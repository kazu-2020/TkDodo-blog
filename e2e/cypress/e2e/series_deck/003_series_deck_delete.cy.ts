describe('シリーズデッキ削除', () => {
  it('シリーズデッキを削除する', () => {
    const now = Cypress.env('NOW')

    cy.visit('/')
    cy.contains('デッキ').click()
    cy.contains('シリーズデッキ一覧').click()

    cy.waitLoading()
    cy.wait(500)

    cy.get('.deck-name').contains(now).click()

    cy.get('.v-navigation-drawer .delete_button:visible').click()

    cy.on('window:alert',(message)=>{
      expect(message).to.contains('削除したデータは復元できません。本当に削除しますか？')
    })
    cy.on('window:confirm', () => true)

    cy.wait(2000)
  })

  it('削除したシリーズデッキが検索されないこと', () => {
    const now = Cypress.env('NOW')

    cy.visit('/')
    cy.contains('デッキ').click()
    cy.contains('シリーズデッキ一覧').click()

    cy.waitLoading()
    cy.wait(500)

    // 対象のデッキが表示されていないこと
    cy.get('body').then((body) => {
      if (body[0].querySelector('.deck-name')) {
        cy.get('.deck-name').contains(now).should('have.lengthOf', 0)
      }
    })
  })
})
