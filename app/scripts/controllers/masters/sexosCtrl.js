'use strict';

/**
* @ngdoc function
* @name ConfigSexos.controller:SexosCtrl
* @description
* # CountriesCtrl
* Controller of the modyMarcaApp
*/

var page = angular.module('ConfigSexos', ['jcs-autoValidate','datatables','ngResource']);

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

page.controller('SexosCtrl', ['$scope','$modal','$window','DTOptionsBuilder','SexosSvc','$resource', function ($scope,$modal,$window,DTOptionsBuilder,
  SexosSvc,$resource) {

  // Page header info (views/layouts/pageheader.html)
  $window.scrollTo(0,0);
  $scope.pageicon = 'fa fa-cogs';
  $scope.pagetitle = 'Sexos';
  $scope.parentpages = [{'url': 'masters','pagetitle': 'Configuraciones'}];

  $scope.sexos = new ResponseLm();

  function dataTableOptions(){
    $scope.dtOptions = DTOptionsBuilder.newOptions()
    .withLanguageSource('scripts/lib/language-dataTables.json');    
  };
  dataTableOptions();

  $scope.open = function (size, backdrop, action, editSexos) {
    backdrop = backdrop ? backdrop : true;
    var modalInstance = $modal.open({
      templateUrl: 'views/masters/modal-forms/sexos-form.html',
      size: size,
      backdrop: backdrop,
      controller: ['$scope', '$modalInstance', function($scope, $modalInstance){
        $scope.action = action;
        $scope.sexo = new Sexo();

        if (action === 'create') {
          $scope.modalTittle = 'Registro';
        } else if (action === 'edit') {
          $scope.modalTittle = 'Edición';

          if (angular.isObject(editSexos)) {
            angular.copy(editSexos, $scope.sexo);
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

  $scope.delete = function (size, backdrop, delSexo) {
    backdrop = backdrop ? backdrop : true;
    var modalInstance = $modal.open({
      templateUrl: 'views/shared/confirm-delete.html',
      size: size,
      backdrop: backdrop,
      controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {

        if (angular.isObject(delSexo)) {
          $scope.message = 'Está seguro de que desea eliminar el sexo';
          $scope.description = delSexo.nombreSexo;
        }

        $scope.ok = function () {
          confirmDelete($scope, delSexo.idSexo);
        };

        $scope.cancel = function () {
          $modalInstance.close();
        };
      }]
    });
  };

  function loadAllAnimalGenders (){
    SexosSvc.getAnimalGenders().then(function(response){
      $scope.sexos = response;

      if (!response.status) {
        infoMessage(response.message, 'growl-warning', 'warning');
      }

    }, function(){
      infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
    });
  };
  loadAllAnimalGenders();

  function save($modalScope) {
    //scope from modal
    
    $scope.sexos = new ResponseLm();

    SexosSvc.save($modalScope.sexo, $modalScope.action).then(function(response){
      $scope.sexos = response;

      if (!response.status) {
        $scope.sexos.status = true;
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
    $scope.sexo = new Sexo();
  };

  function confirmDelete($modalScope, id) {

    $scope.sexos = new ResponseLm();

    SexosSvc.delete(id).then(function (response) {
      $scope.sexos = response;

      if (!response.status) {
        $scope.sexos.status = true;
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
      title: 'Servicio Sexos',
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
  .state('masters.animalGenders', {
    url: '/sexos',
    templateUrl: 'views/masters/sexos.html',
    controller: 'SexosCtrl'
  });

}]);

