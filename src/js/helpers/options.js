// @flow

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
  console.log('update option in php');
}
