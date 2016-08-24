"use strict";

angular.module('automationApp')
    .directive('iCheck', ['$timeout', '$parse', function($timeout, $parse) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, $attrs, ngModel) {
                return $timeout(function() {
                    var value;
                    value = $attrs['value'];

                    scope.$watch($attrs['ngModel'], function(newValue){
                        $(element).iCheck('update');
                    })

                    return $(element).iCheck(scope.iCheckOptions).on('ifChanged', function(event) {
                        if ($(element).attr('type') === 'checkbox' && $attrs['ngModel']) {

                            if(typeof(scope.checkBoxClicked) == "function"){
                                scope.checkBoxClicked();
                            }

                            scope.$apply(function() {
                                return ngModel.$setViewValue(event.target.checked);
                            });
                        }
                        if ($(element).attr('type') === 'radio' && $attrs['ngModel']) {
                            return scope.$apply(function() {
                                return ngModel.$setViewValue(value);
                            });
                        }
                    });
                });
            }
        };
    }]);

