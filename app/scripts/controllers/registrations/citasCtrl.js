'use strict';

/**
* @ngdoc function
* @name ConfigCitas.controller:ConfigCitas
* @description
* # CompaniesCtrl
* Controller of the modyMarcaApp
*/

var page = angular.module('ConfigCitas', ['jcs-autoValidate', 'datatables', 'ngResource', 'ui.calendar']);

angular.module('jcs-autoValidate')
  .run([
    'validator',
    'defaultErrorMessageResolver',
    function (validator, defaultErrorMessageResolver) {
      validator.setValidElementStyling(false);

      // To change the root resource file path
      defaultErrorMessageResolver.setI18nFileRootPath('scripts/lib');
      defaultErrorMessageResolver.setCulture('es-CO');
    }
  ]);

page.controller('CitasCtrl', ['$scope', '$modal', '$window', 'uiCalendarConfig', 'CitasSvc', function ($scope, $modal, $window, uiCalendarConfig, CitasSvc) {

  // Page header info (views/layouts/pageheader.html)
  $window.scrollTo(0, 0);
  $scope.pageicon = 'fa fa-calendar';
  $scope.pagetitle = 'Agendar Visita';
  $scope.parentpages = [{ 'url': 'registrations', 'pagetitle': 'Cronograma de visitas' }];

  //$scope.schedule = new Cronograma();
  $scope.schedules = new ResponseLm();
  $scope.auditors = new ResponseLm();
  $scope.stores = new ResponseLm();
  $scope.storeWithoutVisits = new ResponseLm();
  $scope.events = [];
  $scope.eventSources = [$scope.events];

  function configCalendar() {
    $scope.uiConfig = {
      locale: 'es',
      calendar: {
        height: 450,
        editable: false,
        displayEventTime: false,
        header: {
          left: 'month agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Juev", "Vie", "Sáb"],
        refetchResourcesOnNavigate: true,
        resources: $scope.eventSources,
        eventClick: function (calEvent, jsEvent, view) {
          for (let i = 0; i < $scope.events.length; i++) {
            if ($scope.events[i].eventId === calEvent.eventId) {
              openModal('', 'static', $scope.events[i]);
              break;
            }
          }
        }
      }
    };
    
    setTimeout(() => {
      let datePickSchSince = angular.element('#datePickSchSince');
      datePickSchSince.datepicker({
        minDate: 0,
        numberOfMonths: 2
      });
    }, 500);

  };
  configCalendar();

  function loadAllSchedules() {
    // CitasSvc.getSchedules().then(function (response) {
    //   $scope.schedules = response;

    //   if (!response.status) {
    //     infoMessage(response.message, 'growl-warning', 'warning');
    //   } else {
    //     loadEventSource(response);
    //   }

    // }, function () {
    //   $scope.schedules.status = true;
    //   infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
    // });
  };
  loadAllSchedules();

  function loadStoreWithoutVisits() {
    // CitasSvc.getStoreWithoutVisits().then(function (response) {
    //   if (!response.status) {
    //     infoMessage(response.message, 'growl-warning', 'warning');
    //   } else {

    //     response.data.forEach(el => {
    //       for (let i = 0; i < $scope.stores.data.length; i++ ) {
    //         if (el.posTienda === $scope.stores.data[i].posTienda) {
    //           el.tiendas = $scope.stores.data[i];
    //           break;
    //         }
    //       }
    //     });

    //     $scope.storeWithoutVisits = response;
    //   }

    // }, function () {
    //   $scope.storeWithoutVisits.status = true;
    //   infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
    // });
  };
  //loadStoreWithoutVisits();

  function loadEventSource(response) {
    $scope.events.splice(0, $scope.events.length);

    angular.forEach(response.data, function (obj) {
      let auditor = obj.idAuditor.nombres + ' ' + obj.idAuditor.papellido + ' ' + obj.idAuditor.sapellido;

      $scope.events.push({
        eventId: obj.idCronograma,
        title: obj.posTienda.nombreTienda,
        description: obj.posTienda.nombreTienda,
        auditor: auditor.trim(),
        idAuditor: obj.idAuditor.idPersonal,
        posTienda: obj.posTienda,
        start: new Date(obj.fechaVisita),
        end: new Date(obj.fechaVisita),
        allDay: true,
        status: obj.idEstadoVisita.nombreEstadoVisita,
        canCancel: obj.fechaFinalArqueo === null
      });
    });
  };

  function dataForDropDownList(posTienda, idPersonal) {
    CitasSvc.getAllAuditorsByCity('').then(function (response) {
      $scope.auditors = response;

      if (!response.status) {
        infoMessage(response.message, 'growl-warning', 'warning');

      } else {

        $scope.auditors.data.forEach(el => {
          if (idPersonal !== undefined && idPersonal === el.idPersonal) {
            el.selected = true;
          } else {
            el.selected = false;
          }
        });
      }

    }, function (response) {

      infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');

    });

    CitasSvc.getStoresForSchedules().then(function (response) {
      $scope.stores = response;

      if (!response.status) {
        infoMessage(response.message, 'growl-warning', 'warning');

      } else {
        loadStoreWithoutVisits();
        $scope.stores.data.forEach(el => {
          if (posTienda !== undefined && posTienda === el.posTienda) {
            el.selected = true;
          } else {
            el.selected = false;
          }
        });

      }

    }, function (response) {

      infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');

    });

  };
  dataForDropDownList();

  $scope.saveSchedule = function (frmSchedule) {
    let action = $scope.schedule.idCronograma < 1 ? 'create' : 'edit';
    let fechaVisita = $scope.schedule.fechaVisita.split('/');
    let scheduleAux = JSON.parse(angular.toJson($scope.schedule));
    scheduleAux.fechaVisita = new Date(parseInt(fechaVisita[2]), parseInt(fechaVisita[1]) - 1, parseInt(fechaVisita[0]));

    CitasSvc.save(JSON.parse(angular.toJson(scheduleAux)), action).then(function (response) {
      $scope.schedules = response;

      if (!response.status) {
        $scope.schedules.status = true;
        infoMessage(response.message, 'growl-warning', 'warning');

      } else {
        loadEventSource(response);
        loadStoreWithoutVisits();
        
        if (action === 'create') {
          infoMessage('El registro se guardó correctamente', 'growl-success', 'check');
        } else {
          infoMessage('El registro se actualizó correctamente', 'growl-success', 'check');
        }
      }

      $scope.clean(frmSchedule);

    }, function () {
      infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
    });

  };

  function openModal(size, backdrop, event) {
    backdrop = backdrop ? backdrop : true;
    var modalInstance = $modal.open({
      templateUrl: 'views/registrations/modal-forms/citas-form.html',
      size: size,
      backdrop: backdrop,
      controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
        let day = event.start.getDate() < 10 ? '0' + event.start.getDate() : event.start.getDate();
        let month = (event.start.getMonth() + 1) < 10 ? '0' + (event.start.getMonth() + 1) : (event.start.getMonth() + 1);
        let year = event.start.getFullYear();
        let date = day + '/' + month + '/' + year;

        $scope.event = event;
        $scope.event.dateDay = date;

        $scope.canCancel = event.canCancel;
        $scope.canEdit = event.canCancel;

        $scope.edit = function () {
          $scope.close();
          editSchedule($scope);
        };

        $scope.cancel = function () {
          //$scope.close();
          cancelSchedule('sm', 'static', $scope);
        };

        $scope.clean = function () {
          clean($scope);
        };

        $scope.close = function () {
          $modalInstance.close();
        };
      }]
    });
  };

  function editSchedule($modalScope) {
    //$scope.schedule = new Cronograma();

    // $scope.schedule.idCronograma = $modalScope.event.eventId;
    // $scope.schedule.posTienda.posTienda = $modalScope.event.posTienda.posTienda;
    // $scope.schedule.idAuditor.idPersonal = $modalScope.event.idAuditor;
    // $scope.schedule.fechaVisita = $modalScope.event.dateDay;

    // dataForDropDownList($scope.schedule.posTienda.posTienda, $scope.schedule.idAuditor.idPersonal);
  };

  function cancelSchedule(size, backdrop, $modalScope) {
    backdrop = backdrop ? backdrop : true;
    var modalInstance = $modal.open({
      templateUrl: 'views/shared/confirm-delete.html',
      size: size,
      backdrop: backdrop,
      controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {

        if (angular.isObject($modalScope.event)) {
          $scope.message = 'Está seguro de que desea elminar la visita para la tienda ';
          $scope.description = $modalScope.event.title;
        }

        $scope.ok = function () {
          confirmDelete($scope, $modalScope.event.eventId);
          $modalScope.close();
        };

        $scope.cancel = function () {
          $modalInstance.close();
        };
      }]
    });
  };

  function confirmDelete($modalScope, id) {

    $scope.schedules = new ResponseLm();

    CitasSvc.delete(id).then(function (response) {
      $scope.schedules = response;

      if (!response.status) {
        $scope.schedules.status = true;
        infoMessage(response.message, 'growl-warning', 'warning');

      } else {
        loadEventSource(response);
        loadStoreWithoutVisits();

        infoMessage('El registro se eliminó correctamente', 'growl-success', 'check');
      }

    }, function () {
      infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
    });

    $modalScope.cancel();
  };

  $scope.clean = function (frmSchedule) {
    //$scope.schedule = new Cronograma();
    $scope.auditors = new ResponseLm();
    $scope.stores = new ResponseLm();
    frmSchedule.$setPristine();
    dataForDropDownList();
  };

  function infoMessage(text, class_name, image) {
    jQuery.gritter.add({
      title: 'Servicio Cronograma',
      text: text,
      class_name: class_name, //'growl-primary'
      image: 'images/' + image + '.png',
      sticky: false,
      time: 9000
    });
  };

}]);


page.config(['$stateProvider', function ($stateProvider) {

  $stateProvider
  .state('registrations.activitySchedules', {
          url: '/citas',
          templateUrl: 'views/registrations/citas.html',
          controller: 'CitasCtrl'
      });
}]);
