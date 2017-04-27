
(function () {
	angular.module('leansite')
		.controller('AdminController', AdminController);

	AdminController.$inject = ['$scope', '$document', '$rootScope', '$http', '$mdDialog', '$mdToast', '_userService', 'BROADCAST', '_'];

	function AdminController($scope, $document, $rootScope, $http, $mdDialog, $mdToast, _userService, BROADCAST, _) {
		var vm = this;
		vm.users = [];
		vm.progressCircleEnabled = false;
		vm.toastPosition = 'top right';
		$scope.userContainerId = 'user-manager-container';
		$scope.userSearchQuery = '';

		vm.findAll = function () {
			$http.get('/user?limit=20')
			.then(function (response) {
				if (response.data) vm.users = response.data;
			})
			.catch(function(err) {
				if (BROADCAST.loggingLevel === "DEBUG") {
					console.error(err);
				}
			});
		}

		vm.showDisableWarningDialog = function(user, _scope, $event) {
			var template = '<md-dialog flex-gt-sm="25" layout="column" aria-label="warning dialog" layout-padding>' +
								'	<md-dialog-content>' +
								'		<h3 class="md-heading">Warning</h3>' +
								'		<p class="md-body-1">Disabling <b>' + user.firstname + ' ' + user.lastname + '\'s</b> account will reset their password.</p>' +
								'		<p class="md-body-1">Disabling accounts has potentially irreversible side effects, <em>continue</em>?</p>' +
								'	</md-dialog-content>' +
								'  <md-dialog-actions layout>' +
								'		<md-button class="md-primary" ng-click="onCloseDialog(\'continue\')">Continue</md-button>' +
								'		<md-button class="md-raised md-primary" ng-click="onCloseDialog(\'cancel\')">Cancel</md-button>' +
								'  </md-dialog-actions>' +
								'</md-dialog>';
			$mdDialog.show({
				parent: angular.element(document.body),
				targetEvent: $event,
				template: template,
				controller: 'AdminController',
				onComplete: _scope.onCloseDialog,
				locals: {
					user: user,
					_scope: _scope,
					$event: $event
				}
			})
			.then(function() {
				vm.disableAccount(user, _scope);
			})
			.catch(function(e) {
				console.log('canceled...');
			});
		}

		$scope.onCloseDialog = function(opt) {
			if (opt == "continue") {
				$mdDialog.hide();
			} else if (opt == "cancel"){
				$mdDialog.cancel();
			}
		}

		vm.enableAccount = function (user, _scope) {
			user.accountIsActive = true;
			_scope.updateInProgress = true
			var toast = $mdToast.simple().hideDelay(500).position(vm.toastPosition).parent($document[0].querySelector('#'+$scope.userContainerId));
			_userService.updateUser({
				uuid: user.uuid,
				accountIsActive: user.accountIsActive
			})
			.then(function(response) {
				toast.textContent('Account succesfully enabled.');
				$mdToast.show(toast);
				_scope.updateInProgress = false;
			})
			.catch(function(response) {
				toast.textContent('Error: ' + response.data.details)
				.hideDelay(false).action('Okay')
				.position('top right')
				.highlightAction(true);
				$mdToast.show(toast);
				_scope.updateInProgress = false;
			});
		}

		vm.disableAccount = function (user, _scope) {
			user.accountIsActive = false;
			_scope.updateInProgress = true;
			var toast = $mdToast.simple().hideDelay(500).position(vm.toastPosition).parent($document[0].querySelector('#'+$scope.userContainerId));
			_userService.deleteUser(user)
			.then(function(response) {
				toast.textContent('Account succesfully disabled.');
				$mdToast.show(toast);
				_scope.updateInProgress = false;
			})
			.catch(function(response) {
				toast.textContent('Error: ' + response.data.details)
				.hideDelay(false).action('Okay')
				.position('top right')
				.highlightAction(true);
				$mdToast.show(toast);
				_scope.updateInProgress = false;
			});
		}

		vm.updateUser = function (user) {
			var toast = $mdToast
			.simple()
			.textContent('Saving...')
			.hideDelay(500)
			.position(vm.toastPosition)
			.parent($document[0].querySelector('#'+$scope.userContainerId));
			vm.updateInProgress = true;
			var updatee = $.extend(true, {}, user);
			_userService.updateUser(updatee)
			.then(function(response) {
				toast.textContent('Save Successful!');
				vm.updateInProgress = false;
				$mdToast.show(toast);
				vm.findAll();
			})
			.catch(function(response) {
				toast.textContent('Error: ' + response.data.details)
				.hideDelay(false).action('Okay')
				.position('top right')
				.highlightAction(true);
				vm.updateInProgress = false;
				$mdToast.show(toast);
			});
		}

		$scope.parseRole = function (userRole) {
			var role;
			switch (userRole) {
				case "systemAdmin":
					role = "System Admin";
					break;
				case "admin":
					role = "Admin";
					break;
				case "author":
					role = "Author";
					break;
				case "editor":
					role = "Editor";
					break;
				case "moderator":
					role = "Moderator";
					break;
				default: 
					role = "Member";
					break;
			}
			return role;
		}

		vm.updateRole = function(user, role) {
			user.role = role;
			vm.updateUser(user);
		}

		$scope.selectedUsers = {};
		$scope.hasSelection = false;
		$scope.onMasterCBClick = function() {
			$scope.isSelected = !$scope.isSelected;
			if (Object.keys($scope.selectedUsers).length == vm.users.length && !$scope.isSelected) {
				$scope.selectedUsers = {};
			} else if($scope.isSelected) {
				$scope.selectedUsers = _.keyBy(vm.users, 'uuid');
			}
			$scope.hasSelection = Object.keys($scope.selectedUsers).length > 0;
		}

		$scope.onCBClick = function(user) {
			if ($scope.selectedUsers[user.uuid]) {
				delete $scope.selectedUsers[user.uuid];
			} else {
				$scope.selectedUsers[user.uuid] = user;
			}
			if (Object.keys($scope.selectedUsers).length > 0) {
				$scope.isSelected = false;
			}
			$scope.hasSelection = Object.keys($scope.selectedUsers).length > 0;
		}

		$scope.$watch('userQuery', function (newV, oldV) {
			if (typeof newV == 'undefined' || newV == '') {
				vm.findAll()
			} else {
				$scope.performUserQuery(newV);
			}
		}, true);

		$scope.performUserQuery = function(query) {
			var params = {or: [{firstname: {contains: query}},{lastname: {contains: query}}]}
			$http.get('/user?where=' + JSON.stringify(params))
			.then(function(response) {
				vm.users = response.data;
			})
			.catch(function(err){
				console.error('Error: ', err);
			});
		}

	}

})();