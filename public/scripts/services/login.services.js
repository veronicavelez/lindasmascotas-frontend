var loginService = angular.module('login.service', []);

loginService.factory('LoginService', ['$http', '$q', function($http, $q){
    var self = {
        login: function(datos){
            var d = $q.defer();

            if (datos.usuario === 'jacevedo' && datos.password === '1234') {
                return d.resolve(true);
            } 

            return d.promise;
        }
    };

    return self;
}]);