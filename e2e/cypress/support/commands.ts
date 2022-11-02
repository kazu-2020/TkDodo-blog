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

// NOTE: 追加したコマンドは e2e/global.d.ts に定義すること

import "@testing-library/cypress/add-commands"
import "cypress-real-events/support"
import "cypress-file-upload"
import {
  recommendDeckInput,
  seriesDeckInput,
} from "../fixtures/formInput"
import { faker } from "@faker-js/faker"

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

Cypress.Commands.add(
  "paste",
  {
    prevSubject: true,
  },
  (subject, data) => {
    const pasteEvent = Object.assign(
      new Event("paste", {
        bubbles: true,
        cancelable: true,
      }),
      {
        clipboardData: {
          getData: (type) => data[type],
          types: Object.keys(data),
        },
      }
    )

    subject[0].dispatchEvent(pasteEvent)

    return subject
  }
)

// TODO
Cypress.Commands.add("createPlaylist", () => {
  cy.visit("/")
  cy.contains("プレイリスト").click()
  cy.contains("新規作成").click()
  cy.contains("基本情報(NSeries)").click()
  cy.get('[data-testid="name"]').type(faker.word.adjective())
  cy.attachCoverPhoto("logo")
  cy.attachCoverPhoto("eyecatch")
  cy.attachCoverPhoto("hero")
  cy.contains("保存する").click({ force: true })
  cy.contains("作成しました", { timeout: 10000 })
})

Cypress.Commands.add("deleteAllPlaylists", () => {
  cy.visit("/")
  cy.contains("プレイリスト").click()
  cy.contains("一覧").click({ force: true })
  cy.get('[data-testid="api-status-select"]').select("全て")

  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(200) // これを入れないと安定しない

  cy.get("body").then(($body) => {
    if (!$body.text().includes("見つかりませんでした")) {
      cy.get('[data-testid="playlist-list-item"]').each((el) => {
        cy.wrap(el).click({ force: true })
        cy.get('[data-testid="playlist-drawer-delete-button"]').click({
          force: true,
        })
        cy.get('[data-testid="playlist-alert-delete-button"]').click({
          force: true,
        })
        cy.contains("削除しました")
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(200)
      })
    }
  })
})

Cypress.Commands.add("createRecommendDeck", (overrides = {}) => {
  const recommendDeckInputData = recommendDeckInput(overrides)

  cy.visit("/")
  cy.contains("デッキ").click()
  cy.contains("レコメンドデッキ新規作成").click()
  cy.contains("基本情報(Deck)").click()

  cy.get('[data-testid="name"]').type(recommendDeckInputData.name)
  cy.get('[data-testid="interfix"]').type(recommendDeckInputData.interfix)

  if (recommendDeckInputData.description) {
    cy.get('[data-testid="description"]').type(
      recommendDeckInputData.description
    )
  }

  if (recommendDeckInputData.apiState) {
    cy.get('[data-testid="apiState"] input[type="checkbox"]').check({
      force: true,
    })
  }

  if (recommendDeckInputData.sameAs) {
    recommendDeckInputData.sameAs.forEach((sameAs, index) => {
      cy.get('[data-testid="add-same-as-button"]').click()
      cy.get(`[data-testid="deckSameAsAttributes.${index}.name"]`).type(
        sameAs.name
      )
      cy.get(`[data-testid="deckSameAsAttributes.${index}.url"]`).type(
        sameAs.url
      )
    })
  }

  cy.contains("保存する").click({ force: true })
  cy.contains("作成しました")
})

Cypress.Commands.add("deleteAllRecommendDeck", () => {
  cy.visit("/")
  cy.contains("レコメンドデッキ一覧").click({ force: true })

  cy.get('[data-testid="api-status-select"]').select("全て", { force: true })

  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(200) // これを入れないと安定しない

  cy.get("body").then(($body) => {
    if (!$body.text().includes("見つかりませんでした")) {
      cy.get('[data-testid="recommend-deck-list-item"]').each((el) => {
        cy.wrap(el).click({ force: true })
        cy.get('[data-testid="recommend-deck-drawer-delete-button"]').click({
          force: true,
        })
        cy.get('[data-testid="recommend-deck-alert-delete-button"]').click({
          force: true,
        })
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(200)
      })
    }
  })
})

Cypress.Commands.add("createSeriesDeck", (overrides = {}) => {
  const seriesDeckInputData = seriesDeckInput(overrides)

  cy.visit("/")
  cy.contains("デッキ").click()
  cy.contains("シリーズデッキ新規作成").click()
  cy.contains("基本情報(Deck)").click()

  cy.get('[data-testid="name"]').type(seriesDeckInputData.name)
  cy.get('[data-testid="interfix"]').type(seriesDeckInputData.interfix)

  if (seriesDeckInputData.description) {
    cy.get('[data-testid="description"]').type(seriesDeckInputData.description)
  }

  if (seriesDeckInputData.apiState) {
    cy.get('[data-testid="apiState"] input[type="checkbox"]').check({
      force: true,
    })
  }

  cy.contains("保存する").click({ force: true })
  cy.contains("作成しました")
})

Cypress.Commands.add("deleteAllSeriesDeck", () => {
  cy.visit("/")
  cy.contains("シリーズデッキ一覧").click({ force: true })

  cy.get('[data-testid="api-status-select"]').select("全て", { force: true })

  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(200) // これを入れないと安定しない

  cy.get("body").then(($body) => {
    if (!$body.text().includes("見つかりませんでした")) {
      cy.get('[data-testid="series-deck-list-item"]').each((el) => {
        cy.wrap(el).click({ force: true })
        cy.get('[data-testid="series-deck-drawer-delete-button"]').click({
          force: true,
        })
        cy.get('[data-testid="series-deck-alert-delete-button"]').click({
          force: true,
        })
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(200)
      })
    }
  })
})
