'use strict';

/**
* @ngdoc function
* @name mmConfigAppointmentStates.controller:AppointmentStatesCtrl
* @description
* # CountriesCtrl
* Controller of the modyMarcaApp
*/

var page = angular.module('mmConfigAppointmentStates', ['jcs-autoValidate','datatables','ngResource']);

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

page.controller('AppointmentStatesCtrl', ['$scope','$modal','$window','DTOptionsBuilder','AppointmentStatesSvc', function ($scope,$modal,$window,
  DTOptionsBuilder,AppointmentStatesSvc) {

  // Page header info (views/layouts/pageheader.html)
  $window.scrollTo(0,0);
  $scope.pageicon = 'fa fa-cogs';
  $scope.pagetitle = 'Maestro Estados de Visita';
  $scope.parentpages = [{'url': 'masters','pagetitle': 'Configuraciones'}];

  $scope.estadosVisitas = new ResponseLm();

  function dataTableOptions(){
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withLanguageSource('scripts/lib/language-dataTables.json');
  };
  dataTableOptions();

  $scope.open = function (size, backdrop, action, editEstado) {
    backdrop = backdrop ? backdrop : true;
    var modalInstance = $modal.open({
      templateUrl: 'views/masters/modal-forms/appointment-states-form.html',
      size: size,
      backdrop: backdrop,
      controller: ['$scope', '$modalInstance', function($scope, $modalInstance){
        $scope.action = action;
        $scope.modalTittle = action === 'create' ? 'Registro' : 'Edición';
        $scope.estadoVisita = new EstadosVisitas();

        if (editEstado !== undefined) {
          angular.copy(editEstado, $scope.estadoVisita)
        }
        
        $scope.save = function() {
          save($scope);
        }

        $scope.clean = function() {
          clean($scope);
        }

        $scope.cancel = function() {
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
          $scope.description = delEstado.nombreEstadoVisita;
        }

        $scope.ok = function(){
          confirmDelete($scope,delEstado.idEstadoVisita);
        };

        $scope.cancel = function(){
          $modalInstance.close();
        };
      }]
    });
  };

  function loadAllStates(){
    AppointmentStatesSvc.getStates().then(function(response){
      $scope.estadosVisitas = response;

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
    
    $scope.estadosVisitas = new ResponseLm();

    AppointmentStatesSvc.save($modalScope.estadoVisita, $modalScope.action).then(function(response){
      $scope.estadosVisitas = response;

      if (!response.status) {
        $scope.estadosVisitas.status = true;
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
    $modalScope.estadoVisita = new EstadosVisitas();
  };

  function confirmDelete($modalScope, id) {

    $scope.estadosVisitas = new ResponseLm();

    AppointmentStatesSvc.delete(id).then(function (response) {
      $scope.estadosVisitas = response;

      if (!response.status) {
        $scope.estadosVisitas.status = true;
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
      title: 'Servicio Estados de Visita',
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
  .state('masters.appointmentStates', {
    url: '/appointment-states',
    templateUrl: 'views/masters/appointment-states.html',
    controller: 'AppointmentStatesCtrl'
  });

}]);

