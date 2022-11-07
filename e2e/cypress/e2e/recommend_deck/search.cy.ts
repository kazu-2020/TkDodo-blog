describe("レコメンドデッキの検索", () => {
  before(() => {
    cy.deleteAllRecommendDeck()
    cy.createRecommendDeck({ name: "API公開中デッキ", apiState: true })
    cy.createRecommendDeck({ name: "API非公開デッキ", apiState: false })
  })

  it("レコメンドデッキが検索できること", () => {
    cy.visit("/")
    cy.contains("デッキ").click()
    cy.contains("レコメンドデッキ一覧").click()

    // API非公開
    cy.get('[data-testid="api-status-select"]').select("API非公開のみ", {
      force: true,
    })
    cy.get('[data-testid="recommend-deck-list-item"]')
      .should("have.lengthOf", 1)

    // API公開中
    cy.get('[data-testid="api-status-select"]').select("API公開中のみ", {
      force: true,
    })
    cy.get('[data-testid="recommend-deck-list-item"]')
      .should("have.lengthOf", 1)

    // 全て
    cy.get('[data-testid="api-status-select"]').select("全て", { force: true })

    // 対象のプレイリストが表示されていること
    cy.get('[data-testid="recommend-deck-list-item"]')
      .should("have.lengthOf", 2)


  })
})
