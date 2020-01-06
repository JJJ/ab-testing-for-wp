import React from 'react';
import { render } from 'react-dom';

import AdminBar from './components/AdminBar/AdminBar';

function initAdminBar(): void {
  const root = document.getElementById('wp-admin-bar-ab-testing-for-wp');

  if (!root) return;

  render(<AdminBar />, root);
}

document.addEventListener('DOMContentLoaded', initAdminBar);
