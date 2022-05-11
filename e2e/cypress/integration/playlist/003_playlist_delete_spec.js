describe('プレイリスト削除', () => {
  it('プレイリストを削除する', () => {
    const now = Cypress.env('NOW')

    cy.visit('/')
    cy.contains('プレイリスト').click()
    cy.contains('一覧').click({ force: true })

    cy.get('.v-select__slot').click()
    cy.get('.menuable__content__active').contains('全て').click()

    cy.waitLoading()

    cy.get('.playlist-name').contains(now).click()

    cy.waitLoading()

    cy.get('.v-navigation-drawer .delete_button:visible').click()

    cy.on('window:alert',(message)=>{
      expect(message).to.contains('削除したデータは復元できません。本当に削除しますか？');
    })
    cy.on('window:confirm', () => true)

    cy.wait(2000)
  })

  it('削除したプレイリストが検索されないこと', () => {
    const now = Cypress.env('NOW')

    cy.visit('/')
    cy.contains('プレイリスト').click()
    cy.contains('一覧').click({ force: true })

    cy.url().should('eq', Cypress.config().baseUrl + '/')

    cy.contains('記事モード').click()

    cy.get('.v-select__slot').click()
    cy.get('.menuable__content__active').contains('API公開中のみ').click()

    cy.waitLoading()

    // 対象のプレイリストが表示されていないこと
    if (Cypress.$('.playlist-name').length > 0) {
      cy.get('.playlist-name').contains(now).should('have.lengthOf', 0)
    }

    cy.get('.playlist-search input[type=text]').type(`${now}{enter}`, { force: true })

    // 対象のプレイリストが表示されていないこと
    if (Cypress.$('.playlist-name').length > 0) {
      cy.get('.playlist-name').contains(now).should('have.lengthOf', 0)
    }

    cy.get('.playlist-search button').click()

    // 対象のプレイリストが表示されていないこと
    if (Cypress.$('.playlist-name').length > 0) {
      cy.get('.playlist-name').contains(now).should('have.lengthOf', 0)
    }

    cy.get('.v-select__slot').click()
    cy.get('.menuable__content__active').contains('API非公開のみ').click()

    cy.waitLoading()

    // 対象のプレイリストが表示されていないこと
    if (Cypress.$('.playlist-name').length > 0) {
      cy.get('.playlist-name').contains(now).should('have.lengthOf', 0)
    }

    cy.get('.playlist-search input[type=text]').type(`${now}{enter}`, { force: true })

    // 対象のプレイリストが表示されていないこと
    if (Cypress.$('.playlist-name').length > 0) {
      cy.get('.playlist-name').contains(now).should('have.lengthOf', 0)
    }

    cy.get('.playlist-search button').click()

    // 対象のプレイリストが表示されていないこと
    if (Cypress.$('.playlist-name').length > 0) {
      cy.get('.playlist-name').contains(now).should('have.lengthOf', 0)
    }

    cy.get('.v-select__slot').click()
    cy.get('.menuable__content__active').contains('全て').click()

    cy.waitLoading()

    // 対象のプレイリストが表示されていないこと
    if (Cypress.$('.playlist-name').length > 0) {
      cy.get('.playlist-name').contains(now).should('have.lengthOf', 0)
    }

    cy.get('.playlist-search input[type=text]').type(`${now}{enter}`, { force: true })

    // 対象のプレイリストが表示されていないこと
    if (Cypress.$('.playlist-name').length > 0) {
      cy.get('.playlist-name').contains(now).should('have.lengthOf', 0)
    }

    cy.get('.playlist-search button').click()

    // 対象のプレイリストが表示されていないこと
    if (Cypress.$('.playlist-name').length > 0) {
      cy.get('.playlist-name').contains(now).should('have.lengthOf', 0)
    }
  })
})