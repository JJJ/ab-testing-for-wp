import apiFetch from '@wordpress/api-fetch';

const WPOptions = ABTestingForWP_Options || {};

export function getOptions(): any {
  return WPOptions;
}

export function getOption(key: string): any {
  return getOptions()[key];
}

export function setOption(key: string, value: any): void {
  // update local value
  getOptions()[key] = value;

  // update backend value
  apiFetch({
    path: 'ab-testing-for-wp/v1/options',
    method: 'POST',
    body: JSON.stringify({ key, value }),
  });
}
