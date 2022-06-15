describe('レコメンドデッキ更新', () => {
  it('レコメンドデッキを選択し、メタの更新をする', () => {
    const now = Cypress.env('NOW')

    cy.visit('/')
    cy.contains('デッキ').click()
    cy.contains('レコメンドデッキ一覧').click()

    cy.waitLoading()
    cy.wait(500)

    // すべてのデッキ
    cy.get('.v-select__slot').click()
    cy.get('.menuable__content__active').contains('全て').click()

    cy.waitLoading()

    cy.get('.deck-name').contains(now).click()

    cy.waitLoading()

    cy.get('.v-navigation-drawer .edit_button.orange').click()

    // 基本情報（deck）の編集
    cy.get('.series-step').click()

    const deckName = `${now}レコメンドデッキ2`
    cy.get('.deck_name input[type="text"]').eq(0).clear().type(deckName)
    const interfix = Date.now()
    cy.get('.deck_name input[type="text"]').eq(1).clear().type(interfix)
    cy.get('textarea[name=catch]').clear().type(deckName + interfix + "2")
    cy.get('label').contains('公開する').click()

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
      deckName + interfix + "2"
    )
  })

  it('更新したレコメンドデッキが検索できること', () => {
    const now = Cypress.env('NOW')

    cy.visit('/')
    cy.contains('デッキ').click()
    cy.contains('レコメンドデッキ一覧').click()

    cy.waitLoading()
    cy.wait(500)

    // API公開中のデッキ
    cy.get('.v-input__slot[role=button]').click()
    cy.get('.menuable__content__active').contains('API公開中のみ').click()

    cy.waitLoading()

    // 対象のデッキが表示されていること
    cy.get('.deck-name').contains(now).should('have.lengthOf', 1)

    cy.get('.deck-search input[type=text]').type(`${now}{enter}`, { force: true })

    // 対象のデッキが表示されていること
    cy.get('.deck-name').contains(now).should('have.lengthOf', 1)

    cy.get('.deck-search button').click()

    // 対象のデッキが表示されていること
    cy.get('.deck-name').contains(now).should('have.lengthOf', 1)

    // API非公開のデッキ
    cy.get('.v-input__slot[role=button]').click()
    cy.get('.menuable__content__active').contains('API非公開のみ').click()

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

    // すべてのデッキ
    cy.get('.v-input__slot[role=button]').click()
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
