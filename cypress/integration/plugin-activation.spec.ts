describe('Plugin activation', () => {
  before(() => {
    cy.resetInstall();
  });

  it('Successfully loads without plugin installed', () => {
    cy.visit('/');
  });

  it('Successfully loads with plugin installed', () => {
    // activate the plugin in wp-admin
    cy.activatePlugin();

    // check if activated successfully
    cy.exec('npm run e2e:wp-cli -- plugin list')
      .its('stdout')
      .should('contain', 'ab-testing-for-wp');

    // see if front page still works
    cy.visit('/');
  });
});
