/**
 * Author: Shamim Ahmed
 * Date: 12/09/2015
 * Page Object: Abstraction Menu items
 */


var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = require('chai').expect;

var helperFunctions = require('../support/helper');


var trialCommonBar = function(){

    this.homeMenu = element(by.linkText('Home'));
    this.dashboardMenu = element(by.linkText('Dashboards'));
    this.dashboardAbstractionMenu = element(by.linkText('Abstraction'));
    this.dashboardResultReportingMenu = element(by.linkText('Results Reporting'));
    this.dashboardCTGovMenu = element(by.linkText('CT.Gov Import'));
    this.organizationAndFamiliesMenu = element(by.linkText('Organizations & Families'));
    this.personsMenu = element(by.linkText('Persons'));
    this.trialsMenu = element(by.linkText('Trials'));
    this.userManagementMenu = element(by.linkText('User Management'));


    var homeSearchTrial = element(by.css('a[href="#/main/trials"]'));
    this.homeRegisterTrial = element(by.css('a[href="#/main/new_trial/NAT"]'));
    this.mainTrialsLink = element(by.linkText('Trials')) ;
    this.searchTrialLink = element(by.linkText('Search Trials'));
    this.registerTrialLink = element(by.linkText('Register Trial'));
    this.registerNationalTrial = element(by.css('a[href="#/main/new_trial/NAT"]'));//by.linkText('National')
    this.registerExternallyPeerReviewedTrial = element(by.css('a[href="#/main/new_trial/EPR"]'));
    this.registerInstitutional = element(by.css('a[href="#/main/new_trial/INS"]'));
    var pageHeaderText = element(by.css('div.row > h4'));

    var helper = new helperFunctions();
    var search_Trial_Header_Text = 'Search Trials * for wild card';
    var register_Trial_Header_Text = 'Register Trial';

    this.clickHomeMenu = function(){
        homeMenu.isPresent().then(function(retValHome){
            console.log('Link Exists: ' + retValHome);
            if (retValHome === true) {
                helper.clickLink(homeSearchTrial, "Home Search Trial link");
                expect(pageHeaderText.getText()).to.eventually.equal(search_Trial_Header_Text);
            }
        });
    };

    this.clickHomeSearchTrial = function(){
        homeSearchTrial.isPresent().then(function(retVal){
            console.log('value of ret val : ' + retVal);
            if (retVal === true) {
                helper.clickLink(this.homeMenu, "Home link from the Menu");
                expect(pageHeaderText.getText()).to.eventually.equal(search_Trial_Header_Text);
            }
        });
    };

    this.clickHomeRegisterTrial = function(){
        helper.clickLink(this.homeRegisterTrial, "Home Register Trial link");
        expect(pageHeaderText.getText()).to.eventually.equal(register_Trial_Header_Text);
    };

    this.clickTrials = function(){
        helper.clickLink(this.mainTrialsLink, "Trial link");
    };


    this.clickListSearchTrialLink = function(){
        helper.clickLink(this.searchTrialLink, "Search Trial link");
        expect(pageHeaderText.getText()).to.eventually.equal(search_Trial_Header_Text);
    };

    this.clickRegisterTrialLink = function(){
        helper.clickLink(this.registerTrialLink, "Register Trial link");
    };

    this.clickRegisterNationalTrialLink = function(){
        browser.get('ui/#/main/new_trial/NAT');
      //  http://ctrp-ci.nci.nih.gov/ctrp/ui/#/main/new_trial/NAT
      //  element(by.linkText('Register Trial')).sendKeys(protractor.Key.RIGHT);
      ////  browser.actions().mouseMove(element(by.linkText('Search Trials')).find()).perform();
      //  browser.sleep(10000);
      //  //browser.driver.actions().
      //  element(by.css('a[href="#/main/new_trial/NAT"]')).click();//.then(function(elm){
      //    //  elm[0].click();
      // // });
     //   helper.clickLink(this.registerNationalTrial, "Register National Trial link");
        expect(pageHeaderText.getText()).to.eventually.equal(register_Trial_Header_Text);
    };

    this.clickRegisterExternallyPeerReviewedTrialLink = function(){
        browser.get('ui/#/main/new_trial/EPR');
       // helper.clickLink(this.registerExternallyPeerReviewedTrial, "Register Externally Peer Reviewed Trial link");
        expect(pageHeaderText.getText()).to.eventually.equal(register_Trial_Header_Text);
    };

    this.clickRegisterInstitutionalTrialLink = function(){
        browser.get('ui/#/main/new_trial/INS');
       // helper.clickLink(this.registerInstitutional, "Register Institutional Trial link");
        expect(pageHeaderText.getText()).to.eventually.equal(register_Trial_Header_Text);
    };

    this.verifyRegisterTrial = function(){
        expect(pageHeaderText.getText()).to.eventually.equal(register_Trial_Header_Text);
    };

};

module.exports = trialCommonBar;
