'use strict';

const { github, callback } = require('../handlers/github');

module.exports = server => {
  server.get('/auth/github', github);
  server.get('/auth/github/callback', callback);

  return server;
};
