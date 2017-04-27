(function () {
  'use strict';

  angular.module('leansite')
    .controller('ProfileController', ['$scope', '$rootScope', '_userService', 'BROADCAST', ProfileController]);

  function ProfileController($scope, $rootScope, user, BROADCAST) {
    var vm = this;
    vm.isEditing = false;
    vm.errors = [];

    vm.save = function () {
      user.updateUser($scope.user)
        .then(function (user) {
          $scope.user = user;
          vm.isEditing = false;
          console.log("Saving user: ", $scope.user);
        })
        .catch(function (err) {
          if (BROADCAST.loggingLevel == "DEBUG") {
            $rootScope.$broadcast(BROADCAST.error, JSON.stringify(err));
          } else {
            $rootScope.$broadcast(BROADCAST.error, "There was an error saving your profile. Please try again...");
          }
        });
    }

    vm.uploadPhoto = function (element) {
      console.log("File", element.files[0]);
      user.uploadPhoto(element.files[0])
        .then(function (response) {
            $scope.user.pictureUrl = response.data;
            $rootScope.$broadcast(BROADCAST.userUpdated, $scope.user);
        })
        .catch(function (err) {
          if (BROADCAST.loggingLevel == "DEBUG") {
            $rootScope.$broadcast(BROADCAST.error, JSON.stringify(err));
          } else {
            $rootScope.$broadcast(BROADCAST.error, "There was an error uploading your picture...");
          }
        })
    }

  }
})();
