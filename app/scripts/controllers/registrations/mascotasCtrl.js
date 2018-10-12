'use strict';

/**
* @ngdoc function
* @name ConfigMascotas.controller:MascotasCtrl
* @description
* # MascotasCtrl
* Controller of the modyMarcaApp
*/

var page = angular.module('ConfigMascotas', ['jcs-autoValidate', 'datatables', 'ngResource']);

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

page.controller('MascotasCtrl', ['$scope', '$modal', '$window', 'DTOptionsBuilder', 'MascotasSvc', function ($scope, $modal, $window, DTOptionsBuilder, MascotasSvc) {

    // Page header info (views/layouts/pageheader.html)
    $window.scrollTo(0, 0);
    $scope.pageicon = 'fa fa-edit';
    $scope.pagetitle = 'Mascotas';
    $scope.parentpages = [{ 'url': 'registrations', 'pagetitle': 'Mascotas' }];

    $scope.mascotas = new ResponseLm();

    function dataTableOptions() {
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withLanguageSource('scripts/lib/language-dataTables.json');
    };
    dataTableOptions();

    $scope.open = function (size, backdrop, action, editMascota) {
        backdrop = backdrop ? backdrop : true;
        var modalInstance = $modal.open({
            templateUrl: 'views/registrations/modal-forms/mascota-form.html',
            size: size,
            backdrop: backdrop,
            controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                dataForDropDownList($scope);
                $scope.isEdit = false;
                $scope.action = action;
                $scope.mascota = new Mascota();

                if (action === 'create') {
                    $scope.modalTittle = 'Registro';
                } else if (action === 'edit') {
                    $scope.isEdit = true;
                    $scope.modalTittle = 'Edición';

                    if (angular.isObject(editMascota)) {
                        angular.copy(editMascota, $scope.mascota);
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
            }]
        });
    };

    $scope.delete = function (size, backdrop, delMascota) {
        backdrop = backdrop ? backdrop : true;
        var modalInstance = $modal.open({
            templateUrl: 'views/shared/confirm-delete.html',
            size: size,
            backdrop: backdrop,
            controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {

                if (angular.isObject(delMascota)) {
                    $scope.message = 'Está seguro de que desea elminar la mascota ';
                    $scope.description = delMascota.nombreMascota;
                }

                $scope.ok = function () {
                    confirmDelete($scope, delMascota.idMascota);
                };

                $scope.cancel = function () {
                    $modalInstance.close();
                };
            }]
        });
    };

    function loadAllPets() {
        MascotasSvc.getPets().then(function (response) {
            $scope.mascotas = response;

            if (!response.status) {
                $scope.mascotas.status = true;
                infoMessage(response.message, 'growl-warning', 'warning');
            }

        }, function () {
            $scope.mascotas.status = true;
            infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
        });
    };
    loadAllPets();

    function dataForDropDownList($modalScope) {
        MascotasSvc.getSpecies().then(function (response) {
            $modalScope.especies = response;

            if (!response.status) {
                infoMessage(response.message, 'growl-warning', 'warning');
            }

        }, function (response) {
            infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
        });

        MascotasSvc.getAnimalGenders().then(function (response) {
            $modalScope.sexos = response;

            if (!response.status) {
                infoMessage(response.message, 'growl-warning', 'warning');
            }

        }, function (response) {
            infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
        });

        MascotasSvc.getRaces().then(function (response) {
            $modalScope.razas = response;

            if (!response.status) {
                infoMessage(response.message, 'growl-warning', 'warning');
            }

        }, function (response) {
            infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
        });

        MascotasSvc.getOwners().then(function (response) {
            $modalScope.propietarios = response;

            if (!response.status) {
                infoMessage(response.message, 'growl-warning', 'warning');
            }

        }, function (response) {
            infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
        });
    };

    function save($modalScope) {
        //scope from modal

        $scope.mascotas = new ResponseLm();
        
        MascotasSvc.save(JSON.parse(angular.toJson($modalScope.mascota)), $modalScope.action).then(function (response) {
            $scope.mascotas = response;

            if (!response.status) {
                $scope.mascotas.status = true;
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
        $modalScope.mascota = new Mascota();
        dataForDropDownList($modalScope);
    };

    function confirmDelete($modalScope, id) {

        $scope.mascotas = new ResponseLm();

        MascotasSvc.delete(id).then(function (response) {
            $scope.mascotas = response;

            if (!response.status) {
                $scope.mascotas.status = true;
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
            title: 'Servicio Mascotas',
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
    .state('registrations.pets', {
            url: '/mascotas',
            templateUrl: 'views/registrations/mascotas.html',
            controller: 'MascotasCtrl'
        });
}]);
