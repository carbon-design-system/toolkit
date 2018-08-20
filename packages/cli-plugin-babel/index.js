'use strict';

const defaultBabelConfig = {
  presets: [require.resolve('babel-preset-toolkit')],
};

module.exports = ({ api, options }) => {
  api.extend('babel', () => {
    if (options.presets || options.plugins) {
      return options;
    }
    return defaultBabelConfig;
  });

  api.add(async ({ extendPackageJson, write }) => {
    await extendPackageJson(() => ({
      babel: {
        presets: ['@carbon/cli-plugin-babel/config'],
      },
    }));
  });
};
