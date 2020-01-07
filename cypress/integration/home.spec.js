function setupDatabase() {
  const user = Cypress.env('MYSQL_USER');
  const password = Cypress.env('MYSQL_PASSWORD');
  const database = Cypress.env('MYSQL_DATABASE');
  const port = Cypress.env('MYSQL_PORT');
  const host = Cypress.env('MYSQL_HOST');

  const mysqlBase = `mysql -u"${user}" --password="${password}" -h"${host}" -P"${port}"`;

  // cy.exec(`${mysqlBase} -e "DROP DATABASE IF EXISTS \`${database}\`;"`);
}

describe('The Home Page', function() {
  it('successfully loads', function() {
    cy.visit('/') // change URL to match your dev URL
  })
})
