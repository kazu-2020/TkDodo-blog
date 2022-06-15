describe('レコメンドデッキ新規作成', () => {
  it('レコメンドデッキを新規作成し、メタの編集をする', () => {
    const now = Cypress.env('NOW')

    cy.visit('/')
    cy.contains('デッキ').click()
    cy.contains('レコメンドデッキ新規作成').click()

    // リスト（playlist）の編集
    cy.get('td .add_button').first().click()

    // 基本情報（deck）の編集
    cy.get('.series-step').click()

    const deckName = `${now}レコメンドデッキ`
    cy.get('.deck_name input[type="text"]').eq(0).type(deckName)
    const interfix = Date.now()
    cy.get('.deck_name input[type="text"]').eq(1).type(interfix)

    cy.get('textarea[name=catch]').type(deckName + interfix)

    cy.get('button.add-same-as').click({ force: true })
    const sameAsName = 'same-as1'
    const sameAsUrl = 'https://example.com/same-as'
    cy.get('.same-as-name input[type="text"]').clear().type(sameAsName, { force: true })
    cy.get('.same-as-url input[type="text"]').clear().type(sameAsUrl, { force: true })

    cy.contains('保存する').click({ force: true })

    cy.waitLoading()

    // 登録内容の確認
    // 基本情報(NSeries)の確認
    cy.get('.series-step').click()

    cy.get('.deck_name input[type="text"]').eq(0).should(
      'have.value',
      deckName
    )

    cy.get('.deck_name input[type="text"]').eq(1).should(
      'have.value',
      interfix
    )

    cy.get('textarea[name=catch]').should(
      'have.value',
      deckName + interfix
    )

    cy.get('.same-as-name input[type="text"]').should(
      'have.value',
      sameAsName
    )
    cy.get('.same-as-url input[type="text"]').should(
      'have.value',
      sameAsUrl
    )
  })

  it('新規作成したレコメンドデッキが検索できること', () => {
    const now = Cypress.env('NOW')

    cy.visit('/')
    cy.contains('デッキ').click()
    cy.contains('レコメンドデッキ一覧').click()

    cy.waitLoading()
    cy.wait(500)

    // API公開中のデッキ
    cy.get('.v-select__slot').click()
    cy.get('.menuable__content__active').contains('API公開中のみ').click()

    cy.waitLoading()

    // 対象のデッキが表示されていないこと
    cy.get('body').then((body) => {
      if (body[0].querySelector('.deck-name')) {
        cy.get('.deck-name').contains(now).should('have.lengthOf', 0)
      }
    })

    cy.get('.deck-search input[type=text]').type(`${now}{enter}`, { force: true })

    // 対象のデッキが表示されていないこと
    cy.get('body').then((body) => {
      if (body[0].querySelector('.deck-name')) {
        cy.get('.deck-name').contains(now).should('have.lengthOf', 0)
      }
    })

    cy.get('.deck-search button').click()

    // 対象のデッキが表示されていないこと
    cy.get('body').then((body) => {
      if (body[0].querySelector('.deck-name')) {
        cy.get('.deck-name').contains(now).should('have.lengthOf', 0)
      }
    })

    // API非公開のデッキ
    cy.get('.v-select__slot').click()
    cy.get('.menuable__content__active').contains('API非公開のみ').click()

    cy.waitLoading()

    // 対象のデッキが表示されていること
    cy.get('.deck-name').contains(now).should('have.lengthOf', 1)

    cy.get('.deck-search input[type=text]').type(`${now}{enter}`, { force: true })

    // 対象のデッキが表示されていること
    cy.get('.deck-name').contains(now).should('have.lengthOf', 1)

    cy.get('.deck-search button').click()

    // 対象のデッキが表示されていること
    cy.get('.deck-name').contains(now).should('have.lengthOf', 1)

    // すべてのデッキ
    cy.get('.v-select__slot').click()
    cy.get('.menuable__content__active').contains('全て').click()

    cy.waitLoading()

    // 対象のデッキが表示されていること
    cy.get('.deck-name').contains(now).should('have.lengthOf', 1)

    cy.get('.deck-search input[type=text]').type(`${now}{enter}`, { force: true })

    // 対象のデッキが表示されていること
    cy.get('.deck-name').contains(now).should('have.lengthOf', 1)

    cy.get('.deck-search button').click()

    // 対象のデッキが表示されていること
    cy.get('.deck-name').contains(now).should('have.lengthOf', 1)
  })
})
