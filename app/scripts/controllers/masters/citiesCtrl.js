'use strict';

/**
* @ngdoc function
* @name ConfigCities.controller:CitiesCtrl
* @description
* # CitiesCtrl
* Controller of the modyMarcaApp
*/

var page = angular.module('ConfigCities', ['jcs-autoValidate','datatables','ngResource']);

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

page.controller('CitiesCtrl', ['$scope', '$modal','$window','DTOptionsBuilder','CitiesSvc','$resource', function ($scope,$modal,$window,DTOptionsBuilder,
  CitiesSvc,$resource) {

  // Page header info (views/layouts/pageheader.html)
  $window.scrollTo(0,0);
  $scope.pageicon = 'fa fa-cogs';
  $scope.pagetitle = 'Maestro Ciudades';
  $scope.parentpages = [{'url': 'masters','pagetitle': 'Configuraciones'}];

  $scope.cities = new ResponseLm();

  function dataTableOptions(){
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withLanguageSource('scripts/lib/language-dataTables.json');
  };
  dataTableOptions();

  $scope.open = function (size, backdrop, action, editCiudad) {
    backdrop = backdrop ? backdrop : true;
    var modalInstance = $modal.open({
      templateUrl: 'views/masters/modal-forms/cities-form.html',
      size: size,
      backdrop: backdrop,
      controller: ['$scope', '$modalInstance', function($scope, $modalInstance){
        dataForDropDownList($scope);
        $scope.deptos = [];
        $scope.action = action;
        $scope.ciudad = new Ciudad();

        if (action === 'create') {
          $scope.modalTittle = 'Registro';
        } else if (action === 'edit') {
          $scope.modalTittle = 'Edición';

          if (angular.isObject(editCiudad)) {
            angular.copy(editCiudad, $scope.ciudad);
            getDepartmentsByCounty($scope);
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
        }

        $scope.getDepartmentsByCountry = function() {
          getDepartmentsByCounty($scope);
        }
      }]
    });
  };

  $scope.delete = function (size, backdrop, delCiudad) {
    backdrop = backdrop ? backdrop : true;
    var modalInstance = $modal.open({
      templateUrl: 'views/shared/confirm-delete.html',
      size: size,
      backdrop: backdrop,
      controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {

        if (angular.isObject(delCiudad)) {
          $scope.message = 'Está seguro de que desea elminar la ciudad ';
          $scope.description = delCiudad.nombreCiudad;
        }

        $scope.ok = function () {
          confirmDelete($scope, delCiudad.idCiudad);
        }

        $scope.cancel = function () {
          $modalInstance.close();
        };
      }]
    });
  };

  function loadAllCities (){
    CitiesSvc.getCities().then(function(response){
      $scope.cities = response;

      if (!response.status) {
        infoMessage(response.message, 'growl-warning', 'warning');
      }

    }, function(){
      infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
    });
  };
  loadAllCities();

  function dataForDropDownList ($modalScope) {
    CitiesSvc.getAllCountries().then(function(response){
      $modalScope.countries = response;

      if (!response.status) {
        infoMessage(response.message, 'growl-warning', 'warning');
      }

    }, function(response){

      infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');

    });
  };

  function getDepartmentsByCounty($modalScope){
    var pais = $modalScope.ciudad.idDpto.idPais;

    console.log(pais);

    CitiesSvc.getDepartmentsByCountry(pais).then(function(response){
      $modalScope.deptos = response;
      if (!response.status) {
        infoMessage(response.message, 'growl-warning', 'warning');
      }

    }, function(response){

      infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');

    });
  };

  function save($modalScope) {
    //scope from modal
    
    $scope.cities = new ResponseLm();

    CitiesSvc.save($modalScope.ciudad, $modalScope.action).then(function(response){
      $scope.cities = response;

      if (!response.status) {
        $scope.cities.status = true;
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
    $scope.ciudad = new Ciudad();
  };

  function confirmDelete($modalScope, id) {

    $scope.cities = new ResponseLm();

    CitiesSvc.delete(id).then(function (response) {
      $scope.cities = response;

      if (!response.status) {
        $scope.cities.status = true;
        infoMessage(response.message, 'growl-warning', 'warning');

      } else {

        infoMessage('El registro se eliminó correctamente', 'growl-success', 'check');
      }

    }, function () {
      infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
    });

    $modalScope.cancel();
  };

  function infoMessage(text, class_name, image) {
    jQuery.gritter.add({
      title: 'Servicio Ciudades',
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
  .state('masters.cities', {
    url: '/ciudades',
    templateUrl: 'views/masters/cities.html',
    controller: 'CitiesCtrl'
  });

}]);

