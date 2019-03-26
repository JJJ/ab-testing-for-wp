// @flow

export function findTestById(id: string) {
  return document.querySelector(`.ABTestWrapper[data-test=${id}]`);
}

export function findId(node: HTMLElement) {
  return node.id.replace('wp-admin-bar-ab-testing-for-wp_', '');
}
