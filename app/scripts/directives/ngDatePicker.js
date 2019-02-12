var datePickerDir = angular.module('datePicker', []);

datePickerDir.directive('ngDatePicker', function(){
    return {
        restrict: "A",
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl){
           var datePickerFormat = 'dd/mm/yyyy',
           momentFormat = 'DD/MM/YYYY',
           datepicker,
           elPicker;

           datepicker = element.datepicker({
               autoclose: true,
               keyboardNavigation: false,
               todayHighlight: true,
               format: datePickerFormat
           });

           elPicker = datepicker.data('datepicker').picker;

           datepicker.on('show', function (evt){
                elPicker.css('left', parseInt(elPicker.css('left')) + +attrs.offsetX);
                elPicker.css('top', parseInt(elPicker.css('top')) + +attrs.offsetY);
           });

           if (modelCtrl){
                var lastModelValueMoment;

                modelCtrl.$formatters.push(function (modelValue){

                    var viewValue,
                        m= moment(modelValue);
                    if (modelValue && m.isValid()) {
                        lastModelValueMoment = m.clone();

                        viewValue = m.format(momentFormat);
                    } else {
                        lastModelValueMoment = undefined;
                        viewValue = undefined;
                    }

                    element.datepicker('setDate', viewValue);                
                });

                modelCtrl.$parsers.push(function (viewValue){

                    var modelValue,
                        m = moment(viewValue, momentFormat, true);
                    if (viewValue && m.isValid()){

                        if (lastModelValueMoment) {

                            m.hour(lastModelValueMoment.hour());
                            m.minute(lastModelValueMoment.minute());
                            m.second(lastModelValueMoment.second());
                            m.millisecond(lastModelValueMoment.millisecond());
                        }
                        modelValue = m.toDate();
                    } else {
                        modelValue = undefined;
                    }
                    
                    return modelValue;
                });

                datepicker.on('changeDate', function (evt){

                    if (evt.target.tagName !== 'INPUT'){
                        modelCtrl.$setViewValue(moment(evt.date).format(momentFormat));
                        modelCtrl.$render();
                    }

                });
           }
        }
    };
});