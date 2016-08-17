@Global@PO

Feature: PO F21 PO CTRP-CTEP-NLM Context Management Functionality

Scenario:#1 CTEP Context of a new Organization record can be created in CTRP
    Given CTEP creates a new organization and sends it via RESTful Services to CTRP
    When CTRP receives newly created CTEP Organization record through Restful Services
    Then A CTEP record will be created in CTRP 
    And the newly created Organization in the CTEP Context will display the field types below 
    
    |CTEP Context|
    |CTEP Organization ID|
    |CTEP Organization Type|
    |CTEP Organization Status (Active, Inactive, Legacy)|
    |Name|
    |Address|
    |Address2|
    |Address3|
    |City|
    |State_province|
    |Postal_code|
    |Country|
    |Public Research Email|
    |Public Research Phone|
    |Funding Mechanism|
    |CTEP Org PK ID|
    |Service Request (Create,Update,Merge with CTEP ID,Link with CTRP ID,Legacy,NULL)|
    |Processing Status (Pending, Complete)|
    
    And a PK ID will be assigned to the CTEP context
    And the assigned CTEP Org PK ID will be sent to CTEP
    And the Service Request will be set to "Create"
    And the Processing Status Will be set to "Pending"
   
    
    

Scenario: #1a CTEP Context Mandatory Fields
    Given I am logged into the CTRP 
     When A CTEP Context is created in CTRP
     Then the fields type are mandatory
    
    |CTEP Context|
    |CTEP Organization ID|
    |CTEP Organization Type|
    |CTEP Organization Status (Active, Inactive, Legacy)|
    |Name|
    |Address|
    |City|
    |Country|
    |CTEP Org PK ID|
    |Service Request (Create,Update,Merge with CTEP ID,Link with CTRP ID,Legacy,NULL)|
    |Processing Status (Pending, Complete)|
     

Scenario: #2 As a PO Curator, I can search a NEW CTEP Organization to create a CTRP Context 
    Given I am logged into the CTRP 
    And I am on the Search Organizations Screen
    When I select"Pending" from "Processing Status" 
    And I select Source context as CTEP
    And I select "Create" from "Service Request"
    Then I can view Organizations in the CTEP Context with "Processing Status" of "Pending" and a "Service Request" of "Create" 
    And the search results will display the column type
    
      |CTRP ID|
      |CTEP Org PK ID|
      |CTEP ID|
      |Name|
      |Source Status|
      |Source Context|
      |Source ID|
      |Phone|
      |Email|
      |Last Updated By|
      |Last Updated Date|
      |City|
      |State|
      |Country|
      |Postal Code|
      |Funding Mechanism|
      |Service Request|
      |Processing Status|
      
    When I click on the selected CTEP Organization 
    Then the CTEP context fields type will be displayed in a CTEP context screen
    
    |CTEP Context|
    |CTEP Organization ID|
    |CTEP Organization Type|
    |CTEP Organization Status (Active, Inactive, Legacy)|
    |Name|
    |Address|
    |Address2|
    |Address3|
    |City|
    |State_province|
    |Postal_code|
    |Country|
    |Public Research Email|
    |Public Research Phone|
    |Funding Mechanism|
    |CTEP Org PK ID|
    |Service Request (Create,Update,Merge with CTEP ID,Link with CTRP ID,Legacy,NULL)|
    |Processing Status (Pending, Complete)|
    
    And a list of all organization Context association history will be displayed with source status type 
    
      |Active  |
      |Inactive  |
      |Nullified|
      |Legacy|
      
       
    And the displayed organization association history will list the column type
    
      |CTRP ID|
      |CTEP Org PK ID|
      |CTEP ID|
      |Name|
      |Source Status|
      |Source Context|
      |Source ID|
      |Phone|
      |Email|
      |Last Updated By|
      |Last Updated Date|
      |City|
      |State|
      |Country|
      |Postal Code|
      |Funding Mechanism|
      |Service Request|
      |Processing Status|
      
     
    When the Curator clicks on the "Clone" button
    Then the CTRP system will search Active CTRP Context with both "organization Name" and "Organization Address" 
    And the CTEP Organization does not match an existing CTRP Context Organization name and Organization Address
    Then the CTEP Organization information will be copied into a new CTRP Organization with the field type 
   
    
     |CTRP Context|
     |CTRP Organization ID|
     |CTRP Organization Status| 
     |Name|
     |Address|
     |Address2|
     |City|
     |State_province|
     |Postal_code|
     |Country|
     |Public Research Email|
     |Public Research Phone|
     |Aliases|
     |Processing Status (Pending, Complete)|
     
    And the Created CTRP Context will be associated with the CTEP Context 
    And the CTEP Processing Status will be changed from "Pending" to "Complete"
    And the CTEP Service Request will be change from Create to Null 
    And the CTRP Context "Processing Staus" will be "Complete"
    And the CTRP "Organization Status" will be "Active"
    And The CTEP Org PK ID is sent to CTEP 
    
   
    Scenario:#2a CTRP Context Mandatory Fields
    Given I am logged into the CTRP 
     When A CTRP Context is created
     Then the fields type are mandatory 
     
    |CTRP Context|
    |CTRP Organization ID|
    |CTEP Organization Status|
    |Name|
    |Address|
    |City|
    |Country|
    |Processing Status (Pending, Complete)|

    
    Scenario: #3 As a PO Curator,I can associate an existing CTRP Organization with the Organization in the CTEP Context
    Given I am logged into the CTRP 
    And I am on the Search Organizations Screen
    When I select"Pending" from "Processing Status" 
    And I select Source context as CTEP
    And I select "Create" from "Service Request"
    Then I can view Organizations in the CTEP Context with "Processing Status" of "Pending" and a "Service Request" of "Create" 
    And the CTEP context fields type will be displayed in the CTEP Context screen
    
    |CTEP Context|
    |CTEP Organization ID|
    |CTEP Organization Type|
    |CTEP Organization Status (Active, Inactive, Legacy)|
    |Name|
    |Address|
    |Address2|
    |Address3|
    |City|
    |State_province|
    |Postal_code|
    |Country|
    |Public Research Email|
    |Public Research Phone|
    |Funding Mechanism|
    |CTEP Org PK ID|
    |Service Request (Create,Update,Merge with CTEP ID,Link with CTRP ID,Legacy,NULL)|
    |Processing Status (Pending, Complete)|
    
    And a list of all organization Context associations will be displayed with source status type 
    
      |Active  |
      |Inactive  |
      |Nullified|
      |Legacy|
      
    And the displayed organization list will the column type
    
      |CTRP ID|
      |CTEP Org PK ID|
      |CTEP ID|
      |Name|
      |Source Status|
      |Source Context|
      |Source ID|
      |Phone|
      |Email|
      |Last Updated By|
      |Last Updated Date|
      |City|
      |State|
      |Country|
      |Postal Code|
      |Funding Mechanism|
      |Service Request|
      |Processing Status|
      
    
    When the Curator clicks on the "Clone" button
    Then the CTRP system will search Active CTRP Context for both "organization Name" and "Organization Address" 
    When the CTEP Organization does match any existing CTRP Context Organization name and Organization Address
    Then a pop up list of matching CTRP organization with Organization Source Status "Active" will be displayed with information type
    
    |CTRP ID|
    |CTEP ID|
    |Organization Name|
    |Source Status|
    |Organization Address:City, State, County, Post Code|
    
    And the curator will review the displayed options
    And the curator can click on the existing option types <OptionType> to complete the funtion type <FunctionType|
    
    |OptionType|FunctionType|
    |Cancel    |To complete a New Search|
    |Proceed   |Create a New CTRP organization            |
    |Select    |To associate an Organization from the search results with the selected CTER org |
    
   	When The CTRP Organization displays after clicking on select
    And the curator clicks on Associate Organization Context to associate the selected CTRP Organization with the Organization in the CTEP Context
    Then the CTEP Processing Status will be changed from "Pending" to "Complete"
    And the CTEP Service Request will be change from Create to Null
    And every CTRP Organization can be associated with only one Organization in the CTEP Context
   And The CTRP Organization ID (PO ID) and CTEP Org PK ID  will be sent to CTEP-------------------- not on the workflow diagram, would like to confirm this step.
    
    
  
 Scenario: #4  CTRP Organization information gets updated with the New information received from CTEP
    Given I am on the Search Organizations Screen
    When CTEP updated organization information is sent to CTRP via Restful service
    Then the CTEP Service Request will be set to "Update"
    And the CTEP "Processing Status" will be set to "Pending"
    Then CTEP Context will be updated automatically with the new information received from the Restful service
    When CTEP updates are new organization address type
    	|Address|
        |Address 2|
        |City|
        |State| 
        |Postal Code|
        |Country|
        |Public Research Email|
        |Public Research Phone|
        
    And the CTEP Orgnization Status is Active
    Then The CTRP Context fields will be automatically Updated
    And the CTRP Context Processing Status will be Complete
    When the CTEP context update include a New Organization Name
    And the CTEP Organization is Active
    Then the CTRP Context field type is not automatically updated
    |Organization Name|
    And the CTRP Processing Status will be pending
    And The CTRP Curator will be able to identify by searching CTEP Organization with Service Request "Update"
    And the CTRP Processing Status will be "Pending"
    When CTRP Curator will determine the updates for the CTRP Context
    Then the CTRP Processing Status will be "Complete"
    
   
 
   Scenario: #5 As a CTRP PO Curator I can approve or deny a CTRP request for creating a new organization in CTRP
    Given I am logged into the CTRP  
     And I have received a request to create a new organization in CTRP
     When I have searched existing CTRP organizations with a CTRP Context 
     And the requested organization exists in the CTRP Context
    Then I can deny the request 
    When the requested organization does not exist in the CTRP Context
    Then I can create the requested organization in the CTRP Context
    And the CTRP Context Organization Status is "Active"
    And the CTRP Context Processing Status is "Complete"
    And I can send the CTRP Organization context to the CTEP-ECM

    
    Scenario:#6 CTRP links CTEP created organization record based on a new organization created in CTRP
    Given I am logged into the CTRP 
    When CTEP creates an organization based on a new organization created in CTRP
    Then CTEP sends organization records to CTRP via Restful Services
    And the CTEP Organization record includes the CTEP Organization ID and the CTRP Organization ID (PO ID) and other information type
    
    |CTEP Context|
    |CTEP Organization ID|
    |CTEP Organization Type|
    |CTEP Organization Status (Active, Inactive, Legacy)|
    |Name|
    |Address|
    |Address2|
    |Address3|
    |City|
    |State_province|
    |Postal_code|
    |Country|
    |Public Research Email|
    |Public Research Phone|
    |Funding Mechanism|
    |CTEP Org PK ID|
    |Service Request (Create,Update,Merge with CTEP ID,Link with CTRP ID,Legacy,NULL)|
    |Processing Status (Pending, Complete)|
    
  
   Then a CTEP Context for the received organization is created and automatically linked to the CTRP Context
   And CTEP Org PK ID  will be sent to CTEP

       Scenario: #6' NLM context created in CTRP
    Given I am logged into the CTEP
     When A trial is imported with a Sponsor Name that does not exist in the NLM Context
     Then CTRP creates an NLM Context with a Pending Processing Status and Create Service Request


    Scenario:#7 I can search a NLM Organization associated with an Organization in the CTRP Context 
    Given I am logged into the CTRP 
    And I am on the Search Organizations Screen
    When I select Source status as pending
    And I select Source context as NLM
    Then I can view Organizations in the NLM Context with Pending status with information Type
     
     |NLM Context|
     |Name (Sponsor)|
     |NLM Org PK ID|
     |Service Request (Create)|
     |Processing Status (Pending, Complete)|
    
    When the Imported organization does not exist in the CTRP Context
    Then I can create a NEW CTRP Organization with information type
     
     |CTRP Context|
     |CTRP Organization ID|
     |CTRP Organization Status| 
     |Name|
     |Address|
     |Address2|
     |City|
     |State_province|
     |Postal_code|
     |Country|
     |Public Research Email|
     |Public Research Phone|
     |Aliases|
     |Processing Status (Pending, Complete)|
     
    And I can associate the created organization with the NLM Context
    And The NLM "Processing Status" is changed from "Pending" to "Active"
    And The new CTRP Context information is sent to CTEP
    When the Imported Organization exists in CTRP
    Then the CTRP Curator clicks on "Associate Organization Context" to associate the existing CTRP Organization with the NLM Context
    And The NLM "Processing Status" is changed from "Pending" to "Active"

  Scenario:#8 Curator can identify when two organizations are to be merged 
    Given I am logged into the CTRP 
     When CTEP Indicates via REST Service that two Organizations are to be merged
     And the CTEP Organizations <OrganizationType> will have PK ID <PKIDType>, CTRP ID <CTRPIDType>, Service request <ServiceRequestType>, processing status <ProcessingStatusType>, and Organization status <StatusType>
     
     |OrganizationType| PKIDType|CTRPIDType|ServiceRequestType |rocessingStatusType |StatusType|
     |Organization 1  |PK ID 1  |CTRP ID 1 | Merge ID 1        |Pending             |Active    |
     |Organization 2  |PK ID 2  |CTRP ID 2 | Merge ID 2        |Pending             |Inactive  |
     
     Then the curator will search CTEP Context for organization where Service request is "Merge ID"
     And the curator will search for matching organization in the CTRP Context
     When Matching CTRP organizations found
     Then The CTRP organization matching CTEP organization with inactive status will be Nullified
     And  the organizations <OrganizationType> will have PK ID <PKIDType>, CTRP ID <CTRPIDType>, Service request <ServiceRequestType>, processing status <ProcessingStatusType>, and Organization status <StatusType> 
     
     |OrganizationType| PKIDType|CTRPIDType|ServiceRequestType |ProcessingStatusType |StatusType|
     |Organization 1  |PK ID 1  |CTRP ID 1 | Null              |Complete            |Active    |
     |Organization 2  |PK ID 2  |CTRP ID 2 | Null              |Complete             |Inactive  |
     And the curator will select the CTRP organization associated with the CTEP Active organization to replace the trail associations of the nullified organization
     
    
    
    Scenario:#10 CTEP Context of a new person record created
    Given I am logged into the CTRP 
    When CTRP receives newly created CTEP person record through Restful Services
    Then a new person record will be created in the CTEP Context with Processing Status of "Pending" and Service Request of "Create" in the CTRP 
    And the new person record will display the field type
      
      |CTEP Person ID|
      |CTEP Person Registration Type|
      |CTEP Person Registration Status|
      |Prefix|
      |Suffix|
      |First Name|
      |Middle Name|
      |Last Name|
      |Public Research Phone|
      |Public Research Email|
      |Person Status|
      |Affiliated Organization CTEP ID|
      |CTEP Person PK ID|
      |Service Request (Create, Update, Merge with CTEP ID, NULL)|
      |Processing Status (Pending, Complete)|
      And an person record PK ID will be sent to CTEP
      And the Person Processing status will be " Complete"
      And the Service Request will be set to "Null"
      
        Scenario:#10a CTEP Person Context Mandatory Fields 
    Given I am logged into the CTRP 
     When CTEP Context of a person record is created
     Then the person record fields type are mandatory

      |CTEP Person ID|
      |CTEP Person Registration Type|
      |CTEP Person Registration Status|
      |First Name|
      |Last Name|
      |Person Status|
      |Affiliated Organization CTEP ID|
      |CTEP Person PK ID|
      |CTEP Service Request (Create, Update, Merge with CTEP ID, NULL)|
      |Processing Status (Pending, Complete)|
      

      
Scenario: #11 As a PO Curator, I can search a NEW person record to associate it with a person in the CTEP Context
    Given Given I am logged into the CTRP 
    And I am on the Search Persons Screen
    When I select Processing status as"Pending"
    And Service Request as "Create"
    And I select Source context as CTEP
    Then I can view Persons in the CTEP Context with "Processing Status" of "Pending" and Service request of "Create"
    When the viewed CTEP Person does not exist in CTRP
    Then the Curator clicks on "Clone" button to create a new CTRP Person associated with the CTEP Context with the information type
      
      |CTRP Person ID|
      |CTRP Person Status|
      |Prefix|
      |Suffix|
      |First Name|
      |Middle Name|
      |Last Name|
      |Public Research Phone|
      |Public Research Email|
      |Person Status|
      |Affiliated Organization CTRP ID|
      |Processing Status (Pending, Complete)|
      
    
    And the CTEP Context Status is changed from Pending to Active
    And The CTEP Context Person Information is copied into the CTRP Context
    When the viewed CTEP Person exists in CTRP-------------------------------------------------------------------------------Can we use the same functionality as org (pop up box)
    Then A CTRP Curator clicks on "Associate Person Context" to associate an existing CTRP Person record with the CTEP Context
    And The CTEP "Processing Status" is changed from "Pending" to "Active"
    
    Scenario:#12 CTRP Person Context Mandatory Fields 
    Given I am logged into the CTRP 
     When CTRP Context of a person record is created
     Then the person record fields type are mandatory
     
      |CTRP Person ID|
      |CTRP Person Status|
      |First Name|
      |Last Name|
      |Person Status|
      |Affiliated Organization CTRP ID|
      |Processing Status (Pending, Complete)|
    
    
    Person Record Updates
    
    Can all person records be updated in CTEP,what if Person status? 
    are we concerned only by address and name.
     
     
     
     
     Scenario: #13 Rules for CTRP Organization Status based on CTEP Organization Status
    Given I am logged into the CTRP 
     When the Organization CTEP context status is Active
     Then the Organization CTRP context status must be active  
     When the Organization CTEP context status is Inactive
     Then the CTRP context can be Inactive OR Nullified
     
  


Scenario:#8 Curator can identify when two Persons are to be merged 
    Given I am logged into the CTRP 
     When CTEP Indicates via REST Service that two Persons are to be merged
     And the CTEP person <PersonType> will have PK ID <PKIDType>, CTRP ID <CTRPIDType>, Service request <ServiceRequestType>, processing status <ProcessingStatusType>, and Person status <StatusType>
     
     |PersonType| PKIDType|CTRPIDType|ServiceRequestType |rocessingStatusType |StatusType|
     |Person 1  |PK ID 1  |CTRP ID 1 | Merge ID 1        |Pending             |Active    |
     |Person 2  |PK ID 2  |CTRP ID 2 | Merge ID 2        |Pending             |Inactive  |
     
     Then the curator will search CTEP Context for person where Service request is "Merge ID"
     And the curator will search for matching persons in the CTRP Context
     When Matching CTRP persons found
     Then The CTRP person matching CTEP organization with inactive status will be Nullified
     And  the person <PersonType> will have PK ID <PKIDType>, CTRP ID <CTRPIDType>, Service request <ServiceRequestType>, processing status <ProcessingStatusType>, and Person status <PersonType> 
     
     |PersonType| PKIDType|CTRPIDType|ServiceRequestType |ProcessingStatusType |StatusType|
     |Person 1  |PK ID 1  |CTRP ID 1 | Null              |Complete             |Active    |
     |Person 2  |PK ID 2  |CTRP ID 2 | Null              |Complete             |Inactive  |
     And the curator will select the CTRP person associated with the CTEP Active person to replace the trail associations of the nullified person
     And all references in CTRP to the nullified Person Record will reference the retained Person Record
     And any unique Person Organization Affiliations on the nullified Person Record will be added to the retained Person Record
     
    
    
    