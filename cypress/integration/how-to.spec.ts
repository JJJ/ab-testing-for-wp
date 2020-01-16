describe('How to Use page', () => {
  before(() => {
    cy.cleanInstall();
  });

  it('Check if how to page loads', () => {
    cy.login();

    cy.visitAdmin();

    cy.contains('A/B Testing')
      .click();
    cy.contains('How to Use')
      .click();

    cy.contains('How to Use A/B Testing');
  });
});
