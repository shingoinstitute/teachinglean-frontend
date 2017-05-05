(function () {
  'use strict';

  angular.module('leansite')
    .controller('CommentController', ['$scope', '$rootScope', '_entryService', 'BROADCAST', CommentController]);

  function CommentController($scope, $rootScope, _entryService, BROADCAST) {
    $scope.isEditing = false;

    if ($scope.comm && $scope.comm.owner && !$scope.comm.owner.uuid) {
      _entryService.readComment($scope.comm.id)
        .then(function (response) {
          $scope.comm = response.data;
          $scope.comm.canEdit = response.data.owner.uuid == $rootScope.userId;
        })
        .catch(function (err) {
          if (BROADCAST.loggingLevel == "DEBUG") {
            $rootScope.$broadcast(BROADCAST.error, JSON.stringify(err));
          } else {
            $rootScope.$broadcast(BROADCAST.error, "There was an error loading the comment details...");
          }
        });
    }

    $scope.$watch('isEditing', function (newValue) {
      if (newValue) {
        $scope._tmpComment = $scope.comm;
      } else if ($scope._tmpComment && !$scope.comm.$dirty) {
        $scope.comm = $scope._tmpComment;
      }
    });

    $scope.save = function () {
      _entryService.saveComment($scope.comm)
        .then(function (response) {
          $scope.comm = response.data;
          $scope.isEditing = false;
        })
        .catch(function (err) {
          if (BROADCAST.loggingLevel == "DEBUG") {
            $rootScope.$broadcast(BROADCAST.error, JSON.stringify(err));
          } else {
            $rootScope.$broadcast(BROADCAST.error, "There was an error saving your comment. Please try again...");
          }
        });
    }
  }
})();
