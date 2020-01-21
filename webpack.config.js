// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

const mode = process.env.NODE_ENV || 'development';

module.exports = {
  mode,
  entry: {
    // frontend
    'ab-testing-for-wp': './frontend.ts',

    // admin
    'admin-editor': './admin-editor.ts',
    'admin-bar': './admin-bar.tsx',
    'admin-page': './admin-page.tsx',

    // gutenberg
    'ab-test': './blocks/ab-test.tsx',
    'ab-test-variant': './blocks/ab-test-variant.tsx',
    'ab-test-inserter': './blocks/ab-test-inserter.tsx',
  },
  context: path.resolve(__dirname, 'src/js'),
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js', '.jsx', '.tsx', '.ts', '.json'],
  },
  externals: {
    react: 'window.wp.element',
    'react-dom': 'window.wp.element',
    '@wordpress/api-fetch': 'window.wp.apiFetch',
    '@wordpress/block-editor': 'window.wp.blockEditor || window.wp.editor',
    '@wordpress/blocks': 'window.wp.blocks',
    '@wordpress/components': 'window.wp.components',
    '@wordpress/compose': 'window.wp.compose',
    '@wordpress/data': 'window.wp.data',
    '@wordpress/edit-post': 'window.wp.editPost',
    '@wordpress/i18n': 'window.wp.i18n',
    '@wordpress/plugins': 'window.wp.plugins',
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx|json)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
        resolve: { extensions: ['.js', '.jsx', '.tsx', '.ts', '.json'] },
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
