/**
 * @jest-environment node
 */

'use strict';

describe('health middleware', () => {
  let healthCheckHandler;
  let middleware;
  let mockReq;
  let mockRes;
  let mockSend;
  let mockServer;

  beforeEach(() => {
    middleware = require('../health');
    healthCheckHandler = middleware.healthCheckHandler;
    mockSend = jest.fn();
    mockReq = {};
    mockRes = {
      status: jest.fn(() => ({
        send: mockSend,
      })),
    };
    mockServer = {
      use: jest.fn(),
    };
  });

  describe('middleware', () => {
    it('should apply the healthCheckHandler to `/api/health`', () => {
      middleware(mockServer);
      expect(mockServer.use).toHaveBeenCalledWith(
        '/api/health',
        healthCheckHandler
      );
    });
  });

  describe('healthCheckHandler', () => {
    it('should response with status of 200 and text "OK"', () => {
      healthCheckHandler(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockSend).toHaveBeenCalledWith('OK');
    });
  });
});
