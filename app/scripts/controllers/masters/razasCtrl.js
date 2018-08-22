'use strict';

/**
* @ngdoc function
* @name ConfigRazas.controller:RazasCtrl
* @description
* # CountriesCtrl
* Controller of the modyMarcaApp
*/

var page = angular.module('ConfigRazas', ['jcs-autoValidate','datatables','ngResource']);

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

page.controller('RazasCtrl', ['$scope','$modal','$window','DTOptionsBuilder','RazasSvc','$resource', function ($scope,$modal,$window,DTOptionsBuilder,
  RazasSvc,$resource) {

  // Page header info (views/layouts/pageheader.html)
  $window.scrollTo(0,0);
  $scope.pageicon = 'fa fa-cogs';
  $scope.pagetitle = 'Razas';
  $scope.parentpages = [{'url': 'masters','pagetitle': 'Configuraciones'}];

  $scope.razas = new ResponseLm();

  function dataTableOptions(){
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withLanguageSource('scripts/lib/language-dataTables.json');
  };
  dataTableOptions();

  $scope.open = function (size, backdrop, action, editRaza) {
    backdrop = backdrop ? backdrop : true;
    var modalInstance = $modal.open({
      templateUrl: 'views/masters/modal-forms/razas-form.html',
      size: size,
      backdrop: backdrop,
      controller: ['$scope', '$modalInstance', function($scope, $modalInstance){
        $scope.action = action;
        $scope.raza = new Raza();
        $scope.especies = [];
        dataForDropDownList($scope);

        if (action === 'create') {
          $scope.modalTittle = 'Registro';
        } else if (action === 'edit') {
          $scope.modalTittle = 'Edición';

          if (angular.isObject(editRaza)) {
            angular.copy(editRaza, $scope.raza);
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

  $scope.delete = function (size, backdrop, delRaza) {
    backdrop = backdrop ? backdrop : true;
    var modalInstance = $modal.open({
      templateUrl: 'views/shared/confirm-delete.html',
      size: size,
      backdrop: backdrop,
      controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {

        if (angular.isObject(delRaza)) {
          $scope.message = 'Está seguro de que desea elminar la raza ';
          $scope.description = delRaza.nombreRaza;
        }

        $scope.ok = function () {
          confirmDelete($scope, delRaza.idRaza);
        }

        $scope.cancel = function () {
          $modalInstance.close();
        };
      }]
    });
  };

  function dataForDropDownList ($modalScope) {
    RazasSvc.getSpecies().then(function(response){
      $modalScope.especies = response;

      if (!response.status) {
        infoMessage(response.message, 'growl-warning', 'warning');
      }

    }, function(response){

      infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');

    });
  };

  function loadAllRaces (){
    RazasSvc.getRaces().then(function(response){
      $scope.razas = response;

      if (!response.status) {
        infoMessage(response.message, 'growl-warning', 'warning');
      }

    }, function(){
      infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
    });
  };
  loadAllRaces();

  function save($modalScope) {
    //scope from modal
    
    $scope.razas = new ResponseLm();

    RazasSvc.save($modalScope.raza, $modalScope.action).then(function(response){
      $scope.razas = response;

      if (!response.status) {
        $scope.razas.status = true;
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
    $scope.raza = new Raza();
  };

  function confirmDelete($modalScope, id) {

    $scope.razas = new ResponseLm();

    RazasSvc.delete(id).then(function (response) {
      $scope.razas = response;

      if (!response.status) {
        $scope.razas.status = true;
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
      title: 'Servicio Razas',
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
  .state('masters.races', {
    url: '/razas',
    templateUrl: 'views/masters/razas.html',
    controller: 'RazasCtrl'
  });

}]);

