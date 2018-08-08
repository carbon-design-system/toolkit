/**
 * @jest-environment node
 */

'use strict';

const express = require.requireActual('express');
const freeport = require.requireActual('freeport');

describe('listen', () => {
  let path;
  // eslint-disable-next-line no-unused-vars
  let config;
  let logger;
  let listen;

  describe('with https and localhost', () => {
    let PORT;

    beforeEach(done => {
      jest.resetModules();

      jest.unmock('selfsigned');
      jest.mock('fs');
      jest.mock('path');
      jest.mock('config');
      jest.mock('../logger');

      freeport((error, port) => {
        if (error) {
          done.fail(error);
          return;
        }
        PORT = port;

        require('config').__setConfig({
          PROTOCOL: 'https',
          HOST: 'localhost',
          PORT,
        });

        path = require('path');
        config = require('config');
        logger = require('../logger');
        listen = require('../listen');
        done();
      });
    });
  });

  describe('with no local SSL', () => {
    let PORT;

    beforeEach(done => {
      jest.resetModules();

      jest.mock('config');
      jest.mock('../logger');

      freeport((error, port) => {
        if (error) {
          done.fail(error);
          return;
        }

        PORT = port;
        require('config').__setConfig({
          PROTOCOL: 'http',
          HOST: 'localhost',
          PORT,
        });

        config = require('config');
        logger = require('../logger');
        listen = require('../listen');

        done();
      });
    });

    it('should use a regular express server to listen', async done => {
      const handler = await listen(express());
      handler.close(() => {
        expect(logger.info).toHaveBeenCalledWith(
          `Server listening at http://localhost:${PORT}`
        );
        done();
      });
    });

    it('should reject if something goes wrong', async () => {
      const mockServer = {
        listen: jest.fn((_, __, ___, callback) => {
          callback(new Error('error'));
        }),
      };
      try {
        await listen(mockServer);
      } catch (error) {
        expect(error.message).toBe('error');
      }
    });
  });
});
