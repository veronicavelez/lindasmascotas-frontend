'use strict';

/**
* @ngdoc function
* @name mmVinculStores.controller:StoresCtrl
* @description
* # StoresCtrl
* Controller of the modyMarcaApp
*/

var page = angular.module('mmVinculStores', ['jcs-autoValidate', 'datatables', 'ngResource']);

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

page.controller('StoresCtrl', ['$scope', '$modal', '$window', 'DTOptionsBuilder', 'StoresSvc', function ($scope, $modal, $window, DTOptionsBuilder, StoresSvc) {

    // Page header info (views/layouts/pageheader.html)
    $window.scrollTo(0, 0);
    $scope.pageicon = 'fa fa-edit';
    $scope.pagetitle = 'Tiendas';
    $scope.parentpages = [{ 'url': 'vinculations', 'pagetitle': 'Tiendas para Auditar' }];

    $scope.stores = new ResponseLm();

    function dataTableOptions() {
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withLanguageSource('scripts/lib/language-dataTables.json');
    };
    dataTableOptions();

    $scope.open = function (size, backdrop, action, eidtStore) {
        backdrop = backdrop ? backdrop : true;
        var modalInstance = $modal.open({
            templateUrl: 'views/vinculations/modal-forms/stores-form.html',
            size: size,
            backdrop: backdrop,
            controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                dataForDropDownList($scope);
                $scope.isEdit = false;
                $scope.action = action;
                $scope.store = new Tienda();

                if (action === 'create') {
                    $scope.modalTittle = 'Registro';
                } else if (action === 'edit') {
                    $scope.isEdit = true;
                    $scope.modalTittle = 'Edición';

                    if (angular.isObject(eidtStore)) {
                        angular.copy(eidtStore, $scope.store);
                        getDepartmentsByCounty($scope);
                        getCitiesByDepartments($scope);
                        getStoreManagersByCity($scope);
                    }
                }

                $scope.save = function () {
                    save($scope);
                };

                $scope.clean = function () {
                    clean($scope);
                };

                $scope.cancel = function () {
                    $modalInstance.close();
                };

                $scope.getDepartmentsByCountry = function () {
                    getDepartmentsByCounty($scope);
                };

                $scope.getCitiesByDepartments = function () {
                    getCitiesByDepartments($scope);
                };

                $scope.getStoreManagersByCity = function () {
                    getStoreManagersByCity($scope);
                };

                $scope.validateStore = function(){
                    validateStore($scope);
                };
            }]
        });
    };

    $scope.delete = function (size, backdrop, delStore) {
        backdrop = backdrop ? backdrop : true;
        var modalInstance = $modal.open({
            templateUrl: 'views/shared/confirm-delete.html',
            size: size,
            backdrop: backdrop,
            controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {

                if (angular.isObject(delStore)) {
                    $scope.message = 'Está seguro de que desea elminar la tienda ';
                    $scope.description = delStore.nombreTienda;
                }

                $scope.ok = function () {
                    confirmDelete($scope, delStore.posTienda);
                };

                $scope.cancel = function () {
                    $modalInstance.close();
                };
            }]
        });
    };

    function loadAllStores() {
        StoresSvc.getStores().then(function (response) {
            $scope.stores = response;

            if (!response.status) {
                infoMessage(response.message, 'growl-warning', 'warning');
            }

        }, function () {
            $scope.stores.status = true;
            infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
        });
    };
    loadAllStores();

    function dataForDropDownList($modalScope) {
        StoresSvc.getBrandByCompanies().then(function (response) {
            $modalScope.brands = response;

            if (!response.status) {
                infoMessage(response.message, 'growl-warning', 'warning');
            }

        }, function (response) {
            infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
        });

        StoresSvc.getCountries().then(function (response) {
            $modalScope.countries = response;

            if (!response.status) {
                infoMessage(response.message, 'growl-warning', 'warning');
            }

        }, function (response) {
            infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
        });

        StoresSvc.getStoreStates().then(function (response) {
            $modalScope.storeStates = response;

            if (!response.status) {
                infoMessage(response.message, 'growl-warning', 'warning');
            }

        }, function (response) {
            infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
        });

        // StoresSvc.getStoreManagers().then(function (response) {
        //     $modalScope.storeManagers = response;

        //     if (!response.status) {
        //         infoMessage(response.message, 'growl-warning', 'warning');
        //     }

        // }, function (response) {
        //     infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
        // });
    };

    function getDepartmentsByCounty($modalScope) {
        var pais = $modalScope.store.idCiudad.idDepartamento.idPais;

        StoresSvc.getDepartmentsByCountry(pais).then(function (response) {
            $modalScope.departments = response;
            if (!response.status) {
                infoMessage(response.message, 'growl-warning', 'warning');
            }

        }, function (response) {

            infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');

        });
    };

    function getCitiesByDepartments($modalScope) {
        var dpto = $modalScope.store.idCiudad.idDepartamento;

        StoresSvc.getCitiesByDepartments(dpto).then(function (response) {
            $modalScope.cities = response;
            if (!response.status) {
                infoMessage(response.message, 'growl-warning', 'warning');
            }

        }, function (response) {

            infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');

        });
    };

    function getStoreManagersByCity($modalScope) {
        var cityId = $modalScope.store.idCiudad.idCiudad;

        StoresSvc.getStoreManagersByCity(cityId).then(function (response) {
            $modalScope.storeManagers = response;

            if (!response.status) {
                infoMessage(response.message, 'growl-warning', 'warning');
            }

        }, function (response) {
            infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
        });
    };

    function validateStore($modalScope) {

    };

    function save($modalScope) {
        //scope from modal

        $scope.stores = new ResponseLm();

        StoresSvc.save(JSON.parse(angular.toJson($modalScope.store)), $modalScope.action).then(function (response) {
            $scope.stores = response;

            if (!response.status) {
                $scope.stores.status = true;
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
        $modalScope.store = new Personal();
        $modalScope.brands = new ResponseLm();
        $modalScope.countries = new ResponseLm();
        $modalScope.departments = new ResponseLm();
        $modalScope.cities = new ResponseLm();
        $modalScope.storeStates = new ResponseLm();
        $modalScope.storeManagers = new ResponseLm();
        dataForDropDownList($modalScope);
    };

    function confirmDelete($modalScope, id) {

        $scope.stores = new ResponseLm();

        StoresSvc.delete(id).then(function (response) {
            $scope.stores = response;

            if (!response.status) {
                $scope.stores.status = true;
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
            title: 'Servicio Tiendas',
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
        .state('vinculations.stores', {
            url: '/stores',
            templateUrl: 'views/vinculations/stores.html',
            controller: 'StoresCtrl'
        });
}]);
