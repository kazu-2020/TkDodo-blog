describe("レコメンドデッキ更新", () => {
  before(() => {
    cy.deleteAllPlaylists()
    cy.deleteAllRecommendDeck()
    cy.createPlaylist()
    cy.createPlaylist()
    cy.createRecommendDeck({}, 2)
  })

  it("レコメンドデッキを選択し、メタの更新をする", () => {
    cy.visit("/")
    cy.contains("デッキ").click()
    cy.contains("レコメンドデッキ一覧").click()

    cy.get('[data-testid="api-status-select"]').select("全て", { force: true })
    cy.get('[data-testid="recommend-deck-list-item"]')
      .first()
      .click({ force: true })
    cy.contains('デッキ編集').click({ force: true })

    // リスト（playlist）の編集
    cy.get('[data-testid="search-text-input"]').clear().type("{enter}")
    // 2件すべて削除
    cy.get('[aria-label="削除"]').first().click()
    cy.get('[aria-label="削除"]').first().click()
    cy.get('[aria-label="削除"]').should("have.lengthOf", 0)

    // 基本情報（deck）の編集
    cy.contains("基本情報(Deck)").click()

    const deckName = `レコメンドデッキ2`
    cy.get('[data-testid="name"]').clear().type(deckName)
    const interfix = Date.now().toString()
    cy.get('[data-testid="interfix"]').clear().type(interfix)
    cy.get('[data-testid="description"]').clear().type(deckName + interfix)

    // API State
    cy.get('[data-testid="apiState"] input[type="checkbox"]').check({
      force: true,
    })

    // SameAs
    cy.get('[data-testid="add-same-as-button"]').click()
    const sameAsName = "sameAsName"
    cy.get('[data-testid="deckSameAsAttributes.0.name"]').type(sameAsName)
    const sameAsUrl = "https://sameas.example.com"
    cy.get('[data-testid="deckSameAsAttributes.0.url"]').type(sameAsUrl)

    cy.contains("保存する").click({ force: true })
    cy.contains("保存しました", { timeout: 10000 })

    // 登録内容の確認
    cy.visit("/")
    cy.contains("デッキ").click()
    cy.contains("レコメンドデッキ一覧").click()

    cy.contains(deckName).click()
    cy.contains("デッキ編集").click()

    // リスト（Playlist）の確認
    cy.get('[aria-label="削除"]').should("have.lengthOf", 0)

    // 基本情報(deck)の確認
    cy.contains("基本情報(Deck)").click()

    cy.get('[data-testid="name"]').should("have.value", deckName)
    cy.get('[data-testid="interfix"]').should("have.value", interfix)
    cy.get('[data-testid="description"]').should(
      "have.value",
      deckName + interfix
    )
    cy.get('[data-testid="apiState"] input[type="checkbox"]').should(
      "be.checked"
    )
    cy.get('[data-testid="deckSameAsAttributes.0.name"]').should(
      "have.value",
      sameAsName
    )
    cy.get('[data-testid="deckSameAsAttributes.0.url"]').should(
      "have.value",
      sameAsUrl
    )
  })
})
