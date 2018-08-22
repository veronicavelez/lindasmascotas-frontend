'use strict';

/**
* @ngdoc function
* @name mmVinculBrandNames.controller:BrandNamesCtrl
* @description
* # BrandNamesCtrl
* Controller of the modyMarcaApp
*/

var page = angular.module('mmVinculBrandNames', ['jcs-autoValidate', 'datatables', 'ngResource']);

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

page.controller('BrandNamesCtrl', ['$scope', '$modal', '$window', 'DTOptionsBuilder', 'BrandNamesSvc', function ($scope, $modal, $window, DTOptionsBuilder, BrandNamesSvc) {

    // Page header info (views/layouts/pageheader.html)
    $window.scrollTo(0, 0);
    $scope.pageicon = 'fa fa-edit';
    $scope.pagetitle = 'Marcas';
    $scope.parentpages = [{ 'url': 'vinculations', 'pagetitle': 'Marcas' }];

    $scope.marcas = new ResponseLm();

    function dataTableOptions() {
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withLanguageSource('scripts/lib/language-dataTables.json');
    };
    dataTableOptions();

    $scope.open = function (size, backdrop, action, editMarca) {
        backdrop = backdrop ? backdrop : true;
        var modalInstance = $modal.open({
            templateUrl: 'views/vinculations/modal-forms/brand-names-form.html',
            size: size,
            backdrop: backdrop,
            controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                dataForDropDownList($scope);
                let elem = null;
                $scope.action = action;
                $scope.marca = new Marcas();
                $scope.marca.marcasEmpresaList.push(new MarcasEmpresa());
                $scope.nombreArchivo = '';
                $scope.imagen = null;

                if (action === 'create') {
                    $scope.modalTittle = 'Registro';
                } else if (action === 'edit') {
                    $scope.modalTittle = 'Edición';

                    if (angular.isObject(editMarca)) {
                        angular.copy(editMarca, $scope.marca);
                    }
                }

                $scope.save = function () {
                    save($scope);
                };

                $scope.clean = function () {
                    clean($scope, elem);
                };

                $scope.cancel = function () {
                    $modalInstance.close();
                };

                setTimeout(() => {
                    for (let i = 0; i < $scope.frmBrands.$$element[0].length; i++) {
                        if ($scope.frmBrands.$$element[0][i].id === 'fileInput') {
                            elem = $scope.frmBrands.$$element[0][i];
                            break;
                        }
                    }

                    elem = $(elem).closest('div').parent();
                    loadImage($scope, elem);
                }, 200);

            }]
        });
    };

    $scope.delete = function (size, backdrop, delMarca) {
        backdrop = backdrop ? backdrop : true;
        var modalInstance = $modal.open({
            templateUrl: 'views/shared/confirm-delete.html',
            size: size,
            backdrop: backdrop,
            controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {

                if (angular.isObject(delMarca)) {
                    $scope.message = 'Está seguro de que desea elminar la marca comercial ';
                    $scope.description = delMarca.nombreMarca;
                }

                $scope.ok = function () {
                    confirmDelete($scope, delMarca.idMarca);
                }

                $scope.cancel = function () {
                    $modalInstance.close();
                };
            }]
        });
    };

    function loadAllBrandNames() {
        BrandNamesSvc.getBrandNames().then(function (response) {
            $scope.marcas = response;
            if (!response.status) {
                infoMessage(response.message, 'growl-warning', 'warning');
            }

        }, function () {
            $scope.marcas.status = true;
            infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
        });
    };
    loadAllBrandNames();

    function dataForDropDownList($modalScope) {
        BrandNamesSvc.getAllCompanies().then(function (response) {
            $modalScope.companies = response;

            if (!response.status) {
                infoMessage(response.message, 'growl-warning', 'warning');
            }

        }, function (response) {

            infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');

        });
    };

    function save($modalScope) {
        //scope from modal

        $scope.marcas = new ResponseLm();

        BrandNamesSvc.save(JSON.parse(angular.toJson($modalScope.marca)), $modalScope.action).then(function (response) {
            if (!response.status) {
                $scope.marcas.status = true;
                infoMessage(response.message, 'growl-warning', 'warning');

            } else {
                let marcas = response.data;

                for (let i = 0; i < marcas.length; i++) {
                    if ($modalScope.marca.nombreMarca === marcas[i].nombreMarca) {
                        $modalScope.marca.idMarca = marcas[i].idMarca;
                        break;
                    }
                }

                let nombreMarca = $modalScope.marca.idMarca + '.png';

                BrandNamesSvc.uploadImage($modalScope.imagen, nombreMarca).then(function (response) {
                    if (!response.status) {
                        $scope.marcas.status = true;
                        infoMessage(response.message, 'growl-warning', 'warning');

                    } else {
                        if ($modalScope.action === 'create') {
                            infoMessage('El registro se guardó correctamente', 'growl-success', 'check');
                        } else {
                            infoMessage('El registro se actualizó correctamente', 'growl-success', 'check');
                        }
                        //$window.location.reload();

                        setTimeout(() => {
                            loadAllBrandNames();
                        }, 10000);
                        loadAllBrandNames();
                    }

                }, function () {
                    infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
                });
            }

        }, function () {
            infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
        });

        $modalScope.cancel();
    };

    function clean($scope, elem) {
        //scope from modal    
        $scope.marca = new Marcas();

        $(elem).find('img').attr('src', '');
        $(elem).find('input:text').val('');
    };

    function confirmDelete($modalScope, id) {

        $scope.marcas = new ResponseLm();

        BrandNamesSvc.delete(id).then(function (response) {
            $scope.marcas = response;

            if (!response.status) {
                $scope.marcas.status = true;
                infoMessage(response.message, 'growl-warning', 'warning');

            } else {

                infoMessage('El registro se eliminó correctamente', 'growl-success', 'check');
            }

        }, function () {
            infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
        });

        $modalScope.cancel();
    };

    function loadImage($modalScope, elem) {

        $(elem).find('input:file').on('change', function (e) {
            var file = e.target.files[0];

            if (file !== undefined) {
                var sizeKb = parseFloat(file.size / 1000000);

                if (!file.type.match(/image.*/)) {
                    infoMessage('Debe seleccionar una imagen con formato .jpg .png', 'growl-info', 'info')

                    e.target.files[0] = null;
                    $modalScope.imagen = null;
                    $(elem).find('img').attr('src', '');
                    $(elem).find('input:text').val('...');
                } else if (sizeKb > 2) {
                    infoMessage('La imagen supera el límite permitido de 2Mb', 'growl-warning', 'warning');

                    e.target.files[0] = null;
                    $modalScope.imagen = null;
                    $(elem).find('img').attr('src', '');
                    $(elem).find('input:text').val('...');
                } else {
                    $modalScope.imagen = file;
                    $scope.$apply(function () {
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            var result = e.target.result;
                            $(elem).find('img').attr('src', result);
                            $(elem).find('input:text').val(file.name);
                        };
                        reader.readAsDataURL(file);
                    });
                }
            }
        });
    };

    function getFormato($modalScope) {
        if ($modalScope.imagen !== null) {
            var ext = $modalScope.imagen.name.split('.');
            return '.' + ext[ext.length - 1];
        } else {
            return '';
        }

    };

    function infoMessage(text, class_name, image) {
        jQuery.gritter.add({
            title: 'Servicio Marcas',
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
        .state('vinculations.brandNames', {
            url: '/brand-names',
            templateUrl: 'views/vinculations/brand-names.html',
            controller: 'BrandNamesCtrl'
        });
}]);
