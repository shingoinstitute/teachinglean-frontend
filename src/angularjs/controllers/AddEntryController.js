(function () {
  'use strict';

  angular.module('leansite')
    .controller('AddEntryController', ['$scope', '$rootScope', '$location', '$mdDialog', '_entryService', 'owner', 'parentId', 'BROADCAST', AddEntryController]);

  function AddEntryController($scope, $rootScope, $location, $mdDialog, _entryService, owner, parentId, BROADCAST) {
    $scope.entry = {}

    $scope.post = function () {
      $scope.entry.owner = owner;
      $scope.entry.parent = parentId;
      _entryService.createEntry($scope.entry)
        .then(function (response) {
          $mdDialog.hide();
          if (!parentId) $location.path('/entries/' + response.data.id);
        })
        .catch(function (err) {
          if (BROADCAST.loggingLevel == "DEBUG") {
            $rootScope.$broadcast(BROADCAST.error, JSON.stringify(err));
          } else {
            $rootScope.$broadcast(BROADCAST.error, "There was an error adding your entry. Please try again...");
          }
        });
    }
  }
})();
