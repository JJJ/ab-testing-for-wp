const { apiFetch } = window.wp;

function handleTestRender() {
  const testsOnPage = document.getElementsByClassName('ABTestWrapper');

  for (let i = 0; i < testsOnPage.length; i += 1) {
    const test = testsOnPage[i];
    const testId = (test.getAttribute('data-test')) || '';

    // get variant from server
    apiFetch({ path: `/ab-testing-for-wp/v1/ab-test?test=${testId}` })
      .then((variant) => {
        if (variant.html) {
          test.innerHTML = variant.html;
        }
      });
  }
}

export default handleTestRender;
