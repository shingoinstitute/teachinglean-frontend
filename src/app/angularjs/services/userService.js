(function () {
	'use strict';

	angular.module('leansite')
		.factory('_userService', _userService);

	_userService.$inject = ['$http', '$cookies', '$window', '$location', '$q', 'JWT_TOKEN']

	function _userService($http, $cookies, $window, $location, $q, JWT_TOKEN) {
		var service = {};

		/**
		 * @desc {function} getUser :: API call to find user, requires a JWT
		 */
		service.getUser = function () {
			return $http.get('/me');
		};

		/**
		 * @description createUser :: Call to REST API to create new user
		 */
		service.createUser = function (user) {
			return $http.post('/user', user);
		};

		/**
		 * @description deleteUser :: deletes a user from the database
		 * @param {Object} user - user object with a valid uuid
		 */
		service.deleteUser = function (user) {
			return $http.delete('/user/' + user.uuid);
		};

		/**
		 * @description Call to REST API to update user
		 * @param {Object} user - the new fields to update
		 */
		service.updateUser = function (user) {
			return $http.put('/user/' + user.uuid, user);
		};

		service.findAll = function () {
			return $http.get('/user');
		};

		/**
		 * @description Call to REST API to send user an email with a password reset link
		 * @param email - the email the reset link will be sent to. If null, sends reset link to logged in user, if any.
		 */
		service.requestPasswordResetEmail = function(email) {
			return $http.post('/reset', {email: email});
		};

		service.requestPasswordUpdate = function(options) {
			return $http.put('/reset/' + options.userId, {
				password: options.password,
				token: options.token
			});
		};

		service.uploadPhoto = function(file){
			return $http({
				method: 'post',
				headers: {
					'Content-Type': undefined
				},
				url: '/user/photoUpload',
				data: {'profile': file},
				transformRequest: function(data, headersGetter){
					var formData = new FormData();
					angular.forEach(data, function(value, key){
						formData.append(key,value);
					});
					return formData;
				}
			});
		};

		return service;
	}

})();
