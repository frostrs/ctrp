(function() {
    'use strict';
    angular.module('ctrp.app.pa.dashboard')
        .controller('pasTrialOutcomeMeasuresCtrl', pasTrialOutcomeMeasuresCtrl);

    pasTrialOutcomeMeasuresCtrl.$inject = ['$scope', '$filter', 'TrialService', 'PATrialService','OutcomeMeasureService','outcomeTypesObj', 'toastr',
        'MESSAGES', '_', '$timeout','uiGridConstants','trialDetailObj', '$location','$anchorScroll'];

    function pasTrialOutcomeMeasuresCtrl($scope, $filter, TrialService, PATrialService,OutcomeMeasureService,outcomeTypesObj, toastr,
                                         MESSAGES, _, $timeout, uiGridConstants,trialDetailObj, $location, $anchorScroll) {
        var vm = this;
        vm.curTrial = trialDetailObj;
        vm.currentOutcomeMeasure= {};

        vm.setAddMode = setAddMode;
        vm.setEditMode = setEditMode;
        vm.setCopyMode = setCopyMode;
        vm.deleteListHandler = deleteListHandler;
        vm.deleteSelected = deleteSelected;
        vm.resetOutcomeMeasure = resetOutcomeMeasure;

        //ui-grid plugin options
        vm.gridOptions = OutcomeMeasureService.getGridOptions();
        vm.gridOptions.enableVerticalScrollbar = uiGridConstants.scrollbars.NEVER;
        vm.gridOptions.enableHorizontalScrollbar = uiGridConstants.scrollbars.NEVER;

        vm.trialDetailObj = {};
        vm.om_types = outcomeTypesObj;
        vm.safety_issues=['Yes','No']

        $scope.list = ["one", "two", "thre", "four", "five", "six"];

        $scope.sortableListener = {
            stop : function(e, ui) {
                var item = ui.item.scope().item;
                var fromIndex = ui.item.sortable.index;
                var toIndex = ui.item.sortable.dropindex;
                console.log('moved', item, fromIndex, toIndex);
            }
        };

        $scope.$on("$destroy", function() {
            for (var i = 0; i < vm.curTrial.outcome_measures.length; i++) {
                    if(vm.curTrial.outcome_measures[i].index !=i) {
                        vm.curTrial.outcome_measures[i].index=i;
                        var currentOM= vm.curTrial.outcome_measures[i];
                         TrialService.upsertOutcomeMeasure(currentOM).then(function (response) {

                             PATrialService.setCurrentTrial(vm.curTrial); // update to cache
                            vm.selectedAllOM = false;
                        }).catch(function (err) {
                         console.log("error in re-ordering outcome measures " + JSON.stringify(outerPS));
                        });
                    }
            }

        });

        activate();
        function activate() {
            //submit();
            getTrialDetailCopy();
        }

        $scope.deleteRow = function(row) {
            OutcomeMeasureService.getGridOptions().data.splice(row.entity.id, 1);
        };

        vm.setToDefaultMode = function() {
            vm.addMode = vm.editMode = vm.copyMode = false;
            vm.copyOM = {};

            $location.hash('section_top');
            $anchorScroll();
        }

        vm.checkAllOM = function () {
            if (vm.selectedAllOM) {
                vm.selectedAllOM = true;
            } else {
                vm.selectedAllOM = false;
            }

            angular.forEach(vm.curTrial.outcome_measures, function (item) {
                item.selected = vm.selectedAllOM;
                vm.deleteListHandler(vm.curTrial.outcome_measures);
            });

        };

        vm.saveOutcomeMeasure = function(){
            vm.disableBtn = true;

            if (!vm.currentOutcomeMeasure.id || vm.copyMode) {
                vm.currentOutcomeMeasure.new = true;
                vm.currentOutcomeMeasure.id = null;
            }
            // An outer param wrapper is needed for nested attributes to work
            //var outerOM = {};
            //outerOM.new = vm.currentOutcomeMeasure.new;
            //outerOM.id = vm.currentOutcomeMeasure.id;
            //outerOM.outcome_measure = vm.currentOutcomeMeasure;
            vm.currentOutcomeMeasure.trial_id = trialDetailObj.id;

            console.log(vm.currentOutcomeMeasure);

            TrialService.upsertOutcomeMeasure(vm.currentOutcomeMeasure).then(function(response) {
                //console.log("/n server_response="+JSON.stringify(response));
                var newOutcomeMeasure = false;
                if(!vm.currentOutcomeMeasure.id){
                    // New OutcomeMeasure
                    newOutcomeMeasure = true;
                    vm.currentOutcomeMeasure.id = response.id;
                }
                if(vm.currentOutcomeMeasure.id) {
                    //setting up "outcome measure type" on the fly to display on grid
                    for (var i = 0; i < vm.om_types.length; i++) {
                        if(vm.om_types[i].id == vm.currentOutcomeMeasure.outcome_measure_type_id){
                            console.log(vm.om_types[i].name)
                            vm.currentOutcomeMeasure.outcome_measure_type=vm.om_types[i].name;
                        }
                    }

                    if(newOutcomeMeasure){
                        vm.currentOutcomeMeasure.new = false;
                        //vm.curTrial.outcome_measure_type=vm.curTrial.outcome_measure_type
                        vm.curTrial.outcome_measures.push(vm.currentOutcomeMeasure);
                    } else {
                        for (var i = 0; i < vm.curTrial.outcome_measures.length; i++) {
                            if (vm.curTrial.outcome_measures[i].id == vm.currentOutcomeMeasure.id) {
                                vm.curTrial.outcome_measures[i] = vm.currentOutcomeMeasure;
                            }
                        }
                    }
                    vm.setToDefaultMode();
                    PATrialService.setCurrentTrial(vm.curTrial); // update to cache
                }
                vm.selectedAllOM = false;
            }).catch(function(err) {
                console.log("error in creating or updating outcome measures trial " + JSON.stringify(outerPS));
            });
        };//saveOutcomeMeasure

        function deleteListHandler(outcomeMeasuresSelectedInCheckboxes){
            var deleteList = [];
            angular.forEach(outcomeMeasuresSelectedInCheckboxes, function(item) {
                if ( angular.isDefined(item.selected) && item.selected === true ) {
                    deleteList.push(item);
                }
            });
            vm.selectedDeleteOutcomeMeasuresList = deleteList ;
            // console.log("In vm.selectedDeleteParticipatingSitesList=" + JSON.stringify(vm.selectedDeleteParticipatingSitesList));

            console.log(deleteList)
        };

        function deleteSelected(){
            vm.setToDefaultMode();
            vm.curTrial.outcome_measures_attributes=[];
            for (var i = 0; i < vm.selectedDeleteOutcomeMeasuresList.length; i++) {
                vm.deleteOutcomeMeasure( vm.selectedDeleteOutcomeMeasuresList[i].id);
            }
            resetOutcomeMeasure();
        };

        vm.deleteOutcomeMeasure = function(psId){
            vm.disableBtn = true;

            TrialService.deleteOutcomeMeasure(psId).then(function(response) {

                vm.curTrial.lock_version = response.lock_version || '';
                $scope.$emit('updatedInChildScope', {});
                for (var j = 0; j < vm.curTrial.outcome_measures.length; j++) {
                    if (vm.curTrial.outcome_measures[j].id == psId){
                        vm.curTrial.outcome_measures.splice(j, 1);
                    }
                }
                PATrialService.setCurrentTrial(vm.curTrial); // update to cache
                toastr.clear();
                toastr.success('Outcome Measure ' + psId + ' for' + vm.curTrial.lead_protocol_id + ' has been deleted', 'Operation Successful!', {
                    extendedTimeOut: 1000,
                    timeOut: 0
                });
            }).catch(function(err) {
                console.log("error in deleting outcome measure =" + psId);
            });

        }//saveTrial



        /**
         *  Set Add Mode.
         **/
        function setAddMode() {
            vm.setToDefaultMode();
            vm.addMode = true;
            vm.currentOutcomeMeasure = {};
        }

        /**
         *  Set Edit Mode.
         **/
        function setEditMode(idx) {
            vm.editMode || vm.copyMode || vm.addMode ? resetOutcomeMeasure() : vm.addMode = vm.copyMode = false;
            vm.editMode = true;
            vm.currentOutcomeMeasure = vm.curTrial.outcome_measures[idx];
            saveCopyCurrentOutcomeMeasure(vm.curTrial.outcome_measures[idx]);
        }

        /**
         *  Save copy of currentOutcomeMeasure "TO" vm.copyOM.
         **/
        function saveCopyCurrentOutcomeMeasure(currentOutcomeMeasure) {
            vm.copyOM = {};
            angular.copy(currentOutcomeMeasure, vm.copyOM);
        }

        /**
         *  Set Copy Mode.
         **/
        function setCopyMode(idx) {
            vm.copyMode || vm.addMode || vm.editMode ? resetOutcomeMeasure() : vm.addMode = vm.editMode = false;
            vm.copyMode = true;
            vm.currentOutcomeMeasure = angular.copy(vm.curTrial.outcome_measures[idx]);
            saveCopyCurrentOutcomeMeasure(vm.curTrial.outcome_measures[idx]);
        }

        function resetOutcomeMeasure() {
            vm.addMode || vm.editMode || vm.copyMode ? angular.copy(vm.copyOM, vm.currentOutcomeMeasure) : vm.currentOutcomeMeasure = {};
        }

        function getTrialDetailCopy() {
            $timeout(function() {
                vm.curTrial = PATrialService.getCurrentTrialFromCache();
                //console.log("vm.curTrial =" + JSON.stringify(vm.curTrial ));
            }, 1);
        } //getTrialDetailCopy

    }

})();
