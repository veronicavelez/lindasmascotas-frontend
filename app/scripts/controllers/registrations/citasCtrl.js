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
  $scope.pagetitle = 'Solicitar Cita';
  $scope.parentpages = [{ 'url': 'registrations', 'pagetitle': 'Solicitar Citas' }];

  

  //$scope.schedule = new Cronograma();
  $scope.citas = new ResponseLm();
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
        selectable: true,
        select: function(start, end) {
          openModal('', 'static', {
            eventId: null,
            title: 'Nuevo',
            description: 'Nueva descripción',
            idEmpleado: '??',
            empleado: '??',
            idPropietario: '??',
            propietario: '??',
            mascota: '??',
            idServicio: '??',
            servicio:'??',
            start: start._d,
            end: end._d,
            allDay: false,
            status: '¡¡',
            canCancel: false
          },"nuevo");
        },
        eventClick: function (calEvent, jsEvent, view) {
          for (let i = 0; i < $scope.events.length; i++) {
            if ($scope.events[i].eventId === calEvent.eventId) {
              openModal('', 'static', $scope.events[i],"editar");
              break;
            }
          }
        }
      }
    };
    
    // setTimeout(() => {
    //   let datePickSchSince = angular.element('#datePickSchSince');
    //   datePickSchSince.datepicker({
    //     minDate: 0,
    //     numberOfMonths: 2
    //   });
    // }, 500);

  };
  configCalendar();

  function loadAllSchedules() {
    CitasSvc.getSchedules().then(function (response) {
      $scope.citas = response;

      if (!response.status) {
        infoMessage(response.message, 'growl-warning', 'warning');
      } else {
        loadEventSource(response);
      }

    }, function () {
      $scope.citas.status = true;
      infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
    });
  };
  loadAllSchedules();

  function loadEventSource(response) {
    console.log(response.data)
    $scope.events.splice(0, $scope.events.length);

    angular.forEach(response.data, function (obj) {
      const propietario = obj.idPropietario.nombrePropietario + ' ' + obj.idPropietario.apellidosPropietario;
      const empleado = obj.idEmpleado.nombreEmpleado + ' ' + obj.idEmpleado.apellidosEmpleado;
      const anio = new Date(obj.fechaCita).getFullYear();
      const mes = new Date(obj.fechaCita).getMonth();
      const dia = new Date(obj.fechaCita).getDate();
      const hora = new Date(obj.fechaCita).getHours();
      const minutos = new Date(obj.fechaCita).getMinutes();

      $scope.events.push({

        eventId: obj.idCita,
        title: 'Cita de ' + obj.nombreMascota,
        description: '',
        idEmpleado: obj.idEmpleado.idEmpleado,
        empleado: empleado.trim(),
        idPropietario: obj.idPropietario.idPropietario,
        propietario: propietario.trim(),
        mascota: obj.nombreMascota,
        idServicio: obj.idTipoServicio.idServicio,
        servicio: obj.idTipoServicio.nombreServicio,
        start: new Date(obj.fechaCita),
        end: new Date(anio, mes, dia, minutos == 30 ? hora +1: hora, minutos == 30 ? 0: minutos,0,0 ),
        allDay: false,
        status: 'Pendiente',
        canCancel: true
      
      });
    });
  };

  function dataForDropDownList($modalScope) {
    CitasSvc.getServices().then(function(response){
      $modalScope.servicios = response;
      console.log(response);

      if (!response.status) {
         infoMessage(response.message, 'growl-warning', 'warning');
     }
     }, function(response){

      infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');

     });
  };

  function save($modalScope, accion) {

    //$scope.citas = new ResponseLm();
    CitasSvc.save(JSON.parse(angular.toJson($modalScope.citas)), accion).then(function (response) {
        //$scope.citas = response;

        if (!response.status) {
            //$scope.citas.status = true;
            infoMessage(response.message, 'growl-warning', 'warning');

        } else {

            if ($modalScope.action === 'create') {
                infoMessage('El registro se guardó correctamente', 'growl-success', 'check');
            } else {
                infoMessage('El registro se actualizó correctamente', 'growl-success', 'check');
            }
        }
        loadAllSchedules();
    }, function () {
        infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
    });

    $modalScope.cancel();
};
  
//  $scope.saveSchedule = function (frmSchedule) {
//     let action = $scope.schedule.idCronograma < 1 ? 'create' : 'edit';
//     let fechaVisita = $scope.schedule.fechaVisita.split('/');
//     let scheduleAux = JSON.parse(angular.toJson($scope.schedule));
//     scheduleAux.fechaVisita = new Date(parseInt(fechaVisita[2]), parseInt(fechaVisita[1]) - 1, parseInt(fechaVisita[0]));

//     CitasSvc.save(JSON.parse(angular.toJson(scheduleAux)), action).then(function (response) {
//       $scope.citas = response;

//       if (!response.status) {
//         $scope.citas.status = true;
//         infoMessage(response.message, 'growl-warning', 'warning');

//       } else {
//         loadEventSource(response);
//         loadStoreWithoutVisits();
        
//         if (action === 'create') {
//           infoMessage('El registro se guardó correctamente', 'growl-success', 'check');
//         } else {
//           infoMessage('El registro se actualizó correctamente', 'growl-success', 'check');
//         }
//       }

//       $scope.clean(frmSchedule);

//     }, function () {
//       infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
//     });

//   };

  function openModal(size, backdrop, event, accion) {
    backdrop = backdrop ? backdrop : true;
    var modalInstance = $modal.open({
      templateUrl: 'views/registrations/modal-forms/citas-form.html',
      size: size,
      backdrop: backdrop,
      controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
        dataForDropDownList($scope);  
        
        $scope.detail = true;
        $scope.citas = new Cita();
        $scope.propietario = null;
        $scope.servicios = new ResponseLm();
        $scope.empleados = [];
        $scope.citas.fechaCita = event.start;
        $scope.horas = [];

        let day = event.start.getDate() < 10 ? '0' + (event.start.getDate()+1) : (event.start.getDate()+1);
        let month = (event.start.getMonth() + 1) < 10 ? '0' + (event.start.getMonth() + 1) : (event.start.getMonth() + 1);
        let year = event.start.getFullYear();
        let date = day + '/' + month + '/' + year;

        $scope.event = event;
        $scope.event.dateDay = date;
        $scope.event.title = accion === "nuevo" ? "Nueva cita. fecha: " + date : event.title;

        $scope.canCancel = event.canCancel;
        $scope.canEdit = event.canCancel;

        if (accion === "editar"){
          let empl = new Empleado();
          empl.idEmpleado = event.idEmpleado;
          empl.nombreEmpleado = event.empleado;

          let prop = new Propietario();
          prop.idPropietario = event.idPropietario;
          prop.nombrePropietario = event.propietario;

          let serv = new Servicio();
          serv.idServicio = event.idServicio;
          serv.nombreServicio = event.servicio;

          $scope.citas.idCita = event.eventId;
          $scope.citas.nombreMascota = event.mascota;
          $scope.citas.fechaCita = event.start;
          $scope.citas.idEmpleado = empl;
          $scope.citas.idPropietario = prop;
          $scope.citas.idTipoServicio = serv;

          buscarPropietario($scope);
          
          setTimeout(() => {
            servicioPorEmpleado($scope);
            horarioEmpleado($scope);
          }, 500);
          
        }

        $scope.toEdit = function (){
           $scope.detail = false;
        }

        $scope.timePickerOpts2 = { showMeridian: false };

        $scope.edit = function () {
          $scope.close();
          editSchedule($scope);
        };

      

        $scope.cancel = function () {
          $scope.close();
          // cancelSchedule('sm', 'static', $scope);
        };

        $scope.clean = function () {
          clean($scope);
        };

        $scope.close = function () {
          $modalInstance.close();
        };

        $scope.save = function (){
          const hora = $scope.emp.hora.split(":")[0];
          const minutos = $scope.emp.hora.split(":")[1];
          const empl = $scope.citas.idEmpleado;
          $scope.citas.fechaCita = new Date($scope.citas.fechaCita.getFullYear(), $scope.citas.fechaCita.getMonth(), $scope.citas.fechaCita.getDate() + 1,hora,minutos,0,0);
          $scope.citas.idEmpleado = {idEmpleado:empl.idEmpleado};
          $scope.citas.telefonoMovil = $scope.propietario.telefonoMovil;

          save($scope,"crear");
          
        }

        $scope.buscarPropietario = function (){
          buscarPropietario($scope);
        }

        $scope.servicioPorEmpleado = function (){
          servicioPorEmpleado($scope);
        }

        $scope.consultarHorarioEmpleado = function (){
          horarioEmpleado($scope);
        }

      }]
    });
  };

  function buscarPropietario($modalScope){
    CitasSvc.getPropietario($modalScope.citas.idPropietario.idPropietario)
    .then(function (response){
      $modalScope.propietario = response.data;

      if(!response.status){
        infoMessage(response.message, 'growl-danger', 'danger');
      }else if(response.message !== null){
        infoMessage(response.message, 'growl-info', 'info');
      }
    },function(error){
      console.error(error);
      infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
    });
  }

  function horarioEmpleado($modalScope){
    const fechaCita = new Date($modalScope.citas.fechaCita.getFullYear(), $modalScope.citas.fechaCita.getMonth(), $modalScope.citas.fechaCita.getDate() + 1);
    
    CitasSvc.horarioEmpleado($modalScope.citas.idEmpleado.idEmpleado,fechaCita)
    .then(function (response){
      $modalScope.horas = response.data;

      if(!response.status){
        infoMessage(response.message, 'growl-danger', 'danger');
      }else if(response.message !== null){
        infoMessage(response.message, 'growl-info', 'info');
      }
    },function(error){
      console.error(error);
      infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
    });

  }

  function servicioPorEmpleado($modalScope){
    let servicios = $modalScope.servicios.data;
    $modalScope.empleados = [];

    servicios.forEach(s => {
      if($modalScope.citas.idTipoServicio.idServicio == s.idServicio){
        s.servicioPorEmpleadoList.forEach(c => {
          $modalScope.empleados.push(c.idEmpleado)
        })

      }
      
    });
  }

  function editSchedule($modalScope) {
    
  };

  // function cancelSchedule(size, backdrop, $modalScope) {
  //   backdrop = backdrop ? backdrop : true;
  //   var modalInstance = $modal.open({
  //     templateUrl: 'views/shared/confirm-delete.html',
  //     size: size,
  //     backdrop: backdrop,
  //     controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {

  //       if (angular.isObject($modalScope.event)) {
  //         $scope.message = 'Está seguro de que desea elminar la visita para la tienda ';
  //         $scope.description = $modalScope.event.title;
  //       }

  //       $scope.ok = function () {
  //         confirmDelete($scope, $modalScope.event.eventId);
  //         $modalScope.close();
  //       };

  //       $scope.cancel = function () {
  //         $modalInstance.close();
  //       };
  //     }]
  //   });
  // };

  function confirmDelete($modalScope, id) {

    $scope.citas = new ResponseLm();

    CitasSvc.delete(id).then(function (response) {
      $scope.citas = response;

      if (!response.status) {
        $scope.citas.status = true;
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
      title: 'Servicio Citas',
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
  .state('registrations.citas', {
          url: '/citas',
          templateUrl: 'views/registrations/citas.html',
          controller: 'CitasCtrl'
      });
}]);
