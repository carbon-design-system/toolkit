'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const createResponse = require('./createResponse');

/**
 * TODO
 * Analytics support in Head, might already be supported
 * meta tags in head
 * noscript fallback
 * failure message fallback on script load
 * crossorigin=anonymous
 * preconnect https://www.w3.org/TR/resource-hints/#preconnect
 * dns-prefetch https://www.w3.org/TR/resource-hints/#dns-prefetch
 * modulepreload
 * OpenGraph, title, site_name, image, description, url, ...
 */
module.exports = ({
  getTitle = () => 'UI SDK',
  addToHead = () => '',
  getMetaTags,
} = {}) => (server, context) => {
  const { build } = context;
  const { assets, manifest } = build;

  return Promise.resolve()
    .then(() => {
      if (manifest['runtime.js'] !== undefined) {
        return readFile(path.join(assets, manifest['runtime.js']), 'utf8');
      }
    })
    .then(rawRuntime => {
      if (rawRuntime !== undefined) {
        // Update the sourceMappingURL for the runtime since we embed it in the
        // payload
        const runtime = rawRuntime.replace(
          /(sourceMappingURL=)(runtime)/,
          '$1/static/js/runtime'
        );
        return runtime;
      }
    })
    .then(runtime => {
      server.get(
        '*',
        createResponse({
          manifest,
          runtime,
          getTitle,
          addToHead,
          getMetaTags,
        })
      );

      return server;
    });
};
