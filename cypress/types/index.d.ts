declare namespace Cypress {
  interface Chainable {
    login(): void;
    logout(): void;
    visitAdmin(subpage?: string): void;
    addBlockInEditor(search: string, name?: string): void;
    savePost(): void;
    focusBlock(eq?: number): void;
    disableTooltips(): void;
    changeRange(selector: string, value: number): void;
    installWordPress(): void;
    activatePlugin(): void;
    wipeInstall(): void;
    cleanInstall(): void;
  }
}
