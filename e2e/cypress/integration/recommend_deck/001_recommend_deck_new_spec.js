describe('レコメンドデッキ新規作成', () => {
  it('レコメンドデッキを新規作成し、メタの編集をする', () => {
    const now = Cypress.env('NOW')

    cy.visit('/')
    cy.contains('デッキ').click()
    cy.contains('レコメンドデッキ新規作成').click()
  })

  it('新規作成したレコメンドデッキが検索できること', () => {

  })
})
