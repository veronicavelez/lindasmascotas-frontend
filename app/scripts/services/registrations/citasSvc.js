'use strict';

/**
* @ngdoc function
* @name CitasSvc.service:CitasSvc
* @description
* # CompaniesSvc
* Service of the modyMarcaApp
*/

var service = angular.module('CitasSvc', []);

service.factory('CitasSvc', ['$http','$q','$sce','ServiciosSvc',  function($http, $q, $sce, ServiciosSvc){
    
    var self = {
        url: 'http://localhost:8084/LindasMascotas/rest/citas',

        getSchedules: function () {
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

        getPropietario: function(idPropietario){
            var d = $q.defer();
            
            $http.get($sce.trustAsResourceUrl(self.url + '/propietario?idPropietario=' + idPropietario))
                .then(function (response) {

                    return d.resolve(response.data);
                })
                .catch(function (response) {
                    d.reject();
                });

            return d.promise;
        },

        save: function (citas,accion) {
            var d = $q.defer();

            if (accion === 'crear') {
                $http.post($sce.trustAsResourceUrl(self.url), JSON.stringify(citas))
                    .then(function (response) {

                       return d.resolve(response.data);

                    })
                    .catch(function (response) {
                        d.reject();
                    });

            } else {
                $http.put($sce.trustAsResourceUrl(self.url), JSON.stringify(citas))
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

        horarioEmpleado: function (idEmpleado, fechaCita) {
            var d = $q.defer();

            $http.get($sce.trustAsResourceUrl(self.url + '/horarioemple?idEmpleado=' + idEmpleado + "&fechaCita=" + fechaCita))
                .then(function (response) {
                    return d.resolve(response.data);
                })
                .catch(function (response) {
                    d.reject();
                });

            return d.promise;
        },

        getServices: function(){
            var d = $q.defer();

            ServiciosSvc.getServices()
            .then(function(response){
                return d.resolve(response);
            })
            .catch(function(response){
                d.reject();
            });

            return d.promise; 
        },
    };

    return self;
    
}]);