describe('Plugin activation', () => {
  before(() => {
    cy.wipeInstall();
    cy.installWordPress();
  });

  it('Successfully loads without plugin installed', () => {
    cy.visit('/');
  });

  it('Successfully loads with plugin installed', () => {
    cy.activatePlugin();

    // see if front page still works
    cy.visit('/');
  });
});
