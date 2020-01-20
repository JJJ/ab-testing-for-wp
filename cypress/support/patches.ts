// eslint-disable-next-line @typescript-eslint/no-explicit-any
function patchLeaveMessage(win: any): void {
  // get rid of the "Stay on page" unsaved changes messages blocking navigation in tests
  const original = win.EventTarget.prototype.addEventListener;

  // eslint-disable-next-line no-param-reassign,@typescript-eslint/no-explicit-any
  win.EventTarget.prototype.addEventListener = function catchEvent(): any {
    // eslint-disable-next-line prefer-rest-params
    if (arguments && arguments[0] === 'beforeunload') {
      return;
    }

    // eslint-disable-next-line prefer-rest-params,consistent-return
    return original.apply(this, arguments);
  };

  Object.defineProperty(win, 'onbeforeunload', {
    get() {
      // silence
      return undefined;
    },
    set() {
      // silence
      return undefined;
    },
  });
}

Cypress.on('window:before:load', (win) => {
  patchLeaveMessage(win);
});
