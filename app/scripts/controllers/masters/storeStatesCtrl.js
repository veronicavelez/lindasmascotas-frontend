'use strict';

/**
* @ngdoc function
* @name mmConfigStoreStates.controller:StoreStatesCtrl
* @description
* # CountriesCtrl
* Controller of the modyMarcaApp
*/

var page = angular.module('mmConfigStoreStates', ['jcs-autoValidate','datatables','ngResource']);

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

page.controller('StoreStatesCtrl', ['$scope', '$modal','$window','DTOptionsBuilder','StoreStatesSvc','$resource', function ($scope, $modal,$window,DTOptionsBuilder,
  StoreStatesSvc,$resource) {

  // Page header info (views/layouts/pageheader.html)
  $window.scrollTo(0,0);
  $scope.pageicon = 'fa fa-cogs';
  $scope.pagetitle = 'Maestro Estados de Tienda';
  $scope.parentpages = [{'url': 'masters','pagetitle': 'Configuraciones'}];

  $scope.estadosTiendas = new ResponseLm();

  function dataTableOptions(){
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withLanguageSource('scripts/lib/language-dataTables.json');
  };
  dataTableOptions();

  $scope.open = function (size, backdrop, action, editEstadoTienda) {
    backdrop = backdrop ? backdrop : true;
    var modalInstance = $modal.open({
      templateUrl: 'views/masters/modal-forms/store-states-form.html',
      size: size,
      backdrop: backdrop,
      controller: ['$scope', '$modalInstance', function($scope, $modalInstance){
        $scope.action = action;
        $scope.estadoTienda = new EstadosTiendas();

        if (action === 'create') {
          $scope.modalTittle = 'Registro';
        } else if (action === 'edit') {
          $scope.modalTittle = 'Edición';

          if (angular.isObject(editEstadoTienda)) {
            angular.copy(editEstadoTienda, $scope.estadoTienda);
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
          $scope.description = delEstado.estadoTienda;
        }

        $scope.ok = function(){
          confirmDelete($scope,delEstado.idEstadoTienda);
        };

        $scope.cancel = function(){
          $modalInstance.close();
        };
      }]
    });
  };

  function loadAllStates(){
    StoreStatesSvc.getStates().then(function(response){
      $scope.estadosTiendas = response;

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
    
    $scope.estadosTiendas = new ResponseLm();

    StoreStatesSvc.save($modalScope.estadoTienda, $modalScope.action).then(function(response){
      $scope.estadosTiendas = response;

      if (!response.status) {
        $scope.estadosTiendas.status = true;
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

  function clean($scope) {
    //scope from modal    
    $scope.estadoTienda = new EstadosTiendas();
  };

  function confirmDelete($modalScope, id) {

    $scope.estadosTiendas = new ResponseLm();

    StoreStatesSvc.delete(id).then(function (response) {
      $scope.estadosTiendas = response;

      if (!response.status) {
        $scope.estadosTiendas.status = true;
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
      title: 'Servicio Estados de Tienda',
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
  .state('masters.storeStates', {
    url: '/store-states',
    templateUrl: 'views/masters/store-states.html',
    controller: 'StoreStatesCtrl'
  });

}]);

