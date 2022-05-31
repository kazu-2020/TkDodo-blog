describe('プレイリスト更新', () => {
  it('プレイリストを選択し、メタの更新をする', () => {
    const now = Cypress.env('NOW')

    cy.visit('/')
    cy.contains('プレイリスト').click()
    cy.contains('一覧').click({ force: true })

    cy.get('.v-select__slot').click()
    cy.get('.menuable__content__active').contains('全て').click()

    cy.waitLoading()

    cy.get('.playlist-name').contains(now).click()

    cy.get('.v-navigation-drawer .edit_button:visible').click()

    // 基本情報(NSeries)の編集
    cy.get('.series-step').click()

    cy.get('.playlist_name input[type="text"]').clear().type(`${now}プレイ2`)
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

    cy.waitLoading()

    cy.get('.playlist-name').contains(now).click()

    cy.waitLoading()

    // ドロワーの内容チェック
    const drawerContent = cy.get('.base-information')
    drawerContent.should('include.text', `${now}プレイ2`)
    drawerContent.should('include.text', `API公開中`)
    drawerContent.should('include.text', `summary`)
    drawerContent.should('include.text', `キャッチコピーはこちらに2`)
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
    cy.get('.menuable__content__active').contains('API非公開のみ').click()

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
