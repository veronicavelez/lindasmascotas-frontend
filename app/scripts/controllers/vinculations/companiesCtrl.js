'use strict';

/**
* @ngdoc function
* @name mmVinculCompanies.controller:CompaniesCtrl
* @description
* # CompaniesCtrl
* Controller of the modyMarcaApp
*/

var page = angular.module('mmVinculCompanies', ['jcs-autoValidate','datatables','ngResource']);

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

page.controller('CompaniesCtrl', ['$scope','$modal','$window','DTOptionsBuilder','CompaniesSvc', function ($scope,$modal,$window,DTOptionsBuilder,CompaniesSvc) {

  // Page header info (views/layouts/pageheader.html)
  $window.scrollTo(0,0);
  $scope.pageicon = 'fa fa-edit';
  $scope.pagetitle = 'Empresas';
  $scope.parentpages = [{'url':'vinculations','pagetitle': 'Vinculaciones'}];

  $scope.companies = new ResponseLm();

  function dataTableOptions(){
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withLanguageSource('scripts/lib/language-dataTables.json');
  };
  dataTableOptions();

  $scope.open = function (size, backdrop, action, editCompania) {
    backdrop = backdrop ? backdrop : true;
    var modalInstance = $modal.open({
      templateUrl: 'views/vinculations/modal-forms/company-form.html',
      size: size,
      backdrop: backdrop,
      controller: ['$scope', '$modalInstance', function($scope, $modalInstance){
        dataForDropDownList($scope);
        // $scope.deptos = [];
        $scope.isEdit = false;
        $scope.action = action;
        $scope.compania = new Empresas();

        if (action === 'create') {
          $scope.modalTittle = 'Registro';
        } else if (action === 'edit') {
          $scope.isEdit = true;
          $scope.modalTittle = 'Edición';

          if (angular.isObject(editCompania)) {
            angular.copy(editCompania, $scope.compania);
            // getDepartmentsByCounty($scope);
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
          // getDepartmentsByCounty($scope);
        }
      }]
    });
  };

  $scope.delete = function (size, backdrop, delCompania) {
    backdrop = backdrop ? backdrop : true;
    var modalInstance = $modal.open({
      templateUrl: 'views/shared/confirm-delete.html',
      size: size,
      backdrop: backdrop,
      controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {

        if (angular.isObject(delCompania)) {
          $scope.message = 'Está seguro de que desea elminar la compañía ';
          $scope.description = delCompania.nombreEmpresa;
        }

        $scope.ok = function () {
          confirmDelete($scope, delCompania.nitEmpresa);
        }

        $scope.cancel = function () {
          $modalInstance.close();
        };
      }]
    });
  };

  function loadAllCompanies (){
    CompaniesSvc.getCompanies().then(function(response){
      $scope.companies = response;

      if (!response.status) {
        infoMessage(response.message, 'growl-warning', 'warning');
      }

    }, function(){
      $scope.companies.status = true;
      infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
    });
  };
  loadAllCompanies();

  function dataForDropDownList ($modalScope) {
    // CompaniesSvc.getAllCountries().then(function(response){
    //   $modalScope.countries = response;

    //   if (!response.status) {
    //     infoMessage(response.message, 'growl-warning', 'warning');
    //   }

    // }, function(response){

    //   infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');

    // });
  };

  function getDepartmentsByCounty($modalScope){
    var pais = $modalScope.ciudad.idDepartamento.idPais;

    CompaniesSvc.getDepartmentsByCountry(pais).then(function(response){
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
    
    $scope.companies = new ResponseLm();

    CompaniesSvc.save(JSON.parse(angular.toJson($modalScope.compania)), $modalScope.action).then(function(response){
      $scope.companies = response;

      if (!response.status) {
        $scope.companies.status = true;
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
    $scope.compania = new Empresas();
  };

  function confirmDelete($modalScope, id) {

    $scope.companies = new ResponseLm();

    CompaniesSvc.delete(id).then(function (response) {
      $scope.companies = response;

      if (!response.status) {
        $scope.companies.status = true;
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
      title: 'Servicio Compañías',
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
  .state('vinculations', {
    url: '/vinculations',
    template: '<ui-view/>'
  })
  .state('vinculations.companies', {
    url: '/companies',
    templateUrl: 'views/vinculations/companies.html',
    controller: 'CompaniesCtrl'
  });
}]);
