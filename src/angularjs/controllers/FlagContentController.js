(function(){
    'use strict';

    angular.module('leansite')
    .controller('FlagContentController', ['$scope', '$rootScope', '_flagService', 'BROADCAST', 'content', 'type', '$mdDialog', FlagContentController]);

    function FlagContentController($scope, $rootScope, flags, BROADCAST, contentId, type, $mdDialog){
        var vm = this;
        
        vm.cancel = function(){
            $mdDialog.cancel();
        }

        vm.submit = function(){
            flags.flag($rootScope.userId, contentId, {reason: vm.reason, description: vm.description, type: type})
            .then(function(response){
                $rootScope.$broadcast(BROADCAST.info, "Thank you for letting us know. One of our moderators will review the content and remove it if necessary.");
                $mdDialog.hide();
            })
            .catch(function(err){
                var message = "There was an error flagging the content. Please contact us and let us know.";
                if(BROADCAST.loggingLevel == 'DEBUG'){
                    message = JSON.stringify(err);
                    console.log("FlagControllerError: ", err);
                }
                $rootScope.$broadcast(BROADCAST.error, message);
                $mdDialog.cancel();
            });
        }

        $scope.$watch("vm.reason", function(newValue){
            if(newValue != "Other") vm.description = newValue;
            else vm.description = "";
        });

    }
})();