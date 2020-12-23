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

    // メタの編集
    cy.get('.series-step').click()

    const playlistDetailedNameRuby = 'ぷれいりすと１'
    cy.get('.detailed_name_ruby input[type="text"]')
      .clear()
      .type(playlistDetailedNameRuby)
    const playlistDetailedCatch = 'キャッチコピーはこちらに'
    cy.get('.detailed_catch textarea').clear().type(playlistDetailedCatch)

    const playlistKeywords = 'キーワード1{enter}キーワード2{enter}'
    cy.get('.keywords input[type="text"]').type(playlistKeywords, { force: true })
    const playlistHashTags = '#ハッシュタグ1{enter}'
    cy.get('.hashtags input[type="text"]').type(playlistHashTags, { force: true })
    cy.get('.format_genre_select').click()
    const playlistFormatGenre = '報道'
    cy.contains(playlistFormatGenre).click({ force: true })
    const playlistThemeGenre = '科学'
    cy.get('.theme_genre_select').click()
    cy.contains(playlistThemeGenre).click({ force: true })

    cy.get('button.custom_color').click()
    cy.get('.v-color-picker__input input').clear().type('#FFFFFF{enter}')

    cy.get('button.add-same-as').click({ force: true })
    const sameAsName = 'same-as1'
    const sameAsUrl = 'https://example.com/same-as'
    cy.get('.same-as-name input[type="text"]').clear().type(sameAsName, { force: true })
    cy.get('.same-as-url input[type="text"]').clear().type(sameAsUrl, { force: true })

    cy.get('button.add-citation').click({ force: true })
    const citationName = 'citation1'
    const citationUrl = 'https://example.com/citation'
    cy.get('.citation-name input[type="text"]').clear().type(citationName, { force: true })
    cy.get('.citation-url input[type="text"]').clear().type(citationUrl, { force: true })

    cy.contains('保存する').click({ force: true })

    cy.reload()

    // 保存された内容の確認
    cy.get('.series-step').click()

    cy.contains('.playlist-title', playlistName, { timeout: 5000 })

    cy.get('.detailed_name_ruby input[type="text"]').should(
      'have.value',
      playlistDetailedNameRuby
    )
    cy.get('.detailed_catch textarea').should(
      'have.value',
      playlistDetailedCatch
    )
    cy.get('.keywords .v-chip').first().contains('キーワード1')
    cy.get('.keywords .v-chip').last().contains('キーワード2')

    cy.get('.hashtags .v-chip').first().contains('#ハッシュタグ1')

    cy.get('.format_genre_select .v-select__selection').contains(
      playlistFormatGenre
    )
    cy.get('.theme_genre_select .v-select__selection').contains(
      playlistThemeGenre
    )

    cy.get('.same-as-name input[type="text"]').should(
      'have.value',
      sameAsName
    )
    cy.get('.same-as-url input[type="text"]').should(
      'have.value',
      sameAsUrl
    )
    cy.get('.citation-name input[type="text"]').should(
      'have.value',
      citationName
    )
    cy.get('.citation-url input[type="text"]').should(
      'have.value',
      citationUrl
    )
  })
})
