declare namespace Cypress {
  interface Chainable {
    login(): void;
    logout(): void;
    gotoAdmin(subpage?: string): void;
    addTestInEditor(): void;
  }
}
