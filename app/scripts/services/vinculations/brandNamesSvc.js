'use strict';

/**
* @ngdoc function
* @name mmVinculBrandNamesSvc.service:BrandNamesSvc
* @description
* # BrandNamesSvc
* Service of the modyMarcaApp
*/

var service = angular.module('mmVinculBrandNamesSvc', []);

service.factory('BrandNamesSvc', ['$http','$q','$sce','CompaniesSvc', function($http, $q, $sce,CompaniesSvc){
    
    var self = {
        url: 'http://localhost:8084/ModyMarcaBusinness/rest/brands',

        getBrandNames: function () {
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

        save: function (marca,accion) {
            var d = $q.defer();

            if (accion === 'create') {
                $http.post($sce.trustAsResourceUrl(self.url), JSON.stringify(marca))
                    .then(function (response) {

                       return d.resolve(response.data);

                    })
                    .catch(function (response) {
                        d.reject();
                    });

            } else {
                $http.put($sce.trustAsResourceUrl(self.url), JSON.stringify(marca))
                    .then(function (response) {

                        return d.resolve(response.data);
                    })
                    .catch(function (response) {
                        d.reject();
                    });
            }

            return d.promise;
        },

        uploadImage   : function(imagen, id) {
            return new Promise((resolve, reject) => {
            var formData = new FormData();
            var xhr = new XMLHttpRequest();

            formData.append('uploads[]', imagen, id);

            xhr.onreadystatechange = function(){
                if(xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            }

                xhr.open('POST', self.url + '/uploadimage', true);
                xhr.send(formData);
            });
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

        getAllCompanies: function(){
            var d = $q.defer();

            CompaniesSvc.getCompanies()
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