'use strict';

/**
* @ngdoc function
* @name EmpleadosSvc.service:EmpleadosSvc
* @description
* # EmpleadosSvc
* Service of the modyMarcaApp
*/

var service = angular.module('EmpleadosSvc', []);

service.factory('EmpleadosSvc', ['$http','$q','$sce','BarriosSvc','GenerosSvc','PerfilesSvc','TipoContratosSvc',
                'TipoSangreSvc','OccupationsSvc','CountriesSvc','DepartmentsSvc','CitiesSvc','DocumentTypesSvc',
                function($http, $q, $sce,BarriosSvc,GenerosSvc,PerfilesSvc,TipoContratosSvc,TipoSangreSvc,
                    OccupationsSvc,CountriesSvc,DepartmentsSvc, CitiesSvc,DocumentTypesSvc){
    
    var self = {
        url: 'http://localhost:8084/LindasMascotas/rest/empleados',

        getEmployees: function () {
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

        save: function (empleado,accion) {
            var d = $q.defer();

            if (accion === 'create') {
                $http.post($sce.trustAsResourceUrl(self.url), JSON.stringify(empleado))
                    .then(function (response) {

                       return d.resolve(response.data);

                    })
                    .catch(function (response) {
                        d.reject();
                    });

            } else {
                $http.put($sce.trustAsResourceUrl(self.url), JSON.stringify(empleado))
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

        getProfiles: function(){
            var d = $q.defer();

            PerfilesSvc.getProfiles()
            .then(function(response){
                return d.resolve(response);
            })
            .catch(function(response){
                d.reject();
            });

            return d.promise; 
        },

        getAgreementTypes: function(){
            var d = $q.defer();

            TipoContratosSvc.getAgreementTypes()
            .then(function(response){
                return d.resolve(response);
            })
            .catch(function(response){
                d.reject();
            });

            return d.promise; 
        },

        getBloodTypes: function(){
            var d = $q.defer();

            TipoSangreSvc.getBloodTypes()
            .then(function(response){
                return d.resolve(response);
            })
            .catch(function(response){
                d.reject();
            });

            return d.promise;  
        },

        getOccupations: function(){
            var d = $q.defer();

            OccupationsSvc.getOccupations()
            .then(function (response) {
                    return d.resolve(response);
            })
            .catch(function (response) {
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