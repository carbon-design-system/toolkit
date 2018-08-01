'use strict';

const createClient = require('./createClient');
const getClient = require('./getClient');
const { linkDependency } = require('./link');
const getPackageInfoFrom = require('./getPackageInfoFrom');

module.exports = {
  createClient,
  getClient,
  getPackageInfoFrom,
  linkDependency,
};
