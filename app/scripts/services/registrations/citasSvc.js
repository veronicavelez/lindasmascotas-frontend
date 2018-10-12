'use strict';

/**
* @ngdoc function
* @name CitasSvc.service:CitasSvc
* @description
* # CompaniesSvc
* Service of the modyMarcaApp
*/

var service = angular.module('CitasSvc', []);

service.factory('CitasSvc', ['$http','$q','$sce',  function($http, $q, $sce,){
    
    var self = {
        url: 'http://localhost:8084/ModyMarcaBusinness/rest/schedules',

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

        getStoreWithoutVisits: function(){
            var d = $q.defer();
            
            $http.get($sce.trustAsResourceUrl(self.url + '/getStoreWithoutVisits'))
                .then(function (response) {

                    return d.resolve(response.data);
                })
                .catch(function (response) {
                    d.reject();
                });

            return d.promise;
        },

        save: function (schedule, accion) {
            var d = $q.defer();

            if (accion === 'create') {
                schedule.idCronograma = null;
                
                $http.post($sce.trustAsResourceUrl(self.url), JSON.stringify(schedule))
                    .then(function (response) {

                        return d.resolve(response.data);
                    })
                    .catch(function (response) {
                        d.reject();
                    });

            } else {
                $http.put($sce.trustAsResourceUrl(self.url), JSON.stringify(schedule))
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

        getAllAuditorsByCity: function(cityId) {
            var d = $q.defer();

            // UsersSvc.getUsersByCity(cityId)
            // .then(function(response){
            //     let responseAux = response;
            //     let users = new ResponseLm();

            //     users.status = responseAux.status;
            //     users.message = responseAux.message;

            //     responseAux.data.forEach(el => {
            //         if (el.idCargo.nombreCargo.toLowerCase().indexOf('auditor(a)') > -1){
            //             users.data.push(el);
            //         }
            //     });
                
            //     return d.resolve(users);
            // })
            // .catch(function(response){
            //     d.reject();
            // });

            return d.promise;
        },

        getStoresForSchedules: function(){
            var d = $q.defer();

            // StoresSvc.getStoresForSchedules()
            // .then(function(response){
            //     return d.resolve(response);
            // })
            // .catch(function(response){
            //     d.reject();
            // });

            return d.promise;
        }
    };

    return self;
    
}]);