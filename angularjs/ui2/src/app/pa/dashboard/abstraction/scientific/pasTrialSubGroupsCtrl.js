(function() {
    'use strict';
    angular.module('ctrp.app.pa.dashboard')
        .controller('pasTrialSubGroupsCtrl', pasTrialSubGroupsCtrl);

    pasTrialSubGroupsCtrl.$inject = ['$scope', 'TrialService', 'PATrialService','OutcomeMeasureService', 'toastr',
        'MESSAGES', '_', '$timeout','uiGridConstants','trialDetailObj'];

    function pasTrialSubGroupsCtrl($scope, TrialService, PATrialService,OutcomeMeasureService, toastr,
                                         MESSAGES, _, $timeout, uiGridConstants,trialDetailObj) {
        var vm = this;
        vm.curTrial = trialDetailObj;
        vm.currentSubGroup= {};
        vm.setAddMode = setAddMode;
        vm.setEditMode = setEditMode;
        vm.deleteListHandler = deleteListHandler;
        vm.deleteSelected = deleteSelected;
        vm.resetSubGroup = resetSubGroup;

        vm.trialDetailObj = {};

        activate();
        function activate() {
            //submit();
            getTrialDetailCopy();
        }

        $scope.deleteRow = function(row) {
            OutcomeMeasureService.getGridOptions().data.splice(row.entity.id, 1);
        };


        vm.saveSubGroup = function(){
            // Prevent multiple submissions
            vm.disableBtn = true;
            if (!vm.currentSubGroup.id) {
                vm.currentSubGroup.new = true;
            }
            vm.currentSubGroup.trial_id = trialDetailObj.id;
            vm.curTrial.sub_groups_attributes=[];
            vm.curTrial.sub_groups_attributes.push(vm.currentSubGroup);

            // An outer param wrapper is needed for nested attributes to work
            var outerTrial = {};
            outerTrial.new = vm.curTrial.new;
            outerTrial.id = vm.curTrial.id;
            outerTrial.trial = vm.curTrial;
            // get the most updated lock_version
            outerTrial.trial.lock_version = PATrialService.getCurrentTrialFromCache().lock_version;

            TrialService.upsertTrial(outerTrial).then(function(response) {

                vm.curTrial.lock_version = response.lock_version || '';
                vm.curTrial.sub_groups = response["sub_groups"];
                PATrialService.setCurrentTrial(vm.curTrial);
                $scope.$emit('updatedInChildScope', {});

                toastr.clear();
                toastr.success('Trial ' + vm.curTrial.lead_protocol_id + ' has been recorded', 'Operation Successful!', {
                    extendedTimeOut: 1000,
                    timeOut: 0
                })
                vm.addEditMode=false;

            }).catch(function(err) {
                console.log("error in creating or updating sub group " + JSON.stringify(outerTrial));
            });
        };//saveSubGroup

        function deleteListHandler(subGroupsSelectedInCheckboxes){
            var deleteList = [];
            angular.forEach(subGroupsSelectedInCheckboxes, function(item) {
                if ( angular.isDefined(item.selected) && item.selected === true ) {
                    deleteList.push(item);
                }
            });
            vm.selectedDeleteSubGroupsList = deleteList ;

        };

        function deleteSelected(){
            vm.disableBtn = true;

            vm.curTrial.sub_groups_attributes=[];

            for (var i = 0; i < vm.selectedDeleteSubGroupsList.length; i++) {
                var obj={};
                obj.id = vm.selectedDeleteSubGroupsList[i].id;
                obj._destroy=true;
                vm.curTrial.sub_groups_attributes.push(obj);
            }

            // An outer param wrapper is needed for nested attributes to work
            var outerTrial = {};
            outerTrial.new = vm.curTrial.new;
            outerTrial.id = vm.curTrial.id;
            outerTrial.trial = vm.curTrial;
            // get the most updated lock_version
            outerTrial.trial.lock_version = PATrialService.getCurrentTrialFromCache().lock_version;

            TrialService.upsertTrial(outerTrial).then(function(response) {

                vm.curTrial.lock_version = response.lock_version || '';
                vm.curTrial.sub_groups = response["sub_groups"];
                PATrialService.setCurrentTrial(vm.curTrial);
                $scope.$emit('updatedInChildScope', {});

                toastr.clear();
                toastr.success('Trial ' + vm.curTrial.lead_protocol_id + ' has been recorded', 'Operation Successful!', {
                    extendedTimeOut: 1000,
                    timeOut: 0
                })

            }).catch(function(err) {
                console.log("error in creating or updating Trial sub group " + JSON.stringify(outerTrial));
            });
        };


        /**
         *  Set Add Mode.
         **/
        function setAddMode() {
            vm.addEditMode = true;
            vm.currentSubGroup= {};
        }

        /**
         *  Set Edit Mode.
         **/
        function setEditMode(idx) {
            vm.addEditMode = true;
            vm.currentSubGroup = vm.curTrial.sub_groups[idx];
        }


        function resetSubGroup() {
            if(vm.currentSubGroup.id > 0){
                var cachedTrial = PATrialService.getCurrentTrialFromCache();
              for (var i = 0; i < cachedTrial.sub_groups.length; i++) {
                    if(cachedTrial.sub_groups[i].id == vm.currentSubGroup.id){
                        vm.currentSubGroup = cachedTrial.sub_groups[i];
                    }
                }


            } else {
                vm.setAddMode();
            }

            $timeout(function() {
                getTrialDetailCopy();
            }, 0);

        }

        function getTrialDetailCopy() {
            $timeout(function() {
                vm.curTrial = PATrialService.getCurrentTrialFromCache();
                //console.log("vm.curTrial =" + JSON.stringify(vm.curTrial ));
            }, 1);
        } //getTrialDetailCopy

    }

})();