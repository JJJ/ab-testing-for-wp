describe('Test results and tracking goals', () => {
  before(() => {
    cy.cleanInstall();
  });

  beforeEach(() => {
    cy.login();
    cy.disableTooltips();

    cy.visitAdmin('post-new.php?skipOnboarding=1');

    // change the title
    cy.get('#post-title-0')
      .type('Post with A/B Test');

    // add default test
    cy.addBlockInEditor('A/B Test', 'Test results tracking test');

    // change goal post
    cy.get('#inspector-select-control-3')
      .scrollIntoView()
      .select('Hello world!');

    // start test
    cy.get('#inspector-toggle-control-2')
      .click({ force: true });

    // change button
    cy.get('.wp-block-button > .editor-rich-text > .rich-text')
      .eq(0)
      .clear({ force: true })
      .type('Go to Hello World (A)', { force: true });

    // change link to /?p=1
    cy.get('#wp-block-button__inline-link-0')
      .type('/?p=1', { force: true });

    // go to variant B
    cy.get('.components-button-group > :nth-child(2)')
      .click();

    cy.get('.wp-block-button > .editor-rich-text > .rich-text')
      .eq(1)
      .clear({ force: true })
      .type('Go to Hello World (B)', { force: true });

    // change link to /?p=1
    cy.get('#wp-block-button__inline-link-1')
      .type('/?p=1', { force: true });
  });

  afterEach(() => {
    // logout
    cy.logout();
  });

  it('Tracks goals and participants', () => {
    // save post
    cy.savePost();

    // logout
    cy.logout();

    // go to created page
    cy.get('.post-publish-panel__postpublish-buttons > a.components-button')
      .then(($el) => {
        const pageLink = $el.attr('href');

        for (let i = 0; i < 10; i += 1) {
          // go to page
          cy.visit(pageLink || '')
            .wait(100);

          if (i % 2 === 0) {
            // visit goal 1/2 of the time
            cy.contains('Go to Hello World')
              .click({ force: true })
              .wait(400);
          }

          // clear visitor
          cy.wipeABTestingCookies();
        }
      });

    // go back to admin
    cy.login();

    cy.visitAdmin();

    // go to overview
    cy.contains('A/B Testing')
      .click();

    // has 10 participants
    cy.get(':nth-child(2) > :nth-child(1) > .num')
      .should('contain', 10);

    // see if conversion rate is not 0% on both
    cy.get('.variations > tbody .column-primary')
      .then(($elements) => {
        const AHasTests = $elements[0].innerText.indexOf('0%') !== 0;
        const BHasTests = $elements[1].innerText.indexOf('0%') !== 0;

        expect(AHasTests || BHasTests).to.equal(true);
      });

    // go to post edit page
    cy.contains('Post with A/B Test')
      .click();

    // has winner and loser scores
    cy.get('tr:nth-child(3) > .TestResultValue')
      .then(($elements) => {
        const conversionsA = $elements[0].innerText.indexOf('0') !== 0;
        const conversionsB = $elements[1].innerText.indexOf('0') !== 0;

        expect(conversionsA || conversionsB).to.equal(true);
      });
  });

  it('Remembers which test you partake in', () => {
    // save post
    cy.savePost();

    // logout
    cy.logout();

    // go to created page
    cy.get('.post-publish-panel__postpublish-buttons > a.components-button')
      .then(($el) => {
        const pageLink = $el.attr('href');

        for (let i = 0; i < 10; i += 1) {
          // go to page
          cy.visit(pageLink || '')
            .wait(100);

          if (i === 0) {
            // visit goal the first time
            cy.contains('Go to Hello World')
              .click()
              .wait(100);
          }
        }
      });

    // go back to admin
    cy.login();

    cy.visitAdmin();

    // go to overview
    cy.contains('A/B Testing')
      .click();

    // has 1 participants
    cy.get(':nth-child(2) > :nth-child(1) > .num')
      .should('contain', 1);

    // winner has 1 participant
    cy.get('.ABTestWinning > :nth-child(3)')
      .contains('1');

    // loser has none
    cy.get('.ABTestLosing > :nth-child(3)')
      .contains('0');
  });

  it('Converts participant of variant when force by condition', () => {
    // open block settings
    cy.get('.components-button-group > :nth-child(3)')
      .click();

    // open conditions form for A
    cy.get('.VariantSettings > :nth-child(4) > .components-button')
      .click();

    cy.get('.Conditionals__New .components-text-control__input')
      .eq(0)
      .clear()
      .type('e2e-test');
    cy.get('.Conditionals__New .components-text-control__input')
      .eq(1)
      .clear()
      .type('test-value');

    // save condition
    cy.get('.Conditionals__Buttons > .is-primary')
      .click();

    // open condition form for B
    cy.get(':nth-child(6) > .components-button')
      .scrollIntoView()
      .click();

    cy.get('.Conditionals__New .components-text-control__input')
      .eq(0)
      .clear()
      .type('e2e-test');
    cy.get('.Conditionals__New .components-text-control__input')
      .eq(1)
      .clear()
      .type('test-value-2');

    // save condition
    cy.get('.Conditionals__Buttons > .is-primary')
      .click();

    // save post
    cy.savePost();

    // go to post with condition
    cy.contains('View Post')
      .then((element: any) => {
        const baseUrl = element[0].href;
        const conditionA = 'e2e-test=test-value';
        const conditionB = 'e2e-test=test-value-2';

        // go to A
        cy.visit([baseUrl, conditionA].join('&'));

        // place yourself in A and track
        cy.contains('Go to Hello World (A)')
          .click();

        cy.visitAdmin();

        // go to overview
        cy.contains('A/B Testing')
          .click();

        // check conversions
        cy.get('.running-tests > tbody > tr:last-child .variations tr:nth-child(1) > :nth-child(3)')
          .should('contain', '1');
        cy.get('.running-tests > tbody > tr:last-child .variations tr:nth-child(2) > :nth-child(3)')
          .should('contain', '0');

        // go to B
        cy.visit([baseUrl, conditionB].join('&'));

        // place yourself in B and track
        cy.contains('Go to Hello World (B)')
          .click();

        cy.visitAdmin();

        // go to overview
        cy.contains('A/B Testing')
          .click();

        // variation B should not get a point
        cy.get('.running-tests > tbody > tr:last-child .variations tr:nth-child(1) > :nth-child(3)')
          .should('contain', '1');
        cy.get('.running-tests > tbody > tr:last-child .variations tr:nth-child(2) > :nth-child(3)')
          .should('contain', '0');

        cy.logout();

        cy.login();

        // place yourself in A
        cy.visit([baseUrl, conditionA].join('&'));

        cy.visitAdmin();

        // go to overview
        cy.contains('A/B Testing')
          .click();

        // check participants in A
        cy.get('.running-tests > tbody > tr:last-child .variations tr:nth-child(1) > :nth-child(4)')
          .should('contain', '2');

        // go to B before conversion
        cy.visit([baseUrl, conditionB].join('&'));

        cy.visitAdmin();

        // go to overview
        cy.contains('A/B Testing')
          .click();

        // check participants in A and B (and see if participant switched to B
        cy.get('.running-tests > tbody > tr:last-child .variations tr:nth-child(1) > :nth-child(4)')
          .should('contain', '1');
        cy.get('.running-tests > tbody > tr:last-child .variations tr:nth-child(2) > :nth-child(4)')
          .should('contain', '1');

        cy.visit(baseUrl);

        // convert
        cy.contains('Go to Hello World (B)')
          .click();

        cy.visitAdmin();

        // go to overview
        cy.contains('A/B Testing')
          .click();

        // B should have conversion
        cy.get('.running-tests > tbody > tr:last-child .variations tr:nth-child(2) > :nth-child(3)')
          .should('contain', '1');
      });
  });
});
