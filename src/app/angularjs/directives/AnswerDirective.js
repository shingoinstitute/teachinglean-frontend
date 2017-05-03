(function(){
    'use strict';

    angular.module('leansite')
    .directive('answer', function(){
        return {
            restrict: 'E',
            scope: {
                entry: '=',
                owner: '='
            },
            transclude: true,
            templateUrl: 'assets/templates/entries/answer.tmpl.html',
            controller: 'AnswerController'
        }
    });
})();