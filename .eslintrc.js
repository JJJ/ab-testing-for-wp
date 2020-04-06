module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb',
    'plugin:@typescript-eslint/recommended',
    'plugin:cypress/recommended',
    'plugin:react-hooks/recommended',
  ],
  plugins: ['@typescript-eslint', 'cypress', 'react-hooks'],
  env: {
    browser: true,
    node: true,
    'cypress/globals': true,
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
    'cypress/no-unnecessary-waiting': 0,
    'react/jsx-props-no-spreading': 0,
    'react/prop-types': 0,
    'react/require-default-props': 0,
    'react/jsx-filename-extension': [1, { extensions: ['.jsx', '.tsx'] }],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      }
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
