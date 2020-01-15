const webpack = require('@cypress/webpack-preprocessor');
const shell = require('shell-exec');

module.exports = (on) => {
  on('file:preprocessor', webpack({
    webpackOptions: require('../../webpack.config'),
  }));
};
