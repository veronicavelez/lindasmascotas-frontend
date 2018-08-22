'use strict';

/**
* @ngdoc function
* @name mmRepayPettyCashSvc.service:PettyCashSvc
* @description
* # PettyCashSvc
* Service of the modyMarcaApp
*/

var service = angular.module('mmRepayPettyCashSvc', []);

service.factory('PettyCashSvc', ['$http','$q','$sce', 'EntriesPettyCashSvc', function($http, $q, $sce, EntriesPettyCashSvc){
    
    var self = {
        url: 'http://localhost:8084/ModyMarcaBusinness/rest/pettycash',

        getPettyCashes: function () {
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

        save: function (pettyCash, action) {
            var d = $q.defer();

            if (action === 'create') {
                
                $http.post($sce.trustAsResourceUrl(self.url), JSON.stringify(pettyCash))
                    .then(function (response) {

                        return d.resolve(response.data);
                    })
                    .catch(function (response) {
                        d.reject(response);
                    });

            } else {
                $http.put($sce.trustAsResourceUrl(self.url), JSON.stringify(pettyCash))
                    .then(function (response) {

                        return d.resolve(response.data);
                    })
                    .catch(function (response) {
                        d.reject(response);
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

        getEntries: function() {
            var d = $q.defer();

            EntriesPettyCashSvc.getPettyCashEntries()
                .then(function (response) {
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