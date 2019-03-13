// @flow

import Cookies from 'js-cookie';

function handleCookieData() {
  const cookieKey = 'ab-testing-for-wp';
  const cookieData = JSON.parse(Cookies.get(cookieKey) || '{}');

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
      const content = window.abTestForWP[variantId];

      if (!content) return;

      test.innerHTML = decodeURIComponent(window.abTestForWP[variantId]);
    }
  }

  Cookies.set(cookieKey, Object.assign({}, cookieData, newData), { expires: 30 });
}

document.addEventListener('DOMContentLoaded', handleCookieData);
