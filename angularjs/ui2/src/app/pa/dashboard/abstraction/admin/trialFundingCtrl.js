
/**
 * Created by schintal, January 07, 2016
 */

(function() {
    'use strict';
    angular.module('ctrp.app.pa.dashboard')
    .controller('trialFundingCtrl', trialFundingCtrl);

    trialFundingCtrl.$inject = ['TrialService', '$scope', 'toastr', 'trialDetailObj', 'nciObj', 'holderTypeObj']//, 'studySourceObj', 'nciDivObj', 'nciProgObj'];

    function trialFundingCtrl(TrialService, $scope, toastr, trialDetailObj, nciObj, holderTypeObj){// studySourceObj, nciDivObj, nciProgObj) {
        var vm = this;
        vm.curTrial = trialDetailObj;
        vm.nciArr = nciObj;
        vm.grantorArr = [];
        vm.holderTypeArr = holderTypeObj;
        vm.nihNciArr = [];
        vm.addedIndIdes = [];
        console.log('Trial ' + vm.holderTypeObj + ' has been recorded', 'Operation Successful!');

        vm.updateTrial = function(updateType) {
            // Prevent multiple submissions
            vm.disableBtn = true;

            if (vm.addedIndIdes.length > 0) {
                vm.curTrial.ind_ides_attributes = [];
                _.each(vm.addedIndIdes, function (indIde) {
                    vm.curTrial.ind_ides_attributes.push(indIde);
                });
            }
            // An outer param wrapper is needed for nested attributes to work
            var outerTrial = {};
            outerTrial.new = vm.curTrial.new;
            outerTrial.id = vm.curTrial.id;
            outerTrial.trial = vm.curTrial;


            TrialService.upsertTrial(outerTrial).then(function(response) {
                toastr.success('Trial ' + vm.curTrial.lead_protocol_id + ' has been recorded', 'Operation Successful!');
            }).catch(function(err) {
                console.log("error in updating trial " + JSON.stringify(outerTrial));
            });

        }

        // Add IND/IDE to a temp array
        vm.addIndIde = function () {
            if (vm.ind_ide_type && vm.ind_ide_number && vm.grantor && vm.holder_type_id) {
                var newIndIde = {};
                newIndIde.ind_ide_type = vm.ind_ide_type;
                newIndIde.ind_ide_number = vm.ind_ide_number;
                newIndIde.grantor = vm.grantor;
                newIndIde.holder_type_id = vm.holder_type_id;
                // For displaying name in the table
                _.each(vm.holderTypeArr, function (holderType) {
                    if (holderType.id == vm.holder_type_id) {
                        newIndIde.holder_type_name = holderType.name;
                    }
                });
                newIndIde.nih_nci = vm.nih_nci;
                newIndIde._destroy = false;
                vm.addedIndIdes.push(newIndIde);
                vm.indIdeNum++;
                vm.ind_ide_type = null;
                vm.ind_ide_number = null;
                vm.grantor = null;
                vm.holder_type_id = null;
                vm.nih_nci = null;
                vm.grantorArr = [];
                vm.nihNciArr = [];
                vm.showAddIndIdeError = false;
            } else {
                vm.showAddIndIdeError = true;
            }
        };

        // Delete the associations
        vm.toggleSelection = function (index, type) {
            if (type == 'ind_ide') {
                if (index < vm.addedIndIdes.length) {
                    vm.addedIndIdes[index]._destroy = !vm.addedIndIdes[index]._destroy;
                    if (vm.addedIndIdes[index]._destroy) {
                        vm.indIdeNum--;
                    } else {
                        vm.indIdeNum++;
                    }
                }
            }
        };// toggleSelection


        vm.watchOption = function(type) {
            if (type == 'ind_ide_type') {
                vm.grantor = '';
                if (vm.ind_ide_type == 'IND') {
                    vm.grantorArr = ['CDER', 'CBER'];
                } else if (vm.ind_ide_type == 'IDE') {
                    vm.grantorArr = ['CDRH', 'CBER'];
                } else {
                    vm.grantorArr = [];
                }
            } else if (type == 'holder_type') {
                vm.nih_nci = '';
                var nciOption = vm.holderTypeArr.filter(findNciOption);
                var nihOption = vm.holderTypeArr.filter(findNihOption);
                if (nciOption[0].id == vm.holder_type_id) {
                    TrialService.getNci().then(function (response) {
                        vm.nihNciArr = response;
                    }).catch(function (err) {
                        console.log("Error in retrieving NCI Division/Program code.");
                    });
                } else if (nihOption[0].id == vm.holder_type_id) {
                    TrialService.getNih().then(function (response) {
                        vm.nihNciArr = response;
                    }).catch(function (err) {
                        console.log("Error in retrieving NIH Institution code.");
                    });
                } else {
                    vm.nihNciArr = [];
                }
            }
        };

        activate();

        /****************** implementations below ***************/
        function activate() {
                appendIndIdes();
        }

        function findNciOption(option) {
            if (option.code == 'NCI') {
                return true;
            } else {
                return false;
            }
        }

        function findNihOption(option) {
            if (option.code == 'NIH') {
                return true;
            } else {
                return false;
            }
        }

        function appendIndIdes() {
            for (var i = 0; i < vm.curTrial.ind_ides.length; i++) {
                var indIde = {};
                indIde.id = vm.curTrial.ind_ides[i].id;
                indIde.ind_ide_type = vm.curTrial.ind_ides[i].ind_ide_type;
                indIde.ind_ide_number = vm.curTrial.ind_ides[i].ind_ide_number;
                indIde.grantor = vm.curTrial.ind_ides[i].grantor;
                indIde.holder_type_id = vm.curTrial.ind_ides[i].holder_type_id;
                // For displaying name in the table
                _.each(vm.holderTypeArr, function (holderType) {
                    if (holderType.id == vm.curTrial.ind_ides[i].holder_type_id) {
                        indIde.holder_type_name = holderType.name;
                    }
                });
                indIde.nih_nci = vm.curTrial.ind_ides[i].nih_nci;
                indIde.expanded_access = vm.curTrial.ind_ides[i].expanded_access;
                indIde.expanded_access_type_id = vm.curTrial.ind_ides[i].expanded_access_type_id;
                // For displaying name in the table
                _.each(vm.expandedAccessTypeArr, function (expandedAccessType) {
                    if (expandedAccessType.id == vm.curTrial.ind_ides[i].expanded_access_type_id) {
                        indIde.expanded_access_type_name = expandedAccessType.name;
                    }
                });
                indIde.exempt = vm.curTrial.ind_ides[i].exempt;
                indIde._destroy = false;
                vm.addedIndIdes.push(indIde);
                vm.indIdeNum++;
            }
        }

    } //trialRegIndCtrl

})();
