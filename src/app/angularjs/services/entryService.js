
(function () {
  'use strict';

  angular.module('leansite')
    .factory('_entryService', _entryService);

  _entryService.$inject = ['$http', '$q']

  function _entryService($http, $q) {
    return {
      getUserQuestions: (uuid) => {
        return $http({
          method: 'get',
          dataType: 'json',
          url: '/entry?where={"owner": "' + uuid + '","parent":null}&populate=owner'
        });
      },

      getUserAnswers: (uuid) => {
        return $http({
          method: 'get',
          dataType: 'json',
          url: '/entry?where={"owner":"' + uuid + '","parent": {"!":null}}&populate=owner'
        });
      },

      getUserComments: (uuid) => {
        return $http({
          method: 'get',
          dataType: 'json',
          url: '/comment?where={"owner":"' + uuid + '"}&populate=owner,parent'
        });
      },

      getQuestions: () => {
        return $http.get('/entry?where={"parent":null}&populate=owner,parent');
      },

      getAnswers: () => {
        return $http.get('/entry?where={"parent": {"!":null}}&populate=owner,parent');
      },

      getComments: () => {
        return $http.get('/comment?populate=owner,parent');
      },

      getRecent: (limit, userId) => {
        var now = moment();
        var recent = now.subtract(10, 'days');
        var params = {
          createdAt: {
            ">": recent.toJSON()
          },
          parent: null,
          owner: userId,
        }
        var url = '/entry?where=' + JSON.stringify(params) + (limit ? '&limit=' + limit : '');
        return $http({
          method: 'get',
          dataType: 'json',
          url: url
        });
      },

      readEntry: (id) => {
        return $http({
          method: 'get',
          dataType: 'json',
          url: '/entry/' + id + '?populate=answers,owner,comments,parent,users_did_upvote,users_did_downvote'
        });
      },

      readComment: (id) => {
        return $http({
          method: 'get',
          dataType: 'json',
          url: '/comment/' + id + '?populate=owner,parent'
        });
      },

      createEntry: (entry) => {
        return $http({
          method: 'post',
          dataType: 'json',
          url: '/entry',
          data: entry
        });
      },

      destroyEntry: (entry) => {
        return $http({
          method: 'delete',
          dataType: 'json',
          url: '/entry',
          data: entry
        });
      },

      destroyComment: (comm) => {
        return $http({
          method: 'delete',
          dataType: 'json',
          url: '/comment',
          data: comm
        });
      },

      createComment: (comment) => {
        return $http({
          method: 'post',
          dataType: 'json',
          url: '/comment',
          data: comment
        });
      },

      save: (entry) => {
        return $http({
          method: 'put',
          dataType: 'json',
          url: '/entry/' + entry.id,
          data: entry
        });
      },

      saveComment: (comment) => {
        return $http({
          method: 'put',
          dataType: 'json',
          url: '/comment/' + comment.id,
          data: comment
        });
      },

      upvoteEntry: (entry) => {
        return $http.put('/entry/upvote/' + entry.id);
      },

      downvoteEntry: (entry) => {
        return $http.put('/entry/downvote/' + entry.id);
      },

      query: (queryString) => {
        var query = {
          'or': [{
            'title': {
              'like': "%25" + queryString + "%25"
            },
          },
          {
            'content': {
              'like': "%25" + queryString + "%25"
            }
          }
          ]
        };
        var url = '/entry?where=' + JSON.stringify(query) + '&populate=owner';
        return $http({
          method: 'get',
          dataType: 'json',
          url: url
        })
      }
    };




  };

})();
