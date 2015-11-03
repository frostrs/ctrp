/**
 * Created by schintal 10/15/2015
 */

(function () {
    'use strict';

    angular.module('ctrpApp')
        .controller('gsaModalCtrl', gsaModalCtrl);

    gsaModalCtrl.$inject = ['$scope', '$http', '$window', 'toastr', '$state','$sce',
         '$timeout', 'LocalCacheService', 'UserService', 'gsaObj', '$modalInstance'];

    function gsaModalCtrl($scope, $http, $window, toastr, $state, $sce,
                      $timeout, LocalCacheService, UserService, gsaObj, $modalInstance) {
        var vm = this;
        vm.userType = UserService.getUserType();
        vm.accept = function() {
            console.log('ACCEPT');
            LocalCacheService.cacheItem("gsaFlag", "Accept");
            $modalInstance.close();
            $state.go('main.defaultContent');

        };

        vm.reject = function() {
            console.log('REJECT');
            LocalCacheService.cacheItem("gsaFlag", "Reject");
            $modalInstance.dismiss('cancel');
            UserService.logout();
        };

        vm.renderGSAHtml = function() {
            var gsaText = gsaObj.gsa;
            gsaText = gsaText.replace(/(?:\r\n|\r|\n)/g, '<br />');
            return $sce.trustAsHtml(gsaText);
        };
        
    }

})();