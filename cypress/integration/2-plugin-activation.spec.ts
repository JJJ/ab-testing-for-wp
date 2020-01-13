describe('Plugin activation', () => {
  after(() => {
    cy.logout();
  });

  it('Successfully loads without plugin installed', () => {
    cy.visit('/');
  });

  it('Successfully loads with plugin installed', () => {
    cy.login();

    // go to plugins page
    cy.visitAdmin('plugins.php');

    // has plugin installed
    cy.contains('A/B Testing for WordPress');

    // activate plugin
    cy.get('[data-slug="ab-testing-for-wp"] > .plugin-title > .row-actions > .activate').click();

    // check if worked
    cy.contains('Plugin activated.');

    // see if front page still works
    cy.visit('/');
  });
});
