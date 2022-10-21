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

    cy.contains("削除しました")

    // 検索
    cy.get('[data-testid="search-text-input"]').type(`${now}{enter}`, {
      force: true,
    })
    cy.wait(200)
    cy.contains("見つかりませんでした")
  })
})
