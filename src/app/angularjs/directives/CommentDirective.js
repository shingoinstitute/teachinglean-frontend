(function(){
    'use strict';

    angular.module('leansite')
    .directive('comment', function(){
        return {
            restrict: 'E',
            scope: {
                comm: '=',
                owner: '='
            },
            transclude: true,
            templateUrl: 'templates/entries/comment.tmpl.html',
            controller: 'CommentController'
        }
    });
})();