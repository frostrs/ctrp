/**
 * Created by wus4 on 2/10/16.
 */

(function () {
    'use strict';

    angular.module('ctrp.app.registry').controller('psDetailCtrl', psDetailCtrl);

    psDetailCtrl.$inject = ['psDetailObj', 'trialDetailObj', 'userDetailObj', 'TrialService', 'toastr', '$state',
        'srStatusObj', 'DateService', '$timeout'];

    function psDetailCtrl(psDetailObj, trialDetailObj, userDetailObj, TrialService, toastr, $state,
                          srStatusObj, DateService, $timeout) {

        var vm = this;
        vm.curPs = psDetailObj || {};
        vm.curPs = vm.curPs.data || vm.curPs;
        vm.curTrial = trialDetailObj || vm.curPs.trial;
        vm.curUser = userDetailObj;
        vm.availableOrgs = [];
        vm.srStatusArr = srStatusObj;
        vm.status_date_opened = false;
        vm.addedStatuses = [];
        vm.srsNum = 0;
        vm.selectedPiArray = [];

        vm.updatePs = function() {
            // Prevent multiple submissions
            vm.disableBtn = true;

            vm.curPs.trial_id = vm.curTrial.id;

            if (vm.selectedPiArray.length > 0) {
                vm.curPs.participating_site_investigators_attributes = [];
                var psInvestigatorObj = {person_id: vm.selectedPiArray[0].id, investigator_type: 'Principal Investigator'};
                if (!vm.curPs.new) {
                    psInvestigatorObj.id = vm.curPs.participating_site_investigators[vm.sitePiIdx].id;
                }
                vm.curPs.participating_site_investigators_attributes.push(psInvestigatorObj);
            }

            if (vm.addedStatuses.length > 0) {
                vm.curPs.site_rec_status_wrappers_attributes = [];
                _.each(vm.addedStatuses, function (status) {
                    vm.curPs.site_rec_status_wrappers_attributes.push(status);
                });
            }

            // An outer param wrapper is needed for nested attributes to work
            var outerPs= {};
            outerPs.new = vm.curPs.new;
            outerPs.id = vm.curPs.id;
            outerPs.participating_site = vm.curPs;

            TrialService.upsertParticipatingSite(outerPs).then(function(response) {
                if (response.server_response.status < 300) {
                    $state.go('main.trials', null, {reload: true});
                    toastr.success('Participating Site ' + vm.curPs.id + ' has been recorded', 'Operation Successful!');
                } else {
                    // Enable buttons in case of backend error
                    vm.disableBtn = false;
                }
            }).catch(function(err) {
                console.log("error in updating trial " + JSON.stringify(outerPs));
            });
        };

        vm.reload = function() {
            $state.go($state.$current, null, { reload: true });
        };

        // Delete the associations
        vm.toggleSelection = function (index, type) {
            if (type == 'sr_status') {
                if (index < vm.addedStatuses.length) {
                    vm.addedStatuses[index]._destroy = !vm.addedStatuses[index]._destroy;
                    if (vm.addedStatuses[index]._destroy) {
                        vm.srsNum--;
                    } else {
                        vm.srsNum++;
                    }
                    vm.validateStatus();
                }
            }
        };

        vm.openCalendar = function ($event, type) {
            $event.preventDefault();
            $event.stopPropagation();

            if (type == 'status_date') {
                vm.status_date_opened = !vm.status_date_opened;
            }
        };

        // Add trial status to a temp array
        vm.addStatus = function () {
            if (vm.status_date && vm.sr_status_id) {
                var newStatus = {};
                newStatus.status_date = DateService.convertISODateToLocaleDateStr(vm.status_date);
                newStatus.site_recruitment_status_id = vm.sr_status_id;
                // For displaying status name in the table
                _.each(vm.srStatusArr, function (status) {
                    if (status.id == vm.sr_status_id) {
                        newStatus.sr_status_name = status.name;
                        newStatus.sr_status_code = status.code;
                    }
                });
                newStatus.comments = vm.status_comment;
                newStatus._destroy = false;
                TrialService.addStatus(vm.addedStatuses, newStatus);
                vm.srsNum++;
                vm.status_date = null;
                vm.sr_status_id = null;
                vm.status_comment = null;
                vm.showAddStatusError = false;
                vm.validateStatus();
            } else {
                vm.showAddStatusError = true;
            }
        };

        // Validate Trials Stautuses
        vm.validateStatus = function() {
            // Remove statuses with _destroy is true
            var noDestroyStatusArr = [];
            for (var i = 0; i < vm.addedStatuses.length; i++) {
                if (!vm.addedStatuses[i]._destroy) {
                    noDestroyStatusArr.push(vm.addedStatuses[i]);
                }
            }

            TrialService.validateSrStatus({"statuses": noDestroyStatusArr}).then(function(response) {
                vm.statusValidationMsgs = response.validation_msgs;

                // Add empty object to positions where _destroy is true
                for (var i = 0; i < vm.addedStatuses.length; i++) {
                    if (vm.addedStatuses[i]._destroy) {
                        vm.statusValidationMsgs.splice(i, 0, {});
                    }
                }
            }).catch(function(err) {
                console.log("Error in validating trial status: " + err);
            });
        };

        activate();

        /****************************** implementations **************************/

        function activate() {
            appendNewPsFlag();
            populateOrgs();
            setDefaultOrg();

            if (!vm.curPs.new) {
                setSitePi();
                appendStatuses();
            }
        }

        /**
         * Append a 'new' key to the vm.curPs to
         * indicate this is a new trial, not an trial
         * for editing/curating
         *
         */
        function appendNewPsFlag() {
            if ($state.$current.name.indexOf('add') > -1) {
                vm.curPs.new = true;  //
            }
        }
        
        // Populate available organization list
        function populateOrgs() {
            if (vm.curUser.role === 'ROLE_SITE-SU') {
                vm.availableOrgs = vm.curUser.family_orgs;
            } else {
                vm.availableOrgs.push(vm.curUser.organization);
            }
        }

        // Set the default organization
        function setDefaultOrg() {
            vm.curPs.organization_id = vm.availableOrgs[0].id;
        }

        // Set the Site PI from many participating_site_investigators
        function setSitePi() {
            for (var i = 0; i < vm.curPs.participating_site_investigators.length; i++) {
                if (vm.curPs.participating_site_investigators[i].investigator_type === 'Principal Investigator') {
                    vm.sitePiIdx = i;
                }
            }
            $timeout( function() {
                vm.selectedPiArray.push(vm.curPs.participating_site_investigators[vm.sitePiIdx].person);
            }, 1000);
        }

        // Append site recruitment statuses for existing participating site
        function appendStatuses() {
            for (var i = 0; i < vm.curPs.site_rec_status_wrappers.length; i++) {
                var statusWrapper = {};
                statusWrapper.id = vm.curPs.site_rec_status_wrappers[i].id;
                statusWrapper.status_date = DateService.convertISODateToLocaleDateStr(vm.curPs.site_rec_status_wrappers[i].status_date);
                statusWrapper.site_recruitment_status_id = vm.curPs.site_rec_status_wrappers[i].site_recruitment_status_id;
                // For displaying status name in the table
                _.each(vm.srStatusArr, function (status) {
                    if (status.id == vm.curPs.site_rec_status_wrappers[i].site_recruitment_status_id) {
                        statusWrapper.sr_status_name = status.name;
                        statusWrapper.sr_status_code = status.code;
                    }
                });
                statusWrapper.comments = vm.curPs.site_rec_status_wrappers[i].comments;
                statusWrapper._destroy = false;
                TrialService.addStatus(vm.addedStatuses, statusWrapper);
                vm.srsNum++;
            }
            vm.validateStatus();
        }
    }
})();

