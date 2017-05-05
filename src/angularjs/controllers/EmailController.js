(function() {

  'use strict';

  angular.module('leansite')
    .controller('EmailController', EmailController);

  EmailController.$inject = ['$scope', '$http', '$routeParams'];

  function EmailController($scope, $http, $routeParams) {
    $scope.progressBarEnabled = true;

    $scope.verifyEmail = function() {

      if (!$routeParams.id) {
        return;
      }

      $http.get('/api/verifyEmail/' + $routeParams.id)
        .then(function(res) {
          $scope.progressBarEnabled = false;
          $scope.verifiedEmail = res.data && res.data.email ? res.data.email : null;
          if (!$scope.verifiedEmail) $scope.error = "Email address not found."
        })
        .catch(function(res) {
          $scope.progressBarEnabled = false;
          var err = res.data && res.data.error ? res.data.error: 'An unknown error has occurred!';
          $scope.error = err;
          console.error(err);
        });
    };
  }


})();
