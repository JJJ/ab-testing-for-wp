// @flow

import Cookies from 'js-cookie';

function handleCookieData() {
  const cookieKey = 'ab-testing-for-wp';
  const cookieData = JSON.parse(Cookies.get(cookieKey) || '{}');

  const testsOnPage = document.getElementsByClassName('ABTestWrapper');

  const newData = {};

  Array.from(testsOnPage).forEach((test) => {
    const testId = test.getAttribute('data-test');
    const variantId = test.getAttribute('data-variant');

    if (testId && !cookieData[testId]) {
      newData[testId] = variantId;
    }
  }, {});

  Cookies.set(cookieKey, Object.assign({}, cookieData, newData), { expires: 30 });
}

document.addEventListener('DOMContentLoaded', handleCookieData);
