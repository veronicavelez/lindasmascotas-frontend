'use strict';

/**
* @ngdoc function
* @name ConfigDocumentTypes.controller:DocumentTypesCtrl
* @description
* # CountriesCtrl
* Controller of the modyMarcaApp
*/

var page = angular.module('ConfigDocumentTypes', ['jcs-autoValidate','datatables','ngResource']);

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

page.controller('DocumentTypesCtrl', ['$scope', '$modal','$window','DTOptionsBuilder','DocumentTypesSvc','$resource', function ($scope,$modal,$window,DTOptionsBuilder,
  DocumentTypesSvc,$resource) {

  // Page header info (views/layouts/pageheader.html)
  $window.scrollTo(0,0);
  $scope.pageicon = 'fa fa-cogs';
  $scope.pagetitle = 'Maestro Tipos de Documento';
  $scope.parentpages = [{'url': 'masters','pagetitle': 'Configuraciones'}];

  $scope.docTypes = new ResponseLm();

  function dataTableOptions(){
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withLanguageSource('scripts/lib/language-dataTables.json');
  };
  dataTableOptions();

  $scope.open = function (size, backdrop, action, editDocType) {
    backdrop = backdrop ? backdrop : true;
    var modalInstance = $modal.open({
      templateUrl: 'views/masters/modal-forms/document-types-form.html',
      size: size,
      backdrop: backdrop,
      controller: ['$scope', '$modalInstance', function($scope, $modalInstance){
        $scope.action = action;
        $scope.docType = new TiposDocumentos();

        if (action === 'create') {
          $scope.modalTittle = 'Registro';
        } else if (action === 'edit') {
          $scope.modalTittle = 'Edición';

          if (angular.isObject(editDocType)) {
            angular.copy(editDocType, $scope.docType);
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

  $scope.delete = function (size, backdrop, delDocType) {
    backdrop = backdrop ? backdrop : true;
    var modalInstance = $modal.open({
      templateUrl: 'views/shared/confirm-delete.html',
      size: size,
      backdrop: backdrop,
      controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {

        if (angular.isObject(delDocType)) {
          $scope.message = 'Está seguro de que desea elminar el tipo de documento ';
          $scope.description = delDocType.nombreTipo;
        }

        $scope.ok = function () {
          confirmDelete($scope, delDocType.idTipoDoc);
        }

        $scope.cancel = function () {
          $modalInstance.close();
        };
      }]
    });
  };

  function loadAllDocumentTypes (){
    DocumentTypesSvc.getDocumentTypes().then(function(response){
      $scope.docTypes = response;

      if (!response.status) {
        infoMessage(response.message, 'growl-warning', 'warning');
      }

    }, function(){
      infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
    });
  };
  loadAllDocumentTypes();

  function save($modalScope) {
    //scope from modal
    
    $scope.docTypes = new ResponseLm();

    DocumentTypesSvc.save($modalScope.docType, $modalScope.action).then(function(response){
      $scope.docTypes = response;

      if (!response.status) {
        $scope.docTypes.status = true;
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
    $modalScope.docType = new TiposDocumentos();
  };

  function confirmDelete($modalScope, id) {

    $scope.docTypes = new ResponseLm();

    DocumentTypesSvc.delete(id).then(function (response) {
      $scope.docTypes = response;

      if (!response.status) {
        $scope.docTypes.status = true;
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
      title: 'Servicio Tipos de Documento',
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
  .state('masters.documentTypes', {
    url: '/tipo-documentos',
    templateUrl: 'views/masters/document-types.html',
    controller: 'DocumentTypesCtrl'
  });

}]);

