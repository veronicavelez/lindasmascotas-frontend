'use strict';

/**
* @ngdoc function
* @name mmConfigPettyCashFlow.controller:PettyCashFlowCtrl
* @description
* # CountriesCtrl
* Controller of the modyMarcaApp
*/

var page = angular.module('mmConfigPettyCashFlow', ['jcs-autoValidate', 'datatables', 'ngResource', 'ui.sortable']);

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

page.controller('PettyCashFlowCtrl', ['$scope', '$modal', '$window', 'DTOptionsBuilder', 'PettyCashFlowSvc', function ($scope, $modal, $window,
  DTOptionsBuilder, PettyCashFlowSvc) {

  // Page header info (views/layouts/pageheader.html)
  $window.scrollTo(0, 0);
  $scope.pageicon = 'fa fa-cogs';
  $scope.pagetitle = 'Maestro Flujos de Caja Menor';
  $scope.parentpages = [{ 'url': 'masters', 'pagetitle': 'Configuraciones' }];

  $scope.flujosCM = new ResponseLm();

  function dataTableOptions() {
    $scope.dtOptions = DTOptionsBuilder.newOptions()
      .withLanguageSource('scripts/lib/language-dataTables.json');
  };
  dataTableOptions();

  $scope.open = function (size, backdrop, action, editFlujoCM) {
    backdrop = backdrop ? backdrop : true;
    var modalInstance = $modal.open({
      templateUrl: 'views/masters/modal-forms/petty-cash-flow-form.html',
      size: size,
      backdrop: backdrop,
      controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
        sortableOptions($scope);
        dataForDropDownList($scope);
        $scope.isDetail = false;
        $scope.action = action;
        $scope.estadoCM = new EstadosCajaMenor();
        $scope.flujoCM = new FlujosCajasMenores();

        if (action === 'create') {
          $scope.modalTittle = 'Registro';
          
        } else if (action === 'edit') {
          $scope.modalTittle = 'Edición';

          if (angular.isObject(editFlujoCM)) {
            angular.copy(editFlujoCM, $scope.flujoCM);
          }
        } else if (action === 'detail') {
          $scope.modalTittle = 'Detalle';
          $scope.isDetail = true;

          if (angular.isObject(editFlujoCM)) {
            angular.copy(editFlujoCM, $scope.flujoCM);
          }
        }

        $scope.onSubmit = function () {
          var btnSubmit = angular.element('#btnSubmit');

          $(btnSubmit).click();
        };

        $scope.save = function () {

          if ($scope.flujoCM.detallesFlujosCajasMenoresList.length > 0) {
            save($scope);
          } else {
            infoMessage('¡Debe indicar el flujo de estados!', 'growl-warning', 'warning');
          }
        };

        $scope.edit = function(){
          $scope.isDetail = false;
        };

        $scope.clean = function () {
          clean($scope);
        };

        $scope.cancel = function () {
          clean($scope);
          $modalInstance.close();
        };

        $scope.addState = function () {
          var estado = new EstadosCajaMenor();

          if ($scope.estadoCM.idEstadoCajaMenor !== '') {
            for (let i = 0; i < $scope.estadosCM.data.length; i++) {
              if ($scope.estadosCM.data[i].idEstadoCajaMenor === parseInt($scope.estadoCM.idEstadoCajaMenor)) {
                angular.copy($scope.estadosCM.data[i], estado);
                break;
              }
            }

            $scope.flujoCM.detallesFlujosCajasMenoresList.push(
              new DetalleFlujoCajaMenor(0,0,estado, new FlujosCajasMenores() , null));

            for (var i = 0; i < $scope.flujoCM.detallesFlujosCajasMenoresList.length; i++) {
              $scope.flujoCM.detallesFlujosCajasMenoresList[i].
                ordenFlujo = i + 1;
            }

          } else {
            infoMessage('¡Debe seleccionar un estado!', 'growl-warning', 'warning');
          }
        };

        $scope.removeState = function (index) {
          $scope.flujoCM.detallesFlujosCajasMenoresList.splice(index, 1);
          
          for (var i = 0; i < $scope.flujoCM.detallesFlujosCajasMenoresList.length; i++) {            
              $scope.flujoCM.detallesFlujosCajasMenoresList[i].
                ordenFlujo = i + 1;            
          }
        };
      }]
    });
  };

  $scope.delete = function (size, backdrop, delFlujoCM) {
    backdrop = backdrop ? backdrop : true;
    var modalInstance = $modal.open({
      templateUrl: 'views/shared/confirm-delete.html',
      size: size,
      backdrop: backdrop,
      controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {

        if (angular.isObject(delFlujoCM)) {
          $scope.message = 'Está seguro de que desea elminar el flujo ';
          $scope.description = delFlujoCM.nombreFlujoCajamenor;
        }

        $scope.ok = function () {
          confirmDelete($scope, delFlujoCM.idFlujoCajamenor);
        };

        $scope.cancel = function () {
          $modalInstance.close();
        };
      }]
    });
  };

  function loadAllStates() {
    PettyCashFlowSvc.getFlows().then(function (response) {
      $scope.flujosCM = response;

      if (!response.status) {
        infoMessage(response.message, 'growl-warning', 'warning');
      }

    }, function () {
      $scope.flujosCM.status = true;
      infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
    });
  };
  loadAllStates();

  function dataForDropDownList($modalScope) {
    PettyCashFlowSvc.getPettyCashStates().then(function (response) {
      $modalScope.estadosCM = response;

      if (!response.status) {
        infoMessage(response.message, 'growl-warning', 'warning');
      }

    }, function () {
      infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
    });
  };

  function sortableOptions($modalScope) {
    $modalScope.sortableOptions = {
      stop: function (e, ui) {
        
        for (var i = 0; i < $modalScope.flujoCM.detallesFlujosCajasMenoresList.length; i++) {
          $modalScope.flujoCM.detallesFlujosCajasMenoresList[i].
            ordenFlujo = i + 1;
        }
      }
    };
  };

  function save($modalScope) {
    //scope from modal

    $scope.flujosCM = new ResponseLm();
    
    PettyCashFlowSvc.save(JSON.parse(angular.toJson($modalScope.flujoCM)), $modalScope.action).then(function (response) {
      $scope.flujosCM = response;

      if (!response.status) {
        $scope.flujosCM.status = true;
        infoMessage(response.message, 'growl-warning', 'warning');
      } else {

        if ($modalScope.action === 'create') {
          infoMessage('El registro se guardó correctamente', 'growl-success', 'check');
        } else {
          infoMessage('El registro se actualizó correctamente', 'growl-success', 'check');
        }

        $modalScope.cancel();
      }

    }, function () {
      infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
    });
  };

  function clean($modalScope) {
    //scope from modal    
    $modalScope.flujoCM = new FlujosCajasMenores();
    $modalScope.estadoCM = new EstadosCajaMenor();
  };

  function confirmDelete($modalScope, id) {

    $scope.flujosCM = new ResponseLm();

    PettyCashFlowSvc.delete(id).then(function (response) {
      $scope.flujosCM = response;

      if (!response.status) {
        $scope.flujosCM.status = true;
        infoMessage(response.message, 'growl-warning', 'warning');

      } else {
        infoMessage('El registro se eliminó correctamente', 'growl-success', 'check');
      }

    }, function () {
      infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');

      setTimeout(() => {
        $window.location.reload();
      }, 5000);

    });

    $modalScope.cancel();
  };

  function infoMessage(text, class_name, image) {
    jQuery.gritter.add({
      title: 'Servicio Flujos de Caja Menor',
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
    .state('masters.pettyCashFlow', {
      url: '/petty-cash-flow',
      templateUrl: 'views/masters/petty-cash-flow.html',
      controller: 'PettyCashFlowCtrl'
    });

}]);

