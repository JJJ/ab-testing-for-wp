Cypress.Commands.add('login', () => {
  cy.request({
    url: '/wp-login.php',
    method: 'POST',
    form: true,
    body: {
      log: Cypress.env('WP_USER'),
      pwd: Cypress.env('WP_PASSWORD'),
      rememberme: 'forever',
      testcookie: 1,
    },
  });
});

Cypress.Commands.add('logout', () => {
  // clear all cookies
  cy.getCookies().then((cookies) => {
    cookies.forEach((cookie) => cy.clearCookie(cookie.name));
  });
});

Cypress.Commands.add('visitAdmin', (page = '') => {
  cy.visit(`/wp-admin/${page}`);
});

Cypress.Commands.add('addTestInEditor', () => {
  // open Gutenberg dialog
  cy.get('.edit-post-header-toolbar > :nth-child(1) > .editor-inserter > .components-button').click();

  // search for A/B Testing
  cy.get('.editor-inserter__search').type('A/B Test');

  // insert block
  cy.get('.editor-block-list-item-ab-testing-for-wp-ab-test-block-inserter').click();
});
