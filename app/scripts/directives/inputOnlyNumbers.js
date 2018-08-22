var inputOnlyNumDir = angular.module('inputOnlyNumbers', []);

inputOnlyNumDir.directive('ngOnlyNumbers', function(){
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl){
            function inputVal(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        modelCtrl.$setViewValue(transformedInput);
                        modelCtrl.$render();
                    }
                    return transformedInput;
                }
                return '';
            }            
            modelCtrl.$parsers.push(inputVal);
        }
    };
});