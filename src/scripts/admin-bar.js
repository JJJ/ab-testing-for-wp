// @flow

import scrollIntoView from 'scroll-into-view';

let lastHighlighted;

function highLightElement(node: HTMLElement) {
  const boundingRects = node.getBoundingClientRect();
  const highlight = document.createElement('div');

  highlight.style.position = 'absolute';

  console.log(boundingRects);

  if (!document.body) return;
  // document.body.appendChild(highlight);
}

function findTestById(id: string) {
  return document.querySelector(`.ABTestWrapper[data-test=${id}]`);
}

function findId(node: HTMLElement) {
  return node.id.replace('wp-admin-bar-ab-testing-for-wp_', '');
}

function handleTest() {
  const testId = findId(this);
  const element = findTestById(testId);

  if (!element) return;

  scrollIntoView(element);
  highLightElement(element);
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


document.addEventListener('DOMContentLoaded', bindAdminBarEvents);
