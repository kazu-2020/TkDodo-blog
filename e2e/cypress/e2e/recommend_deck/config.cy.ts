describe('レコメンドデッキ管理設定', () => {
  before(() => {
    cy.createRecommendDeck();
  });

  it('管理メモが更新できること', () => {
    cy.visit('/');
    cy.contains('デッキ').click();
    cy.contains('レコメンドデッキ一覧').click();

    cy.get('[data-testid="api-status-select"]').select('全て', { force: true });
    cy.get('[data-testid="recommend-deck-list-item"]')
      .first()
      .click({ force: true });
    cy.contains('管理設定').click({ force: true });

    cy.get('#adminMemo').clear().type('管理メモメモ');

    cy.contains('保存する').click({ force: true });
    cy.contains('保存しました', { timeout: 10000 });

    // 登録内容の確認
    cy.visit('/');
    cy.contains('デッキ').click();
    cy.contains('レコメンドデッキ一覧').click();

    cy.get('[data-testid="api-status-select"]').select('全て', { force: true });

    cy.contains('管理メモメモ');
  });
});
