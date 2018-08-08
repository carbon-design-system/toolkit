'use strict';

const path = require('path');

const resourceBlacklist = [
  // Runtime information from Webpack that we embed into the HTML payload
  'runtime',
  // Development-specific name for the bundled JavaScript
  'bundle',
];

// These two chunks are essentially our "entry" points for our delivered code
const preloadChunks = ['main', 'vendor'];

// Filter out any sourceMap files, or anything in our resource blacklist
const defaultExtract = chunkNames =>
  chunkNames
    .filter(chunkName => path.extname(chunkName) !== '.map')
    .filter(chunkName =>
      resourceBlacklist.every(entry => chunkName.indexOf(entry) === -1)
    );

/**
 * Preload is a declarative fetch, allowing you to force the browser to make a
 * request for a resource without blocking the document’s onload event.
 *
 * e.g., vendor, main scripts, fonts, main stylesheet
 */
const preloadHints = {
  extract: manifest =>
    defaultExtract(Object.keys(manifest))
      // Only grab chunks that we've specified as ones needed to be preload-ed
      .filter(chunkName =>
        preloadChunks.some(entry => chunkName.indexOf(entry) !== -1)
      )
      .map(chunkName => {
        switch (path.extname(chunkName)) {
          case '.js':
            return {
              chunkName,
              rel: 'preload',
              href: `${manifest[chunkName]}`,
              as: 'script',
            };
          case '.css':
            return {
              chunkName,
              rel: 'preload',
              href: `${manifest[chunkName]}`,
              as: 'style',
            };
          default:
            return {
              chunkName,
              rel: 'preload',
              href: `${manifest[chunkName]}`,
            };
        }
      }),
};

/**
 * Prefetch is a hint to the browser that a resource might be needed, but
 * delegates deciding whether and when loading it is a good idea or not to the
 * browser.
 */
const prefetchHints = {
  extract: manifest =>
    defaultExtract(Object.keys(manifest))
      .filter(chunkName =>
        preloadChunks.every(entry => chunkName.indexOf(entry) === -1)
      )
      .map(chunkName => {
        switch (path.extname(chunkName)) {
          case '.js':
            return {
              chunkName,
              rel: 'prefetch',
              href: `/${manifest[chunkName]}`,
              as: 'script',
            };
          case '.css':
            return {
              chunkName,
              rel: 'prefetch',
              href: `/${manifest[chunkName]}`,
              as: 'style',
            };
          default:
            return {
              chunkName,
              rel: 'prefetch',
              href: `/${manifest[chunkName]}`,
            };
        }
      }),
};

const print = resourceHints =>
  resourceHints.map(({ rel, href, as }) => {
    if (as === undefined) {
      return `<link rel="${rel}" href="${href}">`;
    }

    return `<link rel="${rel}" href="${href}" as="${as}">`;
  });

const getResourceHints = manifest => [
  ...print(preloadHints.extract(manifest)),
  // Soft-cap to 20 entries, for now, just in case the application generates
  // a lot of chunks. Should decide what behavior is best here at some point.
  ...print(prefetchHints.extract(manifest).slice(0, 20)),
];

module.exports = exports = getResourceHints;
exports.resourceBlacklist = resourceBlacklist;
exports.preloadChunks = preloadChunks;
exports.defaultExtract = defaultExtract;
exports.print = print;
exports.preloadHints = preloadHints;
exports.prefetchHints = prefetchHints;
