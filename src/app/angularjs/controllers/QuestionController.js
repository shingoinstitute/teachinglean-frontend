(function () {
  'use strict';

  angular.module('leansite')
    .controller('QuestionController', ['$scope', '$rootScope', '$mdDialog', '_entryService', 'BROADCAST', QuestionController]);

  function QuestionController($scope, $rootScope, $mdDialog, _entryService, BROADCAST) {
    if ($scope.entry) $scope.entry.votes = 0;

    $scope.isEditing = false;

    $scope.$watch('isEditing', function (newValue, oldVaue) {
      if (newValue) {
        $scope._tmpEntry = angular.copy($scope.entry);
      } else if ($scope._tmpEntry && !$scope.entry.$dirty) {
        $scope.entry = $scope._tmpEntry;
      }
    });

    $scope.save = function () {
      _entryService.save($scope.entry)
        .then(function (response) {
          var votes = $scope.entry.votes;
          $scope.entry = response.data;
          $scope.entry.votes = votes;
          $scope.isEditing = false;
          $rootScope.$broadcast(BROADCAST.entryChange);
        })
        .catch(function (err) {
          if (BROADCAST.loggingLevel == "DEBUG") {
            $rootScope.$broadcast(BROADCAST.error, JSON.stringify(err));
          } else {
            $rootScope.$broadcast(BROADCAST.error, "There was an error saving your question. Please try again...");
          }
        });
    }

    $scope.answer = function () {
      $mdDialog.show({
          controller: 'AddEntryController',
          templateUrl: 'templates/entries/add.html',
          parent: angular.element(document.body),
          clickOutsideToClose: true,
          fullscreen: true,
          locals: {
            owner: $scope.owner,
            parentId: $scope.entry.id
          }
        })
        .then(function () {
          $rootScope.$broadcast(BROADCAST.entryChange);
        })
        .catch(function () {
          // DIALOG CANCELLED BY USER
        });
    }

    $scope.upVote = function() {
      _entryService.upvoteEntry($scope.entry)
      .then(function(response) {
        response = response.data;
        $scope.entry.votes = (response.users_did_upvote.length) - (response.users_did_downvote.length);
      })
      .catch(function(err) {
        if (BROADCAST.loggingLevel == "DEBUG") {
          $rootScope.$broadcast(BROADCAST.error, JSON.stringify(err));
        } else {
          $rootScope.$broadcast(BROADCAST.error, JSON.stringify("There was an error upvoting the question. Please try again..."));
        }
      });
    }

    $scope.downVote = function() {
      _entryService.downvoteEntry($scope.entry)
      .then(function(response) {
        response = response.data;
        $scope.entry.votes = (response.users_did_upvote.length) - (response.users_did_downvote.length);
      })
      .catch(function(err) {
        if (BROADCAST.loggingLevel == "DEBUG") {
          $rootScope.$broadcast(BROADCAST.error, JSON.stringify(err));
        } else {
          $rootScope.$broadcast(BROADCAST.error, JSON.stringify("There was an error downvoting the question. Please try again..."));
        }
      });
    }

    $scope.comment = function () {
      $mdDialog.show({
          controller: 'AddCommentController',
          templateUrl: 'templates/entries/addComment.html',
          parent: angular.element(document.body),
          clickOutsideToClose: true,
          fullscreen: true,
          locals: {
            owner: $scope.owner,
            parentId: $scope.entry.id
          }
        })
        .then(function () {
          $rootScope.$broadcast(BROADCAST.entryChange);
        })
        .catch(function () {
          // DIALOG CANCELLED BY USER
        });
    }
  }
})();
