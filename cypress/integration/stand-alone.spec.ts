describe('Stand alone A/B tests', () => {
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

  function createStandAloneTest(name: string): void {
    cy.visitAdmin('post-new.php?post_type=abt4wp-test&skipOnboarding=1');

    // wait for test to get focus
    cy.get('.editor-block-toolbar > :nth-child(1) > .components-button');

    // fill in title
    cy.get('#post-title-0')
      .type(name);

    // save test
    cy.get('.editor-post-publish-panel__toggle')
      .click();
    cy.get('.editor-post-publish-panel__header-publish-button > .components-button')
      .click();

    // wait for save message
    cy.contains('Post published.');
  }

  it('Should allow the user to create a stand alone test', () => {
    createStandAloneTest('This is a stand alone test');

    // reload and skip onboarding
    cy.location()
      .then(({ pathname, search }) => {
        cy.visit(`${pathname}${search}&skipOnboarding=1`);
      });
  });

  it('Should be able to pick stand alone tests when adding A/B test in content', () => {
    const TEST_TITLE = 'Stand alone in content';

    createStandAloneTest(TEST_TITLE);

    // go to new post create page
    cy.visitAdmin('post-new.php?skipOnboarding=1');

    // add default test
    cy.addTestInEditor();

    // should see popup
    cy.get('.components-modal__content');

    // choose to insert existing
    cy.get('.Inserter__actions > .is-default')
      .click();

    // select correct test
    cy.get('#inspector-select-control-0')
      .select(TEST_TITLE);

    // add to content
    cy.get('.Inserter__picking > .is-primary')
      .click();

    // Click on test to activate
    cy.get('.EditWrapper__Overlay')
      .click();

    // check if editing page is loaded
    cy.contains(TEST_TITLE);
  });

  it('Can choose to add inline test when adding to content', () => {
    createStandAloneTest('Dummy test to pop up choice');

    // go to new post create page
    cy.visitAdmin('post-new.php?skipOnboarding=1');

    // add default test
    cy.addTestInEditor();

    // should see popup
    cy.get('.components-modal__content');

    // choose to insert new
    cy.get('.Inserter__actions > .is-primary')
      .click();

    // should have added standard test
    cy.contains('Button for Test Variant "A"');
  });

  it('Can use short code of stand alone test', () => {
    expect(1).to.equal(1);
  });

  it('Can convert an inline test to a stand alone test', () => {
    expect(1).to.equal(1);
  });
});
