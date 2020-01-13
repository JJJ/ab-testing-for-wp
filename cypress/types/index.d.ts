declare namespace Cypress {
  interface Chainable {
    login(): void;
    logout(): void;
    visitAdmin(subpage?: string): void;
    addTestInEditor(): void;
  }
}
