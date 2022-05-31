// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import 'cypress-file-upload'


Cypress.Commands.add("waitLoading", () => {
  cy.get('.v-progress-linear--visible', { timeout: 15000 }).should('not.exist')
})

Cypress.Commands.add("attachCoverPhoto", (index) => {
  cy.get('.v-card.v-sheet.theme--light.rounded-0').eq(index).trigger('mouseenter')
  cy.get('.v-card.v-sheet.theme--light.rounded-0').eq(index).find('button').eq(0).click()
  cy.get('.v-dialog .v-stepper__content .image-input input[type="file"]').attachFile('domo.jpg')
  cy.wait(200)
  cy.get('.v-dialog .v-stepper__content:visible button.primary').click()
  cy.wait(200)
  cy.get('.v-dialog .v-stepper__content:visible button.primary').click()
  cy.wait(200)
  cy.get('.v-dialog .v-stepper__content:visible button.success').click()
})