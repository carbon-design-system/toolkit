'use strict';

const { createTransformer } = require('babel-jest');

const babelOptions = {
  presets: [require.resolve('babel-preset-carbon/test')],
};

module.exports = createTransformer(babelOptions);
