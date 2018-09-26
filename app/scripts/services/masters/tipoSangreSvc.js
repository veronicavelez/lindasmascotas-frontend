'use strict';

/**
* @ngdoc function
* @name TipoSangreSvc.service:TipoSangreSvc
* @description
* # TipoSangreSvc
* Service of the modyMarcaApp
*/

var service = angular.module('TipoSangreSvc', []);

service.factory('TipoSangreSvc', ['$http','$q','$sce',function($http, $q, $sce){
    
    var self = {
        url: 'http://localhost:8084/LindasMascotas/rest/tipossangre',

        getBloodTypes: function () {
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

        save: function (tipoSangre, accion) {
            var d = $q.defer();

            if (accion === 'create') {
                $http.post($sce.trustAsResourceUrl(self.url), JSON.stringify(tipoSangre))
                    .then(function (response) {

                        return d.resolve(response.data);
                    })
                    .catch(function (response) {
                        d.reject();
                    });

            } else {
                $http.put($sce.trustAsResourceUrl(self.url), JSON.stringify(tipoSangre))
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
    };

    return self;
    
}]);