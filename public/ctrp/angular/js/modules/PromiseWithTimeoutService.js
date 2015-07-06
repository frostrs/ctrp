/**
 * Created by wangg5 on 7/2/15
 *
 * Improved PromiseService with $timeout and $resource
 * reference: https://developer.rackspace.com/blog/cancelling-ajax-requests-in-angularjs-applications/
 */



(function () {
    'use strict';

    angular.module('PromiseTimeoutModule', ['ngResource', 'TimeoutHttpInterceptor', 'toastr'])
        .config(['$httpProvider', function($httpProvider) {
            $httpProvider.interceptors.push('timeoutHttpInterceptorService');
        }])

        .factory('PromiseTimeoutService', PromiseTimeoutService);

    PromiseTimeoutService.$inject = ['$q', '$resource', '$timeout', '$log'];

    function PromiseTimeoutService($q, $resource, $timeout, $log) {


        var services = {
            getData: getData,
            getDataV2: getDataV2,
            postDataExpectObj: postDataExpectObj,
            updateObj: updateObj,
            deleteObjFromBackend : deleteObjFromBackend
        };

        return services;


        /************** implementations below ************************/

        function getData(url) {
            console.log("getData called in PromiseWithTimeoutService.js");
           return function() {
               var deferred = $q.defer();

               $http.get(url).success(function (data) {
                   deferred.resolve(data);
               }).error(function (error) {
                   raiseErrorMessage(error);
                   deferred.reject(error);
               });

               return deferred.promise;
           };
            // $http.get( url , { headers: { 'Cache-Control' : 'no-cache' } } );
            //return $http.get(url, {cache: false});
        }



        /**
         *
         * @param url
         * @param params: JSON object
         */
        function postDataExpectObj(url, params) {
            return function() {
                var deferred = $q.defer();
                $http.post(url, params).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    raiseErrorMessage(error);
                    deferred.reject(error);
                });
                return deferred.promise;
            };
           // return $http.post(url, params);
        }


        /**
         * Perform PUT request to update object
         *
         * @param url
         * @param params
         * @param configObj
         * @returns {*}
         */
        function updateObj(url, params, configObj) {

            return function() {
                var deferred = $q.defer();
                $http.put(url, params, configObj).success(function(data) {
                    deferred.resolve(data);
                }).error(function(error) {
                    raiseErrorMessage(error);
                    deferred.reject(error);
                });
                return deferred.promise;
            };

            //return $http.put(url, params, configObj);
        }


        /**
         *
         * @param url (e.g. http://localhost/ctrp/organizations/15.json)
         * @returns {HttpPromise}
         */
        function deleteObjFromBackend(url) {
            return $http.delete(url);
        }


        /**
         * Raise error message for AJAX calls
         * @param error
         * @param deferred
         */
        function raiseErrorMessage(error) {
            var errorMsg = "Failed to retrieve data from service";
            if (error.status === 408) {
                errorMsg = "Retrieving data from service timed out";
            }
            toastr.error(errorMsg, 'Error');
            console.log("request has timed out");
        } //raiseErrorMessage


    } //PromiseTimeoutService

})();
