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
    'react/react-in-jsx-scope': 0,
    'react/require-default-props': 0,
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.tsx'] }],
  },
  settings: {
    'import/resolver': 'webpack',
  },
};
