'use strict';

/**
* @ngdoc function
* @name ConfigPropietarios.controller:PropietariosCtrl
* @description
* # PropietariosCtrl
* Controller of the modyMarcaApp
*/

var page = angular.module('ConfigPropietarios', ['jcs-autoValidate', 'datatables', 'ngResource']);

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

page.controller('PropietariosCtrl', ['$scope', '$modal', '$window', 'DTOptionsBuilder', 'PropietariosSvc', function ($scope, $modal, $window, DTOptionsBuilder, PropietariosSvc) {

    // Page header info (views/layouts/pageheader.html)
    $window.scrollTo(0, 0);
    $scope.pageicon = 'fa fa-edit';
    $scope.pagetitle = 'Propietarios';
    $scope.parentpages = [{ 'url': 'registrations', 'pagetitle': 'Propietarios' }];

    $scope.propietarios = new ResponseLm();

    function dataTableOptions() {
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withLanguageSource('scripts/lib/language-dataTables.json');
    };
    dataTableOptions();

    $scope.open = function (size, backdrop, action, editPropietario) {
        backdrop = backdrop ? backdrop : true;
        var modalInstance = $modal.open({
            templateUrl: 'views/registrations/modal-forms/propietario-form.html',
            size: size,
            backdrop: backdrop,
            controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                dataForDropDownList($scope);
                $scope.isEdit = false;
                $scope.action = action;
                $scope.propietario = new Propietario();

                if (action === 'create') {
                    $scope.modalTittle = 'Registro';
                } else if (action === 'edit') {
                    $scope.isEdit = true;
                    $scope.modalTittle = 'Edición';

                    if (angular.isObject(editPropietario)) {
                        angular.copy(editPropietario, $scope.propietario);
                        getDepartmentsByCounty($scope);
                        getCitiesByDepartments($scope);
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
            }]
        });
    };

    $scope.delete = function (size, backdrop, delPropietario) {
        backdrop = backdrop ? backdrop : true;
        var modalInstance = $modal.open({
            templateUrl: 'views/shared/confirm-delete.html',
            size: size,
            backdrop: backdrop,
            controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {

                if (angular.isObject(delPropietario)) {
                    $scope.message = 'Está seguro de que desea elminar el propietario ';
                    $scope.description = delPropietario.nombrePropietario + ' ' + delPropietario.apellidosPropietario;
                }

                $scope.ok = function () {
                    confirmDelete($scope, delPropietario.idPropietario);
                };

                $scope.cancel = function () {
                    $modalInstance.close();
                };
            }]
        });
    };

    function loadAllOwners() {
        PropietariosSvc.getOwners().then(function (response) {
            $scope.propietarios = response;

            if (!response.status) {
                infoMessage(response.message, 'growl-warning', 'warning');
            }

        }, function () {
            $scope.propietarios.status = true;
            infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
        });
    };
    loadAllOwners();

    function dataForDropDownList($modalScope) {
        PropietariosSvc.getNeighborhoods().then(function (response) {
            $modalScope.barrios = response;

            if (!response.status) {
                infoMessage(response.message, 'growl-warning', 'warning');
            }

        }, function (response) {
            infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
        });

        PropietariosSvc.getGenders().then(function (response) {
            $modalScope.generos = response;

            if (!response.status) {
                infoMessage(response.message, 'growl-warning', 'warning');
            }

        }, function (response) {
            infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
        });

        PropietariosSvc.getDocumentTypes().then(function (response) {
            $modalScope.docTypes = response;

            if (!response.status) {
                infoMessage(response.message, 'growl-warning', 'warning');
            }

        }, function (response) {
            infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
        });

        PropietariosSvc.getCountries().then(function (response) {
            $modalScope.countries = response;

            if (!response.status) {
                infoMessage(response.message, 'growl-warning', 'warning');
            }

        }, function (response) {
            infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
        });
    };

    function getDepartmentsByCounty($modalScope) {
        var pais = $modalScope.propietario.idCiudad.idDpto.idPais;

        PropietariosSvc.getDepartmentsByCountry(pais).then(function (response) {
            $modalScope.deptos = response;
            if (!response.status) {
                infoMessage(response.message, 'growl-warning', 'warning');
            }

        }, function (response) {

            infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');

        });
    };

    function getCitiesByDepartments($modalScope) {
        var dpto = $modalScope.propietario.idCiudad.idDpto.idDepartamento;

        PropietariosSvc.getCitiesByDepartments(dpto).then(function (response) {
            $modalScope.cities = response;
            if (!response.status) {
                infoMessage(response.message, 'growl-warning', 'warning');
            }

        }, function (response) {

            infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');

        });
    };

    function save($modalScope) {
        //scope from modal

        $scope.propietarios = new ResponseLm();
        
        PropietariosSvc.save(JSON.parse(angular.toJson($modalScope.propietario)), $modalScope.action).then(function (response) {
            $scope.propietarios = response;

            if (!response.status) {
                $scope.propietarios.status = true;
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
        $modalScope.propietario = new Propietario();
        $modalScope.documents = new ResponseLm();
        $modalScope.countries = new ResponseLm();
        $modalScope.departments = new ResponseLm();
        $modalScope.cities = new ResponseLm();
        dataForDropDownList($modalScope);
    };

    function confirmDelete($modalScope, id) {

        $scope.propietarios = new ResponseLm();

        PropietariosSvc.delete(id).then(function (response) {
            $scope.propietarios = response;

            if (!response.status) {
                $scope.propietarios.status = true;
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
            title: 'Servicio Propietarios',
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
    .state('registrations.owners', {
            url: '/propietarios',
            templateUrl: 'views/registrations/propietarios.html',
            controller: 'PropietariosCtrl'
        });
}]);
