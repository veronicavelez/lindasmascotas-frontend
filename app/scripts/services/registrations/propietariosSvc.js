'use strict';

/**
* @ngdoc function
* @name PropietariosSvc.service:PropietariosSvc
* @description
* # PropietariosSvc
* Service of the modyMarcaApp
*/

var service = angular.module('PropietariosSvc', []);

service.factory('PropietariosSvc', ['$http','$q','$sce','BarriosSvc','GenerosSvc','CountriesSvc',
                'DepartmentsSvc','CitiesSvc','DocumentTypesSvc', 
                function($http, $q, $sce,BarriosSvc,GenerosSvc,CountriesSvc,DepartmentsSvc,CitiesSvc,
                    DocumentTypesSvc){
    
    var self = {
        url: 'http://localhost:8084/LindasMascotas/rest/propietarios',

        getOwners: function () {
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

        save: function (propietario,accion) {
            var d = $q.defer();

            if (accion === 'create') {
                $http.post($sce.trustAsResourceUrl(self.url), JSON.stringify(propietario))
                    .then(function (response) {

                       return d.resolve(response.data);

                    })
                    .catch(function (response) {
                        d.reject();
                    });

            } else {
                $http.put($sce.trustAsResourceUrl(self.url), JSON.stringify(propietario))
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

        getNeighborhoods: function(){
            var d = $q.defer();

            BarriosSvc.getNeighborhoods()
            .then(function(response){
                return d.resolve(response);
            })
            .catch(function(response){
                d.reject();
            });

            return d.promise; 
        },

        getGenders: function(){
            var d = $q.defer();

            GenerosSvc.getGenders()
            .then(function(response){
                return d.resolve(response);
            })
            .catch(function(response){
                d.reject();
            });

            return d.promise; 
        },

        getCountries: function(){
            var d = $q.defer();

            CountriesSvc.getCountries()
            .then(function (response) {
                    return d.resolve(response);
            })
            .catch(function (response) {
                d.reject();
            });

            return d.promise;
        },

        getDepartmentsByCountry: function(idPais){
            var d = $q.defer();

            DepartmentsSvc.getDepartmentsByCountry(idPais)
            .then(function (response) {
                    return d.resolve(response);
            })
            .catch(function (response) {
                d.reject();
            });

            return d.promise;
        },

        getCitiesByDepartments: function(idDpto){
            var d = $q.defer();

            CitiesSvc.getCitiesByDepartments(idDpto)
            .then(function (response) {
                    return d.resolve(response);
            })
            .catch(function (response) {
                d.reject();
            });

            return d.promise;
        },

        getDocumentTypes: function(){
            var d = $q.defer();

            DocumentTypesSvc.getDocumentTypes()
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