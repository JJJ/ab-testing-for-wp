describe('WordPress installation', () => {
  after(() => {
    cy.wipeInstall();
  });

  it('Should install WordPress', () => {
    cy.installWordPress();
  });
});
