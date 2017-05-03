/**
* `app.ts`
*/

(function() {
	angular.module('leansite', ['ngRoute', 'ngMaterial', 'ngCookies', 'ngMessages', 'ngSanitize', 'angularMoment', 'summernote'])
	.config(Config);

	Config.$inject = ['$locationProvider', '$routeProvider', '$mdThemingProvider', '$mdIconProvider', '$httpProvider'];

	function Config($locationProvider, $routeProvider, $mdThemingProvider, $mdIconProvider, $httpProvider) {
		$routeProvider
		.when('/dashboard', {
			templateUrl: 'assets/templates/user/dashboard.html',
		})
		.when('/education', {
			templateUrl: 'assets/templates/public/education.html',
		})
		.when('/about', {
			templateUrl: 'assets/templates/public/about.html',
		})
		.when('/login', {
			templateUrl: 'assets/templates/public/login.html',
		})
		.when('/auth/linkedin/callback*', {
			template: '<p ng-init=\"linkedinCallback()\">redirecting...</p>',
		})
		.when('/createAccount', {
			templateUrl: 'assets/templates/user/createAccount.html'
		})
		.when('/teachingCurriculum', {
			templateUrl: 'assets/templates/public/teachingCurriculum.html'
		})
		.when('/entries', {
			templateUrl: 'assets/templates/entries/home.html'
		})
		.when('/entries/:id', {
			templateUrl: 'assets/templates/entries/detail.html'
		})
		.when('/reset', {
			templateUrl: 'assets/templates/user/passwordResetRequest.html'
		})
		.when('/reset/:id', {
			templateUrl: 'assets/templates/user/passwordResetForm.html'
		})
		.when('/verifyEmail/:id', {
			templateUrl: 'assets/templates/user/emailVerification.html'
		})
		.otherwise({
			template: ''
		});
		
		$locationProvider.html5Mode(true);
		
		$mdThemingProvider.alwaysWatchTheme(true);
		
		$mdThemingProvider.theme('default')
		.primaryPalette('blue-grey')
		.accentPalette('orange');
		
		$mdThemingProvider.theme('darkTheme')
		.primaryPalette('blue-grey')
		.accentPalette('orange')
		.dark();
	}

	angular.module('leansite')
	.constant('BROADCAST', {
		loggingLevel: 'PRODUCTION', // 'DEBUG' or 'PRODUCTION'
		info: '$infoMessage',
		error: '$errorMessage',
		userLogout: '$userLoggedOut',
		userLogin: '$userLoggedIn',
		qSave: '$questionSave',
		qAnswered: '$questionAnswered',
		entryChange: '$entryChange',
		userUpdated: '$userUpdated'
	})
	.constant('JWT_TOKEN', 'JWT')
	.constant('_', _);
})();
