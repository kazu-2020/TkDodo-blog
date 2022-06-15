describe('レコメンドデッキ削除', () => {
  it('レコメンドデッキを削除する', () => {
    const now = Cypress.env('NOW')

    cy.visit('/')
    cy.contains('デッキ').click()
    cy.contains('レコメンドデッキ一覧').click()

    cy.waitLoading()
    cy.wait(500)

    // すべてのデッキ
    cy.get('.v-select__slot').click()
    cy.get('.menuable__content__active').contains('全て').click()

    cy.waitLoading()

    cy.get('.deck-name').contains(now).click()

    cy.get('.v-navigation-drawer .delete_button:visible').click()

    cy.on('window:alert',(message)=>{
      expect(message).to.contains('削除したデータは復元できません。本当に削除しますか？');
    })
    cy.on('window:confirm', () => true)

    cy.wait(2000)
  })

  it('削除したレコメンドデッキが検索されないこと', () => {
    const now = Cypress.env('NOW')

    cy.visit('/')
    cy.contains('デッキ').click()
    cy.contains('レコメンドデッキ一覧').click()

    cy.waitLoading()
    cy.wait(500)

    // API公開中のデッキ
    cy.get('.v-input__slot[role=button]').click()
    cy.get('.menuable__content__active').contains('API公開中のみ').click()

    cy.waitLoading()

    // 対象のデッキが表示されていないこと
    cy.get('body').then((body) => {
      if (body[0].querySelector('.deck-name')) {
        cy.get('.deck-name').contains(now).should('have.lengthOf', 0)
      }
    })

    cy.get('.deck-search input[type=text]').type(`${now}{enter}`, { force: true })

    // 対象のデッキが表示されていないこと
    cy.get('body').then((body) => {
      if (body[0].querySelector('.deck-name')) {
        cy.get('.deck-name').contains(now).should('have.lengthOf', 0)
      }
    })

    cy.get('.deck-search button').click()

    // 対象のデッキが表示されていないこと
    cy.get('body').then((body) => {
      if (body[0].querySelector('.deck-name')) {
        cy.get('.deck-name').contains(now).should('have.lengthOf', 0)
      }
    })

    // API非公開のデッキ
    cy.get('.v-input__slot[role=button]').click()
    cy.get('.menuable__content__active').contains('API非公開のみ').click()

    cy.waitLoading()

    // 対象のデッキが表示されていないこと
    cy.get('body').then((body) => {
      if (body[0].querySelector('.deck-name')) {
        cy.get('.deck-name').contains(now).should('have.lengthOf', 0)
      }
    })

    cy.get('.deck-search input[type=text]').type(`${now}{enter}`, { force: true })

    // 対象のデッキが表示されていないこと
    cy.get('body').then((body) => {
      if (body[0].querySelector('.deck-name')) {
        cy.get('.deck-name').contains(now).should('have.lengthOf', 0)
      }
    })

    cy.get('.deck-search button').click()

    // 対象のデッキが表示されていないこと
    cy.get('body').then((body) => {
      if (body[0].querySelector('.deck-name')) {
        cy.get('.deck-name').contains(now).should('have.lengthOf', 0)
      }
    })

    // すべてのデッキ
    cy.get('.v-input__slot[role=button]').click()
    cy.get('.menuable__content__active').contains('全て').click()

    cy.waitLoading()

    // 対象のデッキが表示されていないこと
    cy.get('body').then((body) => {
      if (body[0].querySelector('.deck-name')) {
        cy.get('.deck-name').contains(now).should('have.lengthOf', 0)
      }
    })

    cy.get('.deck-search input[type=text]').type(`${now}{enter}`, { force: true })

    // 対象のデッキが表示されていないこと
    cy.get('body').then((body) => {
      if (body[0].querySelector('.deck-name')) {
        cy.get('.deck-name').contains(now).should('have.lengthOf', 0)
      }
    })

    cy.get('.deck-search button').click()

    // 対象のデッキが表示されていないこと
    cy.get('body').then((body) => {
      if (body[0].querySelector('.deck-name')) {
        cy.get('.deck-name').contains(now).should('have.lengthOf', 0)
      }
    })
  })
})
