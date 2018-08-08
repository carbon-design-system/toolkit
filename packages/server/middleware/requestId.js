'use strict';

const uuid = require('uuid/v4');

const requestId = (req, res, next) => {
  if (req._id) {
    return next();
  }
  req._id = req.get('x-request-id') || uuid();
  return next();
};

module.exports = exports = server => {
  server.use(requestId);
  return server;
};

exports.requestId = requestId;
