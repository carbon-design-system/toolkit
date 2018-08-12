'use strict';

const { createTransformer } = require('babel-jest');

const babelOptions = {
  presets: [require.resolve('babel-preset-toolkit/test')],
};

module.exports = createTransformer(babelOptions);
