(function () {
  'use strict';

  angular.module('leansite')
    .directive('entrySummary', function () {
      return {
        restrict: 'E',
        scope: {
          entry: '='
        },
        transclude: true,
        templateUrl: 'templates/entries/summary.tmpl.html',
        controller: ['$scope', '$location', function ($scope, $location) {
          $scope.go = function () {
            if ($scope.entry.parent) {
              $location.path('/entries/' + $scope.entry.parent);
              $location.hash('answer-' + $scope.entry.id);
            } else {
              $location.path('/entries/' + $scope.entry.id);
            }
          }
        }]
      }
    });
})();
