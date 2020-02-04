import apiFetch from '@wordpress/api-fetch';

import doNotTrack from './doNotTrack';

function handleTestRender(): void {
  if (doNotTrack()) return;

  const testsOnPage = document.getElementsByClassName('ABTestWrapper');

  for (let i = 0; i < testsOnPage.length; i += 1) {
    const test = testsOnPage[i];
    const testId = (test.getAttribute('data-test')) || '';

    // get variant from server
    apiFetch<{ html?: string }>({ path: `ab-testing-for-wp/v1/ab-test?test=${testId}` })
      .then((variant) => {
        if (variant.html) {
          test.innerHTML = variant.html;
        }
      });
  }
}

export default handleTestRender;
