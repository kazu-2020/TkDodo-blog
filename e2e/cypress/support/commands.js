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

import "cypress-real-events/support"
import "cypress-file-upload"

Cypress.Commands.add("waitLoading", () => {
  cy.get(".v-progress-linear--visible", { timeout: 15000 }).should("not.exist")
})

Cypress.Commands.add("attachCoverPhoto", (imageType) => {
  cy.get(`[data-testid="${imageType}-image-wrapper"]`).focused()
  cy.get(`[data-testid="${imageType}-image-wrapper"]`)
    .find("button")
    .eq(0)
    .click({ force: true })
  cy.get(
    '[data-testid="cropper-image-modal-body"] input[type="file"]'
  ).attachFile("domo.jpg")
  cy.get('[data-testid="next-button"]').click()
  cy.get('[data-testid="next-button"]').click()
  cy.get('[data-testid="crop-image-button"]').click()
})

Cypress.Commands.add('paste', {
  prevSubject: true,
}, (subject, data) => {
  const pasteEvent = Object.assign(new Event('paste', {
    bubbles: true,
    cancelable: true,
  }), {
    clipboardData: {
      getData: (type) => data[type],
      types: Object.keys(data),
    },
  })

  subject[0].dispatchEvent(pasteEvent)

  return subject
})
