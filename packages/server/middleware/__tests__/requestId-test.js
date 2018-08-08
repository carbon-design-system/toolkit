/**
 * @jest-environment node
 */

'use strict';

describe('request-id middleware', () => {
  let uuid;
  let middleware;
  let requestId;

  beforeEach(() => {
    jest.resetModules();
    jest.mock('uuid/v4', () => jest.fn(() => '<uuid>'));

    uuid = require('uuid/v4');
    middleware = require('../requestId');
    requestId = middleware.requestId;
  });

  it('should use the requestId helper', () => {
    const server = { use: jest.fn() };
    middleware(server);
    expect(server.use).toHaveBeenCalledWith(requestId);
  });

  describe('requestId', () => {
    it('should place an _id property on the req object if it does not exist', () => {
      const params = {
        req: {
          params: {},
          get: jest.fn(() => false),
        },
        res: {},
        next: jest.fn(),
      };
      requestId(params.req, params.res, params.next);
      expect(uuid).toHaveBeenCalledTimes(1);
      expect(params.req._id).toBeDefined();
      expect(params.next).toHaveBeenCalled();
    });

    it('should read from an existing request id header if one is defined', () => {
      const params = {
        req: {
          params: {},
          get: jest.fn(header => {
            if (header === 'x-request-id') {
              return '<uuid>';
            }

            return false;
          }),
        },
        res: {},
        next: jest.fn(),
      };
      requestId(params.req, params.res, params.next);
      expect(uuid).not.toHaveBeenCalled();
      expect(params.req._id).toBeDefined();
      expect(params.next).toHaveBeenCalled();
    });

    it('should call next if _id is already set', () => {
      const params = {
        req: {
          _id: '<uuid>',
          params: {},
          get: jest.fn(),
        },
        res: {},
        next: jest.fn(),
      };
      requestId(params.req, params.res, params.next);
      expect(uuid).not.toHaveBeenCalled();
      expect(params.req._id).toBeDefined();
      expect(params.next).toHaveBeenCalled();
      expect(params.req.get).not.toHaveBeenCalled();
    });
  });
});
