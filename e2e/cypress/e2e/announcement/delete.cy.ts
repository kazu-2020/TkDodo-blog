describe('お知らせ削除', () => {
  const deleteAnnouncement = () => {
    cy.visit('/announcements');
    cy.get('[data-testid^="announcement-list-item-"]')
      .first()
      .as('targetAnnouncement');
    cy.get('@targetAnnouncement').within(() => {
      cy.get('[aria-label="Delete announcement"]').click();
    });
    cy.contains('削除する').click();
  };

  context('正常系', () => {
    before(() => {
      cy.createAnnouncement();
      deleteAnnouncement();
    });

    it('正常にお知らせが削除されること', () => {
      // お知らせリストから消えているか
      cy.get('[data-testid="announcement-list"]').within(() => {
        cy.get(this.targetAnnouncement).should('not.exist');
      });

      // トースト確認
      cy.get('[id^=toast-]').within(() => {
        cy.contains('削除しました。').should('exist');
      });
    });
  });

  context('異常系(サーバーエラー)', () => {
    before(() => {
      cy.intercept(
        {
          method: 'DELETE',
          url: '/announcements/*',
        },
        {
          statusCode: 500,
        }
      );
      cy.createAnnouncement();
      deleteAnnouncement();
    });

    it('「削除に失敗しました。」トーストが表示されること', () => {
      cy.get('[id^=toast-]').within(() => {
        cy.contains('削除に失敗しました。').should('exist');
      });
    });
  });
});
