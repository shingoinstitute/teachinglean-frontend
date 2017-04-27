(function() {

	angular.module('leansite')
	.controller('ModeratorController', ModeratorController);

	ModeratorController.$inject = ['$scope', '$rootScope', '$http', '$mdDialog', '$mdToast', '_userService', '_entryService'];

	function ModeratorController($scope, $rootScope, $http, $mdDialog, $mdToast, _userService, _entryService, users) {

		loadData();

		function loadData() {
			$http.get('/user')
			.then(function(response) {
				$scope.users = response.data;
				return _entryService.getQuestions();
			})
			.then(function(response) {
				$scope.questions = response.data;
				return _entryService.getAnswers();
			})
			.then(function(response) {
				$scope.answers = response.data;
				return _entryService.getComments();
			})
			.then(function(response) {
				$scope.comments = response.data;
			})
			.catch(function(response) {
				console.error(response);
			});
		}

		$scope.saveUser = _userService.updateUser;

		$scope.getUserQuestions = function(user) {
			_entryService.getUserQuestions(user.uuid)
			.then(function(response) {
				console.log('loaded questions...', response.data);
				user.questions = response.data;
			})
			.catch(function(response) {
				console.error(response);
			});
		}

		$scope.getUserAnswers = function(user) {
			_entryService.getUserAnswers(user.uuid)
			.then(function(response) {
				console.log('loaded answers...', response.data)
				user.answers = response.data;
			})
			.catch(function(err) {
				console.error(err);
			});
		}

		$scope.getUserComments = function(user) {
			_entryService.getUserComments(user.uuid)
			.then(function(response){
				console.log('loaded comments...', response.data);
				user.comments = response.data;
			})
			.catch(function(response) {
				console.error(response);
			});
		}
		
		function getIdsForList(list) {
			if (!Array.isArray(list)) list = [list];
			var rList = [];
			list.forEach(function(obj, i) {
				if (obj.$isActive == true) {
					rList.push(obj.id);
				}
			});
			return {id: rList};
		}

		$scope.$watch('selectAll', function(value) {
			if (!$scope.questions) $scope.questions = [];
			$scope.questions.forEach(function(obj) {
				obj.$isActive = value;
			});
			if (!$scope.answers) $scope.answers = [];
			$scope.answers.forEach(function(obj) {
				obj.$isActive = value;
			});
			if (!$scope.comments) $scope.comments = [];
			$scope.comments.forEach(function(obj) {
				obj.$isActive = value;
			});
		});

		$scope.deleteActiveEntries = function(entries) {
			return _entryService.destroyEntry(getIdsForList(entries))
			.then(function(response) {
				loadData();
			})
			.catch(function(err) {
				console.error(err);
			});
		}

		$scope.deleteActiveComments = function(comments) {
			return _entryService.destroyComment(getIdsForList(comments))
			.then(function(response) {
				loadData();
			})
			.catch(function(err) {
				console.error(err);
			});
		}

		$scope.editEntry = function(entry) {
			if (entry.id == $scope.activeEntry) {
				$scope.isEditing = false;
				$scope.activeEntry = null;
			} else {
				$scope.isEditing = true;
				$scope.activeEntry = entry;
				console.log('started editing question ' + entry.id);
			}
		}

		$scope.saveActiveEntries = function(data) {
			return _entryService.save(data)
			.then(function(res) {
				$mdToast.show($mdToast.simple().textContent('Save Successful').position('top right'));
				loadData();
			})
			.catch(function(err) {
				var toastErr = $mdToast.simple()
					.textContent('Error: ' + err.data.details)
					.hideDelay(false).action('Okay')
					.position('top right')
					.highlightAction(true);
				$mdToast.show(toastErr);
				console.error(err);
			});
		}

		$scope.saveActiveComments = function(data) {
			return _entryService.saveComment(data)
			.then(function(res) {
				$mdToast.show($mdToast.simple().textContent('Save Successful').position('top right'));
				loadData();
			})
			.catch(function(err) {
				var toastErr = $mdToast.simple()
					.textContent('Error: ' + err.data.details)
					.hideDelay(false).action('Okay')
					.position('top right')
					.highlightAction(true);
				$mdToast.show(toastErr);
				console.error(err);
			});
		}

		$scope.getStyle = function(isEven) {
			return isEven ? {'background':'white'} : {'background':'#f2f2f2'}
		}

		$scope.formatName = function(obj) {
			if (!obj.owner.firstname) return obj.owner.lastname;
			return obj.owner.lastname + ', ' + obj.owner.firstname;
		}

	}

})();