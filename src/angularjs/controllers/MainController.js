(function () {
	'use strict';

	angular.module('leansite')
		.controller('MainController', MainController);

	MainController.$inject = ['$scope', '$rootScope', '$http', '$cookies', '$location', '$mdMedia', '$mdTheming', '_userService', 'BROADCAST', 'JWT_TOKEN'];

	function MainController($scope, $rootScope, $http, $cookies, $location, $mdMedia, $mdTheming, _userService, BROADCAST, JWT_TOKEN) {
		var vm = this;

		/**
		 * @desc {function} getUser :: returns a user object from the API. Requires a JWT token.
		 */
		vm.getUser = function () {
			_userService.getUser()
				.then(function (response) {
					vm.user = response.data;
					$rootScope.userId = response.data.uuid;
				})
				.catch(function(response) {
					if ($rootScope.userId) console.error(response.data);
				});
		};

		/**
		 * @desc {function} $watch :: Watches for changes in screen size to determine wether to hide/show the side nav
		 */
		$scope.$watch(function () {
			return $mdMedia('gt-sm');
		}, function (shouldLockSidenav) {
			vm.sideNavLocked = shouldLockSidenav;
		});

		/**
		 * @desc :: listener for BROADCAST.error, displays error message when invoked
		 */
		$scope.$on(BROADCAST.error, function (event, args) {
			if (BROADCAST.loggingLevel == "DEBUG") {
				if (args.data && args.data.error) {
					args = args.data.error;
				} else if (args.error) {
					args = args.error;
				}
				if (args instanceof Error) {
					vm.error = args.message;
				} else if (typeof args == 'string') {
					vm.error = args;
				} else {
					vm.error = JSON.stringify(args, null, 2);
				}
			}
		});

		/**
		 * @desc :: listener for BROADCAST.userLogout, removes user object from MainController
		 */
		$scope.$on(BROADCAST.userLogout, function (event) {
			vm.user = $rootScope.userId = null;
		});

		/**
		 * @desc :: listener for user login
		 */
		$scope.$on(BROADCAST.userLogin, function (event, user) {
			vm.user = user;
		});

		/**
		 * @desc :: listener for BROADCAST.userUpdated, fetches updated user object for MainController when invoked
		 */
		$scope.$on(BROADCAST.userUpdated, function (event, user) {
			if (!user) return vm.getUser();
			vm.user = user;
			$rootScope.userId = user.uuid;
		});

		/**
		 * @description {function} :: listener for broadcasts from any controller for communication between controllers
		 * 
		 * listens for event name '$MainControllerListener', and takes a listener function with the event object and the name of the controller the broadcast is coming from.
		 * 
		 * If no controller name is passed in as the second argument to the listener function, the default behavior for MainController is to retrieve the user from the server.
		 */
		$scope.$on('$MainControllerListener', function (event, controller) {
			switch (controller) {
				case 'NavController':
					$rootScope.$broadcast('$NavControllerListener', vm.user);
					break;
				case 'DashboardController':
					if (vm.user) {
						$rootScope.$broadcast('$DashboardControllerListener', vm.user);
					} else {
						_userService.getUser()
							.then(function (response) {
								if (response.error) { $rootScope.$broadcast(BROADCAST.error, response.error); }
								vm.user = response.data;
								$rootScope.$broadcast('$DashboardControllerListener', vm.user);
							})
							.catch(function (err) {
								$rootScope.$broadcast(BROADCAST.error, err);
							});
					}
					break;
				case 'AuthController':

					break;
				case 'SettingsController':
					// do something...
					break;
				case 'QuestionController':
					if (vm.user) {
						$rootScope.$broadcast('$QuestionControllerListener', vm.user);
					} else {
						_userService.getUser()
							.then(function (response) {
								vm.user = response.data;
								$rootScope.$broadcast('$QuestionControllerListener', vm.user);
							})
							.catch(function (err) {
								$rootScope.$broadcast(BROADCAST.error, err);
							});
					}
					break;
				case 'TEST':
					console.log('user: ', vm.user);

					break;
				default:
					vm.getUser();
					break;
			}
		});

		vm.getUser();

	}

})();
