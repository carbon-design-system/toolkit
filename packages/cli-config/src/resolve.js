'use strict';

const path = require('path');

function resolve(descriptor) {
  if (isPathString(descriptor)) {
    const source = path.resolve(descriptor);
    return safeRequire(source);
  }
  if (typeof descriptor === 'string') {
    return safeRequire(descriptor);
  }
  // Fall-through case is if we have already been provided the module
  return { module: descriptor };
}

function isPathString(string) {
  return string[0] === '.' || string[0] === '/';
}

function safeRequire(source) {
  try {
    // eslint-disable-next-line import/no-dynamic-require
    return { module: require(source) };
  } catch (error) {
    return { error };
  }
}

module.exports = resolve;
