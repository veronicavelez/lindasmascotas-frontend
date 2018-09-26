'use strict';

/**
* @ngdoc function
* @name ConfigTipoSangre.controller:TipoSangreCtrl
* @description
* # CountriesCtrl
* Controller of the modyMarcaApp
*/

var page = angular.module('ConfigTipoSangre', ['jcs-autoValidate','datatables','ngResource']);

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

page.controller('TipoSangreCtrl', ['$scope','$modal','$window','DTOptionsBuilder','TipoSangreSvc','$resource', function ($scope,$modal,$window,DTOptionsBuilder,
  TipoSangreSvc,$resource) {

  // Page header info (views/layouts/pageheader.html)
  $window.scrollTo(0,0);
  $scope.pageicon = 'fa fa-cogs';
  $scope.pagetitle = 'Tipos de Sangre';
  $scope.parentpages = [{'url': 'masters','pagetitle': 'Configuraciones'}];

  $scope.tiposSangre = new ResponseLm();

  function dataTableOptions(){
    $scope.dtOptions = DTOptionsBuilder.newOptions()
    .withLanguageSource('scripts/lib/language-dataTables.json');    
  };
  dataTableOptions();

  $scope.open = function (size, backdrop, action, editTipoSangre) {
    backdrop = backdrop ? backdrop : true;
    var modalInstance = $modal.open({
      templateUrl: 'views/masters/modal-forms/tipoSangre-form.html',
      size: size,
      backdrop: backdrop,
      controller: ['$scope', '$modalInstance', function($scope, $modalInstance){
        $scope.action = action;
        $scope.tipoSangre = new TipoSangre();

        if (action === 'create') {
          $scope.modalTittle = 'Registro';
        } else if (action === 'edit') {
          $scope.modalTittle = 'Edición';

          if (angular.isObject(editTipoSangre)) {
            angular.copy(editTipoSangre, $scope.tipoSangre);
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

  $scope.delete = function (size, backdrop, delTipoSangre) {
    backdrop = backdrop ? backdrop : true;
    var modalInstance = $modal.open({
      templateUrl: 'views/shared/confirm-delete.html',
      size: size,
      backdrop: backdrop,
      controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {

        if (angular.isObject(delTipoSangre)) {
          $scope.message = 'Está seguro de que desea eliminar el tipo de sangre';
          $scope.description = delTipoSangre.nombreTipoSangre;
        }

        $scope.ok = function () {
          confirmDelete($scope, delTipoSangre.idTipoSangre);
        };

        $scope.cancel = function () {
          $modalInstance.close();
        };
      }]
    });
  };

  function loadAllBloodTypes (){
    TipoSangreSvc.getBloodTypes().then(function(response){
      $scope.tiposSangre = response;

      if (!response.status) {
        infoMessage(response.message, 'growl-warning', 'warning');
      }

    }, function(){
      infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
    });
  };
  loadAllBloodTypes();

  function save($modalScope) {
    //scope from modal
    
    $scope.tiposSangre = new ResponseLm();

    TipoSangreSvc.save($modalScope.tipoSangre, $modalScope.action).then(function(response){
      $scope.tiposSangre = response;

      if (!response.status) {
        $scope.tiposSangre.status = true;
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
    $scope.tipoSangre = new TipoSangre();
  };

  function confirmDelete($modalScope, id) {

    $scope.tiposSangre = new ResponseLm();

    TipoSangreSvc.delete(id).then(function (response) {
      $scope.tiposSangre = response;

      if (!response.status) {
        $scope.tiposSangre.status = true;
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
      title: 'Servicio Tipo Sangre',
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
  .state('masters.bloodTypes', {
    url: '/tiposSangre',
    templateUrl: 'views/masters/tipoSangre.html',
    controller: 'TipoSangreCtrl'
  });

}]);

