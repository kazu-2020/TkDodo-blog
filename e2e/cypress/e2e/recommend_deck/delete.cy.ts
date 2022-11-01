describe('レコメンドデッキ削除', () => {
  before(() => {
    cy.deleteAllRecommendDeck()
    cy.createRecommendDeck()
    cy.createRecommendDeck()
  })

  it('レコメンドデッキを削除する', () => {
    cy.visit("/")
    cy.contains("デッキ").click()
    cy.contains("レコメンドデッキ一覧").click()

    // 全て
    cy.get('[data-testid="api-status-select"]').select("全て", { force: true })
    // プレイリストが表示されていること
    cy.get('[data-testid="recommend-deck-list-item"]')
      .should("have.lengthOf", 2)

    // 削除
    cy.deleteAllRecommendDeck()

    // 削除されたことを確認
    cy.get('[data-testid="api-status-select"]').select("全て", { force: true })
    cy.contains('見つかりませんでした')
  })
})
