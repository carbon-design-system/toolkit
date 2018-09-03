'use strict';

const register = require('@carbon/server/tools/register');
const setupServer = require('./server');

register(setupServer);
