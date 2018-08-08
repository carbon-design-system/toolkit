/**
 * @jest-environment node
 */

'use strict';

describe('createHead', () => {
  let assetManifest;
  let mockRuntime;
  let createHead;

  beforeEach(() => {
    mockRuntime = 'var runtime = true;';
    assetManifest = require('../__fixtures__/asset-manifest.json');
    createHead = require('../createHead');
  });

  it('should generate the head for the html response', () => {
    expect(createHead(assetManifest, mockRuntime, '', 'App')).toMatchSnapshot();
  });

  it('should embed the runtime', () => {
    const head = createHead(assetManifest, mockRuntime, '', 'App');

    expect(head).toEqual(
      expect.stringContaining(`<script>${mockRuntime}</script>`)
    );
  });

  it('should generate a <link> element for the main.css file', () => {
    const head = createHead(assetManifest, mockRuntime, '', 'App');
    expect(head).toEqual(
      // eslint-disable-next-line quotes
      expect.stringContaining(
        `<link rel="stylesheet" href="${assetManifest['main.css']}"`
      )
    );
  });
});
