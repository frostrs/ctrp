@PO @Global
Feature: Curator review of a Pending Organization

Scenario: As a PO Curator, I can display all Organizations with Pending status
Given I am logged in to the CTRP PO application
And I am on the CTRP PO Curator Review screen
When I select Display Pending Organizations
Then a list of all Organizations in CTRP with a Pending Status should be displayed
And I can sort the list by PO ID, Organization Name, Organization Address, Creator Name, and Creation Date

Scenario: As a PO Curator, I can Search for Duplicate Organizations
Given I am logged in to the CTRP PO application
And I am on the CTRP PO Curator Review screen
When I have select a Pending Organization
Then I can search for possible duplicate organizations by CTEP ID, Organization Name, and Organization address

Scenario: As a PO Curator, I can determine if two organizations are Duplicate Organizations
Given I am logged in to the CTRP PO application
And I am on the CTRP PO Curator Review screen
When I select a Pending Organization and a possible Duplicate Organization
Then all occurrences in CTRP where the Pending Organization and the possible Duplicate Organization are Lead Organizations will be displayed
And all occurrences in CTRP where the Pending Organization and the possible Duplicate Organization are Sponsor Organizations will be displayed
And all occurrences in CTRP where the Pending Organization and the possible Duplicate Organization are Participating Sites will be displayed

Scenario: As a PO Curator, I can Activate a Pending Organization
Given I am logged in to the CTRP PO application
And I am on the CTRP PO Curator Review screen
And I have completed review of a Pending Organization
When I select Activate Organization
Then the Organizationís status will be Active
And the Organization will be available for use in CTRP

Scenario: As a PO Curator, I can Nullify an Organization
Given I am logged in to the CTRP PO Application
And I am on the CTRP PO Curator Review screen
And I have identified two organizations that are duplicates
When I select one of the organizations to be retained
And I select one of the organizations to be nullified
Then all references in CTRP to the nullified organization will reference the retained organization
And the name of the Nullified organization will be listed as an alias on the retained organization
And if both organizations had CTEP IDs only the retained organization CTEP ID will be associated with the retained organization
And the status of the organization to be nullified will be "Nullified"


Scenario: As a PO Curator, I cannot Nullify an Organization with Active CTEP ID
Given I am logged in to the CTRP PO Application
And I am on the CTRP PO Curator Review screen
And I have identified two organizations that are duplicates
When I select one of the organizations to be retained
And I select one of the organizations to be nullified that has an active CTEP ID
Then a warning will be displayed "Active CTEP ID"
And the nullification process will be terminated

