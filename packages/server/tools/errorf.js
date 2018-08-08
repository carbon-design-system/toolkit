'use strict';

function errorf(error, format, ...args) {
  let index = 0;
  return {
    title: error.message || 'Internal Server Error.',
    details: [format.replace(/%s/g, () => args[index++])],
  };
}

module.exports = errorf;
