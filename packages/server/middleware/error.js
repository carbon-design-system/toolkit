'use strict';

const logger = require('../tools/logger');
const formatErrorResponse = require('../tools/formatErrorResponse');

const createErrorResponse = logger => (error, req, res, next) => {
  const status = error.status || 500;
  const response = formatErrorResponse([
    {
      status,
      title: error.message,
      details: error.details,
    },
  ]);

  res.status(status).json(response);

  logger.error(error);
};

module.exports = exports = server => {
  server.use(createErrorResponse(logger));

  return server;
};
exports.createErrorResponse = createErrorResponse;
