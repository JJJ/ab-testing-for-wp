describe('WordPress installation', () => {
  before(() => {
    cy.wipeInstall();
  });

  it('Should install WordPress', () => {
    cy.installWordPress();
  });
});
