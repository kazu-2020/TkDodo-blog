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

import '@testing-library/cypress/add-commands'
import 'cypress-real-events/support'
import 'cypress-file-upload'
import {
  playlistInput,
  recommendDeckInput,
  seriesDeckInput,
} from "../fixtures/formInput"
import {OktaAuth} from '@okta/okta-auth-js'

/*
 * プレイリストの画像を設定する
 */
Cypress.Commands.add('attachCoverPhoto', (imageType) => {
  cy.get(`[data-testid="${imageType}-image-wrapper"]`).focused()
  cy.get(`[data-testid="${imageType}-image-wrapper"]`)
    .find('button')
    .eq(0)
    .click({ force: true })
  cy.get(
    '[data-testid="cropper-image-modal-body"] input[type="file"]'
  ).attachFile('domo.jpg')
  cy.get('[data-testid="next-button"]').click()
  cy.get('[data-testid="next-button"]').click()
  cy.get('[data-testid="crop-image-button"]').click()
})

Cypress.Commands.add(
  'paste',
  {
    prevSubject: true,
  },
  (subject, data) => {
    const pasteEvent = Object.assign(
      new Event('paste', {
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

/*
 * プレイリストを作成する
 */
Cypress.Commands.add(
  'createPlaylist',
  (overrides = {}, addEpisodeCount = 0) => {
    const {
      aliasId,
      apiState,
      authorName,
      beforeSave,
      citation,
      description,
      detailedCatch,
      detailedNameRuby,
      formatGenre,
      hashTags,
      keywords,
      markedFooter,
      markedHeader,
      name,
      publisherName,
      sameAs,
      themeGenre,
      ...activesFlags
    } = playlistInput(overrides)

    cy.visit('/')
    cy.contains('プレイリスト').click()
    cy.contains('新規作成').click()

    if (addEpisodeCount > 0) {
      cy.contains('リスト(NItemList)').click()
      cy.get('[data-testid="search-text-input"]').clear().type('{enter}')
      for (let i = 0; i < addEpisodeCount; i++) {
        cy.get('[aria-label="追加"]').first().click()
      }
    }

    cy.contains('記事(NArticle)').click()
    if (markedHeader) {
      cy.get('[data-testid="markedHeader"]').clear().type(markedHeader)
    }
    if (markedFooter) {
      cy.get('[data-testid="markedFooter"]').clear().type(markedFooter)
    }
    if (authorName) {
      cy.get('[data-testid="authorName"]').clear().type(authorName)
    }
    if (publisherName) {
      cy.get('[data-testid="publisherName"]').clear().type(publisherName)
    }

    cy.contains('基本情報(NSeries)').click()
    cy.get('[data-testid="name"]').type(name)
    if (detailedNameRuby) {
      cy.get('[data-testid="detailedNameRuby"]').clear().type(detailedNameRuby)
    }
    if (detailedCatch) {
      cy.get('[data-testid="detailedCatch"]').clear().type(detailedCatch)
    }
    if (description) {
      cy.get('[data-testid="description"]').clear().type(description)
    }
    if (keywords) {
      cy.get('[data-testid="keywords-input-wrapper"] input[type=text]').type(
        keywords,
        { force: true }
      )
    }
    if (hashTags) {
      cy.get('[data-testid="hashtags-input-wrapper"] input[type="text"]').type(
        hashTags,
        { force: true }
      )
    }
    if (formatGenre) {
      cy.get('#formatGenreCode').type(`${formatGenre}{enter}{enter}`, {
        force: true,
      })
    }
    if (themeGenre) {
      cy.get('#themeGenreCode').type(`${themeGenre}{enter}{enter}`, {
        force: true,
      })
    }
    if (sameAs) {
      sameAs.forEach((sameAs, index) => {
        cy.get('[data-testid="add-same-as-button"]').click()
        cy.get(`[data-testid="sameAsAttributes.${index}.name"]`).type(
          sameAs.name
        )
        cy.get(`[data-testid="sameAsAttributes.${index}.url"]`).type(
          sameAs.url
        )
      })
    }
    if (citation) {
      citation.forEach((citation, index) => {
        cy.get('[data-testid="add-citation-button"]').click()
        cy.get(`[data-testid="citationsAttributes.${index}.name"]`).type(
          citation.name
        )
        cy.get(`[data-testid="citationsAttributes.${index}.url"]`).type(
          citation.url
        )
      })
    }
    if (aliasId) {
      cy.get('[data-testid="aliasId"]').clear().type(aliasId)
    }

    if (apiState !== undefined) {
      const selector = '[data-testid="apiState"] input[type="checkbox"]'
      apiState
        ? cy.get(selector).check({ force: true })
        : cy.get(selector).uncheck({ force: true })
    }

    // Active ON/OFF
    [
      'activeItemList',
      'activeTvepisode',
      'activeFaqpage',
      'activeHowto',
      'activeEvent',
      'activeRecipe',
      'activeArticle',
    ].forEach((key) => {
      if (activesFlags[key] !== undefined) {
        const selector = `[data-testid="${key}"] input[type="checkbox"]`
        activesFlags[key]
          ? cy.get(selector).check({ force: true })
          : cy.get(selector).uncheck({ force: true })
      }
    })

    cy.attachCoverPhoto('logo')
    cy.attachCoverPhoto('eyecatch')
    cy.attachCoverPhoto('hero')

    beforeSave && beforeSave()

    cy.contains('保存する').click({ force: true })
    cy.contains('作成しました', { timeout: 10000 })
  }
)

/*
 * プレイリストをすべて削除する
 */
Cypress.Commands.add('deleteAllPlaylists', () => {
  cy.visit('/')
  cy.contains('プレイリスト').click()
  cy.contains('一覧').click({ force: true })
  cy.get('[data-testid="api-status-select"]').select('全て')

  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1000) // これを入れないと安定しない

  cy.get('body').then(($body) => {
    if ($body.find('[data-testid="playlist-list-item"]').length) {
      cy.get('[data-testid="playlist-list-item"]').each((el) => {
        cy.wrap(el).click({ force: true })
        cy.get('[data-testid="playlist-drawer-delete-button"]').click({
          force: true,
        })
        cy.get('[data-testid="playlist-alert-delete-button"]').click({
          force: true,
        })
        cy.contains('削除しました')
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(200)
      })
    }
  })
})

/*
 * レコメンドデッキを作成する
 */
Cypress.Commands.add(
  'createRecommendDeck',
  (overrides = {}, addPlaylistCount = 0) => {
    const { apiState, beforeSave, description, interfix, name, sameAs } =
      recommendDeckInput(overrides)

    cy.visit('/')
    cy.contains('デッキ').click()
    cy.contains('レコメンドデッキ新規作成').click()

    if (addPlaylistCount > 0) {
      cy.contains('リスト(Playlist)').click()
      cy.get('[data-testid="search-text-input"]').clear().type('{enter}')
      for (let i = 0; i < addPlaylistCount; i++) {
        cy.get('[aria-label="追加"]').first().click()
      }
    }

    cy.contains('基本情報(Deck)').click()

    cy.get('[data-testid="name"]').type(name)
    cy.get('[data-testid="interfix"]').type(interfix)

    if (description) {
      cy.get('[data-testid="description"]').type(description)
    }

    if (apiState) {
      cy.get('[data-testid="apiState"] input[type="checkbox"]').check({
        force: true,
      })
    }

    if (sameAs) {
      sameAs.forEach((sameAs, index) => {
        cy.get('[data-testid="add-same-as-button"]').click()
        cy.get(`[data-testid="deckSameAsAttributes.${index}.name"]`).type(
          sameAs.name
        )
        cy.get(`[data-testid="deckSameAsAttributes.${index}.url"]`).type(
          sameAs.url
        )
      })
    }

    beforeSave && beforeSave()

    cy.contains('保存する').click({ force: true })
    cy.contains('作成しました')
  }
)

/*
 * レコメンドデッキをすべて削除する
 */
Cypress.Commands.add('deleteAllRecommendDeck', () => {
  cy.visit('/')
  cy.contains('レコメンドデッキ一覧').click({ force: true })

  cy.get('[data-testid="api-status-select"]').select('全て', { force: true })

  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(200) // これを入れないと安定しない

  cy.get('body').then(($body) => {
    if ($body.find('[data-testid="recommend-deck-list-item"]').length) {
      cy.get('[data-testid="recommend-deck-list-item"]').each((el) => {
        cy.wrap(el).click({ force: true })
        cy.get('[data-testid="recommend-deck-drawer-delete-button"]').click({
          force: true,
        })
        cy.get('[data-testid="recommend-deck-alert-delete-button"]').click({
          force: true,
        })
        cy.contains('削除しました')
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(200)
      })
    }
  })
})

/*
 * シリーズデッキを作成する
 */
Cypress.Commands.add(
  'createSeriesDeck',
  (overrides = {}, addPlaylistCount = 0) => {
    const { beforeSave, apiState, interfix, description, name } =
      seriesDeckInput(overrides)

    cy.visit('/')
    cy.contains('デッキ').click()
    cy.contains('シリーズデッキ新規作成').click()

    if (addPlaylistCount > 0) {
      cy.contains('リスト(Playlist)').click()
      cy.get('[data-testid="search-text-input"]').clear().type('{enter}')
      for (let i = 0; i < addPlaylistCount; i++) {
        cy.get('[aria-label="追加"]').first().click()
      }
    }

    cy.contains('基本情報(Deck)').click()

    cy.get('[data-testid="name"]').type(name)
    cy.get('[data-testid="interfix"]').type(interfix)

    if (description) {
      cy.get('[data-testid="description"]').type(description)
    }

    if (apiState) {
      cy.get('[data-testid="apiState"] input[type="checkbox"]').check({
        force: true,
      })
    }

    beforeSave && beforeSave()

    cy.contains('保存する').click({ force: true })
    cy.contains('作成しました')
  }
)

/*
 * シリーズデッキをすべて削除する
 */
Cypress.Commands.add('deleteAllSeriesDeck', () => {
  cy.visit('/')
  cy.contains('シリーズデッキ一覧').click({ force: true })

  cy.get('[data-testid="api-status-select"]').select('全て', { force: true })

  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(500) // これを入れないと安定しない

  cy.get('body').then(($body) => {
    if ($body.find('[data-testid="series-deck-list-item"]').length) {
      cy.get('[data-testid="series-deck-list-item"]').each((el) => {
        cy.wrap(el).click({ force: true })
        cy.get('[data-testid="series-deck-drawer-delete-button"]').click({
          force: true,
        })
        cy.get('[data-testid="series-deck-alert-delete-button"]').click({
          force: true,
        })
        cy.contains('削除しました')
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(200)
      })
    }
  })
})

/*
 * お知らせを作成する
 */
Cypress.Commands.add('createAnnouncement', (props) => {
  cy.visit('/announcements/new')
  cy.get('[data-testid="announcement-new-form"]').within(() => {
    cy.get('#status').type(`${props?.status ?? '機能改善'}{enter}{enter}`, {
      force: true,
    })
    cy.get('#contents').type(props?.contents ?? '機能改善のお知らせです')
    cy.contains('新規登録する').click()
  })
})

/* Oktaの開発環境にログインしてアクセストークンを取得する
 * https://docs.cypress.io/guides/end-to-end-testing/okta-authentication#Programmatic-Login を参考にした
 */
Cypress.Commands.add('fetchOktaAccessToken', (username, password) => {
  cy.request({
    method: 'POST',
      url: `https://${Cypress.env('OKTA_DOMAIN')}/api/v1/authn`,
      body: {
        username,
        password,
      },
  }).then(({body}) => {
    const user = body._embedded.user
    const config = {
      issuer: `https://${Cypress.env('OKTA_DOMAIN')}/oauth2/default`,
      clientId: Cypress.env('OKTA_CLIENT_ID'),
      redirectUri: 'http://localhost:5173/login/callback',
      scope: ['openid', 'email', 'profile'],
    }

    const authClient = new OktaAuth(config)

    return authClient.token
      .getWithoutPrompt({sessionToken: body.sessionToken})
      .then(({tokens}) => {
        const accessToken = tokens.accessToken.accessToken
        window.localStorage.setItem('accessToken', accessToken)
      })
  })
})

/* 全てのリクエストヘッダにアクセストークンを設定する */
Cypress.Commands.add('attachAccessTokenToHeader', () => {
  cy.server({
    onAnyRequest:   function (route,  proxy) {
      const accessToken = window.localStorage.getItem('accessToken')
      if(accessToken){
        proxy.xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`)
      } else {
        proxy.xhr.setRequestHeader('Authorization', null)
      }
    }
  })
})
