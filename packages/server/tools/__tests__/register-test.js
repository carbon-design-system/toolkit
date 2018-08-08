/**
 * @jest-environment node
 */

'use strict';

const express = require.requireActual('express');

describe('register', () => {
  let listen;
  let mockClose;
  let mockListen;
  let register;

  beforeEach(() => {
    jest.resetModules();

    mockClose = jest.fn();
    mockListen = jest.fn(() => ({
      close: mockClose,
    }));
    jest.mock('../logger');
    jest.mock('../listen', () => mockListen);

    listen = require('../listen');
    register = require('../register');
  });

  it('should resolve a promise server setup and pass through to listen', async () => {
    const server = express();
    const setupServer = () => Promise.resolve(server);
    const handler = await register(setupServer);

    expect(listen).toHaveBeenCalledWith(server);
    expect(handler.close).toBeDefined();
  });

  it('should resolve a standard server and pass through to listen', async () => {
    const server = express();
    const setupServer = () => server;
    const handler = await register(setupServer);

    expect(listen).toHaveBeenCalledWith(server);
    expect(handler.close).toBeDefined();
  });

  it('should report to the logger if something goes wrong', async () => {
    jest.resetModules();
    const mockError = new Error('logger error');
    jest.mock('../listen', () => () => {
      throw mockError;
    });
    const logger = require('../logger');
    const register = require('../register');
    const server = express();
    const setupServer = () => Promise.resolve(server);
    await register(setupServer);
    expect(logger.error).toHaveBeenCalled();
  });
});
