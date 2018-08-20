'use strict';

module.exports = {
  parser: require.resolve('babel-eslint'),
  extends: [
    './rules/base',
    './rules/best-practices',
    './rules/es6',
    './rules/node',
    './rules/strict',
    './rules/style',
    './rules/variables',
    './plugins/imports',
    './plugins/jsdoc',
    './plugins/prettier',
  ].map(require.resolve),
  env: {
    // Enable these blindly because we can't make a per-file decision about this.
    browser: true,
    es6: true,
    node: true,
    jest: true,
    jasmine: true,
  },
};
