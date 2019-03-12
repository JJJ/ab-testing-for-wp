module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'plugin:flowtype/recommended'],
  plugins: ['flowtype'],
  env: {
    browser: true,
  },
  globals: {
    wp: false,
  },
  rules: {
    'react/react-in-jsx-scope': 0,
    'react/require-default-props': 0,
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
  },
  settings: {
    'import/resolver': 'webpack',
  },
};