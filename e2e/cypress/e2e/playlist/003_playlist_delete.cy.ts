describe('プレイリスト削除', () => {
  it('プレイリストを削除する', () => {
    const now = Cypress.env('NOW')

    // 作成したプレイリストの確認
    cy.visit("/")
    cy.contains("プレイリスト").click()
    cy.contains("一覧").click({ force: true })

    cy.get('[data-testid="api-status-select"]').select("全て")

    cy.get('[data-testid="playlist-list-items"]').contains(now).click()
    cy.get('[data-testid="playlist-drawer-delete-button"]').click()

    cy.get('[data-testid="playlist-alert-delete-button"]').click()

    cy.get('[data-testid="playlist-list-items"]').contains(now).should('have.lengthOf', 0)
  })
})
