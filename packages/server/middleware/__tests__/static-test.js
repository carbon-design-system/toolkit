/**
 * @jest-environment node
 */

'use strict';

describe('static middleware', () => {
  let mockServer;
  let mockExpress;
  let mockContext;
  let middleware;

  beforeEach(() => {
    jest.resetModules();
    mockServer = {
      use: jest.fn(),
    };
    mockExpress = {
      static: jest.fn(),
    };
    mockContext = {
      build: {
        assets: 'mock-asset-path',
      },
    };
    jest.mock('express', () => mockExpress);
    middleware = require('../static');
  });

  it('should serve build assets in static folder with an agressive cache policy', () => {
    middleware(mockServer, mockContext);

    expect(mockExpress.static).toHaveBeenCalledTimes(2);
    expect(mockExpress.static).toHaveBeenCalledWith(
      mockContext.build.assets + '/static',
      { maxAge: 31536000000 }
    );
  });

  it('should assets in the base folder without a cache policy', async () => {
    await middleware(mockServer, mockContext);

    expect(mockExpress.static).toHaveBeenCalledTimes(2);
    expect(mockExpress.static).toHaveBeenCalledWith(mockContext.build.assets);
  });
});
