'use strict';

/**
* @ngdoc function
* @name ConfigPerfiles.controller:PerfilesCtrl
* @description
* # CountriesCtrl
* Controller of the modyMarcaApp
*/

var page = angular.module('ConfigPerfiles', ['jcs-autoValidate','datatables','ngResource']);

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

page.controller('PerfilesCtrl', ['$scope','$modal','$window','DTOptionsBuilder','PerfilesSvc','$resource', function ($scope,$modal,$window,DTOptionsBuilder,
  PerfilesSvc,$resource) {

  // Page header info (views/layouts/pageheader.html)
  $window.scrollTo(0,0);
  $scope.pageicon = 'fa fa-cogs';
  $scope.pagetitle = 'Perfiles';
  $scope.parentpages = [{'url': 'masters','pagetitle': 'Configuraciones'}];

  $scope.perfiles = new ResponseLm();

  function dataTableOptions(){
    $scope.dtOptions = DTOptionsBuilder.newOptions()
    .withLanguageSource('scripts/lib/language-dataTables.json');    
  };
  dataTableOptions();

  $scope.open = function (size, backdrop, action, editPerfiles) {
    backdrop = backdrop ? backdrop : true;
    var modalInstance = $modal.open({
      templateUrl: 'views/masters/modal-forms/perfiles-form.html',
      size: size,
      backdrop: backdrop,
      controller: ['$scope', '$modalInstance', function($scope, $modalInstance){
        $scope.action = action;
        $scope.perfil = new Perfil();

        if (action === 'create') {
          $scope.modalTittle = 'Registro';
        } else if (action === 'edit') {
          $scope.modalTittle = 'Edición';

          if (angular.isObject(editPerfiles)) {
            angular.copy(editPerfiles, $scope.perfil);
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

  $scope.delete = function (size, backdrop, delPerfil) {
    backdrop = backdrop ? backdrop : true;
    var modalInstance = $modal.open({
      templateUrl: 'views/shared/confirm-delete.html',
      size: size,
      backdrop: backdrop,
      controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {

        if (angular.isObject(delPerfil)) {
          $scope.message = 'Está seguro de que desea eliminar el perfil';
          $scope.description = delPerfil.nombrePerfil;
        }

        $scope.ok = function () {
          confirmDelete($scope, delPerfil.idPerfil);
        };

        $scope.cancel = function () {
          $modalInstance.close();
        };
      }]
    });
  };

  function loadAllProfiles (){
    PerfilesSvc.getProfiles().then(function(response){
      $scope.perfiles = response;

      if (!response.status) {
        infoMessage(response.message, 'growl-warning', 'warning');
      }

    }, function(){
      infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
    });
  };
  loadAllProfiles();

  function save($modalScope) {
    //scope from modal
    
    $scope.perfiles = new ResponseLm();

    PerfilesSvc.save($modalScope.perfil, $modalScope.action).then(function(response){
      $scope.perfiles = response;

      if (!response.status) {
        $scope.perfiles.status = true;
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
    $scope.perfil = new Perfil();
  };

  function confirmDelete($modalScope, id) {

    $scope.perfiles = new ResponseLm();

    PerfilesSvc.delete(id).then(function (response) {
      $scope.perfiles = response;

      if (!response.status) {
        $scope.perfiles.status = true;
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
      title: 'Servicio Perfiles',
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
  .state('masters.profiles', {
    url: '/perfiles',
    templateUrl: 'views/masters/perfiles.html',
    controller: 'PerfilesCtrl'
  });

}]);

