'use strict';

/**
* @ngdoc function
* @name mmVinculStoresSvc.service:StoresSvc
* @description
* # StoresSvc
* Service of the modyMarcaApp
*/

var service = angular.module('mmVinculStoresSvc', []);

service.factory('StoresSvc', ['$http', '$q', '$sce', 'BrandNamesSvc', 'StoreStatesSvc', 'UsersSvc', 'CountriesSvc',
    'DepartmentsSvc', 'CitiesSvc',
    function ($http, $q, $sce, BrandNamesSvc, StoreStatesSvc, UsersSvc, CountriesSvc, DepartmentsSvc, CitiesSvc) {

        var self = {
            url: 'http://localhost:8084/ModyMarcaBusinness/rest/stores',

            getStores: function () {
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

            save: function (tienda, accion) {
                var d = $q.defer();

                if (accion === 'create') {
                    $http.post($sce.trustAsResourceUrl(self.url), JSON.stringify(tienda))
                        .then(function (response) {

                            return d.resolve(response.data);

                        })
                        .catch(function (response) {
                            d.reject();
                        });

                } else {
                    $http.put($sce.trustAsResourceUrl(self.url), JSON.stringify(tienda))
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

            getStoresForSchedules: function () {
                var d = $q.defer();

                $http.get($sce.trustAsResourceUrl(self.url + '/getStoresForSchedules'))
                    .then(function (response) {

                        return d.resolve(response.data);
                    })
                    .catch(function (response) {
                        d.reject();
                    });

                return d.promise;
            },

            getBrandByCompanies: function () {
                var d = $q.defer();

                BrandNamesSvc.getBrandNames()
                    .then(function (response) {
                        return d.resolve(response);
                    })
                    .catch(function (response) {
                        d.reject();
                    });

                return d.promise;
            },

            getCountries: function () {
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

            getStoreStates: function() {
                var d = $q.defer();

                StoreStatesSvc.getStates()
                    .then(function (response) {
                        return d.resolve(response);
                    })
                    .catch(function (response) {
                        d.reject();
                    });

                return d.promise;
            },

            getStoreManagersByCity: function(cityId){
                var d = $q.defer();

                UsersSvc.getUsersByCity(cityId)
                    .then(function (response) {
                        let responseAux = response;
                        let users = new ResponseLm();

                        users.status = responseAux.status;
                        users.message = responseAux.message;

                        responseAux.data.forEach(el => {
                            if (el.idCargo.nombreCargo.toLowerCase().indexOf('gerente') > -1) {
                                users.data.push(el);
                            }
                        });

                        return d.resolve(users);
                    })
                    .catch(function (response) {
                        d.reject();
                    });

                return d.promise;
            },

            getDepartmentsByCountry: function (pais) {
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

            getCitiesByDepartments: function (dpto) {
                var d = $q.defer();

                CitiesSvc.getCitiesByDepartments(dpto)
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