/**
 * Created by wangg5 on 6/23/15.
 */

(function() {

    'use strict';

    angular.module('ctrp.module.common', [])
        .service('Common', Common);

    Common.$inject = ['$rootScope', '_'];

    function Common($rootScope, _) {

        /**
         * A-Z Comparator for sorting an array of JSON objects
         * by the 'name' field in each JSON object
         *
         */
        this.a2zComparator = function() {
            var compare = function(a, b) {
                if (a.name > b.name) {
                    return 1;
                }
                if (a.name < b.name) {
                    return -1;
                }

                return 0;
            };

            return compare;
        }; //a2zComparator


        /**
         * Broastcast message to other components
         * @param message
         */
        this.broadcastMsg = function(message) {
            $rootScope.$broadcast(message, {});
        }; //broadcastMsg


        /**
         * Find the index of the given keyName and needleValue in the array of JSON
         * -1: not found
         * @param arrayOfJson
         * @param keyName
         * @param needleValue
         * @returns {number}
         */
        this.indexOfObjectInJsonArray = function(arrayOfJson, keyName, needleValue) {
            var queryObj = {};
            queryObj[keyName] = needleValue;
            return _.findIndex(arrayOfJson, queryObj);
        };


    }

})();