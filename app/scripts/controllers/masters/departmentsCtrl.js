'use strict';

/**
* @ngdoc function
* @name ConfigDepartments.controller:DepartmentsCtrl
* @description
* # DepartmentsCtrl
* Controller of the modyMarcaApp
*/

var page = angular.module('ConfigDepartments', ['jcs-autoValidate','datatables','ngResource']);

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

page.controller('DepartmentsCtrl',['$scope','$modal','$window','DTOptionsBuilder','DepartmentsSvc','$resource',function ($scope,$modal,$window,DTOptionsBuilder,
  DepartmentsSvc,$resource) {

  // Page header info (views/layouts/pageheader.html)
  $window.scrollTo(0,0);
  $scope.pageicon = 'fa fa-cogs';
  $scope.pagetitle = 'Maestro Departamentos';
  $scope.parentpages = [{'url': 'masters','pagetitle': 'Configuraciones'}];

  $scope.deptos = new ResponseLm();
  
  function dataTableOptions(){
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withLanguageSource('scripts/lib/language-dataTables.json');
  };
  dataTableOptions();

  $scope.open = function (size, backdrop, action, editDpto) {
    backdrop = backdrop ? backdrop : true;
    var modalInstance = $modal.open({
      templateUrl: 'views/masters/modal-forms/department-form.html',
      size: size,
      backdrop: backdrop,
      controller: ['$scope', '$modalInstance', function($scope, $modalInstance){
        dataForDropDownList($scope);

        $scope.action = action;
        $scope.depto = new Departamento();

        if (action === 'create') {
          $scope.modalTittle = 'Registro';
        } else if (action === 'edit') {
          $scope.modalTittle = 'Edición';

          if (angular.isObject(editDpto)) {
            angular.copy(editDpto, $scope.depto);
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

  $scope.delete = function (size, backdrop, delDpto) {
    backdrop = backdrop ? backdrop : true;
    var modalInstance = $modal.open({
      templateUrl: 'views/shared/confirm-delete.html',
      size: size,
      backdrop: backdrop,
      controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {

        if (angular.isObject(delDpto)) {
          $scope.message = 'Está seguro de que desea elminar el departamento ';
          $scope.description = delDpto.nombreDepartamento;
        }

        $scope.ok = function () {
          confirmDelete($scope, delDpto.idDepartamento);
        }

        $scope.cancel = function () {
          $modalInstance.close();
        };
      }]
    });
  };

  function loadAllDepartments (){
    DepartmentsSvc.getDepartments().then(function(response){
      $scope.deptos = response;

      if (!response.status) {
        infoMessage(response.message, 'growl-warning', 'warning');
      }

    }, function(){
      infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
    });
  };
  loadAllDepartments();

  function dataForDropDownList ($modalScope) {
    DepartmentsSvc.getAllCountries().then(function(response){
      $modalScope.countries = response;

      if (!response.status) {
        infoMessage(response.message, 'growl-warning', 'warning');
      }

    }, function(response){

      infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');

    });
  };

  function save($modalScope) {
    //scope from modal
    
    $scope.deptos = new ResponseLm();

    DepartmentsSvc.save($modalScope.depto, $modalScope.action).then(function(response){
      $scope.deptos = response;

      if (!response.status) {
        $scope.deptos.status = true;
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
    $scope.depto = new Departamento();
  };

  function confirmDelete($modalScope, id) {

    $scope.deptos = new ResponseLm();

    DepartmentsSvc.delete(id).then(function (response) {
      $scope.deptos = response;

      if (!response.status) {
        $scope.deptos.status = true;
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
      title: 'Servicio Departamentos',
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
  .state('masters.departments', {
    url: '/departamentos',
    templateUrl: 'views/masters/departments.html',
    controller: 'DepartmentsCtrl'
  });

}]);

