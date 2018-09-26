'use strict';

/**
* @ngdoc function
* @name ConfigServicios.controller:ServiciosCtrl
* @description
* # CountriesCtrl
* Controller of the modyMarcaApp
*/

var page = angular.module('ConfigServicios', ['jcs-autoValidate','datatables','ngResource']);

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

page.controller('ServiciosCtrl', ['$scope','$modal','$window','DTOptionsBuilder','ServiciosSvc','$resource', function ($scope,$modal,$window,DTOptionsBuilder,
  ServiciosSvc,$resource) {

  // Page header info (views/layouts/pageheader.html)
  $window.scrollTo(0,0);
  $scope.pageicon = 'fa fa-cogs';
  $scope.pagetitle = 'Servicios';
  $scope.parentpages = [{'url': 'masters','pagetitle': 'Configuraciones'}];

  $scope.servicios = new ResponseLm();

  function dataTableOptions(){
    $scope.dtOptions = DTOptionsBuilder.newOptions()
    .withLanguageSource('scripts/lib/language-dataTables.json');    
  };
  dataTableOptions();

  $scope.open = function (size, backdrop, action, editServicio) {
    backdrop = backdrop ? backdrop : true;
    var modalInstance = $modal.open({
      templateUrl: 'views/masters/modal-forms/servicio-form.html',
      size: size,
      backdrop: backdrop,
      controller: ['$scope', '$modalInstance', function($scope, $modalInstance){
        $scope.action = action;
        $scope.servicio = new Servicio();

        if (action === 'create') {
          $scope.modalTittle = 'Registro';
        } else if (action === 'edit') {
          $scope.modalTittle = 'Edición';

          if (angular.isObject(editServicio)) {
            angular.copy(editServicio, $scope.servicio);
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

  $scope.delete = function (size, backdrop, delServicio) {
    backdrop = backdrop ? backdrop : true;
    var modalInstance = $modal.open({
      templateUrl: 'views/shared/confirm-delete.html',
      size: size,
      backdrop: backdrop,
      controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {

        if (angular.isObject(delServicio)) {
          $scope.message = 'Está seguro de que desea eliminar el servicio';
          $scope.description = delServicio.nombreServicio;
        }

        $scope.ok = function () {
          confirmDelete($scope, delServicio.idServicio);
        };

        $scope.cancel = function () {
          $modalInstance.close();
        };
      }]
    });
  };

  function loadAllServices (){
    ServiciosSvc.getServices().then(function(response){
      $scope.servicios = response;

      if (!response.status) {
        infoMessage(response.message, 'growl-warning', 'warning');
      }

    }, function(){
      infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
    });
  };
  loadAllServices();

  function save($modalScope) {
    //scope from modal
    
    $scope.servicios = new ResponseLm();

    ServiciosSvc.save($modalScope.servicio, $modalScope.action).then(function(response){
      $scope.servicios = response;

      if (!response.status) {
        $scope.servicios.status = true;
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
    $scope.servicio = new Servicio();
  };

  function confirmDelete($modalScope, id) {

    $scope.servicios = new ResponseLm();

    ServiciosSvc.delete(id).then(function (response) {
      $scope.servicios = response;

      if (!response.status) {
        $scope.servicios.status = true;
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
      title: 'Servicios',
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
  .state('masters.services', {
    url: '/servicios',
    templateUrl: 'views/masters/servicios.html',
    controller: 'ServiciosCtrl'
  });

}]);

