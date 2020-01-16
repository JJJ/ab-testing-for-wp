describe('A/B Testing', () => {
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

  it('Can add a test in Gutenberg', () => {
    cy.visitAdmin('post-new.php?skipOnboarding=1');

    // add default test
    cy.addTestInEditor();

    // test if succeeded
    cy.contains('Button for Test Variant "A"')
      .should('be.visible');

    cy.get('.components-button-group > button')
      .eq(1)
      .click();

    cy.contains('Button for Test Variant "B"')
      .should('be.visible');
  });

  it('Can add switch between variants', () => {
    cy.visitAdmin('post-new.php?skipOnboarding=1');

    // add default test
    cy.addTestInEditor();

    // test if succeeded
    cy.get('.components-button-group > button')
      .eq(1)
      .click();
    cy.contains('Button for Test Variant "B"')
      .should('be.visible');
  });

  it('Can save test and displays control on frontend', () => {
    // create new post
    cy.visitAdmin('post-new.php?skipOnboarding=1');

    // add default test
    cy.addTestInEditor();

    // save post
    cy.get('.editor-post-publish-panel__toggle')
      .click();
    cy.get('.editor-post-publish-panel__header-publish-button > .components-button')
      .click();

    // go to post
    cy.get('.post-publish-panel__postpublish-buttons > a.components-button')
      .click();

    // check if it renders button
    cy.get('.wp-block-button__link')
      .contains('Button for Test Variant “A”');
  });

  it('Can save test and displays variant "B" as control on frontend', () => {
    cy.visitAdmin('post-new.php?skipOnboarding=1');

    // add default test
    cy.addTestInEditor();

    // open test options
    cy.get('.components-button-group > :nth-child(3)')
      .click();

    // change variant to B
    cy.get('#inspector-select-control-1')
      .scrollIntoView()
      .select('B');

    // save post
    cy.get('.editor-post-publish-panel__toggle')
      .click();
    cy.get('.editor-post-publish-panel__header-publish-button > .components-button')
      .click();

    // go to post
    cy.get('.post-publish-panel__postpublish-buttons > a.components-button')
      .click();

    // check if it renders button
    cy.get('.wp-block-button__link')
      .contains('Button for Test Variant “B”');
  });

  it('Can change distribution of variants', () => {
    cy.visitAdmin('post-new.php?skipOnboarding=1');

    // add default test
    cy.addTestInEditor();

    // open test options
    cy.get('.components-button-group > :nth-child(3)')
      .click();

    // change range input
    cy.changeRange('#inspector-range-control-2', 75);

    // check if values updated correctly
    cy.get(':nth-child(2) > .components-base-control__field > .components-range-control__number')
      .should('have.value', '75');
    cy.get(':nth-child(3) > .components-base-control__field > .components-range-control__number')
      .should('have.value', '25');

    // save post
    cy.get('.editor-post-publish-panel__toggle')
      .click();
    cy.get('.editor-post-publish-panel__header-publish-button > .components-button')
      .click();

    // reload and skip onboarding
    cy.location()
      .then(({ pathname, search }) => {
        cy.visit(`${pathname}${search}&skipOnboarding=1`);
      });

    // open test options
    cy.get('.components-button-group > :nth-child(3)')
      .click();

    // check if values saved correctly
    cy.get(':nth-child(2) > .components-base-control__field > .components-range-control__number')
      .should('have.value', '75');
    cy.get(':nth-child(3) > .components-base-control__field > .components-range-control__number')
      .should('have.value', '25');
  });

  it('Can change set a goal for the test', () => {
    cy.visitAdmin('post-new.php?skipOnboarding=1');

    // add default test
    cy.addTestInEditor();

    // open test options
    cy.get('.components-button-group > :nth-child(3)')
      .click();

    // change goal type
    cy.get('#inspector-select-control-2')
      .scrollIntoView()
      .select('Pages');

    // change goal page
    cy.get('#inspector-select-control-3')
      .scrollIntoView()
      .select('Sample Page');

    // save post
    cy.get('.editor-post-publish-panel__toggle')
      .click();
    cy.get('.editor-post-publish-panel__header-publish-button > .components-button')
      .click();

    // reload and skip onboarding
    cy.location()
      .then(({ pathname, search }) => {
        cy.visit(`${pathname}${search}&skipOnboarding=1`);
      });

    // open test options
    cy.get('.components-button-group > :nth-child(3)')
      .click();

    // check saved values
    cy.get('#inspector-select-control-1')
      .scrollIntoView()
      .should('contain', 'Pages');
    cy.get('#inspector-select-control-2')
      .should('contain', 'Sample Page');
  });

  it('Can start a test for tracking', () => {
    cy.visitAdmin('post-new.php?skipOnboarding=1');

    // add default test
    cy.addTestInEditor();

    // open test options
    cy.get('.components-button-group > :nth-child(3)')
      .click();

    // start test
    cy.get('#inspector-toggle-control-1')
      .click();

    // gets declare winner tab
    cy.contains('Results so far');

    // save post
    cy.get('.editor-post-publish-panel__toggle')
      .click();
    cy.get('.editor-post-publish-panel__header-publish-button > .components-button')
      .click();

    // reload and skip onboarding
    cy.location()
      .then(({ pathname, search }) => {
        cy.visit(`${pathname}${search}&skipOnboarding=1`);
      });

    // open test options
    cy.get('.components-button-group > :nth-child(3)')
      .click();

    // gets declare winner tab
    cy.contains('Results so far');
  });
});
