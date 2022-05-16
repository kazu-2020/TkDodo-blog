describe('シリーズデッキ新規作成', () => {
  it('シリーズデッキを新規作成し、メタの編集をする', () => {
    const now = Cypress.env('NOW')

    cy.visit('/')
    cy.contains('デッキ').click()
    cy.contains('シリーズデッキ新規作成').click()
  })

  it('新規作成したシリーズデッキが検索できること', () => {

  })
})
