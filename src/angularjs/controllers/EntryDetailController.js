(function () {
  'use strict';

  angular.module('leansite')
    .controller('EntryDetailController', ['$scope', '$rootScope','$routeParams', '_entryService', 'BROADCAST', EntryDetailController]);

  function EntryDetailController($scope, $rootScope, $routeParams, _entryService, BROADCAST) {
    var vm = this;
    var id = $routeParams.id;

    vm.loadQuestion = function () {
      _entryService.readEntry(id)
        .then(function (response) {
          vm.question = response.data;
          vm.question.votes = (vm.question.users_did_upvote.length + 1) - (vm.question.users_did_downvote.length + 1);
          vm.question.canEdit = response.data.owner.uuid == $rootScope.userId;
          for (var i = 0; i < vm.question.answers.length; i++) {
            vm.question.answers[i].canEdit = vm.question.answers[i].owner == $rootScope.userId;
          }
        })
        .catch(function (err) {
          if (BROADCAST.loggingLevel == "DEBUG") {
            $rootScope.$broadcast(BROADCAST.error, JSON.stringify(err));
          } else {
            $rootScope.$broadcast(BROADCAST.error, "There was an error loading the question. Please try again...");
          }
        });
    }

    $scope.$on(BROADCAST.entryChange, function () {
      vm.loadQuestion();
    });

    vm.loadQuestion();
  }
})();
