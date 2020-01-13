describe('Plugin activation', () => {
  it('Successfully loads with plugin installed', () => {
    // check if activated successfully
    cy.exec('npm run e2e:wp-cli -- plugin is-active ab-testing-for-wp');

    // see if front page still works
    cy.visit('/');
  });

  it('Successfully loads without plugin installed', () => {
    // deactivate the plugin in wp-admin
    cy.deactivatePlugin();

    // front page should still work
    cy.visit('/');

    // activate the plugin in wp-admin
    cy.activatePlugin();
  });
});