describe('プレイリスト新規作成', () => {
  it('プレイリストを新規作成し、メタの編集をする', () => {
    cy.visit('/')
    cy.contains('プレイリスト').click()
    cy.contains('新規作成').click()

    cy.get('.new_episode_list').click()

    // プレイリスト名を設定
    const playlistName = 'プレイリスト1'
    cy.get('.new-playlist-name').type(playlistName)
    cy.get('.new-playlist-name input[type="text"]').should(
      'have.value',
      playlistName
    )

    cy.contains('上記の内容で保存する').click()

    // 新規作成された内容を確認
    cy.contains('span.playlist-name', playlistName, { timeout: 5000 })
  })
})
