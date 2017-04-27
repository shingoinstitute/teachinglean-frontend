// (function(){
//     'use strict';

//     angular.module('leansite')
//     .directive('isSame', function($interpolate, $parse){
//         return {
//             restrict: 'E',
//             require: 'ngModel',
//             link: function(scope, elem, attr, ngModelCtrl){
//                 var dataToMatch = $parse(attr.isSame);
//                 var dataFn = $interpolate(attr.isSame)(scope);

//                 scope.$watch(dataFn, function(newVal){
//                     ngModelCtrl.$setValidity('same', ngModelCtrl.$viewValue == newVal);
//                 });

//                 ngModelCtrl.$validators.same = function(modelValue, viewValue){
//                     var value = modelValue || viewValue;
//                     return value == dataToMatch(scope);
//                 };
//             }
//         };
//     });
// })();