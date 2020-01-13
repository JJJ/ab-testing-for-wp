function execWPCLI(command: string, options = { timeout: 60000 }): void {
  cy.exec(`npm run e2e:wp-cli -- ${command}`, options).then((result) => {
    if (result.code !== 0) {
      console.log(result);
    }

    return result;
  });
}

function activatePlugin(name = 'ab-testing-for-wp', deactivate = false): void {
  execWPCLI(`plugin ${deactivate ? 'de' : ''}activate ${name}`);
}

Cypress.Commands.add('activatePlugin', (name = 'ab-testing-for-wp') => {
  activatePlugin(name);
});

Cypress.Commands.add('deactivatePlugin', (name = 'ab-testing-for-wp') => {
  activatePlugin(name, true);
});

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

Cypress.Commands.add('gotoAdmin', () => {
  cy.visit('/wp-admin/');
});
