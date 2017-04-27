(function () {
  'use strict';

  angular.module('leansite')
    .controller('EntryHomeController', ['$scope', '$rootScope', '$mdDialog', '$location', '$anchorScroll', '$q', '_entryService', 'BROADCAST', EntryHomeController]);

  function EntryHomeController($scope, $rootScope, $mdDialog, $location, $anchorScroll, $q, _entryService, BROADCAST) {
    $anchorScroll();  // Scroll to anchor if present
    var vm = this;
    vm.postQuestion = function (_owner) {
      $mdDialog.show({
          controller: 'AddEntryController',
          templateUrl: 'templates/entries/add.html',
          parent: angular.element(document.body),
          clickOutsideToClose: true,
          fullscreen: true,
          locals: {
            owner: _owner,
            parentId: null
          }
        })
        .then(function () {
          // DIALOG ANSWERED BY USER
        })
        .catch(function () {
          // DIALOG CANCELLED BY USER
        });
    }

    vm.go = function (path) {
      $location.path(path);
    }

    /**
     * The following code is for loading
     * recent, global activity.
     */
    vm.recent = [];

    vm.loadRecent = function () {
      _entryService.getRecent(10)
        .then(function (response) {
          vm.recent = response.data;
        })
        .catch(function (err) {
          if (BROADCAST.loggingLevel == "DEBUG") {
            $rootScope.$broadcast(BROADCAST.error, JSON.stringify(err));
          } else {
            $rootScope.$broadcast(BROADCAST.error, "There was an error loading recent questions. Please try again...");
          }
        });
    }

    /**
     * The following code is for
     * loading user queries.
     * (uses debounce)
     */
    vm.results = [];

    vm.isSearching = false;

    vm.search = "";

    $scope.$watch('vm.search', function (newV, oldV) {
      if (newV == '') {
        vm.results = [];
        vm.isSearching = false;
      } else {
        vm.isSearching = true;
        vm.query(newV);
      }
    });

    var pendingSearch, cancelSearch = angular.noop;
    var cachedQuery, lastSearch;

    function refreshDebounce() {
      lastSearch = 0;
      pendingSearch = null;
      cancelSearch = angular.noop;
    }

    function debounceSearch() {
      var now = new Date().getMilliseconds();
      lastSearch = lastSearch || now;

      return ((now - lastSearch) < 50000);
    }

    function preformQuery() {
      _entryService.query(cachedQuery)
        .then(function (response) {
          vm.results = response.data;
          refreshDebounce();
        })
        .catch(function (err) {
          console.log(err);
        });
    }

    vm.query = function (query) {
      cachedQuery = query;
      if (!pendingSearch || !debounceSearch()) {
        cancelSearch();

        pendingSearch = $q(function (resolve, reject) {
          cancelSearch = reject;
          resolve(preformQuery());
        });
      }
    }

    vm.loadRecent();
  }
})();
