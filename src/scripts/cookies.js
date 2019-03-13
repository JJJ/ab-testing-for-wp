// @flow

import Cookies from 'js-cookie';

const { apiFetch } = window.wp;

function handleCookieData() {
  const cookieKey = 'ab-testing-for-wp';
  const cookieData = JSON.parse(Cookies.get(cookieKey) || '{}');

  const testsOnPage = document.getElementsByClassName('ABTestWrapper');

  const newData = {};

  for (let i = 0; i < testsOnPage.length; i += 1) {
    const test = testsOnPage[i];
    const testId = (test.getAttribute('data-test')) || '';
    const postId = (test.getAttribute('data-post')) || '';

    // get variant from server
    apiFetch({ path: `/ab-testing-for-wp/v1/ab-test?test=${testId}&post=${postId}` })
      .then(console.log)
      .catch(console.error);
  }

  Cookies.set(cookieKey, Object.assign({}, cookieData, newData), { expires: 30 });
}

document.addEventListener('DOMContentLoaded', handleCookieData);
