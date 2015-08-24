/**
 * Created by wus4 on 8/14/2015.
 */

(function () {
    'use strict';
    angular.module('ctrpApp')
        .controller('trialDetailCtrl', trialDetailCtrl);
    trialDetailCtrl.$inject = ['trialDetailObj', 'TrialService', 'DateService','$timeout','toastr', 'MESSAGES',
        '$scope', 'Common', '$state', '$modal', 'phaseObj', 'researchCategoryObj', 'primaryPurposeObj',
        'secondaryPurposeObj', 'responsiblePartyObj', 'trialStatusObj'];
    function trialDetailCtrl(trialDetailObj, TrialService, DateService, $timeout, toastr, MESSAGES,
                             $scope, Common, $state, $modal, phaseObj, researchCategoryObj, primaryPurposeObj,
                             secondaryPurposeObj, responsiblePartyObj, trialStatusObj) {
        var vm = this;
        vm.curTrial = trialDetailObj || {lead_protocol_id: ""}; //trialDetailObj.data;
        vm.curTrial = vm.curTrial.data || vm.curTrial;
        vm.phaseArr = phaseObj;
        vm.researchCategoryArr = researchCategoryObj;
        vm.primaryPurposeArr = primaryPurposeObj;
        vm.secondaryPurposeArr = secondaryPurposeObj;
        vm.responsiblePartyArr = responsiblePartyObj;
        vm.trialStatusArr = trialStatusObj;

        //update trial (vm.curTrial)
        vm.updateTrial = function() {
            TrialService.upsertTrial(vm.curTrial).then(function(response) {
                toastr.success('Trial ' + vm.curTrial.name + ' has been recorded', 'Operation Successful!');
            }).catch(function(err) {
                console.log("error in updating trial " + JSON.stringify(vm.curTrial));
            });
        }; // updatePerson

        activate();

        /****************** implementations below ***************/
        function activate() {
            appendNewTrialFlag();
            prepareModal();
        }

        /**
         * Append a 'new' key to the vm.curTrial to
         * indicate this is a new trial, not an trial
         * for editing/curating
         *
         */
        function appendNewTrialFlag() {
            if ($state.$current.name.indexOf('add') > -1) {
                vm.curTrial.new = true;  //
            }
        }

        function prepareModal() {
            vm.searchOrg = function(size, type) {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: '/ctrp/angular/partials/modals/advanced_org_search_form_modal.html',
                    controller: 'advancedOrgSearchModalCtrl as orgSearchModalView',
                    size: size
                });

                modalInstance.result.then(function (selectedOrg) {
                    if (type == 'lead') {
                        vm.selectedLeadOrg = selectedOrg[0];
                        vm.curTrial.lead_org_id = selectedOrg[0].id;
                    }
                }, function () {
                    console.log("operation canceled");
                });
            }

            vm.searchPerson = function(size, type) {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: '/ctrp/angular/partials/modals/advanced_person_search_form_modal.html',
                    controller: 'personSearchCtrl as personSearchModalView',
                    size: size
                });

                modalInstance.result.then(function (selectedPerson) {
                    if (type == 'pi') {
                        vm.selectedPi = selectedPerson[0];
                        vm.curTrial.pi_id = selectedPerson[0].id;
                    }
                }, function () {
                    console.log("operation canceled");
                });
            }
        } //prepareModal
    }
})();