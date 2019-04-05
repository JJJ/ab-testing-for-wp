const path = require('path');

const mode = process.env.NODE_ENV || 'development';

module.exports = {
  mode,
  entry: {
    'ab-testing-for-wp': './ab-testing-for-wp.js',
    'admin-bar': './admin-bar.js',
    admin: './admin.js',
    'ab-test': './blocks/ab-test.js',
    'ab-test-variant': './blocks/ab-test-variant.js',
  },
  context: path.resolve(__dirname, 'src/js'),
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  externals: {
    react: 'window.React',
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
