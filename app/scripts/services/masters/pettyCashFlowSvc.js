'use strict';

/**
* @ngdoc function
* @name mmPettyCashFlowSvc.service:PettyCashFlowSvc
* @description
* # PettyCashFlowSvc
* Service of the modyMarcaApp
*/

var service = angular.module('mmPettyCashFlowSvc', []);

service.factory('PettyCashFlowSvc', ['$http','$q','$sce','PettyCashStatesSvc',function($http, $q, $sce,PettyCashStatesSvc){
    
    var self = {
        url: 'http://localhost:8084/ModyMarcaBusinness/rest/pettycashflow',

        getFlows: function () {
            var d = $q.defer();
            
            $http.get($sce.trustAsResourceUrl(self.url))
                .then(function (response) {

                    return d.resolve(response.data);
                })
                .catch(function (response) {
                    d.reject();
                });

            return d.promise;
        },

        save: function (flujo, accion) {
            var d = $q.defer();

            if (accion === 'create') {
                $http.post($sce.trustAsResourceUrl(self.url), JSON.stringify(flujo))
                    .then(function (response) {

                        return d.resolve(response.data);
                    })
                    .catch(function (response) {
                        d.reject();
                    });

            } else {
                $http.put($sce.trustAsResourceUrl(self.url), JSON.stringify(flujo))
                    .then(function (response) {

                        return d.resolve(response.data);
                    })
                    .catch(function (response) {
                        d.reject();
                    });
            }

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

        getPettyCashStates: function(){
            var d = $q.defer();

            PettyCashStatesSvc.getStates().then(function (response) {
                    return d.resolve(response);
                })
                .catch(function (response) {
                    d.reject();
                });

            return d.promise;
        }
    };

    return self;
    
}]);