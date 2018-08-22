'use strict';

/**
* @ngdoc function
* @name GenerosSvc.service:GenerosSvc
* @description
* # GenerosSvc
* Service of the modyMarcaApp
*/

var service = angular.module('GenerosSvc', []);

service.factory('GenerosSvc', ['$http','$q','$sce',function($http, $q, $sce){
    
    var self = {
        url: 'http://localhost:8084/LindasMascotas/rest/generos',

        getGenders: function () {
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

        save: function (genero, accion) {
            var d = $q.defer();

            if (accion === 'create') {
                $http.post($sce.trustAsResourceUrl(self.url), JSON.stringify(genero))
                    .then(function (response) {

                        return d.resolve(response.data);
                    })
                    .catch(function (response) {
                        d.reject();
                    });

            } else {
                $http.put($sce.trustAsResourceUrl(self.url), JSON.stringify(genero))
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
        }
    };

    return self;
    
}]);