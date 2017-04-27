(function(){
    'use strict';

    angular.module('leansite')
    .directive('profile', function(){
        return {
            restrict: 'E',
            scope: {
                user: '='
            },
            transclude: true,
            templateUrl: 'templates/user/profile.tmpl.html',
            controller: 'ProfileController as vm'
        }
    });
})();