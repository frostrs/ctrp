@Global
Feature: PO F9 Search for Persons

  Scenario Outline:#1 As a Curator, search for persons with multiple parameters
    Given I know multiple parameters of the person I wish to search for
      And I am logged in to CTRP PO application
    And I am on the search persons screen
    And I can search with one or more parameters type
    |First Name|
    |Last Name|
    |Affiliation Organization ID
    |Context Person ID|
    |Affiliation|
    |Source Context|
    |Source ID|
    |Source Status|
    |Email|
    |Phone Number|
    |Last Updated Date: (Start Date, End Date)|
    |Updated By:Username|
    |Processing Status|
    |Service Request|
    
    And I submit my search request for Person Search
    Then the search results <result> should display the following sorted by Last Name:
    |CTRP Person ID|
    |CTEP Person ID|
    |First Name|
    |Middle Name|
    |Last Name|
    |Source ID|
    |Context person ID|
    |Source Status|
    |Source Context|
    |Processing Status|
    |Service Request|
    |Affiliated Orgs|
    |Email|
    |Phone |
    |Last Updated Date|
    |Last Updated By|
    |Prefix|
    |Suffix|

   When I select a person to view in CTRP Context
   Then CTRP records of the selected person details type will display in the edit mode
    |CTRP Person ID|
    |CTRP Context Person ID|
    |Prefix|
    |First Name|
    |Middle Name|
    |Last Name|
    |Suffix|
    |Processing Status|
    |Source Context: CTRP|
    |Source ID|
    |Source Status: Active|
    |Email|
    |Phone Number-Extension|
    |Created By:ctrpcurator (14-Sep-2016 10:53:52 EDT)|
    |Updated By:ctrpcurator (14-Sep-2016 10:53:52 EDT)|
    |Add Affiliated Organization Details|
    And I can choose to associate person context from that screen
    And I can view all Person associations displayed with information type
    And Person associations might have any source status 
    |CTRP Person ID|
    |CTEP Person ID|
    |First Name|
    |Middle Name|
    |Last Name|
    |Source ID|
    |Context person ID|
    |Source Status|
    |Source Context|
    |Processing Status|
    |Service Request|
    |Affiliated Orgs|
    |Email|
    |Phone |
    |Last Updated Date|
    |Last Updated By|
    |Prefix|
    |Suffix|
    And I deleted a person association 
    
  Scenario:#2 As a Curator, I will get a message if searched with no parameters
    Given I am logged in to CTRP PO application
    And I am on the search persons screen
    When I searched without providing any search parameters
    Then I should get message as "At least one selection value must be entered prior to running the search"
 
 Scenario: #3 A a Curator, I can search PersonExact Search is checked
    Given I know the exact paramater type of the person I want to search for
    And I am logged in to CTRP PO application
    And I have selected the option to search for a person
    When I provide the exact parameter I would like to search
    And the Exact search checked
    And I submit my search request
    Then the system should display all the exisiting exact parameter provided
    And the result should be sorted by Person Last Name
    
    Scenario: #4 A a Curator, I can search person when Exact Search is unchecked
   Given I know the exact paramater type of the person I want to search for
    And I am logged in to CTRP PO application
    And I have selected the option to search for a person
    When I provide the exact parameter I would like to search
    And the Exact search is unchecked
    And I submit my search request
    Then the system should not display all the existing exact parameter provided
    And the result should be sorted by Person Last Name
   
  
  Scenario:#5 As a curator, I cannot Search Results when the Exact Search box is checked and Exact Match is not provided
    Given I am logged in to CTRP PO application
    And Exact Search is checked on search person
    And I dont provide the Exact criteria for Person
    Then the search result should not be displayed



