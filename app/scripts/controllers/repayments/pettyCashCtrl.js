'use strict';

/**
* @ngdoc function
* @name mmRepayPettyCash.controller:PettyCashCtrl
* @description
* # PettyCashCtrl
* Controller of the modyMarcaApp
*/

var page = angular.module('mmRepayPettyCash', ['jcs-autoValidate', 'datatables', 'ngResource']);

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

page.controller('PettyCashCtrl', ['$scope', '$modal', '$window', '$filter', 'DTOptionsBuilder', 'PettyCashSvc', function ($scope, $modal, $window, $filter, DTOptionsBuilder,
    PettyCashSvc) {

    // Page header info (views/layouts/pageheader.html)
    var $wizard = null;
    $window.scrollTo(0, 0);
    $scope.pageicon = 'fa fa-usd';
    $scope.pagetitle = 'Caja Menor';
    $scope.parentpages = [{ 'url': 'repayments', 'pagetitle': 'Reembolso caja menor' }];

    $scope.pettyCashes = new ResponseLm();

    function dataTableOptions() {
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withLanguageSource('scripts/lib/language-dataTables.json');
    };
    dataTableOptions();

    $scope.open = function (size, backdrop, action, editPettyCash) {
        backdrop = backdrop ? backdrop : true;
        var modalInstance = $modal.open({
            templateUrl: 'views/repayments/modal-forms/petty-cash-form.html',
            size: size,
            backdrop: backdrop,
            controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                dataForDropDownList($scope);
                $scope.isEdit = false;
                $scope.action = action;
                $scope.pettyCash = new CajaMenor();
                $scope.pettyCashDetail = new DetalleCajaMenor();
                $scope.refundTotal = 0;

                setTimeout(() => {
                    let datePickPeCaSince = angular.element('#datePickPeCaSince');
                    let datePickPeCaUntil = angular.element('#datePickPeCaUntil');
                    datePickPeCaSince.datepicker({
                        numberOfMonths: 1
                    });

                    datePickPeCaUntil.datepicker({
                        numberOfMonths: 1
                    });
                }, 500);

                if (action === 'create') {
                    $scope.modalTittle = 'Registro';
                } else if (action === 'edit') {
                    $scope.isEdit = true;
                    $scope.modalTittle = 'Edición';

                    if (angular.isObject(editPettyCash)) {
                        angular.copy(editPettyCash, $scope.pettyCash);
                    }
                }

                // FALTA PEDIR EL VALOR DE LA CAJA MENOR                
                // CONFIGURAR LOS CAMPOS DE FECHA

                $scope.save = function () {
                    save($scope);
                };

                $scope.clean = function () {
                    clean($scope);
                };

                $scope.cancel = function () {
                    $modalInstance.close();
                };

                $scope.validateSerial = function () {
                    //validateSerial($scope);
                };

                $scope.addEntry = function () {
                    let exist = false;
                    let pettyCashDetail = new DetalleCajaMenor();
                    angular.copy($scope.pettyCashDetail, pettyCashDetail);

                    if (pettyCashDetail.idRubro.idRubro === '' || pettyCashDetail.valorRubro === null) {
                        infoMessage('Debe seleccionar un rubro y registrar un valor!', 'growl-info', 'info');

                    } else {
                        pettyCashDetail.idRubro.nombreRubro = getEntryDescription($scope.entries.data, pettyCashDetail.idRubro.idRubro);

                        for (let i = 0; i < $scope.pettyCash.detallesCajaMenorList.length; i++) {
                            if (parseInt(pettyCashDetail.idRubro.idRubro) === parseInt($scope.pettyCash.detallesCajaMenorList[i].idRubro.idRubro)) {
                                exist = true;
                                confirmAddAmount('sm', 'static', $scope, pettyCashDetail, i);
                            }
                        }

                        if (!exist) {
                            $scope.refundTotal += parseInt(pettyCashDetail.valorRubro);
                            $scope.pettyCash.detallesCajaMenorList.push(pettyCashDetail);

                            $scope.pettyCashDetail = new DetalleCajaMenor();
                            dataForDropDownList($scope);
                        }
                    }
                };

                $scope.removeEntry = function (index) {
                    $scope.refundTotal -= $scope.pettyCash.detallesCajaMenorList[index].valorRubro;
                    $scope.pettyCash.detallesCajaMenorList.splice(index, 1);
                };
            }]
        });
    };

    $scope.delete = function (size, backdrop, delPettyCash) {
        backdrop = backdrop ? backdrop : true;
        var modalInstance = $modal.open({
            templateUrl: 'views/shared/confirm-delete.html',
            size: size,
            backdrop: backdrop,
            controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {

                if (angular.isObject(delPettyCash)) {
                    $scope.message = 'Está seguro de que desea elminar la caja menor ';
                    $scope.description = delPettyCash.nombres + ' ' + delPettyCash.papellido + ' ' + delPettyCash.sapellido;
                }

                $scope.ok = function () {
                    confirmDelete($scope, delPettyCash.idPersonal);
                };

                $scope.cancel = function () {
                    $modalInstance.close();
                };
            }]
        });
    };

    function loadAllPettyCashes() {
        PettyCashSvc.getPettyCashes().then(function (response) {
            response.data = dateToString(response.data);
            $scope.pettyCashes = response;

            if (!response.status) {
                infoMessage(response.message, 'growl-warning', 'warning');
            }

            if (response.status && response.data.length == 0) {
                $scope.pettyCashes.status = true;
            }

        }, function () {
            $scope.pettyCashes.status = true;
            infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
        });
    };
    loadAllPettyCashes();

    function dataForDropDownList($modalScope) {
        $modalScope.entries = new ResponseLm();

        PettyCashSvc.getEntries().then(function (response) {
            $modalScope.entries = response;

            if (!response.status) {
                infoMessage(response.message, 'growl-warning', 'warning');
            }

        }, function (response) {
            infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
        });
    };

    function getEntryDescription(scopeEntries, idEntry) {
        let entries = [];
        angular.copy(scopeEntries, entries);

        for (let i = 0; i < entries.length; i++) {
            if (parseInt(entries[i].idRubro) === parseInt(idEntry)) {
                return entries[i].nombreRubro;
            }
        }

        return '';
    };

    function confirmAddAmount(size, backdrop, $modalScope, pcd, index) {
        backdrop = backdrop ? backdrop : true;
        var modalInstance = $modal.open({
            templateUrl: 'views/shared/confirm-delete.html',
            size: size,
            backdrop: backdrop,
            controller: ['$scope', '$filter', '$modalInstance', function ($scope, $filter, $modalInstance) {

                $scope.message = 'Ya está registrado el rubro ' + pcd.idRubro.nombreRubro + ', ¿Desea aumentar el valor de este rubro?. ';
                $scope.description = 'Valor: ' + $filter('currency')(pcd.valorRubro, '$', 0);

                $scope.ok = function () {
                    let currentValue = parseInt($modalScope.pettyCash.detallesCajaMenorList[index].valorRubro);
                    $modalScope.pettyCash.detallesCajaMenorList[index].valorRubro = currentValue + parseInt(pcd.valorRubro);
                    $modalScope.refundTotal += parseInt(pcd.valorRubro);
                    $modalScope.pettyCashDetail = new DetalleCajaMenor();
                    dataForDropDownList($modalScope);

                    $modalInstance.close();
                };

                $scope.cancel = function () {
                    $modalInstance.close();
                };
            }]
        });
    };

    function validateSerial($modalScope) {
        var id = $modalScope.user.idPersonal;

        PettyCashSvc.validateUser(id).then(function (response) {
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

        $scope.pettyCashes = new ResponseLm();

        if ($modalScope.pettyCash.detallesCajaMenorList.length > 0) {
            let pettyCash = {};
            angular.copy($modalScope.pettyCash, pettyCash);
            pettyCash = stringToDate([pettyCash])[0];

            PettyCashSvc.save(JSON.parse(angular.toJson(pettyCash)), $modalScope.action).then(function (response) {
                response.data = dateToString(response.data);
                $scope.pettyCashes = response;
    
                if (!response.status) {
                    $scope.pettyCashes.status = true;
                    infoMessage(response.message, 'growl-warning', 'warning');
    
                } else {
    
                    if ($modalScope.action === 'create') {
                        infoMessage('El registro se guardó correctamente', 'growl-success', 'check');
                    } else {
                        infoMessage('El registro se actualizó correctamente', 'growl-success', 'check');
                    }

                    $modalScope.cancel();
                }
    
            }, function () {
                infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
            });
        }
    };

    function clean($modalScope) {
        //scope from modal    
        $modalScope.pettyCash = new CajaMenor();
        $modalScope.entries = new ResponseLm();
        $modalScope.refundTotal = 0;
        dataForDropDownList($modalScope);
    };

    function confirmDelete($modalScope, id) {

        $scope.users = new ResponseLm();

        PettyCashSvc.delete(id).then(function (response) {
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

    function stringToDate(arrPetyCashes){
        arrPetyCashes.forEach(pc => {
            let auxDateSince = pc.fechaDesde.split('/');
            let auxDateUntil = pc.fechaHasta.split('/');

            pc.fechaDesde = new Date(parseInt(auxDateSince[2]), parseInt(auxDateSince[1]) - 1, parseInt(auxDateSince[0]));
            pc.fechaHasta = new Date(parseInt(auxDateUntil[2]), parseInt(auxDateUntil[1]) - 1, parseInt(auxDateUntil[0]));
        });

        return arrPetyCashes;
    };

    function dateToString(arrPetyCashes){
        let day = null;
        let month = null;
        let year = null;
        let date = null;

        arrPetyCashes.forEach(pc => {
            let auxDateSince = new Date(pc.fechaDesde);
            let auxDateUntil = new Date(pc.fechaHasta);

            day = auxDateSince.getDate() < 10 ? '0' + auxDateSince.getDate() : auxDateSince.getDate();
            month = (auxDateSince.getMonth() + 1) < 10 ? '0' + (auxDateSince.getMonth() + 1) : (auxDateSince.getMonth() + 1);
            year = auxDateSince.getFullYear();
            date = day + '/' + month + '/' + year;
            pc.fechaDesde = date;
            
            day = auxDateUntil.getDate() < 10 ? '0' + auxDateUntil.getDate() : auxDateUntil.getDate();
            month = (auxDateUntil.getMonth() + 1) < 10 ? '0' + (auxDateUntil.getMonth() + 1) : (auxDateUntil.getMonth() + 1);
            year = auxDateUntil.getFullYear();
            date = day + '/' + month + '/' + year;
            pc.fechaHasta = date;
        });

        return arrPetyCashes;
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
        .state('repayments', {
            url: '/repayments',
            template: '<ui-view/>'
        })
        .state('repayments.pettyCash', {
            url: '/petty-cash',
            templateUrl: 'views/repayments/petty-cash.html',
            controller: 'PettyCashCtrl'
        });
}]);