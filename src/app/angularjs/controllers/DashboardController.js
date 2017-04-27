(function () {
  'use strict';

  angular.module('leansite')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$scope', '$rootScope', '$cookies', '$http', '$location', '_userService', '_entryService', 'BROADCAST'];

  function DashboardController($scope, $rootScope, $cookies, $http, $location, _userService, _entryService, BROADCAST) {
    var vm = this;
    var userId = '';
    vm.questions = [];
    vm.answers = [];
    vm.comments = [];

    vm.go = function (path) {
      $location.path(path);
    }

    vm.loadData = function () {
      _entryService.getUserQuestions(userId)
        .then(function (response) {
          vm.questions = response.data;
          return _entryService.getUserAnswers(userId);
        })
        .then(function (response) {
          vm.answers = response.data;
          return _entryService.getRecent(10, userId);
        })
        .then(function(response) {
          vm.recent = response.data;
          return _entryService.getUserComments(userId);
        })
        .then(function (response) {
          vm.comments = response.data;
        })
        .catch(function (err) {
          if (BROADCAST.loggingLevel == "DEBUG") {
            $rootScope.$broadcast(BROADCAST.error, JSON.stringify(err));
          } else {
            $rootScope.$broadcast(BROADCAST.error, "There was an error loading your profile data. Please try again...");
          }
        });
    }

		/**
		 * @description {function} onPageLoad :: sends broadcast to MainController, which in return sends broadcast back to DashboardController via '$DashboardControllerListener'
		 * @param {string} listenerName :: name of the listener
		 * @param {string} controllerName :: name of the controller making the broadcast
		 */
		vm.onPageLoad = function(listenerName, controllerName) {
			$rootScope.$broadcast(listenerName, controllerName);
		}

		/**
		 * @description {function} :: listener for broadcast from MainController. If user (in function(event, user)) is null, a user is not logged in.
		 */
		$scope.$on('$DashboardControllerListener', function(event, user) {
      if (user) {
        userId = user.uuid;
        vm.loadData();
      }
		});

		vm.onPageLoad('$MainControllerListener', 'DashboardController');

	}

})();
