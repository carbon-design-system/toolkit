'use strict';

const healthCheckHandler = (req, res) => {
  res.status(200).send('OK');
};

module.exports = server => {
  server.use('/api/health', healthCheckHandler);
  return server;
};

module.exports.healthCheckHandler = healthCheckHandler;
