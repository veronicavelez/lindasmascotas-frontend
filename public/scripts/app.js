var login = angular.module('loginApp', ['login.service', 'jcs-autoValidate']);

angular.module('jcs-autoValidate')
    .run([
        'validator',
        'defaultErrorMessageResolver',
        function (validator, defaultErrorMessageResolver) {
            validator.setValidElementStyling(false);

            // To change the root resource file path
            defaultErrorMessageResolver.setI18nFileRootPath('scripts/lib');
            defaultErrorMessageResolver.setCulture('es-CO');
        }
    ]);

login.controller('loginCtrl', ['$scope', '$location', 'LoginService', function($scope, $location, LoginService){
    $scope.invalido = false;
    $scope.mensaje = '';
    $scope.datos = {};
    
    $scope.ingresar = function(datos) {
        $scope.mensaje = 'Usuario y contraseña requeridos';
        if ($.isEmptyObject(datos)) {
            $scope.invalido = true;

            setTimeout(function(){
                $scope.invalido = false;
            }, 5000);

        } else if (datos.usuario === undefined || datos.password === undefined ) {
            $scope.invalido = true;

            setTimeout(function(){
                $scope.invalido = false;
            }, 5000);

        } else {
            $scope.invalido = false;
            
            if (datos.usuario === 'veronica' && datos.password === '1234') {
                $scope.invalido = false;
                sessionStorage.setItem('usuario', 'Veronica Velez');
                window.location = '../app/lindasmascotas.html';
                //$location.path('/app/modymarca.html');
            } else {
                $scope.mensaje = 'Usuario y contraseña invalidos';
                $scope.invalido = true;
            }


            /*
            LoginService.login(datos).then(function(response){
                console.log(response);
                if (response) {
                    $scope.invalido = false;
                    window.location = '../app/modymarca.html'
                } else {
                    $scope.mensaje = 'Usuario y contraseña invalidos';
                    $scope.invalido = true;
                }
            });
            */
        }
    };

    $scope.modalRecuperarPassword = function(){
        $('#modalRecuperarPass').modal();
    };

    $scope.recuperarPassword = function(datos){

    }
    
}]);