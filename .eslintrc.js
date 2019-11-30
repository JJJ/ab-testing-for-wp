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
    ABTestingForWP_Data: false,
  },
  rules: {
    '@typescript-eslint/camelcase': 0,
    'react/jsx-props-no-spreading': 0,
    'react/require-default-props': 0,
    'react/jsx-filename-extension': [1, { extensions: ['.jsx', '.tsx'] }],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
