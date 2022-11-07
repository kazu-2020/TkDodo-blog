describe('プレイリスト削除', () => {
  before(() => {
    cy.createPlaylist({name: 'テストプレイリスト'})
  })

  it('プレイリストを削除する', () => {
    // 作成したプレイリストの確認
    cy.deleteAllPlaylists()

    // 検索
    cy.get('[data-testid="search-text-input"]').type(`テストプレイリスト{enter}`, {
      force: true,
    })
    cy.wait(200)
    cy.contains("見つかりませんでした")
  })
})
