var inputMayusDir = angular.module('inputMayus', []);

inputMayusDir.directive('ngUppercase', function(){
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl){
            var uppercase = function(inputValue){
                if (inputValue === undefined) inputValue = '';
                var uppercase = inputValue.toUpperCase();
                if (uppercase !== inputValue) {
                    modelCtrl.$setViewValue(uppercase);
                    modelCtrl.$render();
                }
                return uppercase;
            }
            modelCtrl.$parsers.push(uppercase);
            uppercase(scope[attrs.ngModel]);
        }
    };
});