'use strict';

/**
* @ngdoc function
* @name mmVinculUsersSvc.service:UsersSvc
* @description
* # UsersSvc
* Service of the modyMarcaApp
*/

var service = angular.module('mmVinculUsersSvc', []);

service.factory('UsersSvc', ['$http','$q','$sce','OccupationsSvc','CountriesSvc','DepartmentsSvc','CitiesSvc','DocumentTypesSvc',
function($http, $q, $sce,OccupationsSvc,CountriesSvc,DepartmentsSvc,CitiesSvc,DocumentTypesSvc){
    
    var self = {
        url: 'http://localhost:8084/ModyMarcaBusinness/rest/users',

        getUsers: function () {
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

        save: function (usuario,accion) {
            var d = $q.defer();

            if (accion === 'create') {
                $http.post($sce.trustAsResourceUrl(self.url), JSON.stringify(usuario))
                    .then(function (response) {

                       return d.resolve(response.data);

                    })
                    .catch(function (response) {
                        d.reject();
                    });

            } else {
                $http.put($sce.trustAsResourceUrl(self.url), JSON.stringify(usuario))
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

        getUsersByCity: function (cityId) {
            var d = $q.defer();
            
            $http.get($sce.trustAsResourceUrl(self.url + '/getUsersByCity?cityId=' + cityId))
                .then(function (response) {

                    return d.resolve(response.data);
                })
                .catch(function (response) {
                    d.reject();
                });

            return d.promise;
        },

        validateUser: function(id) {
            var d = $q.defer();

            $http.get($sce.trustAsResourceUrl(self.url + '/validateUser?id=' + id))
            .then(function (response){

                return d.resolve(response.data);
            })
            .catch(function (response) {
                d.reject();
            });

            return d.promise;
        },

        getUserByOccupationAndCity: function(occupationId, cityId){
            var d = $q.defer();
            var path = '/getUserByOccupationAndCity?occupationId=' + occupationId + '&cityId=' + cityId;

            $http.get($sce.trustAsResourceUrl(self.url + path))
            .then(function(response){
                return d.resolve(response.data);
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

        getDepartmentsByCountry: function(pais){
            var d = $q.defer();

            DepartmentsSvc.getDepartmentsByCountry(pais)
            .then(function (response) {
                    return d.resolve(response);
            })
            .catch(function (response) {
                d.reject();
            });

            return d.promise;
        },

        getCitiesByDepartments: function(dpto){
            var d = $q.defer();

            CitiesSvc.getCitiesByDepartments(dpto)
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