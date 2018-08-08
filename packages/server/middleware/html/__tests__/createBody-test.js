/**
 * @jest-environment node
 */

'use strict';

describe('createBody', () => {
  let mockManifest;
  let mockWebpackConfig;
  let createBody;

  beforeEach(() => {
    mockManifest = {
      'vendor.js': 'vendor.js',
      'main.js': 'main.js',
    };
    mockWebpackConfig = {
      output: {
        filename: 'file.js',
      },
    };
    createBody = require('../createBody');
  });

  it('should generate the body for the html response', () => {
    expect(createBody(mockManifest, mockWebpackConfig)).toMatchSnapshot();
  });

  it('should generate the script tags for the vendor bundle', () => {
    const body = createBody(mockManifest, mockWebpackConfig);

    expect(body).toEqual(
      expect.stringContaining(
        `<script crossorigin="anonymous" src="${
          mockManifest['vendor.js']
        }"></script>`
      )
    );
  });

  it('should generate the script tags for the main bundle', () => {
    const body = createBody(mockManifest, mockWebpackConfig);

    expect(body).toEqual(
      expect.stringContaining(
        `<script crossorigin="anonymous" src="${
          mockManifest['main.js']
        }"></script>`
      )
    );
  });
});
