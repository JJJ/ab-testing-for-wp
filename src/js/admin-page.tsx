import React from 'react';
import { render } from 'react-dom';

import AdminPage from './components/Admin/Admin';

function onLoad(): void {
  const root = document.getElementById('admin_app');

  if (!root) return;

  render(<AdminPage data={ABTestingForWP_Data} reload={onLoad} />, root);
}

document.addEventListener('DOMContentLoaded', onLoad);
