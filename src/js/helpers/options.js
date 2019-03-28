// @flow

const WPOptions = window.ABTestingForWP_Options || {};

export function getOptions() {
  return WPOptions;
}

export function getOption(key: string) {
  return getOptions()[key];
}
