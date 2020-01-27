describe('Overview of created tests', () => {
  before(() => {
    cy.cleanInstall();
  });

  beforeEach(() => {
    cy.login();
    cy.disableTooltips();
  });

  afterEach(() => {
    cy.logout();
  });

  it.only('Lists inline tests created in posts / pages', () => {
    // create new post
    cy.visitAdmin('post-new.php?skipOnboarding=1');

    // add default test
    cy.addBlockInEditor('A/B Test', 'Inline A/B Test');

    // Change target post to "Hello World!"
    cy.get('#inspector-select-control-3')
      .select('Hello world!');

    // save post
    cy.savePost();

    // open A/B Testing menu
    cy.contains('A/B Testing')
      .click();

    // shows test in list
    cy.contains('Inline A/B Test');

    // shows test goal
    cy.contains('Hello world!');
  });

  it('Lists stand alone tests', () => {
    cy.visitAdmin('post-new.php?post_type=abt4wp-test&skipOnboarding=1');

    // wait for test to get focus
    cy.focusBlock();

    // fill in title
    cy.get('#post-title-0')
      .type('Stand alone test', { force: true });

    // save test
    cy.savePost();

    // open A/B Testing menu
    cy.contains('A/B Testing')
      .click();

    // shows test in list
    cy.contains('Stand alone test');
  });
});
