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
  cy.exec('npm run e2e:wp-cli -- db reset --yes', { failOnNonZeroExit: false });
  cy.exec('npm run e2e:wp-install', { failOnNonZeroExit: false });
});

Cypress.Commands.add('activatePlugin', (name = 'ab-testing-for-wp', deactivate = false) => {
  cy.exec(`npm run e2e:wp-cli -- plugin ${deactivate ? 'de' : ''}activate ${name}`);
});
