describe('編集ページへの導線', () => {
  before(() => {
    cy.createAnnouncement({ status: '緊急', contents: '緊急のお知らせです' });
  });

  beforeEach(() => {
    cy.visit('/');
  });

  it('お知らせ一覧からお知らせ編集ページへ遷移できること', () => {
    cy.get('[aria-label="Edit announcement"]').first().click();
    cy.location('pathname').should('match', /^\/announcements\/\d+\/edit$/);
  });

  it('編集フォームに初期値がセットされていること', () => {
    cy.get('[aria-label="Edit announcement"]').first().click();

    cy.get('#contents').should('have.value', '緊急のお知らせです');
    cy.get('[data-testid="announcement-edit-form"]').within(() => {
      cy.contains('緊急').should('exist');
    });
  });
});

describe('お知らせ更新', () => {
  const updateAnnouncement = () => {
    cy.visit('/');
    cy.get('[aria-label="Edit announcement"]').first().click();
    cy.get('[data-testid="announcement-edit-form"]').within(() => {
      cy.get('#status').type(`'お知らせ{enter}{enter}`, {
        force: true,
      });
      cy.get('#contents').clear();
      cy.get('#contents').type('お知らせを更新しました');
      cy.contains('保存する').click();
    });
  };

  context('正常系', () => {
    before(() => {
      cy.createAnnouncement({ status: '緊急', contents: '緊急のお知らせです' });
      updateAnnouncement();
    });

    beforeEach(() => {});

    it('「保存しました」トーストが表示されること', () => {
      cy.get('#toast-update-announcement-success').within(() => {
        cy.contains('保存しました。').should('exist');
      });
    });
  });

  context('異常系(サーバーエラー)', () => {
    before(() => {
      cy.intercept(
        {
          method: 'PATCH',
          url: 'announcements/*',
        },
        {
          statusCode: 500,
        }
      );
      updateAnnouncement();
    });

    it('「保存に失敗しました。」トーストが表示されること', () => {
      cy.get('#toast-update-announcement-error').within(() => {
        cy.contains('保存に失敗しました。').should('exist');
      });
    });
  });

  context.only('編集中のデータがある場合にページ遷移したとき', () => {
    before(() => {
      cy.createAnnouncement();
      cy.visit('/');
      cy.get('[aria-label="Edit announcement"]').first().click();
      cy.get('[data-testid="announcement-edit-form"]').within(() => {
        cy.get('#status').type(`'お知らせ{enter}{enter}`, {
          force: true,
        });
        cy.get('#contents').clear();
        cy.get('#contents').type('お知らせを更新しました');
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
