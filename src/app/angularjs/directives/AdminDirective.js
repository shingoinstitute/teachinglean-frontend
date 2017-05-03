(function() {

	angular.module('leansite')
	.directive('admin', function() {
		return {
			templateUrl: 'assets/templates/admin/admin.tmpl.html',
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
			templateUrl: 'assets/templates/admin/adminUserCard.tmpl.html',
			controller: 'AdminController',
			controllerAs: 'vm'
		}
	});

})();