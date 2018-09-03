'use strict';

const path = require('path');
const express = require('express');
const applyMiddleware = require('@carbon/server/tools/applyMiddleware');
const getBuildContext = require('@carbon/server/tools/getBuildContext');

const middleware = [
  // Secure middleware for redirecting to HTTPS, when applicable
  require('@carbon/server/middleware/secure'),

  // Development Middleware for handling client-side related development
  require('@carbon/server/middleware/development'),

  // Middleware that should be enabled for most requests
  require('@carbon/server/middleware/all'),

  // "Security" middleware
  require('@carbon/server/middleware/security')(),

  // Handle serving static assets provided through ASSET_PATH
  require('@carbon/server/middleware/static'),

  // Handle generating HTML responses, serving static assets, and error handling
  require('@carbon/server/middleware/html')({
    getTitle: () => 'UI Toolkit Demo',
    getMetaTags: () => ({
      og: {
        title: 'UI Toolkit Demo',
        type: 'website',
        description: 'Prototype to demonstrate capabilities of the UI Toolkit',
      },
    }),
    addToHead: () => `
<link href="https://fonts.googleapis.com/css?family=IBM+Plex+Mono" rel="stylesheet">
<style>body { font-family: 'IBM Plex Mono', monospace; }</style>`,
  }),

  // Error handling so we don't pollute the response with stack traces
  require('@carbon/server/middleware/error'),
];

const ASSET_PATH = path.resolve(__dirname, '../../build');
const server = express();
const context = {
  build: getBuildContext(ASSET_PATH),
};

module.exports = () => applyMiddleware(server, middleware, context);
