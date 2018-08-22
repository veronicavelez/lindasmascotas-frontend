'use strict';

/**
* @ngdoc function
* @name ConfigDepartmentsSvc.service:DepartmentsSvc
* @description
* # DepartmentsSvc
* Service of the modyMarcaApp
*/

var service = angular.module('ConfigDepartmentsSvc', []);

service.factory('DepartmentsSvc', ['$http', '$q', '$sce','CountriesSvc', function ($http, $q, $sce,CountriesSvc) {

    var self = {
        url: 'http://localhost:8084/LindasMascotas/rest/departamentos',

        getDepartments: function () {
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

        save: function (departamento, accion) {
            var d = $q.defer();

            if (accion === 'create') {
                $http.post($sce.trustAsResourceUrl(self.url), JSON.stringify(departamento))
                    .then(function (response) {

                        return d.resolve(response.data);
                    })
                    .catch(function (response) {
                        d.reject();
                    });

            } else {
                $http.put($sce.trustAsResourceUrl(self.url), JSON.stringify(departamento))
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

        getDepartmentsByCountry: function(pais){
            var d = $q.defer();

            $http.post($sce.trustAsResourceUrl(self.url + '/dptoporpais'), JSON.stringify(pais))
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