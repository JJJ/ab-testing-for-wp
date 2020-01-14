describe('A/B Testing', () => {
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
    cy.contains('Button for Test Variant "A"').should('be.visible');

    cy.get('.components-button-group > button').eq(1).click();

    cy.contains('Button for Test Variant "B"').should('be.visible');
  });

  it('Can add switch between variants', () => {
    cy.visitAdmin('post-new.php?skipOnboarding=1');

    // add default test
    cy.addTestInEditor();

    // test if succeeded
    cy.get('.components-button-group > button').eq(1).click();
    cy.contains('Button for Test Variant "B"').should('be.visible');
  });

  it('Can save test and displays control on frontend', () => {
    // create new post
    cy.visitAdmin('post-new.php?skipOnboarding=1');

    // add default test
    cy.addTestInEditor();

    // save post
    cy.get('.editor-post-publish-panel__toggle').click();
    cy.get('.editor-post-publish-panel__header-publish-button > .components-button').click();

    // go to post
    cy.get('.post-publish-panel__postpublish-buttons > a.components-button').click();

    // check if it renders button
    cy.get('.wp-block-button__link').contains('Button for Test Variant “A”');
  });

  it('Can save test and displays variant "B" as control on frontend', () => {
    cy.visitAdmin('post-new.php?skipOnboarding=1');

    // add default test
    cy.addTestInEditor();

    // open test options
    cy.get('.components-button-group > :nth-child(3)').click();

    // change variant to B
    cy.get('#inspector-select-control-1').select('B');

    // save post
    cy.get('.editor-post-publish-panel__toggle').click();
    cy.get('.editor-post-publish-panel__header-publish-button > .components-button').click();

    // go to post
    cy.get('.post-publish-panel__postpublish-buttons > a.components-button').click();

    // check if it renders button
    cy.get('.wp-block-button__link').contains('Button for Test Variant “B”');
  });
});
