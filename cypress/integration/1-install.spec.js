describe('WordPress installation', () => {
  it('Should install WordPress', () => {
    // go to install page
    cy.visitAdmin('install.php');

    // select language
    cy.get('input[type=submit]').click();

    // fill out form
    cy.get('#weblog_title').type('A/B Testing for WordPress E2E tests');
    cy.get('#user_login').type(Cypress.env('WP_USER'));
    cy.get('#pass1').clear({ force: true }).type(Cypress.env('WP_PASSWORD'), { force: true });
    cy.get('#admin_email').type('e2e@abtestingforwp.com');
    cy.get('#submit').click();
  });
});
