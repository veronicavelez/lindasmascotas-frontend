'use strict';

/**
* @ngdoc function
* @name ServiciosSvc.service:ServiciosSvc
* @description
* # ServiciosSvc
* Service of the modyMarcaApp
*/

var service = angular.module('ServiciosSvc', []);

service.factory('ServiciosSvc', ['$http','$q','$sce','EmpleadosSvc',function($http, $q, $sce, EmpleadosSvc){
    
    var self = {
        url: 'http://localhost:8084/LindasMascotas/rest/servicios',

        getServices: function () {
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

        save: function (servicio, accion) {
            var d = $q.defer();

            if (accion === 'create') {
                $http.post($sce.trustAsResourceUrl(self.url), JSON.stringify(servicio))
                    .then(function (response) {

                        return d.resolve(response.data);
                    })
                    .catch(function (response) {
                        d.reject(response);
                    });

            } else {
                $http.put($sce.trustAsResourceUrl(self.url), JSON.stringify(servicio))
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

        getEmployees: function() {
            var d = $q.defer();

            EmpleadosSvc.getEmployees().then(function(response){
                return d.resolve(response);

            }, function(response){
                d.reject(response);

            });

            return d.promise;
        }
    };

    return self;
    
}]);