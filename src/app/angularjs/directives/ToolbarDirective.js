(function(){
    'use strict';

    angular.module('leansite')
    .directive('toolBar', function(){
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: 'assets/templates/public/toolbar.tmpl.html',
            controller: 'NavController',
            controllerAs: 'vm'
        };
    });
})();