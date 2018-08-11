'use strict';

const defaultBabelConfig = {
  presets: [require.resolve('babel-preset-carbon')],
};

module.exports = ({ api, options }) => {
  api.extend('babel', () => {
    if (options.presets || options.plugins) {
      return options;
    }
    return defaultBabelConfig;
  });
};
