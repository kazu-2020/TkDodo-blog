describe('シリーズデッキ更新', () => {
  it('シリーズデッキを選択し、メタの更新をする', () => {
    const now = Cypress.env('NOW')

    cy.visit('/')
    cy.contains('デッキ').click()
    cy.contains('シリーズデッキ一覧').click()

    cy.waitLoading()
    cy.wait(500)

    cy.get('.deck-name').contains(now).click()

    cy.waitLoading()

    cy.get('.v-navigation-drawer .edit_button.orange').click()

    // 基本情報（deck）の編集
    cy.get('.series-step').click()

    const deckName = `${now}シリーズデッキ2`
    cy.get('.deck_name input[type="text"]').eq(0).clear().type(deckName)
    const interfix = Date.now()
    cy.get('.deck_name input[type="text"]').eq(1).clear().type(interfix)
    cy.get('textarea[name=catch]').clear().type(deckName + interfix + "2")
    cy.get('label').contains('公開する').click()

    cy.contains('保存する').click({ force: true })

    cy.waitLoading()
    cy.wait(500)

    // 登録内容の確認
    // 基本情報(deck)の確認
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

  it('更新したシリーズデッキが検索できること', () => {
    const now = Cypress.env('NOW')

    cy.visit('/')
    cy.contains('デッキ').click()
    cy.contains('シリーズデッキ一覧').click()

    cy.waitLoading()
    cy.wait(500)

    // 対象のデッキが表示されていること
    cy.get('.py-1.col.col-11 .row').contains(now).should('have.lengthOf', 1)
    cy.get('.py-1.col.col-11 .row').contains('公開中').should('have.lengthOf', 1)
  })
})
