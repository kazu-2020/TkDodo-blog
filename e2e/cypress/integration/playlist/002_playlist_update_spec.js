describe('プレイリスト更新', () => {
  it('プレイリストを選択し、メタの更新をする', () => {
    const now = Cypress.env('NOW')

    cy.visit('/')
    cy.contains('プレイリスト').click()
    cy.contains('一覧').click({ force: true })

    cy.get('.v-select__slot').click()
    cy.get('.menuable__content__active').contains('全て').click()

    cy.get('.playlist-name').contains(now).click()

    cy.get('.v-navigation-drawer .edit_button:visible').click()

    cy.get('.series-step').click()

    const playlistName = `${now}プレイ`
    cy.get('.playlist_name').type(playlistName)

    // 基本情報(NSeries)の編集
    cy.get('.series-step').click()

    cy.get('.playlist_name').type(`${now}プレイ2`)
    cy.get('label').contains('公開する').click()
    cy.get('.detailed_catch textarea').clear().type(`キャッチコピーはこちらに2`)

    cy.contains('保存する').click({ force: true })
    cy.wait(2000)
  })


  it('更新したプレイリストのドロワーの内容が正しいこと', () => {
    const now = Cypress.env('NOW')

    cy.visit('/')
    cy.contains('プレイリスト').click()
    cy.contains('一覧').click({ force: true })

    cy.get('.v-select__slot').click()
    cy.get('.menuable__content__active').contains('全て').click()

    cy.get('.playlist-name').contains(now).click()

    // ドロワーの内容チェック
    const drawerContent = cy.get('.v-navigation-drawer__content')
    drawerContent.should('have.value', `${now}プレイ2`)
    drawerContent.should('have.value', `API公開中`)
    drawerContent.should('have.value', `summary`)
    drawerContent.get('v-image__image').should('have.lengthOf', 3)
    drawerContent.should('have.value', `キャッチコピーはこちらに2`)
  })

  it('更新したプレイリストが検索できること', () => {
    const now = Cypress.env('NOW')

    cy.visit('/')
    cy.contains('プレイリスト').click()
    cy.contains('一覧').click({ force: true })

    cy.url().should('eq', Cypress.config().baseUrl + '/')

    cy.contains('記事モード').click()

    cy.get('.v-select__slot').click()
    cy.get('.menuable__content__active').contains('API公開中のみ').click()

    // 対象のプレイリストが表示されていること
    cy.get('.playlist-name').contains(now).should('have.lengthOf', 1)

    cy.get('.playlist-search input[type=text]').type(`${now}{enter}`, { force: true })

    // 対象のプレイリストが表示されていること
    cy.get('.playlist-name').contains(now).should('have.lengthOf', 1)

    cy.get('.playlist-search button').click()

    // 対象のプレイリストが表示されていること
    cy.get('.playlist-name').contains(now).should('have.lengthOf', 1)

    cy.get('.v-select__slot').click()
    cy.get('.menuable__content__active').contains('API非公開のみ').click()

    // 対象のプレイリストが表示されていないこと
    cy.get('.playlist-name').contains(now).should('have.lengthOf', 0)

    cy.get('.playlist-search input[type=text]').type(`${now}{enter}`, { force: true })

    // 対象のプレイリストが表示されていないこと
    cy.get('.playlist-name').contains(now).should('have.lengthOf', 0)

    cy.get('.playlist-search button').click()

    // 対象のプレイリストが表示されていないこと
    cy.get('.playlist-name').contains(now).should('have.lengthOf', 0)

    cy.get('.v-select__slot').click()
    cy.get('.menuable__content__active').contains('全て').click()

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