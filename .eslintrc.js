module.exports = {
  extends: 'airbnb',
  env: {
    browser: true,
  },
  globals: {
    wp: false,
  },
  rules: {
    'react/react-in-jsx-scope': 0,
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }]
  },
};