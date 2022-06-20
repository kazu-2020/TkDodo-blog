describe('シリーズデッキ新規作成', () => {
  it('シリーズデッキを新規作成し、メタの編集をする', () => {
    const now = Cypress.env('NOW')

    cy.visit('/')
    cy.contains('デッキ').click()
    cy.contains('シリーズデッキ新規作成').click()

    // リスト（playlist）の編集
    // リストの追加はAPIが関連するため実装をスキップ
    // cy.get('td .add_button').first().click()

    // 基本情報（deck）の編集
    cy.get('.series-step').click()

    const deckName = `${now}シリーズデッキ`
    cy.get('.deck_name input[type="text"]').eq(0).type(deckName)
    const interfix = Date.now()
    cy.get('.deck_name input[type="text"]').eq(1).type(interfix)

    cy.get('textarea[name=catch]').type(deckName + interfix)

    cy.contains('保存する').click({ force: true })

    cy.waitLoading()
    cy.wait(500)

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
  })

  it('新規作成したシリーズデッキが検索できること', () => {
    const now = Cypress.env('NOW')

    cy.visit('/')
    cy.contains('デッキ').click()
    cy.contains('シリーズデッキ一覧').click()

    cy.waitLoading()
    cy.wait(500)

    // 対象のデッキが表示されていること
    cy.get('.py-1.col.col-11 .row').contains(now).should('have.lengthOf', 1)
    cy.get('.py-1.col.col-11 .row').contains('非公開').should('have.lengthOf', 1)
  })
})
