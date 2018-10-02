'use strict';

/**
* @ngdoc function
* @name ConfigEmpleados.controller:EmpleadosCtrl
* @description
* # EmpleadosCtrl
* Controller of the modyMarcaApp
*/

var page = angular.module('ConfigEmpleados', ['jcs-autoValidate', 'datatables', 'ngResource']);

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

page.controller('EmpleadosCtrl', ['$scope', '$modal', '$window', 'DTOptionsBuilder', 'EmpleadosSvc', function ($scope, $modal, $window, DTOptionsBuilder, EmpleadosSvc) {

    // Page header info (views/layouts/pageheader.html)
    $window.scrollTo(0, 0);
    $scope.pageicon = 'fa fa-edit';
    $scope.pagetitle = 'Empleados';
    $scope.parentpages = [{ 'url': 'registrations', 'pagetitle': 'Empleados' }];

    $scope.empleados = new ResponseLm();

    function dataTableOptions() {
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withLanguageSource('scripts/lib/language-dataTables.json');
    };
    dataTableOptions();

    $scope.open = function (size, backdrop, action, editEmpleado) {
        backdrop = backdrop ? backdrop : true;
        var modalInstance = $modal.open({
            templateUrl: 'views/registrations/modal-forms/empleado-form.html',
            size: size,
            backdrop: backdrop,
            controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                dataForDropDownList($scope);
                $scope.isEdit = false;
                $scope.action = action;
                $scope.empleado = new Empleado();

                if (action === 'create') {
                    $scope.modalTittle = 'Registro';
                } else if (action === 'edit') {
                    $scope.isEdit = true;
                    $scope.modalTittle = 'Edición';

                    if (angular.isObject(editEmpleado)) {
                        angular.copy(editEmpleado, $scope.empleado);
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

                $scope.consultarEmpleado = function (){
                    let idEmpleado = $scope.empleado.idEmpleado;
                    consultarEmpleado(idEmpleado);
                }

                $scope.validarFechaNac = function (){
                    let fechaAct = new Date((new Date().getFullYear() - 18),11,31);
                    let fechaNacimiento = $scope.empleado.fechaNacimiento;

                    if (fechaNacimiento > fechaAct) {
                        infoMessage("No es mayor de edad!", 'growl-warning', 'warning');
                        $scope.empleado.fechaNacimiento = null;
                    }


                }
            }]
        });
    };

    $scope.delete = function (size, backdrop, delEmpleado) {
        backdrop = backdrop ? backdrop : true;
        var modalInstance = $modal.open({
            templateUrl: 'views/shared/confirm-delete.html',
            size: size,
            backdrop: backdrop,
            controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {

                if (angular.isObject(delEmpleado)) {
                    $scope.message = 'Está seguro de que desea elminar el empleado ';
                    $scope.description = delEmpleado.nombreEmpleado + ' ' + delEmpleado.apellidosEmpleado;
                }

                $scope.ok = function () {
                    confirmDelete($scope, delEmpleado.idEmpleado);
                };

                $scope.cancel = function () {
                    $modalInstance.close();
                };
            }]
        });
    };

    function loadAllEmployees() {
        EmpleadosSvc.getEmployees().then(function (response) {
            $scope.empleados = response;

            if (!response.status) {
                infoMessage(response.message, 'growl-warning', 'warning');
            }

        }, function () {
            $scope.empleados.status = true;
            infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
        });
    };
    loadAllEmployees();

    function dataForDropDownList($modalScope) {
        EmpleadosSvc.getNeighborhoods().then(function (response) {
            $modalScope.barrios = response;

            if (!response.status) {
                infoMessage(response.message, 'growl-warning', 'warning');
            }

        }, function (response) {
            infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
        });

        EmpleadosSvc.getGenders().then(function (response) {
            $modalScope.generos = response;

            if (!response.status) {
                infoMessage(response.message, 'growl-warning', 'warning');
            }

        }, function (response) {
            infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
        });

        EmpleadosSvc.getProfiles().then(function (response) {
            $modalScope.perfiles = response;

            if (!response.status) {
                infoMessage(response.message, 'growl-warning', 'warning');
            }

        }, function (response) {
            infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
        });

        EmpleadosSvc.getAgreementTypes().then(function (response) {
            $modalScope.tipoContratos = response;

            if (!response.status) {
                infoMessage(response.message, 'growl-warning', 'warning');
            }

        }, function (response) {
            infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
        });

        EmpleadosSvc.getDocumentTypes().then(function (response) {
            $modalScope.docTypes = response;

            if (!response.status) {
                infoMessage(response.message, 'growl-warning', 'warning');
            }

        }, function (response) {
            infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
        });

        EmpleadosSvc.getBloodTypes().then(function (response) {
            $modalScope.tiposSangre = response;

            if (!response.status) {
                infoMessage(response.message, 'growl-warning', 'warning');
            }

        }, function (response) {
            infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
        });

        EmpleadosSvc.getOccupations().then(function (response) {
            $modalScope.cargos = response;

            if (!response.status) {
                infoMessage(response.message, 'growl-warning', 'warning');
            }

        }, function (response) {
            infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
        });

        EmpleadosSvc.getCountries().then(function (response) {
            $modalScope.countries = response;

            if (!response.status) {
                infoMessage(response.message, 'growl-warning', 'warning');
            }

        }, function (response) {
            infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
        });
    };

    function getDepartmentsByCounty($modalScope) {
        var pais = $modalScope.empleado.idCiudad.idDpto.idPais;

        EmpleadosSvc.getDepartmentsByCountry(pais).then(function (response) {
            $modalScope.deptos = response;
            if (!response.status) {
                infoMessage(response.message, 'growl-warning', 'warning');
            }

        }, function (response) {

            infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');

        });
    };

    function getCitiesByDepartments($modalScope) {
        var dpto = $modalScope.empleado.idCiudad.idDpto.idDepartamento;

        EmpleadosSvc.getCitiesByDepartments(dpto).then(function (response) {
            $modalScope.cities = response;
            if (!response.status) {
                infoMessage(response.message, 'growl-warning', 'warning');
            }

        }, function (response) {

            infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');

        });
    };

    function consultarEmpleado(idEmpleado) {
        
        EmpleadosSvc.consultarEmpleado(idEmpleado).then(function (response) {
            if (response.status) {
                infoMessage(response.message, 'growl-warning', 'warning');
            }

        }, function (response) {

            infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');

        });
    };

    function save($modalScope) {
        //scope from modal

        $scope.empleados = new ResponseLm();
        
        EmpleadosSvc.save(JSON.parse(angular.toJson($modalScope.empleado)), $modalScope.action).then(function (response) {
            $scope.empleados = response;

            if (!response.status) {
                $scope.empleados.status = true;
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
        $modalScope.empleado = new Empleado();
        $modalScope.documents = new ResponseLm();
        $modalScope.occupations = new ResponseLm();
        $modalScope.countries = new ResponseLm();
        $modalScope.departments = new ResponseLm();
        $modalScope.cities = new ResponseLm();
        dataForDropDownList($modalScope);
    };

    function confirmDelete($modalScope, id) {

        $scope.empleados = new ResponseLm();

        EmpleadosSvc.delete(id).then(function (response) {
            $scope.empleados = response;

            if (!response.status) {
                $scope.empleados.status = true;
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
            title: 'Servicio Empleados',
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
    .state('registrations', {
      url: '/resgistros',
      template: '<ui-view/>'
    })
    .state('registrations.employees', {
            url: '/empleados',
            templateUrl: 'views/registrations/empleados.html',
            controller: 'EmpleadosCtrl'
        });
}]);
