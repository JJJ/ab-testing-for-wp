declare namespace Cypress {
  interface Chainable {
    resetInstall(): void;
    activatePlugin(name?: string): void;
    deactivatePlugin(name?: string): void;
  }
}
