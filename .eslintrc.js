module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['airbnb', 'plugin:@typescript-eslint/recommended'],
  plugins: ['@typescript-eslint'],
  env: {
    browser: true,
    node: true,
  },
  globals: {
    wp: false,
    ABTestingForWP: false,
    ABTestingForWP_AdminBar: false,
    ABTestingForWP_Options: false,
  },
  rules: {
    'react/require-default-props': 0,
    '@typescript-eslint/camelcase': 0,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
