// @flow

import scrollIntoView from 'scroll-into-view';

let lastHighlighted;

function offsetFromRects(rect) {
  const scrollLeft = window.pageXOffset
    || (document.documentElement || { scrollLeft: 0 }).scrollLeft;
  const scrollTop = window.pageYOffset
    || (document.documentElement || { scrollTop: 0 }).scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
}

function highLightElement(testId: string, node: HTMLElement) {
  if (lastHighlighted === testId) return;

  lastHighlighted = testId;

  const highLightId = `ab-testing-for-wp__highlight__${testId}`;

  if (document.getElementById(highLightId)) return;

  document.querySelectorAll('.ab-testing-for-wp__highlight').forEach((item) => {
    if (!document.body) return;
    document.body.removeChild(item);
  });

  const boundingRects = node.getBoundingClientRect();
  const offset = offsetFromRects(boundingRects);
  const highlight = document.createElement('div');
  const padding = 15;

  highlight.className = 'ab-testing-for-wp__highlight';
  highlight.setAttribute('id', highLightId);

  highlight.style.position = 'absolute';
  highlight.style.width = `${boundingRects.width + (padding * 2)}px`;
  highlight.style.height = `${boundingRects.height + (padding * 2)}px`;
  highlight.style.top = `${offset.top - padding}px`;
  highlight.style.left = `${offset.left - padding}px`;

  if (!document.body) return;

  document.body.appendChild(highlight);

  setTimeout(() => {
    if (!document.body || !document.body.contains(highlight)) return;
    document.body.removeChild(highlight);
  }, 5000);
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


document.addEventListener('DOMContentLoaded', bindAdminBarEvents);
