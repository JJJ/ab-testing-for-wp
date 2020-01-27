describe('Admin bar', () => {
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

  it('Shows current tests on page in admin bar and is able to change variants', () => {
    // create new post
    cy.visitAdmin('post-new.php?skipOnboarding=1');

    // add default test
    cy.addBlockInEditor('A/B Test', 'Test on page');

    // save post
    cy.savePost();

    // go to post
    cy.get('.post-publish-panel__postpublish-buttons > a.components-button')
      .click();

    // should contain test in admin bar
    cy.contains('A/B Tests (1)')
      .wait(200)
      .click();

    // open test variants
    cy.contains('Test on page');

    // pick variant B
    cy.get('button.ab-item')
      .eq(1)
      .click({ force: true });

    // check if B loads
    cy.contains('Button for Test Variant “B”');

    // pick variant A
    cy.get('button.ab-item')
      .eq(0)
      .click({ force: true });

    // check if A loads
    cy.contains('Button for Test Variant “A”');
  });

  it('Shows two tests on page in admin bar', () => {
    // create new post
    cy.visitAdmin('post-new.php?skipOnboarding=1');

    // add two default tests
    cy.addBlockInEditor('A/B Test', 'Test on page 1');
    cy.addBlockInEditor('A/B Test', 'Test on page 2');

    // save post
    cy.savePost();

    // go to post
    cy.get('.post-publish-panel__postpublish-buttons > a.components-button')
      .click();

    // should contain test in admin bar
    cy.contains('A/B Tests (2)')
      .wait(200)
      .click();

    // has both variants
    cy.contains('Test on page 1');
    cy.contains('Test on page 2');
  });
});
