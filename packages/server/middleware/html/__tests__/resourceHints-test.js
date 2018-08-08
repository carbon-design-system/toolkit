/**
 * @jest-environment node
 */

'use strict';

const path = require('path');

describe('resourceHints', () => {
  let assetManifest;
  let resourceHints;
  let preloadHints;
  let prefetchHints;
  let print;

  beforeEach(() => {
    assetManifest = require('../__fixtures__/asset-manifest.json');
    resourceHints = require('../resourceHints');
    preloadHints = resourceHints.preloadHints;
    prefetchHints = resourceHints.prefetchHints;
    print = resourceHints.print;
  });

  describe('#defaultExtract', () => {
    it('should remove sourceMaps from the asset manifest', () => {
      const extracted = preloadHints.extract(assetManifest);
      extracted.forEach(resourceHint => {
        expect(path.extname(resourceHint.chunkName)).not.toBe('.map');
      });
    });

    it('should remove any blacklisted elements from the asset manifest', () => {
      const { resourceBlacklist } = resourceHints;
      const extracted = preloadHints.extract(assetManifest);
      resourceBlacklist.forEach(resourceName => {
        const resource = extracted.find(resourceHint => {
          return resourceHint.chunkName.indexOf(resourceName) !== -1;
        });
        expect(resource).not.toBeDefined();
      });
    });
  });

  describe('#preloadHints', () => {
    it('should define an extract method', () => {
      expect(preloadHints.extract).toBeDefined();
    });

    it('should extract chunks defined in `preloadChunks` as resource hints', () => {
      const { preloadChunks, resourceBlacklist } = resourceHints;
      const extracted = preloadHints.extract(assetManifest);

      preloadChunks.forEach(chunkName => {
        const resource = extracted.find(resourceHint => {
          return resourceHint.chunkName.indexOf(chunkName) !== -1;
        });
        expect(resource).toBeDefined();
      });

      resourceBlacklist.forEach(resourceName => {
        const resource = extracted.find(resourceHint => {
          return resourceHint.chunkName.indexOf(resourceName) !== -1;
        });
        expect(resource).not.toBeDefined();
      });
    });

    it('should print out link tags', () => {
      const { extract } = preloadHints;
      const tags = print(extract(assetManifest));
      expect(tags).toMatchSnapshot();
    });
  });

  describe('#prefetchHints', () => {
    it('should define an extract method', () => {
      expect(prefetchHints.extract).toBeDefined();
    });

    it('should extract non-preload chunks', () => {
      const { preloadChunks, resourceBlacklist } = resourceHints;
      const extracted = prefetchHints.extract(assetManifest);

      preloadChunks.forEach(chunkName => {
        const resource = extracted.find(resourceHint => {
          return resourceHint.chunkName.indexOf(chunkName) !== -1;
        });
        expect(resource).not.toBeDefined();
      });

      resourceBlacklist.forEach(resourceName => {
        const resource = extracted.find(resourceHint => {
          return resourceHint.chunkName.indexOf(resourceName) !== -1;
        });
        expect(resource).not.toBeDefined();
      });
    });

    it('should print out link tags', () => {
      const { extract } = prefetchHints;
      const tags = print(extract(assetManifest));
      expect(tags).toMatchSnapshot();
    });
  });
});
