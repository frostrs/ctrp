@Global @Reg
Feature: As a CTRP User, I can save my imcomplete registration as a draft, to be completed in the future

Scenario: #1 I can save my incomplete registration as a draft
Given I have selected the option to register a National, Externally Peer-Reviewed, or Institutional trial
And I have completed some of the registration
When I have selected Save as Draft
Then the CTRP application will save all information that was entered as a draft
And I will be able to search for saved draft registration
And I will be able to complete the registration at a future date


