describe('ユーザー管理ページへの導線', () => {
  it('ヘッダーメニューからユーザー管理ページへ遷移できること', () => {
    cy.attachAccessTokenRequests().then(() => {
      cy.visit('/')
    })

    cy.get('header').within(() => {
      cy.contains('管理').click()
      cy.contains('ユーザー管理').click()
    })

    cy.location('pathname').should('eq', '/users')
  })
})

// api-eh/db/fixtures/users.rb のテストデータを元にしたテストとなっています
describe('キーワード検索によるユーザー絞り込み', () => {
  it('名前、メールに部分一致したユーザーが表示されること', () => {
    cy.attachAccessTokenRequests().then(() => {
      cy.visit('/users')
    })

    cy.findByPlaceholderText(/名前またはメールアドレスで検索/).type(
      '田中{enter}'
    )
    cy.contains(/田中/)

    cy.findByPlaceholderText(/名前またはメールアドレスで検索/)
      .clear()
      .type('太郎{enter}')
    cy.contains(/太郎/)

    cy.findByPlaceholderText(/名前またはメールアドレスで検索/)
      .clear()
      .type('tanaka{enter}')
    cy.contains(/tanaka/)

    cy.findByPlaceholderText(/名前またはメールアドレスで検索/).clear()
    cy.contains(/tanaka/)
  })
})

/* api-eh/db/fixtures/users_roles.rbのテストデータを元にしたテストとなっています
  - address: tanaka@example.com,  systemRole: [userAdmin]
  - address: sato@example.com,    systemRole: [playlistAdmin, deckAdmin]
  - address: ichiro@example.com,  systemRole: [userAdmin, playlistAdmin, deckAdmin]
  - address: nanashi@example.com, systemRole: [readerAdmin]
*/
describe('システムロールによるユーザー絞り込み', () => {
  it('指定したシステムロールを持つユーザーのみ表示されること', () => {
    cy.attachAccessTokenRequests().then(() => {
      cy.visit('/users')
    })

    cy.get('select#system-role').select('ユーザー管理者')
    cy.contains('tanaka@example.com')
    cy.contains('ichiro@example.com')
    cy.contains('sato@example.com').should('not.exist')
    cy.contains('nanashi@example.com').should('not.exist')

    cy.get('select#system-role').select('プレイリスト管理者')
    cy.contains('tanaka@example.com').should('not.exist')
    cy.contains('ichiro@example.com')
    cy.contains('sato@example.com')
    cy.contains('nanashi@example.com').should('not.exist')

    cy.get('select#system-role').select('デッキ管理者')
    cy.contains('tanaka@example.com').should('not.exist')
    cy.contains('ichiro@example.com')
    cy.contains('sato@example.com')
    cy.contains('nanashi@example.com').should('not.exist')

    cy.get('select#system-role').select('閲覧者')
    cy.contains('tanaka@example.com').should('not.exist')
    cy.contains('ichiro@example.com').should('not.exist')
    cy.contains('sato@example.com').should('not.exist')
    cy.contains('nanashi@example.com')

    cy.get('select#system-role').select('全てのロール')
    cy.contains('tanaka@example.com')
    cy.contains('ichiro@example.com')
    cy.contains('sato@example.com')
    cy.contains('nanashi@example.com')
  })
})
