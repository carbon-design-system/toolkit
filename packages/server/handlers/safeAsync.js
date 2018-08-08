'use strict';

function safeAsync(handler) {
  return function safeAsyncMiddleware(req, res, next) {
    try {
      handler(req, res, next).catch(next);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = safeAsync;
