declare namespace Cypress {
  interface Chainable {
    login(): void;
    logout(): void;
    visitAdmin(subpage?: string): void;
    addTestInEditor(): void;
    disableTooltips(): void;
    changeRange(selector: string, value: number): void;
    installWordPress(): void;
    activatePlugin(): void;
    wipeInstall(): void;
    cleanInstall(): void;
  }
}
