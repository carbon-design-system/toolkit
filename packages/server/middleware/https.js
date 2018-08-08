'use strict';

const { PROTOCOL } = require('config');

module.exports = server => {
  if (PROTOCOL !== 'https') {
    return server;
  }

  server.use((req, res, next) => {
    if (req.secure) {
      return next();
    }

    res.redirect(`https://${req.headers.host}${req.url}`);
  });

  return server;
};
