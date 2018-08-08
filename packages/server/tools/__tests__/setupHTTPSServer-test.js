/**
 * @jest-environment node
 */

'use strict';

const mockValidCertPath = 'ssl/__valid_cert_path__';
const mockExpiredCertPath = 'ssl/__expired_cert_path__';
const mockInitialDate = 'Thu Sep 14 2017 17:04:07 GMT-0500 (CDT)';
const certificates = {
  [`${mockValidCertPath}/server.pem`]: {
    readFileSync: '<valid-cert-contents>',
    statSync: {
      // +1 Day
      ctime: new Date(1505513047000),
    },
  },
  [`${mockExpiredCertPath}/server.pem`]: {
    readFileSync: '<invalid-cert-contents>',
    statSync: {
      // +31 Days
      ctime: new Date(1508105047000),
    },
  },
};

describe('setupHTTPSServer tool', () => {
  let fs;
  let del;
  let path;
  let https;
  let logger;
  let setupHTTPSServer;
  let generateLocalCertificate;
  let isValidCertificate;

  describe('setupHTTPSServer', () => {
    const RealDate = Date;
    let mockServer;

    beforeEach(() => {
      jest.resetAllMocks();
      global.Date = jest.fn(() => new RealDate(mockInitialDate));
      jest.mock('fs');
      jest.mock('del');
      jest.mock('https');
      jest.mock('path');
      jest.mock('../logger');
      fs = require('fs');
      del = require('del');
      path = require('path');
      https = require('https');
      logger = require('../logger');
      fs.__setMockFiles(certificates);
      setupHTTPSServer = require('../setupHTTPSServer');
      mockServer = jest.fn();
    });

    afterEach(() => {
      global.Date = RealDate;
    });

    it('should log that SSL is being setup locally', () => {
      path.__setNextResolve(mockValidCertPath);
      setupHTTPSServer(mockServer);
      expect(logger.info).toHaveBeenCalledWith(
        '[SSL] Setting up server for local HTTPS.'
      );
    });

    it('should create an https server with a valid certificate', () => {
      path.__setNextResolve(mockValidCertPath);
      setupHTTPSServer(mockServer);
      const cert = certificates[`${mockValidCertPath}/server.pem`].readFileSync;
      expect(https.createServer).toHaveBeenCalledWith(
        {
          key: cert,
          cert,
        },
        mockServer
      );
    });

    it('should create a new certificate if none exists', () => {
      path.__setNextResolve('foo');
      setupHTTPSServer(mockServer);
      expect(https.createServer).toHaveBeenCalled();
    });

    it('should create a new certificate if what exists is expired', () => {
      path.__setNextResolve(mockExpiredCertPath);
      setupHTTPSServer(mockServer);
      expect(https.createServer).toHaveBeenCalled();
    });
  });

  describe('generateLocalCertificate', () => {
    beforeEach(() => {
      jest.mock('selfsigned');
      setupHTTPSServer = require('../setupHTTPSServer');
      generateLocalCertificate = setupHTTPSServer.generateLocalCertificate;
    });

    it('should generate a valid local certificate', () => {
      const result = generateLocalCertificate();
      const expectedKeys = ['private', 'public', 'cert', 'fingerprint'];
      expectedKeys.forEach(key => {
        expect(result[key]).toBeDefined();
        expect(result[key]).toEqual(expect.any(String));
      });
    });
  });

  describe('isValidCertificate', () => {
    const RealDate = Date;

    beforeEach(() => {
      jest.resetAllMocks();

      global.Date = jest.fn(() => new RealDate(mockInitialDate));

      jest.mock('fs');
      jest.mock('del');
      jest.mock('../logger');

      fs = require('fs');
      del = require('del');
      logger = require('../logger');

      fs.__setMockFiles(certificates);

      isValidCertificate = require('../setupHTTPSServer').isValidCertificate;
    });

    afterEach(() => {
      global.Date = RealDate;
    });

    it('should return false if the certificate does not exist in the filesystem', () => {
      expect(isValidCertificate('foo')).toBe(false);
    });

    it('should return false if the certificate has expired', () => {
      const certPath = `${mockExpiredCertPath}/server.pem`;
      expect(isValidCertificate(certPath)).toBe(false);
      expect(logger.info).toHaveBeenCalledWith(
        '[SSL] Local SSL Certificate is expired, removing.'
      );
      expect(del.sync).toHaveBeenCalledWith([certPath], { force: true });
    });

    it('should return true if the certificate exists and has not expired', () => {
      const certPath = `${mockValidCertPath}/server.pem`;
      expect(isValidCertificate(certPath)).toBe(true);
    });
  });
});
