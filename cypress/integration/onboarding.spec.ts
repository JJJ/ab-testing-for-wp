describe('Onboarding', () => {
  beforeEach(() => {
    cy.cleanInstall();
    cy.login();
    cy.disableTooltips();
  });

  afterEach(() => {
    cy.logout();
  });

  function checkStep(text: string, gotoNext = true) {
    cy.contains(text);

    if (!gotoNext) return;

    // next step
    cy.get('.ab-testing-for-wp__Onboarding button.next')
      .click({ force: true, multiple: true });
  }

  it('Loads onboarding on adding A/B Test for the first time', () => {
    cy.visitAdmin('post-new.php');

    // add default test
    cy.addBlockInEditor('A/B Test');

    // Shows onboarding modal
    cy.contains('Welcome to A/B Testing for WordPress!');

    // start tour
    cy.get('.ButtonContainer > .is-button')
      .click();

    // check if step 1 loads
    checkStep('edit your test variants');

    // check if step 2 loads
    checkStep('Switch between editing variants');

    // check if step 3 loads
    checkStep('Use the cog toggle');

    // check if step 4 loads
    checkStep('configure the test in this sidebar');

    // check if step 5 loads
    checkStep('Adjust the distribution weight');

    // check if step 6 loads
    checkStep('Select the goal');

    // check if step 7 loads
    checkStep('the control version');

    // check if step 8 loads
    checkStep('enable and run the test');

    // Tour finished!
    cy.contains('That is it!');

    // Finish tour
    cy.get('.ButtonContainer > .is-button')
      .click();
  });

  it('Can cancel the tour and stays closed', () => {
    cy.visitAdmin('post-new.php');

    // add default test
    cy.addBlockInEditor('A/B Test');

    // cancel tour
    cy.get('.ButtonContainer > .is-link')
      .click();
  });

  it('Should not load onboarding once it has been dismissed', () => {
    cy.visitAdmin('post-new.php');

    // add default test
    cy.addBlockInEditor('A/B Test');

    // cancel tour
    cy.get('.ButtonContainer > .is-link')
      .click();

    // open add post page again
    cy.visitAdmin('post-new.php');

    // add default test
    cy.addBlockInEditor('A/B Test');

    // open add new test (will not happen if onbaording is opened)
    cy.get('.wp-block > .editor-inserter')
      .click();
  });
});
