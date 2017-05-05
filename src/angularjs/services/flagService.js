(function () {
  'use strict';

  angular.module('leansite')
    .factory('_flagService', _flagService);

  _flagService.$inject = ['$http']

  var backendUri = 'http://localhost:8080/backend/';

  function _flagService($http) {
    return {
      flag: (user, contentId, options) => {
        var f = {
            owner: user,
            content: contentId,
            reason: options.reason,
            description: options.description,
            type: options.type
        };
        return $http({
            method: 'post',
            dataType: 'json',
            url: backendUri + '/flag',
            data: f
        });
      }
    };

    /**
     * Create a flag on some content
     * 
     * @param owner    :: the user's uuid
     * @param contentId :: the flagged content's id
     * @param options :: {reason: picklist, description: textfield, type: textfield}
     */
    
  };

})();
