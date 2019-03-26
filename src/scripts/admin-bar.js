// @flow

import scrollIntoView from 'scroll-into-view';

import { findId, findTestById, setTestStatus } from './helpers/test-dom';
import highLightElement from './helpers/highlight';

const { apiFetch } = window.wp;

function handleTest() {
  const testId = findId(this);
  const element = findTestById(testId);

  if (!element) return;

  scrollIntoView(element);
  highLightElement(testId, element);
}

function handleVariant(e: Event) {
  e.stopPropagation();

  // skip if already selected
  if (this.classList.contains('ab-testing-for-wp__selected')) return;

  // skip if data needed is not present
  if (!window.ABTestingForWP_AdminBar || !window.ABTestingForWP) return;

  const { testsData } = window.ABTestingForWP_AdminBar;
  const { postId } = window.ABTestingForWP;

  const variantId = findId(this);
  const test = testsData.find(item => item.variants.some(variant => variant.id === variantId));

  // skip if test data is not present
  if (!test) return;

  const testId = test.id;
  apiFetch({ path: `/ab-testing-for-wp/v1/ab-test?test=${testId}&variant=${variantId}&post=${postId}` })
    .then((result) => {
      if (result.html) {
        const target = document.querySelector(`.ABTestWrapper[data-test=${testId}]`);

        if (target) target.innerHTML = result.html;
      }
    });
}

function bindAdminBarEvents() {
  document.querySelectorAll('.ab-testing-for-wp__test').forEach((item) => {
    item.addEventListener('mouseover', handleTest);
  });

  document.querySelectorAll('.ab-testing-for-wp__variant').forEach((item) => {
    item.addEventListener('click', handleVariant);
  });
}

function initAdminBar() {
  setTestStatus();
  bindAdminBarEvents();
}

document.addEventListener('DOMContentLoaded', initAdminBar);
