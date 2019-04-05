// @flow @jsx wp.element.createElement

import { element } from './wp';

import AdminPage from './components/Admin/Admin';

const { render } = element;

function onLoad() {
  const root = document.getElementById('admin_app');

  if (!root) return;

  render(<AdminPage data={window.ABTestingForWP_Data} />, root);
}

document.addEventListener('DOMContentLoaded', onLoad);
