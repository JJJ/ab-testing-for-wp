const path = require('path');

module.exports = {
  entry: {
    block: './src/scripts/block.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  }
};