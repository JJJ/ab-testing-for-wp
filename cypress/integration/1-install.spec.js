describe('WordPress installation', () => {
  it('Should install WordPress', () => {
    cy.visit('/');

    // select language
    cy.get('#language-continue').click();

    // fill out form
    cy.get('#weblog_title').type('A/B Testing for WordPress E2E tests');
    cy.get('#user_login').type(Cypress.env('WP_USER'));
    cy.get('#pass1-text').clear().type(Cypress.env('WP_PASSWORD'));
    cy.get('#admin_email').type('e2e@abtestingforwp.com');
    cy.get('#submit').click();
  });
});
