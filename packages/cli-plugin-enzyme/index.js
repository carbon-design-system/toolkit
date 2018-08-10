'use strict';

module.exports = ({ api }) => {
  api.extend('jest', defaultConfig => {
    const setupFile = require.resolve('./setup');
    const setupFiles = Array.isArray(defaultConfig.setupFiles)
      ? defaultConfig.setupFiles.concat(setupFile)
      : [setupFile];

    return {
      ...defaultConfig,
      setupFiles,
    };
  });
};
