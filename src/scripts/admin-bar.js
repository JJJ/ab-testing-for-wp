// @flow

import scrollIntoView from 'scroll-into-view';

import { findId, findTestById } from './helpers/test-dom';
import highLightElement from './helpers/highlight';

function handleTest() {
  const testId = findId(this);
  const element = findTestById(testId);

  if (!element) return;

  scrollIntoView(element);
  highLightElement(testId, element);
}

function handleVariant(e: Event) {
  e.stopPropagation();

  console.log('Variant', findId(this));
}

function bindAdminBarEvents() {
  document.querySelectorAll('.ab-testing-for-wp__test').forEach((item) => {
    item.addEventListener('mouseover', handleTest);
  });

  document.querySelectorAll('.ab-testing-for-wp__variant').forEach((item) => {
    item.addEventListener('click', handleVariant);
  });
}

function setTestStatus() {
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

function initAdminBar() {
  setTestStatus();
  bindAdminBarEvents();
}

document.addEventListener('DOMContentLoaded', initAdminBar);
