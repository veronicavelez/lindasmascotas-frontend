'use strict';

/**
* @ngdoc function
* @name MascotasSvc.service:MascotasSvc
* @description
* # MascotasSvc
* Service of the modyMarcaApp
*/

var service = angular.module('MascotasSvc', []);

service.factory('MascotasSvc', ['$http','$q','$sce','EspeciesSvc','SexosSvc','RazasSvc',
                'PropietariosSvc', 
                function($http, $q, $sce,EspeciesSvc,SexosSvc,RazasSvc,PropietariosSvc){
    
    var self = {
        url: 'http://localhost:8084/LindasMascotas/rest/mascotas',

        getPets: function () {
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

        save: function (mascota,accion) {
            var d = $q.defer();

            if (accion === 'create') {
                $http.post($sce.trustAsResourceUrl(self.url), JSON.stringify(mascota))
                    .then(function (response) {

                       return d.resolve(response.data);

                    })
                    .catch(function (response) {
                        d.reject();
                    });

            } else {
                $http.put($sce.trustAsResourceUrl(self.url), JSON.stringify(mascota))
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

        getSpecies: function(){
            var d = $q.defer();

            EspeciesSvc.getSpecies()
            .then(function(response){
                return d.resolve(response);
            })
            .catch(function(response){
                d.reject();
            });

            return d.promise; 
        },

        getAnimalGenders: function(){
            var d = $q.defer();

            SexosSvc.getAnimalGenders()
            .then(function(response){
                return d.resolve(response);
            })
            .catch(function(response){
                d.reject();
            });

            return d.promise; 
        },

        getRaces: function(){
            var d = $q.defer();

            RazasSvc.getRaces()
            .then(function (response) {
                    return d.resolve(response);
            })
            .catch(function (response) {
                d.reject();
            });

            return d.promise;
        },

        getOwners: function(){
            var d = $q.defer();

            PropietariosSvc.getOwners()
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