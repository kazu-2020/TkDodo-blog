describe('プレイリスト更新', () => {
  it('プレイリストを選択し、メタの更新をする', () => {
    const now = Cypress.env('NOW')

    cy.visit('/')
    cy.contains('プレイリスト').click()
    cy.contains('一覧').click({ force: true })

    cy.get('.v-select__slot').click()
    cy.get('.menuable__content__active').contains('全て').click()

    cy.get('.playlist-name').contains(now).click()

    // TODO: ドロワーの内容チェック playlist_new_spec側でもいいかも

    cy.get('.edit_button').click()
  })

  // it('更新したプレイリストが検索できること', () => {
  //   const now = Cypress.env('NOW')
  //
  //   cy.visit('/')
  //   cy.contains('プレイリスト').click()
  //   cy.contains('一覧').click({ force: true })
  //
  //   cy.url().should('eq', Cypress.config().baseUrl + '/')
  //
  //   cy.contains('記事モード').click()
  //
  //   cy.get('.v-select__slot').click()
  //   cy.get('.menuable__content__active').contains('API公開中のみ').click()
  //
  //   // 対象のプレイリストが表示されていないこと
  //   cy.get('.playlist-name').contains(now).should('have.lengthOf', 0)
  //
  //   cy.get('.playlist-search input[type=text]').type(`${now}{enter}`, { force: true })
  //
  //   // 対象のプレイリストが表示されていること
  //   cy.get('.playlist-name').contains(now).should('have.lengthOf', 1)
  //
  //   cy.get('.playlist-search button').click()
  //
  //   // 対象のプレイリストが表示されていること
  //   cy.get('.playlist-name').contains(now).should('have.lengthOf', 1)
  //
  //   cy.get('.v-select__slot').click()
  //   cy.get('.menuable__content__active').contains('API非公開のみ').click()
  //
  //   // 対象のプレイリストが表示されていないこと
  //   cy.get('.playlist-name').contains(now).should('have.lengthOf', 0)
  //
  //   cy.get('.playlist-search input[type=text]').type(`${now}{enter}`, { force: true })
  //
  //   // 対象のプレイリストが表示されていないこと
  //   cy.get('.playlist-name').contains(now).should('have.lengthOf', 0)
  //
  //   cy.get('.playlist-search button').click()
  //
  //   // 対象のプレイリストが表示されていないこと
  //   cy.get('.playlist-name').contains(now).should('have.lengthOf', 0)
  //
  //   cy.get('.v-select__slot').click()
  //   cy.get('.menuable__content__active').contains('全て').click()
  //
  //   // 対象のプレイリストが表示されていること
  //   cy.get('.playlist-name').contains(now).should('have.lengthOf', 1)
  //
  //   cy.get('.playlist-search input[type=text]').type(`${now}{enter}`, { force: true })
  //
  //   // 対象のプレイリストが表示されていること
  //   cy.get('.playlist-name').contains(now).should('have.lengthOf', 1)
  //
  //   cy.get('.playlist-search button').click()
  //
  //   // 対象のプレイリストが表示されていること
  //   cy.get('.playlist-name').contains(now).should('have.lengthOf', 1)
  // })
})