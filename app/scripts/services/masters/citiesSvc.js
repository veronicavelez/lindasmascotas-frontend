'use strict';

/**
* @ngdoc function
* @name ConfigCitiesSvc.service:CitiesSvc
* @description
* # CitiesSvc
* Service of the modyMarcaApp
*/

var service = angular.module('ConfigCitiesSvc', []);

service.factory('CitiesSvc', ['$http','$q','$sce','CountriesSvc','DepartmentsSvc', function($http, $q, $sce,CountriesSvc,DepartmentsSvc){
    
    var self = {
        url: 'http://localhost:8084/LindasMascotas/rest/ciudades',

        getCities: function () {
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

        save: function (ciudad, accion) {
            var d = $q.defer();

            if (accion === 'create') {
                $http.post($sce.trustAsResourceUrl(self.url), JSON.stringify(ciudad))
                    .then(function (response) {

                        return d.resolve(response.data);
                    })
                    .catch(function (response) {
                        d.reject();
                    });

            } else {
                $http.put($sce.trustAsResourceUrl(self.url), JSON.stringify(ciudad))
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

        getAllCountries: function(){
            var d = $q.defer();

            CountriesSvc.getCountries().then(function(response){
                return d.resolve(response);

            }, function(response){
                d.reject(response);

            });

            return d.promise;
        },

        getCitiesByDepartments: function(idDepartamento){
            var d = $q.defer();

            $http.get($sce.trustAsResourceUrl(self.url + '/ciudadespordpto?id=' + idDepartamento))
            .then(function(res){
                return d.resolve(res.data);
            })
            .catch(function(res){
                return d.reject(res);
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