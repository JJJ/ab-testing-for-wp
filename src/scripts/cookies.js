// @flow

import Cookies from 'js-cookie';

function handleCookieData() {
  const cookieKey = 'ab-testing-for-wp';
  const cookieData = JSON.parse(Cookies.get(cookieKey) || '{}');
  const variantContents = window.abTestForWP || {};

  const testsOnPage = document.getElementsByClassName('ABTestWrapper');

  const newData = {};

  for (let i = 0; i < testsOnPage.length; i += 1) {
    const test = testsOnPage[i];
    const testId = test.getAttribute('data-test');
    const variantId = test.getAttribute('data-variant');
    const controlId = test.getAttribute('data-control');

    // save variant id to cookie
    if (testId && !cookieData[testId]) {
      newData[testId] = variantId;
    }

    // if variant id is not control, switch content
    if (variantId !== controlId) {
      const content = variantContents[variantId];

      if (content) {
        test.innerHTML = decodeURIComponent(variantContents[variantId]);
      }
    }
  }

  Cookies.set(cookieKey, Object.assign({}, cookieData, newData), { expires: 30 });
}

document.addEventListener('DOMContentLoaded', handleCookieData);
