'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');
const del = require('del');
const selfsigned = require('selfsigned');
const logger = require('./logger');

const generateLocalCertificate = () => {
  const attrs = [
    {
      name: 'commonName',
      value: 'localhost',
    },
    {
      name: 'subjectAltName',
      value: 'localhost',
    },
  ];

  return selfsigned.generate(attrs, {
    algorithm: 'sha256',
    days: 30,
    keySize: 2048,
    extensions: [
      {
        name: 'basicConstraints',
        cA: true,
      },
      {
        name: 'keyUsage',
        keyCertSign: true,
        digitalSignature: true,
        nonRepudiation: true,
        keyEncipherment: true,
        dataEncipherment: true,
      },
      {
        name: 'subjectAltName',
        altNames: [
          {
            // type 2 is DNS
            type: 2,
            value: 'localhost',
          },
          {
            type: 2,
            value: 'localhost.localdomain',
          },
          {
            type: 2,
            value: 'lvh.me',
          },
          {
            type: 2,
            value: '*.lvh.me',
          },
          {
            type: 2,
            value: '[::1]',
          },
          {
            // type 7 is IP
            type: 7,
            ip: '127.0.0.1',
          },
          {
            type: 7,
            ip: 'fe80::1',
          },
        ],
      },
    ],
  });
};

const writeLocalCertificate = (certPath, certificate) => {
  fs.writeFileSync(certPath, certificate.private + certificate.cert, {
    encoding: 'utf8',
  });
};

const readLocalCertificate = certPath => fs.readFileSync(certPath, 'utf8');

const isValidCertificate = certificatePath => {
  const certExists = fs.existsSync(certificatePath);

  if (!certExists) {
    return false;
  }

  const certState = fs.statSync(certificatePath);
  const certTtl = 1000 * 60 * 60 * 24;
  const now = new Date();

  if ((certState.ctime - now) / certTtl > 30) {
    logger.info('[SSL] Local SSL Certificate is expired, removing.');
    del.sync([certificatePath], { force: true });
    return false;
  }

  return true;
};

const setupHTTPSServer = server => {
  logger.info('[SSL] Setting up server for local HTTPS.');
  // We go up one level since the `tools` directory is a direct descendant of
  // the package
  const LOCAL_SSL_PATH = path.resolve(__dirname, '../ssl');
  const CERT_PATH = path.join(LOCAL_SSL_PATH, 'server.pem');

  if (!isValidCertificate(CERT_PATH)) {
    writeLocalCertificate(CERT_PATH, generateLocalCertificate());
  }

  const localCert = readLocalCertificate(CERT_PATH);
  const credentials = {
    key: localCert,
    cert: localCert,
  };

  return https.createServer(credentials, server);
};

module.exports = exports = setupHTTPSServer;
exports.generateLocalCertificate = generateLocalCertificate;
exports.isValidCertificate = isValidCertificate;
