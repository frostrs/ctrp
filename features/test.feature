@Global @test
Feature: Search for persons
  @runthis
  Scenario: As any CTRP User, I am able to search for persons by first name
    Given Login in CTRP
    And Creaye person with Organization
    Then verify person
    And Create person with Organizations
