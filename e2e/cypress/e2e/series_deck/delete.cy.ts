describe('シリーズデッキ削除', () => {
  before(() => {
    cy.deleteAllSeriesDeck()
    cy.createSeriesDeck()
    cy.createSeriesDeck()
  })

  it('シリーズデッキを削除する', () => {
    cy.visit("/")
    cy.contains("デッキ").click()
    cy.contains("シリーズデッキ一覧").click()

    // 全て
    cy.get('[data-testid="api-status-select"]').select("全て", { force: true })
    // プレイリストが表示されていること
    cy.get('[data-testid="series-deck-list-item"]')
      .should("have.lengthOf", 2)

    // 削除
    cy.deleteAllSeriesDeck()

    // 削除されたことを確認
    cy.get('[data-testid="api-status-select"]').select("全て", { force: true })
    cy.contains('見つかりませんでした')
  })
})
