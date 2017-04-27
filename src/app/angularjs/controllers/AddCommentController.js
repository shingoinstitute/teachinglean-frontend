
(function () {
  'use strict';

  angular.module('leansite')
    .controller('AddCommentController', ['$scope', '$rootScope', '$mdDialog', '_entryService', 'parentId', 'BROADCAST', AddCommentController]);

  function AddCommentController($scope, $rootScope, $mdDialog, _entryService, parentId, BROADCAST) {
    $scope.comment = {};
    $scope.comment.owner = $rootScope.userId;
    $scope.comment.parent = parentId;

    $scope.save = function () {
      _entryService.createComment($scope.comment)
        .then(function (response) {
          $scope.comment = response.data;
          $mdDialog.hide();
        })
        .catch(function (err) {
          if (BROADCAST.loggingLevel == "DEBUG") {
            $rootScope.$broadcast(BROADCAST.error, JSON.stringify(err));
          } else {
            $rootScope.$broadcast(BROADCAST.error, "There was an error adding your comment. Please try again...");
          }
        });
    }
  }
})();
