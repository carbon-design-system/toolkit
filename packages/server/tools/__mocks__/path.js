'use strict';

const path = jest.genMockFromModule('path');

let nextResolve = null;

const actualResolve = path.resolve;
const resolve = () => nextResolve;

path.__setNextResolve = pathToResolve => {
  nextResolve = pathToResolve;
};

path.resolve = resolve;
path.actualResolve = actualResolve;
path.join = (...args) => {
  const realPath = require.requireActual('path');
  return realPath.join(...args);
};

module.exports = path;
