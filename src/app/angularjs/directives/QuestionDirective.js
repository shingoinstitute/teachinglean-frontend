(function(){
    'use strict';

    angular.module('leansite')
    .directive('question', function(){
        return {
            restrict: 'E',
            scope: {
                entry: '=',
                owner: '='
            },
            transclude: true,
            templateUrl: 'templates/entries/question.tmpl.html',
            controller: 'QuestionController'
        }
    });
})();