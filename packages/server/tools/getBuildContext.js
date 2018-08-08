'use strict';

const { NODE_ENV } = require('config');
const fs = require('fs');
const path = require('path');
const errorf = require('./errorf');

const DEV_BUNDLE_ENTRY = '@@bundle.js';

const getBuildContext = (assetPath, webpackConfig) => {
  if (NODE_ENV === 'development') {
    // This information is derived from the specific Webpack config file that
    // we end up using.
    const context = {
      assets: assetPath,
      manifest: {
        [DEV_BUNDLE_ENTRY]: '/static/js/bundle.js',
      },
    };

    return context;
  }

  const manifestPath = path.join(assetPath, 'asset-manifest.json');
  try {
    const rawManifest = fs.readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(rawManifest);
    const context = {
      assets: assetPath,
      manifest,
    };
    return context;
  } catch (error) {
    return errorf(
      error,
      'Unable to read asset-manifest.json at path %s.',
      manifestPath
    );
  }
};

module.exports = exports = getBuildContext;
exports.DEV_BUNDLE_ENTRY = DEV_BUNDLE_ENTRY;
