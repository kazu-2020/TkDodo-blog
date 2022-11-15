describe("プレイリストの検索", () => {
  before(() => {
    cy.deleteAllPlaylists()
    cy.createPlaylist({ name: "API公開中プレイリスト", apiState: true })
    cy.createPlaylist({ name: "API非公開プレイリスト", apiState: false })
  })

  it("プレイリストが検索できること", () => {
    cy.visit("/")
    cy.contains("プレイリスト").click()
    cy.contains("一覧").click({ force: true })

    // API非公開
    cy.get('[data-testid="api-status-select"]').select("API非公開のみ", {
      force: true,
    })

    // 対象のプレイリストが表示されていること
    cy.get('[data-testid="playlist-list-item"]')
      .should("have.lengthOf", 1)

    // API公開中
    cy.get('[data-testid="api-status-select"]').select("API公開中のみ", {
      force: true,
    })

    cy.wait(200)

    // 対象のプレイリストが表示されていること
    cy.get('[data-testid="playlist-list-item"]')
      .should("have.lengthOf", 1)

    // 全て
    cy.get('[data-testid="api-status-select"]').select("全て", { force: true })

    cy.wait(200)

    // 対象のプレイリストが表示されていること
    cy.get('[data-testid="playlist-list-item"]')
      .should("have.lengthOf", 2)
  })
})
