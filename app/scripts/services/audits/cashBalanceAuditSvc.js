'use strict';

/**
* @ngdoc function
* @name mmAudCashBalanceAuditSvc.service:CashBalanceAuditSvc
* @description
* # CashBalanceAuditSvc
* Service of the modyMarcaApp
*/

var service = angular.module('mmAudCashBalanceAuditSvc', []);

service.factory('CashBalanceAuditSvc', ['$http','$q','$sce','SchedulesSvc', function($http, $q, $sce,SchedulesSvc){
    
    var self = {
        url: '',

        getScheduledVisits: function () {
            var d = $q.defer();
            
            SchedulesSvc.getSchedules().then(function (response) {
                return d.resolve(response);
            })
            .catch(function (response) {
                d.reject();
            });

            return d.promise;
        },

        save: function (schedule, action) {
            var d = $q.defer();

            SchedulesSvc.save(schedule, action).then(function (response) {
                return d.resolve(response);
            })
            .catch(function (response) {
                d.reject();
            });

            return d.promise;
        },

        delete: function (id) {
            var d = $q.defer();

            $http.delete($sce.trustAsResourceUrl(self.url + '?id=' + id))
                .then(function (response) {
                    return d.resolve(response.data);
                })
                .catch(function (response) {
                    d.reject();
                });

            return d.promise;
        },

        getAllCountries: function(){
            var d = $q.defer();

            CountriesSvc.getCountries().then(function(response){
                return d.resolve(response);

            }, function(response){
                d.reject(response);

            });

            return d.promise;
        },

        getCitiesByDepartments: function(dpto){
            var d = $q.defer();

            $http.post($sce.trustAsResourceUrl(self.url + '/getCitiesByDepartments'), JSON.stringify(dpto))
                .then(function (response) {
                    return d.resolve(response.data);
                })
                .catch(function (response) {
                    d.reject();
                });

            return d.promise;
        },

        getDepartmentsByCountry: function(pais){
            var d = $q.defer();

            DepartmentsSvc.getDepartmentsByCountry(pais).then(function(response){
                return d.resolve(response);

            }, function(response){
                d.reject(response);

            });

            return d.promise;
        }
    };

    return self;
    
}]);