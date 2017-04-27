(function() {

	angular.module('leansite')
	.directive('moderator', function() {
		return {
			restrict: 'E',
			scope: {
				users: "="
			},
			transclude: true,
			templateUrl: 'templates/moderator/moderator.tmpl.html',
			controller: 'ModeratorController',
			controllerAs: 'vm'
		}
	})
	.directive('moderatorUser', function() {
		return {
			restrict: 'E',
			scope: {
				user: "="
			},
			transclude: true,
			templateUrl: 'templates/moderator/moderator.user.tmpl.html',
			controller: 'ModeratorController'
		}
	})
	.directive('moderatorAnswers', function() {
		return {
			restrict: 'E',
			scope: {
				answer: "="
			},
			transclude: true,
			templateUrl: 'templates/moderator/moderator.answer.tmpl.html',
			controller: 'ModeratorController'
		}
	})
	.directive('moderatorQuestions', function() {
		return {
			restrict: 'E',
			transclude: true,
			templateUrl: 'templates/moderator/moderator.question.tmpl.html',
			controller: 'ModeratorController'
		}
	})
	.directive('moderatorComments', function() {
		return {
			restrict: 'E',
			scope: {
				comment: "="
			},
			transclude: true,
			templateUrl: 'templates/moderator/moderator.comment.tmpl.html',
			controller: 'ModeratorController'
		}
	});

})();