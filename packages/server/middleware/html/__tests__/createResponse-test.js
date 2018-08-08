/**
 * @jest-environment node
 */

'use strict';

describe('createResponse', () => {
  let assetManifest;
  let mockRuntime;
  let mockParams;
  let createResponse;

  beforeEach(() => {
    assetManifest = require('../__fixtures__/asset-manifest.json');
    mockRuntime = 'const runtime = true;';
    mockParams = {
      req: {},
      res: {
        set: jest.fn(),
        write: jest.fn(),
        flush: jest.fn(),
        end: jest.fn(),
      },
    };
    createResponse = require('../createResponse')({
      manifest: assetManifest,
      runtime: mockRuntime,
      addToHead: () => '',
      getTitle: () => 'App',
    });
  });

  it('should set the content type to html', () => {
    const { set } = mockParams.res;

    createResponse(mockParams.req, mockParams.res);
    expect(set).toHaveBeenCalledWith(
      'Content-Type',
      'text/html; charset=utf-8'
    );
  });

  it('should send an early chunk to the client with the <head> element', () => {
    const { write, flush } = mockParams.res;
    createResponse(mockParams.req, mockParams.res);

    expect(write).toHaveBeenCalledWith(
      expect.stringContaining(
        ['<!DOCTYPE html>', '<html lang="en">', '<head>'].join('')
      )
    );

    expect(flush).toHaveBeenCalled();
  });

  it('should send a late chunk to the client with the <body> element', () => {
    const { write, flush, end } = mockParams.res;
    createResponse(mockParams.req, mockParams.res);

    expect(write).toHaveBeenCalledWith(expect.stringContaining('<body>'));
    expect(write).toHaveBeenCalledWith(expect.stringContaining('</html>'));

    expect(flush).toHaveBeenCalledTimes(2);
    expect(end).toHaveBeenCalledTimes(1);
  });
});
