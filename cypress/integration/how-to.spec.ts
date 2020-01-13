describe('How to page', () => {
  beforeEach(() => {
    cy.login();
  });

  afterEach(() => {
    cy.logout();
  });

  it('Check if how to page loads', () => {
    cy.gotoAdmin();

    cy.contains('A/B Testing').click();
    cy.contains('How to Use').click();

    cy.contains('How to Use A/B Testing');
  });
});
