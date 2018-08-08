'use strict';

const getResourceHints = require('./resourceHints');

/**
 * `createHead` needs to do a coupe of things with the given manifest and
 * embedded runtime, namely:
 *
 * - Specify resources that need to be "preloaded"
 * - Specify resources that need to be "prefetched"
 * - Link resources, such as stylesheet
 * - Inlined scripts, such as the runtime information, analytics, etc
 */
const createHead = (manifest, runtime, postHeadContent, title) => {
  const resourceHints = getResourceHints(manifest);
  const linkedStylesheets = [manifest['main.css']]
    .filter(Boolean)
    .map(path => `<link rel="stylesheet" href="${path}">`);
  const inlinedScripts = [runtime]
    .filter(Boolean)
    .map(script => `<script>${script}</script>`);

  return [
    '<head>',
    '<meta charset="utf-8">',
    `<title>${title}</title>`,
    '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">',
    '<link rel="manifest" href="/static/manifest.json?v1.0">',
    '<link rel="shortcut icon" href="/static/favicon.ico?v1.0">',
    resourceHints.join(''),
    linkedStylesheets.join(''),
    inlinedScripts.join(''),
    postHeadContent,
    '</head>',
  ].join('');
};

module.exports = createHead;
