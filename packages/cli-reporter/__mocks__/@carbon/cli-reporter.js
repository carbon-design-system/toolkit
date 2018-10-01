'use strict';

const methods = ['error', 'header', 'info', 'log', 'stack', 'success'];

function ConsoleReporter() {
  return methods.reduce(
    (acc, method) => ({
      ...acc,
      [method]: jest.fn(),
    }),
    {}
  );
}

module.exports = {
  ConsoleReporter,
};
