'use strict';

/**
* @ngdoc function
* @name ConfigProductos.controller:ProductosCtrl
* @description
* # CountriesCtrl
* Controller of the modyMarcaApp
*/

var page = angular.module('ConfigProductos', ['jcs-autoValidate','datatables','ngResource']);

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

page.controller('ProductosCtrl', ['$scope','$modal','$window','DTOptionsBuilder','ProductosSvc','$resource', function ($scope,$modal,$window,DTOptionsBuilder,
  ProductosSvc,$resource) {

  // Page header info (views/layouts/pageheader.html)
  $window.scrollTo(0,0);
  $scope.pageicon = 'fa fa-cogs';
  $scope.pagetitle = 'Productos';
  $scope.parentpages = [{'url': 'masters','pagetitle': 'Configuraciones'}];

  $scope.productos = new ResponseLm();

  function dataTableOptions(){
    $scope.dtOptions = DTOptionsBuilder.newOptions()
    .withLanguageSource('scripts/lib/language-dataTables.json');    
  };
  dataTableOptions();

  $scope.open = function (size, backdrop, action, editProducto) {
    backdrop = backdrop ? backdrop : true;
    var modalInstance = $modal.open({
      templateUrl: 'views/masters/modal-forms/producto-form.html',
      size: size,
      backdrop: backdrop,
      controller: ['$scope', '$modalInstance', function($scope, $modalInstance){
        $scope.action = action;
        $scope.producto = new Producto();

        if (action === 'create') {
          $scope.modalTittle = 'Registro';
        } else if (action === 'edit') {
          $scope.modalTittle = 'Edición';

          if (angular.isObject(editProducto)) {
            angular.copy(editProducto, $scope.producto);
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

  $scope.delete = function (size, backdrop, delProducto) {
    backdrop = backdrop ? backdrop : true;
    var modalInstance = $modal.open({
      templateUrl: 'views/shared/confirm-delete.html',
      size: size,
      backdrop: backdrop,
      controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {

        if (angular.isObject(delProducto)) {
          $scope.message = 'Está seguro de que desea eliminar el producto';
          $scope.description = delProducto.nombreProducto;
        }

        $scope.ok = function () {
          confirmDelete($scope, delProducto.idProducto);
        };

        $scope.cancel = function () {
          $modalInstance.close();
        };
      }]
    });
  };

  function loadAllProducts (){
    ProductosSvc.getProducts().then(function(response){
      $scope.productos = response;

      if (!response.status) {
        infoMessage(response.message, 'growl-warning', 'warning');
      }

    }, function(){
      infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
    });
  };
  loadAllProducts();

  function save($modalScope) {
    //scope from modal
    
    $scope.productos = new ResponseLm();

    ProductosSvc.save($modalScope.producto, $modalScope.action).then(function(response){
      $scope.productos = response;

      if (!response.status) {
        $scope.productos.status = true;
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
    $scope.producto = new Producto();
  };

  function confirmDelete($modalScope, id) {

    $scope.productos = new ResponseLm();

    ProductosSvc.delete(id).then(function (response) {
      $scope.productos = response;

      if (!response.status) {
        $scope.productos.status = true;
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
      title: 'Productos',
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
  .state('masters.products', {
    url: '/productos',
    templateUrl: 'views/masters/productos.html',
    controller: 'ProductosCtrl'
  });

}]);

