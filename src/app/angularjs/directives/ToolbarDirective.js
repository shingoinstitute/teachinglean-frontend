(function(){
    'use strict';

    angular.module('leansite')
    .directive('toolBar', function(){
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: 'assets/templates/toolbar.tmpl.html',
            controller: 'NavController',
            controllerAs: 'vm'
        };
    });
})();