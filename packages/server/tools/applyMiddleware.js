'use strict';

function applyMiddleware(server, middleware, context) {
  /**
   * The setup process here involves:
   *
   * 1) Iterate through each potentially async middleware
   * 2) Try to resolve the middleware with Promise.resolve(), which will work
   *    for middleware that return promises or values
   * 3) Apply the middleware to the current iteration of the server with the
   *    given build context
   */
  const setup = middleware.reduce(
    (promise, apply) => promise.then(prevServer => apply(prevServer, context)),
    Promise.resolve(server)
  );

  return Promise.resolve(setup);
}

module.exports = applyMiddleware;
