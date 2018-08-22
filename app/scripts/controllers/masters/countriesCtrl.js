'use strict';

/**
* @ngdoc function
* @name ConfigCountries.controller:CountriesCtrl
* @description
* # CountriesCtrl
* Controller of the modyMarcaApp
*/

var page = angular.module('ConfigCountries', ['jcs-autoValidate', 'datatables', 'ngResource']);

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

page.controller('CountriesCtrl', ['$scope', '$modal', '$window', 'CountriesSvc', 'DTOptionsBuilder', function ($scope, $modal, $window, CountriesSvc, DTOptionsBuilder) {

  // Page header info (views/layouts/pageheader.html)
  $window.scrollTo(0, 0);
  $scope.pageicon = 'fa fa-cogs';
  $scope.pagetitle = 'Maestro Países';
  $scope.parentpages = [{ 'url': 'masters', 'pagetitle': 'Configuraciones' }];

  $scope.countries = new ResponseLm();

  function dataTableOptions(){
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withLanguageSource('scripts/lib/language-dataTables.json');
  };
  dataTableOptions();

  $scope.open = function (size, backdrop, action, editPais) {
    backdrop = backdrop ? backdrop : true;
    var modalInstance = $modal.open({
      templateUrl: 'views/masters/modal-forms/country-form.html',
      size: size,
      backdrop: backdrop,
      controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
        $scope.action = action;
        $scope.pais = new Pais();

        if (action === 'create') {
          $scope.modalTittle = 'Registro';
        } else if (action === 'edit') {
          $scope.modalTittle = 'Edición';

          if (angular.isObject(editPais)) {
            angular.copy(editPais, $scope.pais);
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

  $scope.delete = function (size, backdrop, delPais) {
    backdrop = backdrop ? backdrop : true;
    var modalInstance = $modal.open({
      templateUrl: 'views/shared/confirm-delete.html',
      size: size,
      backdrop: backdrop,
      controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {

        if (angular.isObject(delPais)) {
          $scope.message = 'Está seguro de que desea elminar el país ';
          $scope.description = delPais.nombrePais;
        }

        $scope.ok = function () {
          confirmDelete($scope, delPais.idPais);
        }

        $scope.cancel = function () {
          $modalInstance.close();
        };
      }]
    });
  };

  function loadAllCountries() {
    CountriesSvc.getCountries().then(function (response) {
      $scope.countries = response;

      if (!response.status) {
        infoMessage(response.message, 'growl-warning', 'warning');
      }

    }, function () {
      infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
    });
  };
  loadAllCountries();

  function save($modalScope) {
    //scope from modal

    $scope.countries = new ResponseLm();

    CountriesSvc.save($modalScope.pais, $modalScope.action).then(function (response) {
      $scope.countries = response;

      if (!response.status) {
        $scope.countries.status = true;
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
    $modalScope.pais = new UtilPaises();
  };

  function confirmDelete($modalScope, id) {

    $scope.countries = new ResponseLm();

    CountriesSvc.delete(id).then(function (response) {
      $scope.countries = response;

      if (!response.status) {
        $scope.countries.status = true;
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
      title: 'Servicio Países',
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
    .state('masters', {
      url: '/maestros',
      template: '<ui-view/>'
    })
    .state('masters.countries', {
      url: '/paises',
      templateUrl: 'views/masters/countries.html',
      controller: 'CountriesCtrl'
    });

}]);

