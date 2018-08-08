'use strict';

const morgan = require('morgan');
const bodyParser = require('body-parser');

module.exports = (server, context) => {
  server.disable('x-powered-by');

  // Logging middleware
  server.use(morgan('tiny'));

  // Enable GZIP by default
  server.use(require('compression')());
  server.use(bodyParser.json({ limit: 2 ** 21 /* 2MB */ }));

  return server;
};
