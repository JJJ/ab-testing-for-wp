// @flow

import React from 'react';
import { render } from 'react-dom';

import AdminPage from './components/Admin/Admin';

function onLoad() {
  const root = document.getElementById('admin_app');

  if (!root) return;

  render(<AdminPage data={window.ABTestingForWP_Data} />, root);
}

document.addEventListener('DOMContentLoaded', onLoad);
