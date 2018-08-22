'use strict';

/**
* @ngdoc function
* @name mmAudCashBalanceAudit.controller:CashBalanceAuditCtrl
* @description
* # CashBalanceAuditCtrl
* Controller of the modyMarcaApp
*/

var page = angular.module('mmAudCashBalanceAudit', ['jcs-autoValidate', 'datatables', 'ngResource']);

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

page.controller('CashBalanceAuditCtrl', ['$scope', '$modal', '$window', 'DTOptionsBuilder', 'CashBalanceAuditSvc', '$resource', function ($scope, $modal, $window, DTOptionsBuilder,
    CashBalanceAuditSvc, $resource) {

    // Page header info (views/layouts/pageheader.html)
    var $wizard = null;
    $window.scrollTo(0, 0);
    $scope.pageicon = 'fa fa-cogs';
    $scope.pagetitle = 'Arqueo de Caja';
    $scope.parentpages = [{ 'url': 'audits', 'pagetitle': 'Auditorías' }];

    $scope.scheduledVisits = new ResponseLm();
    $scope.isVisible = true;
    $scope.schedule = new Cronograma();
    $scope.isEdit = false;
    $scope.observCG = false;
    $scope.observCM = false;

    function dataTableOptions() {
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withLanguageSource('scripts/lib/language-dataTables.json');
    };
    dataTableOptions();

    function loadScheduledVisits() {
        CashBalanceAuditSvc.getScheduledVisits().then(function (response) {
            if (!response.status) {
                infoMessage(response.message, 'growl-warning', 'warning');

            } else {
                response.data.forEach(el => {
                    el.fechaVisita = dateFormat(el.fechaVisita, false);
                    el.fechaInicioArqueo = dateFormat(el.fechaInicioArqueo, true);
                    el.fechaFinalArqueo = dateFormat(el.fechaFinalArqueo, true);
                });

                $scope.scheduledVisits = response;
            }

        }, function () {
            infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
        });
    };
    loadScheduledVisits();

    function dateFormat(date, timer) {
        let day = null;
        let month = null;
        let year = null;
        let hours = null;
        let minutes = null;
        let dateFormat = null;

        if (date !== null) {
            if (!timer) {
                date = new Date(date);
                day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
                month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
                year = date.getFullYear();
                dateFormat = day + '/' + month + '/' + year;
            } else {
                date = new Date(date);
                day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
                month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
                year = date.getFullYear();
                hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
                minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
                dateFormat = day + '/' + month + '/' + year + ' ' + hours + ':' + minutes;
            }
        } 
        return dateFormat;
    };

    /**
     * ******************************************************
     * ******************************************************
     * ******* OPEN MODAL CONFIRM START CASH BALANCE ********
     */

    $scope.confirm = function (size, backdrop, schVisit) {
        backdrop = backdrop ? backdrop : true;
        var modalInstance = $modal.open({
            templateUrl: 'views/audits/modal-confirm/confirm-start-delete.html',
            size: size,
            backdrop: backdrop,
            controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                $scope.title = 'Confirmar Inicio de Arqueo';
                $scope.isCancel = false;
                $scope.schVisit = new Cronograma();
                
                if (angular.isObject(schVisit)) {
                    angular.copy(schVisit, $scope.schVisit);

                    $scope.message = 'Está seguro que desea iniciar el Arqueo de Caja para la Tienda: ';
                    $scope.description = schVisit.posTienda.nombreTienda;
                }

                $scope.cancel = function () {
                    $modalInstance.close();
                };

                $scope.ok = function () {
                    startCashBalance($scope.schVisit, false);
                    $modalInstance.close();
                };
            }]
        });
    };

    $scope.editCashBalance = function(schVisit) {
        startCashBalance(schVisit, true);
    };

    function startCashBalance(schVisit, isEdit) {
        $window.scrollTo(0, 0);
        $scope.isVisible = false;
        $scope.isEdit = isEdit;

        if (angular.isObject(schVisit)) {
            angular.copy(schVisit, $scope.schedule);
            
            if (!isEdit) {
                $scope.schedule.fechaInicioArqueo = new Date();
                $scope.schedule.fechaInicioArqueo = dateFormat($scope.schedule.fechaInicioArqueo, true);
            }
        }

        wizardInit();
    };

    function wizardInit() {
        setTimeout(() => {
            $wizard = angular.element('#frmCashBalance');

            $wizard.bootstrapWizard({
                onTabShow: function (tab, navigation, index) {
                    tab.prevAll().addClass('done');
    
                    var $total = navigation.find('li').length;
                    var $current = index + 1;
    
                    var $percent = ($current / $total) * 100;
                    $wizard.find('.progress-bar').css('width', $percent + '%');
                }
            });
        }, 200);        
    };

    $scope.onTabShow = function ($event, index) {
        $event.preventDefault();
        var $tab = angular.element($event.currentTarget).parent();
        var $navigation = $wizard.find('ul.nav-wizard');
        var total = $navigation.find('li').length;
        var current = index + 1;

        if ($tab !== null) {
            $tab.prevAll().addClass('done');
            $tab.nextAll().removeClass('done');
            $tab.removeClass('done');
        }

        if (current >= total) {
            $wizard.find('.wizard .next').addClass('hide');
            $wizard.find('.wizard .finish').removeClass('hide');
        } else {
            $wizard.find('.wizard .next').removeClass('hide');
            $wizard.find('.wizard .finish').addClass('hide');
        }

        var percent = (current / total) * 100;
        $wizard.find('.progress-bar').css('width', percent + '%');
    };

    $scope.onlyNumbers = function($e) {
        if ($e.keyCode < 48 || $e.keyCode > 57) {
            if  ($e.keyCode !== 45) {
                $e.preventDefault();
            }
        }
    };

    $scope.validateValue = function(type) {
        let value;
        let observ;
        switch (type) {
            case 'cg':
                value = parseInt($scope.schedule.diferenciaCajaGeneral);
                observ = $scope.schedule.observacionesCajaGeneral;

                if (value !== 0 && (observ === '' || observ === null)) {
                    $scope.observCG = true;
                } else {
                    $scope.observCG = false;
                }
                break;
        
            case 'cm':
                value = parseInt($scope.schedule.diferenciaCajaMenor);
                observ = $scope.schedule.observacionesCajaMenor;

                if (value !== 0 && (observ === '' || observ === null)) {
                    $scope.observCM = true;
                } else {
                    $scope.observCM = false;
                }
                break;
        }
    },

    function restoreDateFormat(dateFormat, timer) {
        let day = dateFormat.split('/')[0]; //Day: 0, Month: 1, Year & Time: 2
        let month = parseInt(dateFormat.split('/')[1]) - 1;
        let year = dateFormat.split('/')[2].split(' ')[0];
        let hours = timer ? dateFormat.split('/')[2].split(' ')[1].split(':')[0] : null;
        let minutes = timer ? dateFormat.split('/')[2].split(' ')[1].split(':')[1] : null;
        let date = null;

        if (!timer) {
            date = new Date(year,month,day).getTime();
        } else {
            date = new Date(year,month,day,hours,minutes).getTime();
        }
        
        return date;
    };

    $scope.save = function() {
        $scope.scheduledVisits = new ResponseLm();

        $scope.schedule.fechaVisita = restoreDateFormat($scope.schedule.fechaVisita, false);
        $scope.schedule.fechaInicioArqueo = restoreDateFormat($scope.schedule.fechaInicioArqueo, true);
        $scope.schedule.fechaFinalArqueo = new Date().getTime();
        $scope.schedule.observaciones = $scope.schedule.observaciones === null ? null : $scope.schedule.observaciones;
        let schedule = JSON.parse(angular.toJson($scope.schedule));

        CashBalanceAuditSvc.save(schedule, 'edit').then(function (response) {
            
            if (!response.status) {
                $scope.scheduledVisits.status = true;
                infoMessage(response.message, 'growl-warning', 'warning');

            } else {
                infoMessage('El registro se guardó correctamente', 'growl-success', 'check');

                response.data.forEach(el => {
                    el.fechaVisita = dateFormat(el.fechaVisita, false);
                    el.fechaInicioArqueo = dateFormat(el.fechaInicioArqueo, true);
                    el.fechaFinalArqueo = dateFormat(el.fechaFinalArqueo, true);
                });

                $scope.scheduledVisits = response;
                $scope.isVisible = true;
            }

        }, function () {
            infoMessage('No se ha podido establecer conexión con el servidor, intente más tarde!...', 'growl-danger', 'danger');
        });

    };

    $scope.goBack = function() {
        $window.scrollTo(0, 0);
        $scope.isVisible = true;
        $scope.isEdit = false;
    };

    $scope.cancelVisit = function (size, backdrop, schVisit) {
        backdrop = backdrop ? backdrop : true;
        var modalInstance = $modal.open({
            templateUrl: 'views/audits/modal-confirm/confirm-start-delete.html',
            size: size,
            backdrop: backdrop,
            controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                $scope.title = 'Confirmar Cancelación de Arqueo';
                $scope.isCancel = true;
                $scope.schVisit = new Cronograma();

                if (angular.isObject(schVisit)) {
                    angular.copy(schVisit, $scope.schVisit);

                    $scope.message = 'Está seguro que desea cancelar el Arqueo de Caja para la Tienda: ';
                    $scope.description = schVisit.posTienda.nombreTienda;
                }

                $scope.cancel = function () {
                    $modalInstance.close();
                };

                $scope.ok = function () {
                    confirmCancel($scope.schVisit);
                    $modalInstance.close();
                };
            }]
        });
    };

    function confirmCancel(schVisit) {

        if (angular.isObject(schVisit)) {
            angular.copy(schVisit, $scope.schedule);
            
            if (!$scope.isEdit) {
                $scope.schedule.fechaInicioArqueo = new Date();
                $scope.schedule.fechaInicioArqueo = dateFormat($scope.schedule.fechaInicioArqueo, true);
            }
        }

        $scope.save();
    };

    function infoMessage(text, class_name, image) {
        jQuery.gritter.add({
            title: 'Servicio Ciudades',
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
        .state('audits', {
            url: '/audits',
            template: '<ui-view/>'
        })
        .state('audits.cashBalanceAudit', {
            url: '/cash-balance-audit-cahs',
            templateUrl: 'views/audits/cash-balance-audit.html',
            controller: 'CashBalanceAuditCtrl'
        });

}]);

