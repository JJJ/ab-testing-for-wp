// @flow

import scrollIntoView from 'scroll-into-view';

import { apiFetch, i18n } from './wp';

import { findId, findTestById, setTestStatus } from './helpers/test-dom';
import highLightElement from './helpers/highlight';

const { __, sprintf } = i18n;

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

  // update selected test
  window.ABTestingForWP_AdminBar.cookieData[test.id] = variantId;
  setTestStatus();

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
  document.querySelectorAll('.ab-item .ab-testing-for-wp__test').forEach((item) => {
    item.addEventListener('mouseover', handleTest);
  });

  document.querySelectorAll('.ab-item .ab-testing-for-wp__variant').forEach((item) => {
    item.addEventListener('click', handleVariant);
  });
}

type MenuItem = {
  name: string;
  className?: string;
  children?: MenuItem[];
};

function menuRoot() {
  const root = document.getElementById('wp-admin-bar-ab-testing-for-wp');

  return root || document.createElement('div');
}

function createMenu(items: MenuItem[], root = menuRoot().querySelector('.ab-sub-wrapper'), clean = true) {
  if (!root) return;

  const workRoot = root;
  if (clean) workRoot.innerText = '';

  const menu = document.createElement('ul');
  menu.setAttribute('class', 'ab-submenu');

  items.forEach((item) => {
    const listItem = document.createElement('li');

    const content = document.createElement('div');
    content.setAttribute('class', 'ab-item ab-empty-item');
    content.setAttribute('aria-haspopup', 'true');
    content.innerText = item.name;

    listItem.appendChild(content);

    if (item.children && item.children.length > 0) {
      createMenu(item.children, listItem, false);
      listItem.setAttribute('class', 'menupop');
    }

    menu.appendChild(listItem);
  });

  workRoot.appendChild(menu);
}

function scanPageForTests() {
  const testsOnPage = document.querySelectorAll('.ABTestWrapper[data-test]');

  const root = menuRoot();
  const firstItem = root.querySelector('.ab-item');

  if (firstItem) {
    firstItem.innerText = testsOnPage.length > 0
      ? sprintf(__('A/B Tests (%d)'), testsOnPage.length)
      : __('A/B Tests');
  }

  if (testsOnPage.length > 0) {
    const testIds = [];
    testsOnPage.forEach(test => testIds.push(test.getAttribute('data-test')));

    console.log(testIds);
    // createMenu([
    //   {
    //     name: __('No tests found on page.')
    //   }
    // ]);
  } else {
    createMenu([{ name: __('No tests found on page.') }]);
  }
}

function initAdminBar() {
  // setTestStatus();
  // bindAdminBarEvents();
  scanPageForTests();
}

document.addEventListener('DOMContentLoaded', initAdminBar);
