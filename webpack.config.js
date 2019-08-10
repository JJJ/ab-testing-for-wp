const path = require('path'); // eslint-disable-line import/no-extraneous-dependencies

const mode = process.env.NODE_ENV || 'development';

module.exports = {
  mode,
  entry: {
    // frontend
    'ab-testing-for-wp': './frontend.js',

    // admin
    'admin-editor': './admin-editor.js',
    'admin-bar': './admin-bar.js',
    'admin-page': './admin-page.js',

    // gutenberg
    'ab-test': './blocks/ab-test.js',
    'ab-test-variant': './blocks/ab-test-variant.js',
    'ab-test-inserter': './blocks/ab-test-inserter.js',
  },
  context: path.resolve(__dirname, 'src/js'),
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  externals: {
    react: 'window.wp.element',
    'react-dom': 'window.wp.element',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
        ],
      },
    ],
  },
};
