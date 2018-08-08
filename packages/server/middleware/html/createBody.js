'use strict';

const { DEV_BUNDLE_ENTRY } = require('../../tools/getBuildContext');

module.exports = manifest => {
  const scripts = [
    manifest[DEV_BUNDLE_ENTRY],
    manifest['vendor.js'],
    manifest['main.js'],
  ]
    .filter(Boolean)
    .map(path => `<script crossorigin="anonymous" src="${path}"></script>`);

  return [
    '<body>',
    '<noscript>You need to enable JavaScript to run this app.</noscript>',
    '<div id="root"></div>',
    scripts.join(''),
    '</body>',
  ].join('');
};
