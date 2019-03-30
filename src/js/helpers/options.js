// @flow

import { apiFetch } from '../WP';

const WPOptions = window.ABTestingForWP_Options || {};

export function getOptions() {
  return WPOptions;
}

export function getOption(key: string) {
  return getOptions()[key];
}

export function setOption(key: string, value: any) {
  // update local value
  getOptions()[key] = value;

  // update backend value
  apiFetch({
    path: '/ab-testing-for-wp/v1/options',
    method: 'POST',
    body: JSON.stringify({ key, value }),
  });
}
