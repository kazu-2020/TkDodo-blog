before(() => {
  // APIモックを定義
  const apiUrl = Cypress.env('API_URL')
  cy.fixture('episodes/search.json').then((episodesSearchFixture) => {
    cy.intercept("GET",
      `${apiUrl}/episodes/search?word=&offset=0&order_by=score&order=desc&ignore_range=false&size=10`,
      episodesSearchFixture
    )
  })

  cy.intercept("GET", `${apiUrl}/episodes/bundle_items?episode_ids=123JXPM5ZQ`, {"tvepisode":1,"event":0,"howto":0,"faqpage":0})
  cy.intercept("GET", `${apiUrl}/episodes/bundle_items?episode_ids=123JXPM5ZQ%2CQZ1M9NX81N`, {"tvepisode":2,"event":0,"howto":0,"faqpage":0})
})

describe('プレイリスト新規作成', () => {
  it('プレイリストを新規作成し、メタの編集をする', () => {
    const now = Cypress.env('NOW')

    cy.visit('/')

    cy.wait(2000)

    cy.contains('プレイリスト').click()
    cy.contains('新規作成').click()

    // リスト(NItemList)の編集
    cy.get('.new_episode_list').click()

    // TODO: 保存時にバックグラウンドでAPIを叩くときにエラーが発生するため、回避策が見つかるまでコメントアウト
    // // エピソードの選択
    // cy.get('.episode-search input[type="text"]').clear().type('{enter}')
    //
    // // 検索結果の1件目を追加
    // cy.get('.result_row .add_button').first().click()
    // // 検索結果の2件目を追加
    // // 1件目追加の時点で、1件目はリストから除外されるため先頭が2件目となる
    // cy.get('.result_row .add_button').first().click()


    // 基本情報(NSeries)の編集
    cy.get('.series-step').click()

    const playlistName = `${now}プレイ`
    cy.get('.playlist_name input[type="text"]').type(playlistName)

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

    cy.get('[data-cy=logo-image-data]').trigger('mouseover')
    cy.get('.logo-edit-btn').click()



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

    cy.waitLoading()

    // TODO: 保存時にバックグラウンドでAPIを叩くときにエラーが発生するため、回避策が見つかるまでコメントアウト
    // // リスト(NItemList)の確認
    // cy.get('.list-step').click()
    // const listRows = cy.get('.list-item-container .v-data-table tbody tr')
    // listRows.should('have.lengthOf', 2)
    // listRows.eq(0).should('include.text', '「メルケル首相の16年とドイツの行方」')
    // listRows.eq(1).should('include.text', '「内田雄馬」')


    // 基本情報(NSeries)の確認
    cy.get('.series-step').click()

    cy.get('.playlist_name input[type="text"]').should(
      'have.value',
      playlistName
    )

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

  it('新規作成したプレイリストのドロワーの内容が正しいこと', () => {
    const now = Cypress.env('NOW')

    cy.visit('/')
    cy.contains('プレイリスト').click()
    cy.contains('一覧').click({ force: true })

    cy.get('.v-select__slot').click()
    cy.get('.menuable__content__active').contains('全て').click()

    cy.waitLoading()

    cy.get('.playlist-name').contains(now).click()

    cy.waitLoading()

    // ドロワーの内容チェック
    const drawerContent = cy.get('.base-information')
    drawerContent.should('include.text', `${now}プレイ`)
    drawerContent.should('include.text', `API非公開`)
    drawerContent.should('include.text', `summary`)
    drawerContent.should('include.text', `キャッチコピーはこちらに`)

    cy.get('.base-information .v-image__image').should('have.lengthOf', 3)

    // TODO: 保存時にバックグラウンドでAPIを叩くときにエラーが発生するため、回避策が見つかるまでコメントアウト
    // cy.get('.v-navigation-drawer__content .episode_list').eq(0)
    //   .should('include.text', `「メルケル首相の16年とドイツの行方」`)
    // cy.get('.v-navigation-drawer__content .episode_list').eq(1)
    //   .should('include.text', `「内田雄馬」`)
  })

  it('新規作成したプレイリストが検索できること', () => {
    const now = Cypress.env('NOW')

    cy.visit('/')
    cy.contains('プレイリスト').click()
    cy.contains('一覧').click({ force: true })

    cy.url().should('eq', Cypress.config().baseUrl + '/')

    cy.contains('記事モード').click()

    cy.get('.v-select__slot').click()
    cy.get('.menuable__content__active').contains('API公開中のみ').click()

    cy.waitLoading()

    // 対象のプレイリストが表示されていないこと
    cy.get('body').then((body) => {
      if (body[0].querySelector('.playlist-name')) {
        cy.get('.playlist-name').contains(now).should('have.lengthOf', 0)
      }
    })

    cy.get('.playlist-search input[type=text]').type(`${now}{enter}`, { force: true })

    // 対象のプレイリストが表示されていないこと
    cy.get('body').then((body) => {
      if (body[0].querySelector('.playlist-name')) {
        cy.get('.playlist-name').contains(now).should('have.lengthOf', 0)
      }
    })

    cy.get('.playlist-search button').click()

    // 対象のプレイリストが表示されていないこと
    cy.get('body').then((body) => {
      if (body[0].querySelector('.playlist-name')) {
        cy.get('.playlist-name').contains(now).should('have.lengthOf', 0)
      }
    })

    cy.get('.v-select__slot').click()
    cy.get('.menuable__content__active').contains('API非公開のみ').click()

    cy.waitLoading()

    // 対象のプレイリストが表示されていること
    cy.get('.playlist-name').contains(now).should('have.lengthOf', 1)

    cy.get('.playlist-search input[type=text]').type(`${now}{enter}`, { force: true })

    // 対象のプレイリストが表示されていること
    cy.get('.playlist-name').contains(now).should('have.lengthOf', 1)

    cy.get('.playlist-search button').click()

    // 対象のプレイリストが表示されていること
    cy.get('.playlist-name').contains(now).should('have.lengthOf', 1)

    cy.get('.v-select__slot').click()
    cy.get('.menuable__content__active').contains('全て').click()

    cy.waitLoading()

    // 対象のプレイリストが表示されていること
    cy.get('.playlist-name').contains(now).should('have.lengthOf', 1)

    cy.get('.playlist-search input[type=text]').type(`${now}{enter}`, { force: true })

    // 対象のプレイリストが表示されていること
    cy.get('.playlist-name').contains(now).should('have.lengthOf', 1)

    cy.get('.playlist-search button').click()

    // 対象のプレイリストが表示されていること
    cy.get('.playlist-name').contains(now).should('have.lengthOf', 1)
  })
})
