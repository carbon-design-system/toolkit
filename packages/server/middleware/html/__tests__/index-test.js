/**
 * @jest-environment node
 */

'use strict';

describe('html middleware', () => {
  let html;
  let mockServer;
  let mockContext;

  beforeEach(() => {
    mockServer = {
      get: jest.fn(),
    };
    mockContext = {
      build: {
        assets: '<mock-asset-path>',
        manifest: {},
      },
    };
    html = require('../');
  });

  it('should create a valid default middleware to apply to a server', async () => {
    await html()(mockServer, mockContext);

    expect(mockServer.get).toHaveBeenCalledTimes(1);
  });
});
