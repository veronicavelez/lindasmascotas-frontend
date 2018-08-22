'use strict';

/**
* @ngdoc function
* @name mmConfigPettyCashStates.controller:PettyCashStatesCtrl
* @description
* # CountriesCtrl
* Controller of the modyMarcaApp
*/

var page = angular.module('mmConfigPettyCashStates', ['jcs-autoValidate','datatables','ngResource']);

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

page.controller('PettyCashStatesCtrl', ['$scope','$modal','$window','DTOptionsBuilder','PettyCashStatesSvc', function ($scope,$modal,$window,
  DTOptionsBuilder,PettyCashStatesSvc) {

  // Page header info (views/layouts/pageheader.html)
  $window.scrollTo(0,0);
  $scope.pageicon = 'fa fa-cogs';
  $scope.pagetitle = 'Maestro Estados de Caja Menor';
  $scope.parentpages = [{'url': 'masters','pagetitle': 'Configuraciones'}];

  $scope.estadosCM = new ResponseLm();

  function dataTableOptions(){
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withLanguageSource('scripts/lib/language-dataTables.json');
  };
  dataTableOptions();

  $scope.open = function (size, backdrop, action, editEstadoCM) {
    backdrop = backdrop ? backdrop : true;
    var modalInstance = $modal.open({
      templateUrl: 'views/masters/modal-forms/petty-cash-states-form.html',
      size: size,
      backdrop: backdrop,
      controller: ['$scope', '$modalInstance', function($scope, $modalInstance){
        $scope.action = action;
        $scope.estadoCM = new EstadosCajaMenor();
        console.log($scope.estadoCM);

        if (action === 'create') {
          $scope.modalTittle = 'Registro';
        } else if (action === 'edit') {
          $scope.modalTittle = 'Edición';

          if (angular.isObject(editEstadoCM)) {
            angular.copy(editEstadoCM, $scope.estadoCM);
          }
        }

        $scope.save = function () {
          save($scope);
        }

        $scope.clean = function () {
          clean($scope);
        }

        $scope.cancel = function () {
          $modalInstance.close();
        };
      }]
    });
  };

  $scope.delete = function(size,backdrop,delEstado){
    backdrop = backdrop ? backdrop : true;
    var modalInstance = $modal.open({
      templateUrl: 'views/shared/confirm-delete.html',
      size: size,
      backdrop: backdrop,
      controller: ['$scope','$modalInstance',function($scope,$modalInstance){

        if (angular.isObject(delEstado)) {
          $scope.message = 'Está seguro de que desea elminar el estado ';
          $scope.description = delEstado.nombreEstado;
        }

        $scope.ok = function(){
          confirmDelete($scope,delEstado.idEstadoCajaMenor);
        };

        $scope.cancel = function(){
          $modalInstance.close();
        };
      }]
    });
  };

  function loadAllStates(){
    PettyCashStatesSvc.getStates().then(function(response){
      $scope.estadosCM = response;

      if (!response.status) {
        infoMessage(response.message, 'growl-warning', 'warning');
      }

    }, function(){
      infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
    });
  };
  loadAllStates();

  function save($modalScope) {
    //scope from modal
    
    $scope.estadosCM = new ResponseLm();

    PettyCashStatesSvc.save($modalScope.estadoCM, $modalScope.action).then(function(response){
      $scope.estadosCM = response;

      if (!response.status) {
        $scope.estadosCM.status = true;
        infoMessage(response.message, 'growl-warning', 'warning');

      } else {

        if ($modalScope.action === 'create') {
          infoMessage('El registro se guardó correctamente', 'growl-success', 'check');
        } else {
          infoMessage('El registro se actualizó correctamente', 'growl-success', 'check');
        }
      }

    }, function () {
      infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
    });

    $modalScope.cancel();
  };
  
  function clean($modalScope) {
    //scope from modal    
    $modalScope.estadoCM = new EstadosCajaMenor();
  };

  function confirmDelete($modalScope, id) {

    $scope.estadosCM = new ResponseLm();

    PettyCashStatesSvc.delete(id).then(function (response) {
      $scope.estadosCM = response;

      if (!response.status) {
        $scope.estadosCM.status = true;
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
      title: 'Servicio Estados de Caja Menor',
      text: text,
      class_name: class_name, //'growl-primary'
      image: 'images/' + image + '.png',
      sticky: false,
      time: 9000
    });
  };

}]);

page.config(['$stateProvider', function($stateProvider) {

  $stateProvider
  .state('masters.pettyCashStates', {
    url: '/petty-cash-states',
    templateUrl: 'views/masters/petty-cash-states.html',
    controller: 'PettyCashStatesCtrl'
  });

}]);

