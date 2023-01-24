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
