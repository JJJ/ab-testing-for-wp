// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('resetInstall', () => {
  cy.exec('npm run e2e:wp-cli -- db reset --yes');
  cy.exec('npm run e2e:wp-install');
});
