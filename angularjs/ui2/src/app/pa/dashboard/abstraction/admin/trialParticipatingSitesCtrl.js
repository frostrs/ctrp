
/**
 * Created by schintal, Jan 31, 2016
 */

(function() {
    'use strict';
    angular.module('ctrp.app.pa.dashboard')
    .controller('trialParticipatingSitesCtrl', trialParticipatingSitesCtrl);

    trialParticipatingSitesCtrl.$inject = ['TrialService', 'PATrialService', 'PersonService','DateService', '$scope', '$timeout','$state', '$stateParams', 'toastr', 'MESSAGES', 'trialDetailObj', 'siteRecruitmentStatusesObj', 'centralContactTypes'];

    function trialParticipatingSitesCtrl(TrialService, PATrialService, PersonService, DateService , $scope, $timeout, $stateParams, $route, toastr, MESSAGES, trialDetailObj, siteRecruitmentStatusesObj, centralContactTypes) {

        var vm = this;

        // injected objects
        vm.curTrial = trialDetailObj;
        vm.siteRecruitmentStatusesArr = siteRecruitmentStatusesObj;

        // initializations
        vm.deleteListHandler = deleteListHandler;
        vm.deleteSelected = deleteSelected;
        vm.currentParticipatingSite= {};
        vm.current_site_recruitment = {};
        vm.current_investigator = {};
        vm.siteRecruitmentGrid = [];
        vm.investigatorGrid = [];
        vm.currentParticipatingSite.site_rec_status_wrappers_attributes=[];
        vm.currentParticipatingSite.participating_site_investigators=[];
        vm.persisted_contact = {};
        vm.showOrgFields = true;
        vm.city=null;
        vm.state_province=null;
        vm.country=null;
        vm.postal=null;
        vm.dateFormat = DateService.getFormats()[1];
        vm.dateOptions = DateService.getDateOptions();
        vm.selOrganization = {name: '', array: []};
        vm.principalInvestigator = {name: '', array: []};
        vm.selectedPerson = {name: '', array: []};
        vm.selectedInvestigator = null;
        vm.investigatorArray = [];
        vm.selectedContactTypePI = false;
        vm.centralContactTypes = centralContactTypes.types;
        for (var i = 0; i < vm.centralContactTypes.length; i++) {
           if(vm.centralContactTypes[i].code  == "NONE") {
               console.log('vm.centralContactTypes[i].code=' +vm.centralContactTypes[i].code);
               vm.centralContactTypes.splice(i, 1);
           }
        }
        console.log('vm.centralContactTypes=' + JSON.stringify(vm.centralContactTypes));

        //actions
        vm.addSiteRecruitment = addSiteRecruitment;
        vm.editSiteRecruitment = editSiteRecruitment;
        vm.deleteSiteRecruitment = deleteSiteRecruitment;
        vm.cancelSiteRecruitmentEdit = cancelSiteRecruitmentEdit;
        vm.editInvestigator  = editInvestigator;
        vm.deleteInvestigator  = deleteInvestigator;
        vm.commitEditInvestigator = commitEditInvestigator;
        vm.setAddMode = setAddMode;
        vm.setEditMode = setEditMode;
        vm.openCalendar = openCalendar;
        vm.commitEditSiteRecruitment = commitEditSiteRecruitment;
        vm.setAsSiteContact = setAsSiteContact;
        vm.resetParticipatingSiteTab = resetParticipatingSiteTab;
        //vm.saveContact;


        activate();

        /****************** implementations below ***************/
        function activate() {
            getTrialDetailCopy();
            watchTrialDetailObj();
            watchOrganization();
            watchPISelection();
            watchContactType();
            watchPersonSelection();
            watchInvestigatorSelection();
        }

        vm.saveContact = function(){
            console.log("In saveContact vm.currentParticipatingSite =" + JSON.stringify(vm.currentParticipatingSite));
            //if ()
            vm.saveParticipatingSite();
        }

        vm.saveParticipatingSite = function(){
            vm.disableBtn = true;
            console.log("In save ps");
            //console.log("vm.siteRecruitmentGrid="+ JSON.stringify(vm.siteRecruitmentGrid));
            //console.log("1vm.currentParticipatingSite.site_rec_status_wrappers_attributes=" + JSON.stringify(vm.currentParticipatingSite.site_rec_status_wrappers_attributes));
            //console.log("1vm.currentParticipatingSite.site_rec_status_wrappers=" + JSON.stringify(vm.currentParticipatingSite.site_rec_status_wrappers));
            vm.currentParticipatingSite.site_rec_status_wrappers_attributes = [];
            for (var i = 0; i < vm.siteRecruitmentGrid.length; i++) {
                var siteObj = vm.siteRecruitmentGrid[i];
                if (siteObj.edit || siteObj.new || siteObj._destroy) {
                    vm.currentParticipatingSite.site_rec_status_wrappers_attributes.push(siteObj);
                }
            }
            vm.siteRecruitmentGrid = [];

            vm.currentParticipatingSite.participating_site_investigators_attributes = [];
            for (var i = 0; i < vm.investigatorGrid.length; i++) {
                var invObj = vm.investigatorGrid[i];
                if (invObj.edit || invObj.new || invObj._destroy) {
                    vm.currentParticipatingSite.participating_site_investigators_attributes.push(invObj);
                }
            }
            //vm.currentParticipatingSite.participating_site_investigators_attributes.push(participating_site_investigator);

            //console.log("2vm.currentParticipatingSite.site_rec_status_wrappers_attributes=" + JSON.stringify(vm.currentParticipatingSite.site_rec_status_wrappers_attributes));
            //console.log("2vm.currentParticipatingSite.site_rec_status_wrappers=" + JSON.stringify(vm.currentParticipatingSite.site_rec_status_wrappers));
            if (!vm.currentParticipatingSite.id) {
                vm.currentParticipatingSite.new = true;
            }
            // An outer param wrapper is needed for nested attributes to work
            var outerPS = {};
            outerPS.new = vm.currentParticipatingSite.new;
            outerPS.id = vm.currentParticipatingSite.id;
            outerPS.participating_site = vm.currentParticipatingSite;
            vm.currentParticipatingSite.trial_id = trialDetailObj.id;
            //console.log("/n In save saveParticipatingSite vm.currentParticipatingSite=" + JSON.stringify(vm.currentParticipatingSite));

            TrialService.upsertParticipatingSite(outerPS).then(function(response) {
                //console.log("/n server_response="+JSON.stringify(response));
                var newParticipatingSite = false;
                if(!vm.currentParticipatingSite.id){
                    // New Participating Site
                    newParticipatingSite = true;
                    vm.currentParticipatingSite.id = response.id;
                }
                if(vm.currentParticipatingSite.id) {
                    TrialService.getParticipatingSiteById(vm.currentParticipatingSite.id).then(function (response) {
                        console.log("getParticipatingSiteById response = " + JSON.stringify(response.site_rec_status_wrappers));
                        vm.currentParticipatingSite.site_rec_status_wrappers = response.site_rec_status_wrappers;
                        vm.currentParticipatingSite.site_rec_status_wrappers_attributes = [];
                        vm.currentParticipatingSite.participating_site_investigators = response.participating_site_investigators;
                        vm.currentParticipatingSite.participating_site_investigators_attributes = [];
                        vm.initSiteRecruitmentGrid();
                        vm.initInvestigatorGrid();
                        vm.persisted_contact.contact_name = vm.currentParticipatingSite.contact_name;
                        vm.persisted_contact.contact_phone = vm.currentParticipatingSite.contact_phone;
                        vm.persisted_contact.contact_email = vm.currentParticipatingSite.contact_email;
                        vm.persisted_contact.contact_type = vm.currentParticipatingSite.contact_type;
                        if(newParticipatingSite){
                            vm.curTrial.participating_sites.push(vm.currentParticipatingSite);
                        } else {
                            for (var i = 0; i < vm.curTrial.participating_sites.length; i++) {
                                if (vm.curTrial.participating_sites[i] == vm.currentParticipatingSite.id) {
                                    vm.curTrial.participating_sites[i] = vm.currentParticipatingSite;
                                }
                            }
                        }
                        vm.current_site_recruitment = {};
                        PATrialService.setCurrentTrial(vm.curTrial); // update to cache
                        $scope.$emit('updatedInChildScope', {});
                        toastr.clear();
                        toastr.success('Participating Site of  ' + vm.curTrial.lead_protocol_id + ' has been recorded', 'Operation Successful!', {
                            extendedTimeOut: 5,
                            timeOut: 0
                        });
                    }).catch(function (err) {
                        console.log("2server_response="+JSON.stringify(response));
                    });
                }
            }).catch(function(err) {
                console.log("error in updating trial " + JSON.stringify(outerPS));
            });
        };//saveParticipatingSite



        vm.reload = function() {
            $state.go($state.$current, null, { reload: true });
        };

        // Add Participating to a temp array
        function watchOrganization() {
            $scope.$watchCollection(function() {return vm.selOrganization.array;}, function(newVal, oldVal) {
                if (angular.isArray(newVal) && newVal.length > 0) {
                    console.log("newVal = "+ JSON.stringify(newVal));
                    vm.currentParticipatingSite.name = newVal[0].name;
                    vm.currentParticipatingSite.organization = newVal[0];
                    vm.currentParticipatingSite.organization_id = newVal[0].id;
                    vm.city = newVal[0].city;
                    vm.state_province = newVal[0].state_province;
                    vm.country = newVal[0].country;
                    vm.postal_code = newVal[0].postal_code;
                    vm.selOrganization = {name: vm.currentParticipatingSite["po_name"], array: []};
                    //console.log("vm.currentParticipatingSite =" + JSON.stringify(vm.currentParticipatingSite));
                }
            });
        }

        /**
         *  Set Add Mode. This causes the first tab to appear for a new Participating Site
         **/
        function setAddMode() {
            console.log("SETTING TO ADDMODE");
            vm.addEditMode = true;
            vm.currentParticipatingSite = {};
            vm.current_site_recruitment = {};
            vm.city = null;
            vm.state_province =  null;
            vm.country = null;
            vm.postal_code = null;
            vm.po_name = null;
            vm.selOrganization = {name: '', array: []};
        }

        /**
         *  Set Edit Mode. This causes the first tab to appear for an existing Participating Site
         **/
        function setEditMode(idx) {
            vm.addEditMode = true;
            vm.currentParticipatingSite = vm.curTrial.participating_sites[idx];
            vm.city =  vm.curTrial.participating_sites[idx].organization.city;
            vm.state_province =  vm.curTrial.participating_sites[idx].organization.state_province;
            vm.country = vm.curTrial.participating_sites[idx].organization.country;
            vm.postal_code = vm.curTrial.participating_sites[idx].organization.postal_code;
            vm.po_name = vm.curTrial.participating_sites[idx].organization.po_name;
            vm.selOrganization = {name: vm.currentParticipatingSite["po_name"], array: []};
            vm.persisted_contact = {};
            vm.persisted_contact.contact_name = vm.currentParticipatingSite.contact_name;
            vm.persisted_contact.contact_phone = vm.currentParticipatingSite.contact_phone;
            vm.persisted_contact.contact_email = vm.currentParticipatingSite.contact_email;
            vm.persisted_contact.contact_type = vm.currentParticipatingSite.contact_type;
            vm.initSiteRecruitmentGrid();
            vm.initInvestigatorGrid();
            vm.validateStatus();
        }

        vm.initSiteRecruitmentGrid = function (){
            vm.siteRecruitmentGrid = [];
            for (var i = 0; i < vm.currentParticipatingSite.site_rec_status_wrappers.length; i++) {
                var siteObj = vm.currentParticipatingSite.site_rec_status_wrappers[i];
                siteObj._destroy = false;
                siteObj.edit = false;
                siteObj.new = false;
                // For displaying status name in the table
                _.each(vm.siteRecruitmentStatusesArr, function (status) {
                    if (status.id == siteObj.site_recruitment_status.id) {
                        siteObj.sr_status_name = status.name;
                        siteObj.sr_status_code = status.code;
                    }
                });
                vm.siteRecruitmentGrid.push(siteObj);
            };
            vm.validateStatus();
        };

        /**
         *  Initialize Investigator Grid
         */
        vm.initInvestigatorGrid = function (){
            console.log("in vm.initInvestigatorGrid");
            vm.investigatorGrid = [];
            for (var i = 0; i < vm.currentParticipatingSite.participating_site_investigators.length; i++) {
                var invObj = vm.currentParticipatingSite.participating_site_investigators[i];
                invObj._destroy = false;
                invObj.edit = false;
                invObj.new = false;
                vm.investigatorGrid.push(invObj);
            };
            console.log("vm.investigatorGrid ="+ JSON.stringify(vm.investigatorGrid));
        };

        function openCalendar ($event, type) {
            $event.preventDefault();
            $event.stopPropagation();
            
            if (type === 'status_date') {
                vm.statusDateOpened = !vm.statusDateOpened;
            }
        }; //openCalendar

        /**
         *  First Tab
         *  Add a new Site Recruitment Status Record to the Participating Site
         **/
        function addSiteRecruitment() {
            vm.current_site_recruitment.participating_site_id= vm.currentParticipatingSite.id;
            vm.current_site_recruitment.new = true;
            var newSiteRec = vm.current_site_recruitment;
            var siteObj = vm.current_site_recruitment;
            _.each(vm.siteRecruitmentStatusesArr, function (status) {
                //console.log(" addSiteRecruitment() = status = "+ JSON.stringify(status) );
               // console.log(" addSiteRecruitment() = status = "+ JSON.stringify(status) );
                if (status.name == siteObj.site_recruitment_status.name) {
                    siteObj.sr_status_name = status.name;
                    siteObj.sr_status_code = status.code;
                    siteObj.site_recruitment_status_id = status.id;
                    //siteObj.site_recruitment_status = status;
                }
            });
            vm.validateStatus();
            //TrialService.addStatus(vm.siteRecruitmentGrid, siteObj);
            vm.siteRecruitmentGrid.push(siteObj);
            console.log(" addSiteRecruitment() = siteObj="+ JSON.stringify(siteObj) );
            vm.current_site_recruitment = {};
        }

        /**
         *  First Tab
         *  Edit an existing Site Recruitment Status Record in the Participating Site
         *  This function is used to show the values of the selected site recruitment record
         **/
        function editSiteRecruitment(index) {
            //if (index < vm.tempTrialStatuses.length) {
            console.log("In editSiteRecruitment");
            vm.current_site_recruitment = angular.copy(vm.siteRecruitmentGrid[index]);
            //if(!vm.current_site_recruitment.new){
                vm.current_site_recruitment.edit = true;
           // }
            vm.current_site_recruitment._destroy = false;
            vm.current_site_recruitment.index = index;
            console.log("vm.current_site_recruitment="+ JSON.stringify(vm.current_site_recruitment));
        //vm.current_site_recruitment.site_recruitment_status_id = vm.siteRecruitmentStatusesArr[1].id;
            // vm.tempTrialStatuses.splice(index, 1);
            //}
        }

        /**
         *  First Tab
         *  Edit an existing Site Recruitment Status Record in the Participating Site
         *  This function is used to save the user entered values of the selected site recruitment record
        */
        function commitEditSiteRecruitment() {
            console.log("In commitEditSiteRecruitment");
            if (vm.current_site_recruitment.edit) {
                vm.current_site_recruitment.status_date = DateService.convertISODateToLocaleDateStr(vm.current_site_recruitment.status_date);
                console.log("site_recruitment_status_id="+JSON.stringify(vm.current_site_recruitment.site_recruitment_status));
                vm.current_site_recruitment.site_recruitment_status_id = vm.current_site_recruitment.site_recruitment_status.id;
                console.log("In commitEditSiteRecruitment=" + JSON.stringify(vm.current_site_recruitment));
                var siteObj = vm.current_site_recruitment;
                _.each(vm.siteRecruitmentStatusesArr, function (status) {
                    if (status.name == siteObj.site_recruitment_status.name) {
                        siteObj.sr_status_name = status.name;
                        siteObj.sr_status_code = status.code;
                        siteObj.site_recruitment_status = status;
                        siteObj.site_recruitment_status_id = status.id;
                    }
                });
                for (var i = 0; i < vm.siteRecruitmentGrid.length; i++) {
                    var siteObj = vm.siteRecruitmentGrid[i];
                    if(siteObj.id == vm.current_site_recruitment.id){
                        vm.siteRecruitmentGrid[i] = vm.current_site_recruitment;
                    }
                }
                vm.validateStatus();
            }
        } // commitEdit

        /**
         *  First Tab
         *  Delete an existing Site Recruitment Status Record in the Participating Site
         */
        function deleteSiteRecruitment(index) {
            //if (index < vm.tempTrialStatuses.length) {
            console.log("In delete  SiteRecruitment index ="+index);
            vm.current_site_recruitment.edit = false;
            vm.siteRecruitmentGrid[index]._destroy = !vm.siteRecruitmentGrid[index]._destroy;
            vm.validateStatus();
        }

        /**
         *  First Tab
         *  Cancel out of editing an existing Site Recruitment Status Record in the Participating Site
         */
        function cancelSiteRecruitmentEdit() {
            vm.current_site_recruitment = {};
        }


        /**
         * Second Tab
         * Selecting a new Investigator
         */
        function watchPISelection() {
            $scope.$watchCollection(function() {return vm.principalInvestigator.array;}, function(newVal, oldVal) {
                console.log("newVal=" + JSON.stringify(newVal));
                if (angular.isArray(newVal) && newVal.length > 0) {
                    vm.principalInvestigator.name = PersonService.extractFullName(newVal[0]); // firstName + ' ' + middleName + ' ' + lastName;
                    vm.principalInvestigator.pi = vm.principalInvestigator.array[0];
                    vm.principalInvestigator.pi_id  = vm.principalInvestigator.array[0].id; // update PI on view
                    var participating_site_investigator = {};
                    participating_site_investigator.person_id = vm.principalInvestigator.array[0].id;
                    participating_site_investigator.new = true;
                    participating_site_investigator.person = vm.principalInvestigator.array[0];
                    //participating_site_investigator.person.set_as_contact = false;
                    // Check of Duplicate Entry
                    var exists = false;
                    for (var i = 0; i < vm.investigatorGrid.length; i++) {
                        if(vm.investigatorGrid[i].person_id == participating_site_investigator.person_id){
                            exists = true;
                        }
                    }
                    if(!exists){
                        vm.investigatorGrid.push(participating_site_investigator);
                    }
                }
            });
        }

        /**
         *  Second Tab
         *  Delete an existing Investigator in the Participating Site
         */
        function deleteInvestigator(index) {
            //if (index < vm.tempTrialStatuses.length) {
            console.log("In delete  deleteInvestigator");
            vm.current_investigator = angular.copy(vm.currentParticipatingSite.participating_site_investigators[index]);
            vm.current_investigator._destroy = true;
            vm.investigatorGrid[index]._destroy = !vm.investigatorGrid[index]._destroy;
        }

        /**
         * Editing an existing investigator
         * @param index
         */
        function editInvestigator(index) {
            //if (index < vm.tempTrialStatuses.length) {
            console.log("In editSiteRecruitment");
            vm.current_investigator = angular.copy(vm.currentParticipatingSite.participating_site_investigators[index]);
            vm.current_investigator.edit = true;
            //vm.current_investigator.index = index;
            console.log("In editSiteRecruitment vm.current_investigator=" +JSON.stringify(vm.current_investigator));
            // vm.tempTrialStatuses.splice(index, 1);
            //}
        }

        /**
         *  Second Tab
         *  Edit an existing Site Recruitment Status Record in the Participating Site
         *  This function is used to save the user entered values of the selected site recruitment record
         */
        function commitEditInvestigator() {
            console.log("In commitEditInvestigator");
            if (vm.current_investigator.edit) {
                //console.log("EDIT!!!!!!In commitEditInvestigator");
                vm.currentParticipatingSite.participating_site_investigators_attributes = [];
                vm.currentParticipatingSite.participating_site_investigators_attributes.push(vm.current_investigator);
                //console.log("EDIT!!!!!!In commitEditInvestigator=" + JSON.stringify(vm.currentParticipatingSite.participating_site_investigators_attributes));
                vm.saveParticipatingSite();
            }
        } // commitEdit

        /**
         *  Set the Investigator as a Primary Contact
         */
        function setAsSiteContact(index) {
            var inv = vm.currentParticipatingSite.participating_site_investigators[index];
            vm.currentParticipatingSite.contact_name = inv.person.lname;
            vm.currentParticipatingSite.contact_phone = inv.person.phone;
            vm.currentParticipatingSite.contact_email = inv.person.email;
            for (var i = 0; i < vm.centralContactTypes; i++) {
                if(vm.centralContactTypes[i].code  == "PI") {
                    vm.currentParticipatingSite.contact_type = vm.centralContactTypes[i];
                }
            }
            //vm.currentParticipatingSite.contact_type = ;
        }

        /**
         * Third Tab
         */

        function watchContactType() {
            $scope.$watch(function() {return vm.currentParticipatingSite.contact_type;}, function(newVal, oldVal) {
                console.log('Contact Type selected = ' + newVal);
                //vm.currentParticipatingSite.contact_type = newVal;
                if(newVal == "PI"){
                    vm.selectedContactTypePI = true;
                    vm.investigatorArray = [];
                    for (var i = 0; i < vm.currentParticipatingSite.participating_site_investigators.length; i++) {
                        var id = vm.currentParticipatingSite.participating_site_investigators[i].id;
                        var name = PersonService.extractFullName(vm.currentParticipatingSite.participating_site_investigators[i].person);

                        vm.investigatorArray.push({"id": id, "name": name});
                        console.log('vm.investigatorArray' + JSON.stringify(vm.investigatorArray));
                    }
                    if(vm.persisted_contact.contact_type == "PI"){
                        vm.currentParticipatingSite.contact_name = vm.persisted_contact.contact_name;
                        vm.currentParticipatingSite.contact_phone = vm.persisted_contact.contact_phone;
                        vm.currentParticipatingSite.contact_email = vm.persisted_contact.contact_email;
                        vm.currentParticipatingSite.person_id =  vm.persisted_contact.person_id;
                    } else {
                        vm.currentParticipatingSite.contact_name = null;
                        vm.currentParticipatingSite.contact_phone = null;
                        vm.currentParticipatingSite.contact_email = null;
                        vm.currentParticipatingSite.person_id = null;
                    }

                } else if (newVal == "General"){
                    vm.selectedContactTypePI = false;
                    if(vm.persisted_contact.contact_type == "General"){
                        vm.currentParticipatingSite.contact_name = vm.persisted_contact.contact_name;
                        vm.currentParticipatingSite.contact_phone = vm.persisted_contact.contact_phone;
                        vm.currentParticipatingSite.contact_email = vm.persisted_contact.contact_email;
                        vm.currentParticipatingSite.person_id = null;
                    } else {
                        vm.currentParticipatingSite.contact_name = null;
                        vm.currentParticipatingSite.contact_phone = null;
                        vm.currentParticipatingSite.contact_email = null;
                        vm.currentParticipatingSite.person_id = null;
                    }
                } else if (newVal == "Person"){
                    vm.selectedContactTypePI = false;
                    if(vm.persisted_contact.contact_type == "Person"){
                        vm.currentParticipatingSite.contact_name = vm.persisted_contact.contact_name;
                        vm.currentParticipatingSite.contact_phone = vm.persisted_contact.contact_phone;
                        vm.currentParticipatingSite.contact_email = vm.persisted_contact.contact_email;
                        vm.currentParticipatingSite.person_id =  vm.persisted_contact.person_id;
                    } else {
                        console.log("Initialize for Person");
                        vm.currentParticipatingSite.contact_name = null;
                        vm.currentParticipatingSite.contact_phone = null;
                        vm.currentParticipatingSite.contact_email = null;
                        vm.currentParticipatingSite.person_id = null;
                    }
                }

                /**
                if (angular.isArray(newVal) && newVal.length > 0 && !newVal[0].fullname) {
                    vm.currentParticipatingSite.central_contacts[0] = newVal[0];
                    var firstName = newVal[0].fname || '';
                    var middleName = newVal[0].mname || '';
                    var lastName = newVal[0].lname || '';
                    var fullName = firstName + ' ' + middleName + ' ' + lastName;
                    vm.currentParticipatingSite.central_contacts[0].fullname = (fullName).trim();
                    vm.currentParticipatingSite.central_contacts[0].person_id = newVal[0].id || '';
                    vm.currentParticipatingSite.central_contacts[0].phone = newVal[0].phone.replace(regex, '');
                    delete vm.currentParticipatingSite.central_contacts[0].id;
                } **/
            });

        }

        /**
         * Third Tab
         * Selecting a new  Person
         */
        function watchPersonSelection() {
            $scope.$watchCollection(function() {return vm.selectedPerson.array;}, function(newVal, oldVal) {
                console.log(" watchPersonSelection newVal=" + JSON.stringify(newVal));
                if (angular.isArray(newVal) && newVal.length > 0) {
                    vm.currentParticipatingSite.contact_name = PersonService.extractFullName(newVal[0]); // firstName + ' ' + middleName + ' ' + lastName;
                    //vm.principalInvestigator.pi = vm.selectedPerson.array[0];
                    //vm.principalInvestigator.pi_id  = vm.selectedPerson.array[0].id; // update PI on view
                    var personAsContact = {};
                    personAsContact.person_id = vm.selectedPerson.array[0].id;
                    personAsContact.new = true;
                    vm.currentParticipatingSite.contact_type = "Person";
                    vm.currentParticipatingSite.participating_site_investigators_attributes = [];
                    vm.currentParticipatingSite.participating_site_investigators_attributes.push(personAsContact);
                }
            });
        }

        /**
         * Third Tab
         */

        function watchInvestigatorSelection() {
            $scope.$watch(function() {return vm.selectedInvestigator;}, function(newVal, oldVal) {
                for (var i = 0; i < vm.currentParticipatingSite.participating_site_investigators.length; i++) {
                    if(vm.currentParticipatingSite.participating_site_investigators[i].id == newVal.id){
                        var inv = vm.currentParticipatingSite.participating_site_investigators[i].person;
                        vm.currentParticipatingSite.contact_name = PersonService.extractFullName(inv);
                        vm.currentParticipatingSite.contact_phone = inv.phone;
                        vm.currentParticipatingSite.contact_email = inv.email;
                        vm.currentParticipatingSite.contact_type = "PI"; // replace hardcoding
                    }
                }
            });
        };

        /**
         * Get trial detail object from parent scope
         */
        function watchTrialDetailObj() {
            $scope.$on(MESSAGES.TRIAL_DETAIL_SAVED, function() {
                getTrialDetailCopy();
            });
        } //watchTrialDetailObj

        function getTrialDetailCopy() {
            $timeout(function() {
                vm.curTrial = PATrialService.getCurrentTrialFromCache();
                //console.log("vm.curTrial =" + JSON.stringify(vm.curTrial ));
            }, 1);
        } //getTrialDetailCopy

        function deleteListHandler(participatingSitesSelectedInCheckboxes){
            //console.log("In deleteListHandler");
            var deleteList = [];
            angular.forEach(participatingSitesSelectedInCheckboxes, function(item) {
                if ( angular.isDefined(item.selected) && item.selected === true ) {
                    deleteList.push(item);
                }
            });
            vm.selectedDeleteParticipatingSitesList = deleteList ;
           // console.log("In vm.selectedDeleteParticipatingSitesList=" + JSON.stringify(vm.selectedDeleteParticipatingSitesList));

        };

        function deleteSelected(){
            vm.curTrial.participating_sites_attributes=[];
            for (var i = 0; i < vm.selectedDeleteParticipatingSitesList.length; i++) {
                vm.deleteParticipatingSite( vm.selectedDeleteParticipatingSitesList[i].id);
            }
        };

        vm.deleteParticipatingSite = function(psId){
            vm.disableBtn = true;

            TrialService.deleteParticipatingSite(psId).then(function(response) {
                console.log("response="+JSON.stringify(response));
                //toastr.success('Trial ' + vm.curTrial.lead_protocol_id + ' has been recorded', 'Operation Successful!');
                vm.curTrial.lock_version = response.lock_version || '';
                //toastr.success('Trial ' + vm.curTrial.lead_protocol_id + ' has been recorded', 'Operation Successful!');
                $scope.$emit('updatedInChildScope', {});
                for (var j = 0; j < vm.curTrial.participating_sites.length; j++) {
                    if (vm.curTrial.participating_sites[j].id == psId){
                        vm.curTrial.participating_sites.splice(j, 1);
                    }
                }
                PATrialService.setCurrentTrial(vm.curTrial); // update to cache
                toastr.clear();
                toastr.success('Participating Site ' + psId + ' for' + vm.curTrial.lead_protocol_id + ' has been deleted', 'Operation Successful!', {
                    extendedTimeOut: 1000,
                    timeOut: 0
                });
            }).catch(function(err) {
                console.log("error in deleting participating site=" + psId);
            });

        }//saveTrial

        // Validate Trials Stautuses
        vm.validateStatus = function() {
            // Remove statuses with _destroy is true
            var noDestroyStatusArr = [];
            for (var i = 0; i < vm.siteRecruitmentGrid.length; i++) {
                if (!vm.siteRecruitmentGrid[i]._destroy) {
                    noDestroyStatusArr.push(vm.siteRecruitmentGrid[i]);
                }
            }

            TrialService.validateSrStatus({"statuses": noDestroyStatusArr}).then(function(response) {
                vm.statusValidationMsgs = response.validation_msgs;

                // Add empty object to positions where _destroy is true
                for (var i = 0; i < vm.siteRecruitmentGrid.length; i++) {
                    if (vm.siteRecruitmentGrid[i]._destroy) {
                        vm.statusValidationMsgs.splice(i, 0, {});
                    }
                }
            }).catch(function(err) {
                console.log("Error in validating trial status: " + err);
            });
        };


        function resetParticipatingSiteTab() {
            vm.selOrganization = {name: '', array: []};
            vm.currentParticipatingSite.site_rec_status_wrappers_attributes=[];
            vm.current_site_recruitment = {};
            vm.initSiteRecruitmentGrid();
           $timeout(function() {
                getTrialDetailCopy();
                //vm.centralContactType = _getCentralContactType(); // restore vm.centralContactType
            }, 0);
        }

    } //trialParticipatingSitesCtrl

})();
