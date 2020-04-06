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
    cy.addBlockInEditor('A/B Test');

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
    cy.addBlockInEditor('A/B Test');

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
    cy.addBlockInEditor('A/B Test');

    // save post
    cy.savePost();

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
    cy.addBlockInEditor('A/B Test');

    // open test options
    cy.get('.components-button-group > :nth-child(3)')
      .click();

    // change variant to B
    cy.get('#inspector-select-control-1')
      .scrollIntoView()
      .select('B');

    // save post
    cy.savePost();

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
    cy.addBlockInEditor('A/B Test');

    // open test options
    cy.get('.components-button-group > :nth-child(3)')
      .click();

    // change range input
    cy.changeRange('#inspector-range-control-3', 75);

    // check if values updated correctly
    cy.get(':nth-child(3) > .components-base-control__field > .components-range-control__number')
      .should('have.value', '75');
    cy.get(':nth-child(5) > .components-base-control__field > .components-range-control__number')
      .should('have.value', '25');

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

    // check if values saved correctly
    cy.get(':nth-child(3) > .components-base-control__field > .components-range-control__number')
      .should('have.value', '75');
    cy.get(':nth-child(5) > .components-base-control__field > .components-range-control__number')
      .should('have.value', '25');
  });

  it('Can change set a goal for the test', () => {
    cy.visitAdmin('post-new.php?skipOnboarding=1');

    // add default test
    cy.addBlockInEditor('A/B Test');

    // open test options
    cy.get('.components-button-group > :nth-child(3)')
      .click();

    // change goal type
    cy.get('#inspector-select-control-2')
      .scrollIntoView()
      .select('Pages', { force: true });

    // change goal page
    cy.get('#inspector-select-control-3')
      .scrollIntoView()
      .select('Sample Page');

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
      .should('contain', 'Pages');
    cy.get('#inspector-select-control-2')
      .should('contain', 'Sample Page');
  });

  it('Can start a test for tracking', () => {
    cy.visitAdmin('post-new.php?skipOnboarding=1');

    // add default test
    cy.addBlockInEditor('A/B Test');

    // open test options
    cy.get('.components-button-group > :nth-child(3)')
      .click();

    // start test
    cy.get('#inspector-toggle-control-2')
      .click({ force: true });

    // gets declare winner tab
    cy.contains('Results so far');

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

    // gets declare winner tab
    cy.contains('Results so far');
  });

  it('Can convert an inline block to an A/B test', () => {
    cy.visitAdmin('post-new.php?skipOnboarding=1');

    // add button block to editor
    cy.addBlockInEditor('Button');

    // change button text
    cy.get('.rich-text')
      .click({ force: true })
      .type('Testing button');

    // open block selector
    cy.get('.edit-post-header-toolbar > :nth-child(5) > .components-button')
      .click();
    cy.get('button.block-editor-block-navigation__item-button')
      .eq(0)
      .click();

    // open the options
    cy.get(':nth-child(4) > .components-dropdown > .components-button')
      .click();

    // convert to test
    cy.contains('Convert to A/B test')
      .click();

    // check if block is now a test
    cy.get('.components-button-group > :nth-child(1)').should('contain', 'A');
    cy.get('.components-button-group > :nth-child(2)').should('contain', 'B');
  });

  it('Can declare a winner', () => {
    cy.visitAdmin('post-new.php?skipOnboarding=1');

    // add default test
    cy.addBlockInEditor('A/B Test');

    // open test options
    cy.get('.components-button-group > :nth-child(3)')
      .click();

    // start test
    cy.get('#inspector-toggle-control-2')
      .click({ force: true });

    // switch to variant B
    cy.get('.components-button-group > :nth-child(2)')
      .click();

    cy.get('.ABTestVariant .wp-block-paragraph.rich-text')
      .eq(1)
      .click()
      .type('Variant B text');

    // save post
    cy.savePost();

    // reload and skip onboarding
    cy.location()
      .then(({ pathname, search }) => {
        cy.visit(`${pathname}${search}&skipOnboarding=1`);
      });

    // open the options
    cy.get('.components-button-group > :nth-child(3)')
      .click();

    // click on declare a winner
    cy.contains('Declare a winner')
      .click({ force: true });

    // Pick variant B
    cy.contains('B — 0%')
      .click();

    // Declare the winner
    cy.contains('Declare winner')
      .click();

    // Confirm the winner
    cy.contains('Yes, "B" is the winner')
      .click();

    // Converted to variant "B"
    cy.contains('Variant B text');
  });

  it('Can change conditions of variants', () => {
    cy.visitAdmin('post-new.php?skipOnboarding=1');

    // add default test
    cy.addBlockInEditor('A/B Test');

    // open test options
    cy.get('.components-button-group > :nth-child(3)')
      .click();

    // open condition form B
    cy.get('.VariantSettings > :nth-child(6) > .components-button')
      .scrollIntoView()
      .click();

    // change utm_source
    cy.get('.Conditionals__New select')
      .select('utm_source in URL');

    // input test value
    cy.get('.Conditionals__New .components-text-control__input')
      .clear()
      .type('test-value');

    // renders example
    cy.contains('utm_source=test-value');

    // clear and try to save
    cy.get('.Conditionals__New .components-text-control__input')
      .clear();
    cy.get('.Conditionals__Buttons > .is-primary')
      .click();
    cy.contains('Fill in value');

    // change to query param
    cy.get('.Conditionals__New select')
      .select('Query parameter in URL');

    // clear key value
    cy.get('.Conditionals__New .components-text-control__input')
      .eq(0)
      .clear();

    // should revert preview to defaults
    cy.contains('key=value');

    // should error on no key
    cy.get('.Conditionals__Buttons > .is-primary')
      .click();
    cy.contains('Fill in key');

    // add test params
    cy.get('.Conditionals__New .components-text-control__input')
      .eq(0)
      .type('e2e-test');
    cy.get('.Conditionals__New .components-text-control__input')
      .eq(1)
      .type('test-value');

    // save condition
    cy.get('.Conditionals__Buttons > .is-primary')
      .click();

    // add another condition to B
    cy.get(':nth-child(6) > :nth-child(2)')
      .scrollIntoView()
      .click();

    cy.get('.Conditionals__New .components-text-control__input')
      .eq(0)
      .clear()
      .type('e2e-test-2');
    cy.get('.Conditionals__New .components-text-control__input')
      .eq(1)
      .clear()
      .type('test-value');

    // save condition
    cy.get('.Conditionals__Buttons > .is-primary')
      .click();

    // open conditions form for A
    cy.get('.VariantSettings > :nth-child(4) > .components-button')
      .click();

    cy.get('.Conditionals__New .components-text-control__input')
      .eq(0)
      .clear()
      .type('e2e-test-3');
    cy.get('.Conditionals__New .components-text-control__input')
      .eq(1)
      .clear()
      .type('another-value');

    // save condition
    cy.get('.Conditionals__Buttons > .is-primary')
      .click();

    // shows list of conditions
    cy.contains('Force variant B when either');
    cy.contains('e2e-test=test-value');

    // change distribution of A to 100
    cy.changeRange('#inspector-range-control-3', 100);

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

    // conditions were saved
    cy.contains('Force variant B when either');
    cy.contains('e2e-test=test-value');

    // start test
    cy.get('#inspector-toggle-control-0')
      .click({ force: true });

    // update post
    cy.get('.editor-post-publish-button')
      .click();

    // go to post with condition
    cy.contains('View Post')
      .then((element: any) => {
        // go to URL
        cy.visit(`${element[0].href}&e2e-test=test-value`);

        // Should put you in variant B
        cy.contains('Button for Test Variant “B”');

        // go to URL
        cy.visit(`${element[0].href}&e2e-test-3=another-value`);

        // Should put you in variant A
        cy.contains('Button for Test Variant “A”');

        // go to URL
        cy.visit(`${element[0].href}&e2e-test-2=test-value`);

        // Should put you in variant B again
        cy.contains('Button for Test Variant “B”');
      });
  });

  it('Will not clash conditions when visitor is already in variant', () => {
    cy.visitAdmin('post-new.php?skipOnboarding=1');

    // add default test
    cy.addBlockInEditor('A/B Test');

    // open test options
    cy.get('.components-button-group > :nth-child(3)')
      .click();

    // open condition form
    cy.get('.VariantSettings > :nth-child(6) > .components-button')
      .scrollIntoView()
      .click();

    // change utm_source
    cy.get('.Conditionals__New select')
      .select('utm_source in URL');

    // input test value
    cy.get('.Conditionals__New .components-text-control__input')
      .clear()
      .type('test-value');

    // save condition
    cy.get('.Conditionals__Buttons > .is-primary')
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

    // start test
    cy.get('#inspector-toggle-control-2')
      .click({ force: true });

    // save post
    cy.savePost();

    // go to post with condition
    cy.contains('View Post')
      .then((element: any) => {
        // go to URL
        cy.visit(`${element[0].href}&utm_source=test-value`);

        // Should put you in variant B
        cy.contains('Button for Test Variant “B”');

        cy.visit(element[0].href);

        // Should still put you in variant B
        cy.contains('Button for Test Variant “B”');

        // go to URL
        cy.visit(`${element[0].href}&e2e-test=test-value`);

        // Should put you in variant A
        cy.contains('Button for Test Variant “A”');

        cy.visit(element[0].href);

        // Still in A when reloading because of cookie
        cy.contains('Button for Test Variant “A”');
      });
  });
});
