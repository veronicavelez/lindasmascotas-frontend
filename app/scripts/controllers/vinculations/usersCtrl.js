'use strict';

/**
* @ngdoc function
* @name mmVinculUsers.controller:UsersCtrl
* @description
* # UsersCtrl
* Controller of the modyMarcaApp
*/

var page = angular.module('mmVinculUsers', ['jcs-autoValidate', 'datatables', 'ngResource']);

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

page.controller('UsersCtrl', ['$scope', '$modal', '$window', 'DTOptionsBuilder', 'UsersSvc', function ($scope, $modal, $window, DTOptionsBuilder, UsersSvc) {

    // Page header info (views/layouts/pageheader.html)
    $window.scrollTo(0, 0);
    $scope.pageicon = 'fa fa-edit';
    $scope.pagetitle = 'Usuarios del Sistema';
    $scope.parentpages = [{ 'url': 'vinculations', 'pagetitle': 'Usuarios del Sistema' }];

    $scope.users = new ResponseLm();

    function dataTableOptions() {
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withLanguageSource('scripts/lib/language-dataTables.json');
    };
    dataTableOptions();

    $scope.open = function (size, backdrop, action, eidtUser) {
        backdrop = backdrop ? backdrop : true;
        var modalInstance = $modal.open({
            templateUrl: 'views/vinculations/modal-forms/users-form.html',
            size: size,
            backdrop: backdrop,
            controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                dataForDropDownList($scope);
                $scope.isEdit = false;
                $scope.action = action;
                $scope.user = new Personal();

                if (action === 'create') {
                    $scope.modalTittle = 'Registro';
                } else if (action === 'edit') {
                    $scope.isEdit = true;
                    $scope.modalTittle = 'Edición';

                    if (angular.isObject(eidtUser)) {
                        angular.copy(eidtUser, $scope.user);
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

                $scope.validateUser = function () {
                    validateUser($scope);
                }
            }]
        });
    };

    $scope.delete = function (size, backdrop, delUser) {
        backdrop = backdrop ? backdrop : true;
        var modalInstance = $modal.open({
            templateUrl: 'views/shared/confirm-delete.html',
            size: size,
            backdrop: backdrop,
            controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {

                if (angular.isObject(delUser)) {
                    $scope.message = 'Está seguro de que desea elminar el usuario ';
                    $scope.description = delUser.nombres + ' ' + delUser.papellido + ' ' + delUser.sapellido;
                }

                $scope.ok = function () {
                    confirmDelete($scope, delUser.idPersonal);
                };

                $scope.cancel = function () {
                    $modalInstance.close();
                };
            }]
        });
    };

    function loadAllUsers() {
        UsersSvc.getUsers().then(function (response) {
            $scope.users = response;

            if (!response.status) {
                infoMessage(response.message, 'growl-warning', 'warning');
            }

        }, function () {
            $scope.users.status = true;
            infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
        });
    };
    loadAllUsers();

    function dataForDropDownList($modalScope) {
        UsersSvc.getDocumentTypes().then(function (response) {
            $modalScope.documents = response;

            if (!response.status) {
                infoMessage(response.message, 'growl-warning', 'warning');
            }

        }, function (response) {
            infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
        });

        UsersSvc.getOccupations().then(function (response) {
            $modalScope.occupations = response;

            if (!response.status) {
                infoMessage(response.message, 'growl-warning', 'warning');
            }

        }, function (response) {
            infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
        });

        UsersSvc.getCountries().then(function (response) {
            $modalScope.countries = response;

            if (!response.status) {
                infoMessage(response.message, 'growl-warning', 'warning');
            }

        }, function (response) {
            infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
        });
    };

    function getDepartmentsByCounty($modalScope) {
        var pais = $modalScope.user.idCiudad.idDepartamento.idPais;

        UsersSvc.getDepartmentsByCountry(pais).then(function (response) {
            $modalScope.departments = response;
            if (!response.status) {
                infoMessage(response.message, 'growl-warning', 'warning');
            }

        }, function (response) {

            infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');

        });
    };

    function getCitiesByDepartments($modalScope) {
        var dpto = $modalScope.user.idCiudad.idDepartamento;

        UsersSvc.getCitiesByDepartments(dpto).then(function (response) {
            $modalScope.cities = response;
            if (!response.status) {
                infoMessage(response.message, 'growl-warning', 'warning');
            }

        }, function (response) {

            infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');

        });
    };

    function validateUser($modalScope) {
        var id = $modalScope.user.idPersonal;

        UsersSvc.validateUser(id).then(function (response) {
            if (response.status && response.data) {
                infoMessage(response.message, 'growl-info', 'info');
                $modalScope.user.idPersonal = '';
            }

        }, function (response) {

            infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');

        });
    };

    function save($modalScope) {
        //scope from modal

        $scope.users = new ResponseLm();
        
        UsersSvc.save(JSON.parse(angular.toJson($modalScope.user)), $modalScope.action).then(function (response) {
            $scope.users = response;

            if (!response.status) {
                $scope.users.status = true;
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
        $modalScope.user = new Personal();
        $modalScope.documents = new ResponseLm();
        $modalScope.occupations = new ResponseLm();
        $modalScope.countries = new ResponseLm();
        $modalScope.departments = new ResponseLm();
        $modalScope.cities = new ResponseLm();
        dataForDropDownList($modalScope);
    };

    function confirmDelete($modalScope, id) {

        $scope.users = new ResponseLm();

        UsersSvc.delete(id).then(function (response) {
            $scope.users = response;

            if (!response.status) {
                $scope.users.status = true;
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
            title: 'Servicio Usuarios',
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
        .state('vinculations.users', {
            url: '/users',
            templateUrl: 'views/vinculations/users.html',
            controller: 'UsersCtrl'
        });
}]);
