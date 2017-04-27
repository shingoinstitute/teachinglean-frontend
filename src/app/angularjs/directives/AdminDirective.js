(function() {

	angular.module('leansite')
	.directive('admin', function() {
		return {
			templateUrl: 'templates/admin/admin.tmpl.html',
			controller: 'AdminController',
			transclude: true,
			controllerAs: 'vm'
		}
	})
	.directive('adminUserCard', function() {
		return {
			restrict: 'E',
			scope: {
				user: "=",
				index: "=",
				ctrl: "="
			},
			transclude: true,
			templateUrl: 'templates/admin/adminUserCard.tmpl.html',
			controller: 'AdminController',
			controllerAs: 'vm'
		}
	});

})();