'use strict';

/**
* @ngdoc function
* @name ProductosSvc.service:ProductosSvc
* @description
* # ProductosSvc
* Service of the modyMarcaApp
*/

var service = angular.module('ProductosSvc', []);

service.factory('ProductosSvc', ['$http','$q','$sce',function($http, $q, $sce){
    
    var self = {
        url: 'http://localhost:8084/LindasMascotas/rest/productos',

        getProducts: function () {
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

        save: function (producto, accion) {
            var d = $q.defer();

            if (accion === 'create') {
                $http.post($sce.trustAsResourceUrl(self.url), JSON.stringify(producto))
                    .then(function (response) {

                        return d.resolve(response.data);
                    })
                    .catch(function (response) {
                        d.reject(response);
                    });

            } else {
                $http.put($sce.trustAsResourceUrl(self.url), JSON.stringify(producto))
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
    };

    return self;
    
}]);