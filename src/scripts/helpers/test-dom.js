// @flow

export function findTestById(id: string) {
  return document.querySelector(`.ABTestWrapper[data-test=${id}]`);
}

export function findId(node: HTMLElement) {
  return node.id.replace('wp-admin-bar-ab-testing-for-wp_', '');
}

export function setTestStatus() {
  if (!window.ABTestingForWP_AdminBar) return;

  const data = window.ABTestingForWP_AdminBar;
  const prefix = 'wp-admin-bar-ab-testing-for-wp_';

  // remove current state
  document
    .querySelectorAll('.ab-testing-for-wp__test')
    .forEach(node => node.classList.remove('ab-testing-for-wp__enabled'));

  document
    .querySelectorAll('.ab-testing-for-wp__variant')
    .forEach(node => node.classList.remove('ab-testing-for-wp__selected'));

  data.testsData.forEach((test) => {
    const element = document.getElementById(`${prefix}${test.id}`);

    if (!element) return;

    if (test.isEnabled) element.classList.add('ab-testing-for-wp__enabled');

    test.variants.forEach((variant) => {
      const variantElement = document.getElementById(`${prefix}${variant.id}`);

      if (!variantElement) return;
      if (data.cookieData[test.id] === variant.id) variantElement.classList.add('ab-testing-for-wp__selected');
    });
  });
}
