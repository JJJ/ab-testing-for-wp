describe('Outbound link tracking', () => {
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

  const SITE = 'http://localhost:9000/?p=2';

  it('Can setup test for outbound tracking', () => {
    cy.visitAdmin('post-new.php?skipOnboarding=1');

    // add default test
    cy.addBlockInEditor('A/B Test');

    // open test options
    cy.get('.components-button-group > :nth-child(3)')
      .click();

    // change goal type
    cy.get('#inspector-select-control-2')
      .scrollIntoView()
      .select('Outbound link', { force: true });

    // Enter an URL
    cy.get('#inspector-text-control-3')
      .type('https://abtestingforwp.com');

    // save post
    cy.savePost();

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
      .should('contain', 'Outbound link');
    cy.get('#inspector-text-control-1')
      .invoke('val')
      .should('contain', 'https://abtestingforwp.com');
  });

  it('Will track visits to outbound links', () => {
    cy.visitAdmin('post-new.php?skipOnboarding=1');

    // add default test
    cy.addBlockInEditor('A/B Test');

    // open test options
    cy.get('.components-button-group > :nth-child(3)')
      .click();

    // change goal type
    cy.get('#inspector-select-control-2')
      .scrollIntoView()
      .select('Outbound link', { force: true });

    // Enter an URL
    cy.get('#inspector-text-control-3')
      .type(SITE);

    // start test
    cy.get('#inspector-toggle-control-2')
      .scrollIntoView()
      .click({ force: true });

    // edit button A
    cy.get('#wp-block-button__inline-link-0')
      .type(SITE, { force: true });

    // edit button B
    cy.get('.components-button-group > :nth-child(2)')
      .click();
    cy.get('#wp-block-button__inline-link-1')
      .type(SITE, { force: true });

    // save post
    cy.savePost();

    // go to post
    cy.contains('View Post')
      .click();

    // click outbound link
    cy.get('.wp-block-button__link')
      .click({ force: true });

    // check results
    cy.visitAdmin();

    // go to overview
    cy.contains('A/B Testing')
      .click();

    // should contain a winner variant
    cy.get('.ABTestWinning > :nth-child(3)')
      .last()
      .should('contain', '1');

    // shows outbound link conversion
    cy.contains(SITE);
  });

  it('Will track form submits to outbound links', () => {
    cy.visitAdmin('post-new.php?skipOnboarding=1');

    // add default test
    cy.addBlockInEditor('A/B Test');

    // open test options
    cy.get('.components-button-group > :nth-child(3)')
      .click();

    // change goal type
    cy.get('#inspector-select-control-2')
      .scrollIntoView()
      .select('Outbound link', { force: true });

    // Enter an URL
    cy.get('#inspector-text-control-3')
      .type(SITE);

    // start test
    cy.get('#inspector-toggle-control-2')
      .scrollIntoView()
      .click({ force: true });

    // add HTML block
    cy.addBlockInEditor('HTML');

    // enter HTML
    cy.get('.editor-plain-text')
      .type(`<form action="${SITE}" method="get"><button type="submit">GO!</button></form>`);

    // save post
    cy.savePost();

    // go to post
    cy.contains('View Post')
      .click();

    // submit form
    cy.get('form > button')
      .click();

    // check results
    cy.visitAdmin();

    // go to overview
    cy.contains('A/B Testing')
      .click();

    // should contain a winner variant
    cy.get('.ABTestWinning > :nth-child(3)')
      .last()
      .should('contain', '1');
  });
});
