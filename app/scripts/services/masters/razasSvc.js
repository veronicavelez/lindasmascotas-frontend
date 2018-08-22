'use strict';

/**
* @ngdoc function
* @name RazasSvc.service:RazasSvc
* @description
* # RazasSvc
* Service of the modyMarcaApp
*/

var service = angular.module('RazasSvc', []);

service.factory('RazasSvc', ['$http','$q','$sce', 'EspeciesSvc',function($http, $q, $sce, EspeciesSvc){
    
    var self = {
        url: 'http://localhost:8084/LindasMascotas/rest/razas',

        getRaces: function () {
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

        save: function (raza, accion) {
            var d = $q.defer();

            if (accion === 'create') {
                $http.post($sce.trustAsResourceUrl(self.url), JSON.stringify(raza))
                    .then(function (response) {

                        return d.resolve(response.data);
                    })
                    .catch(function (response) {
                        d.reject();
                    });

            } else {
                $http.put($sce.trustAsResourceUrl(self.url), JSON.stringify(raza))
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

        getSpecies: function() {
            var d = $q.defer();

            EspeciesSvc.getSpecies().then(function(response){
                return d.resolve(response);

            }, function(response){
                d.reject(response);

            });

            return d.promise;
        }
    };

    return self;
    
}]);