'use strict';

const { DEPLOY_ENV, NODE_ENV } = require('config');

module.exports = server => {
  // Only trust proxy if we're deployed to prod
  if (DEPLOY_ENV === 'production' && NODE_ENV === 'production') {
    server.enable('trust proxy');
  }

  server.use((req, res, next) => {
    // Only redirect in production environments to help out with local debugging
    // of a prod deployment through NODE_ENV=production
    if (DEPLOY_ENV === 'production' && !req.secure) {
      res.redirect(`https://${req.headers.host}${req.url}`);
      return;
    }

    next();
  });
  return server;
};
