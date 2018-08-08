/**
 * @jest-environment node
 */

'use strict';

describe('security middleware', () => {
  let mockServer;
  let mockHelmet;
  let hpp;
  let sts;
  let middleware;

  beforeEach(() => {
    jest.resetModules();
    mockServer = {
      use: jest.fn(),
    };
    mockHelmet = {
      xssFilter: jest.fn(),
      frameguard: jest.fn(),
      ieNoOpen: jest.fn(),
      noSniff: jest.fn(),
      contentSecurityPolicy: jest.fn(),
    };
    jest.mock('hpp');
    jest.mock('helmet', () => mockHelmet);
    jest.mock('strict-transport-security');
    hpp = require('hpp');
    sts = require('strict-transport-security');
    middleware = require('../security');
  });

  it('should use `hpp` to help stop HTTP parameter pollution attacks', () => {
    middleware()(mockServer);

    expect(hpp).toHaveBeenCalledTimes(1);
  });

  it('should use helmet to set various HTTP headers', () => {
    middleware()(mockServer);

    expect(mockHelmet.xssFilter).toHaveBeenCalledTimes(1);
    expect(mockHelmet.frameguard).toHaveBeenCalledWith('deny');
    expect(mockHelmet.ieNoOpen).toHaveBeenCalledTimes(1);
    expect(mockHelmet.noSniff).toHaveBeenCalledTimes(1);
  });

  it('should use strict-transport-security', () => {
    middleware()(mockServer);

    expect(sts.getSTS).toHaveBeenCalledWith({
      'max-age': { days: 365 },
    });
  });

  it('should set the CSP policy if provided', () => {
    const contentSecurityPolicy = { foo: 'bar' };
    middleware({ contentSecurityPolicy })(mockServer);
    expect(mockHelmet.contentSecurityPolicy).toHaveBeenCalledWith(
      contentSecurityPolicy
    );
  });
});
