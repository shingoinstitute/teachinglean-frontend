
(function(){
    'use strict';

    angular.module('leansite')
    .directive('sideNav', function(){
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: 'templates/public/sidenav.tmpl.html',
            controller: 'NavController'
        }
    });
})();
