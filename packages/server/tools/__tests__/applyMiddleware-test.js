/**
 * @jest-environment node
 */

'use strict';

describe('applyMiddleware', () => {
  let mockServer;
  let mockContext;
  let applyMiddleware;

  beforeEach(() => {
    jest.resetModules();
    mockServer = {
      enable: jest.fn(),
      disable: jest.fn(),
      use: jest.fn(),
    };
    mockContext = {
      build: {
        asset: '<asset-path>',
        manifest: {
          asset: '<asset-path>',
        },
      },
    };
    applyMiddleware = require('../applyMiddleware');
  });

  it('should apply each middleware to the server', async () => {
    const identity = i => Promise.resolve(i);
    const middleware = [
      jest.fn(identity),
      jest.fn(identity),
      jest.fn(identity),
    ];
    await applyMiddleware(mockServer, middleware, mockContext);

    middleware.forEach(m => {
      expect(m).toHaveBeenCalledTimes(1);
      expect(m).toHaveBeenCalledWith(mockServer, mockContext);
    });
  });

  it('should return a promise', () => {
    const promise = applyMiddleware(mockServer, [], mockContext);
    expect(promise.then).toBeDefined();
    expect(promise.catch).toBeDefined();
  });
});
