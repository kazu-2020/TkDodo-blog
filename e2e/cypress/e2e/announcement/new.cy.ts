describe('新規作成ページへの導線', () => {
  it('お知らせ一覧から新規作成ページへ遷移できること', () => {
    cy.visit('/');
    cy.get('[data-testid="announcement-list"]').within(() => {
      cy.contains('新規お知らせ登録').click();
    });

    cy.location('pathname').should('eq', '/announcements/new');
  });
});

describe('お知らせ新規作成', () => {
  context('正常系', () => {
    before(() => {
      cy.createAnnouncement();
    });

    it('お知らせ一覧ページへ遷移すること', () => {
      cy.location('pathname').should('eq', '/announcements');
    });

    it('正常にお知らせが作成されること', () => {
      cy.get('[data-testid="announcement-list"]').within(() => {
        cy.get('[data-testid="announcement-list-item"]')
          .first()
          .within(() => {
            cy.get('[data-testid="announcement-badge"]').should(
              'to.have.text',
              '機能改善'
            );

            cy.contains('機能改善のお知らせです').should('exist');
          });
      });
    });

    it('「作成しました。」トーストが表示されること', () => {
      cy.contains('作成しました。').should('exist');
    });
  });

  context('異常系(サーバーエラー)', () => {
    before(() => {
      cy.intercept(
        {
          method: 'POST',
          url: 'announcements',
        },
        {
          statusCode: 500,
        }
      );
      cy.createAnnouncement();
    });

    it('「新規作成に失敗しました。」トーストが表示されること', () => {
      cy.contains('新規作成に失敗しました。').should('exist');
    });
  });

  context('編集中のデータがある場合にページ遷移したとき', () => {
    before(() => {
      cy.visit('/announcements/new');
      cy.get('[data-testid="announcement-new-form"]').within(() => {
        cy.get('#status').type('機能改善{enter}{enter}', { force: true });
        cy.get('#contents').type('機能改善のお知らせです');
      });
    });

    it('離脱アラートが表示されこと', () => {
      cy.on('window:confirm', (confirmText) => {
        expect(confirmText).to.eq(
          '編集中のデータがあります。ページを離れますか？'
        );
      });

      cy.contains('ホーム').click();
    });
  });
});
