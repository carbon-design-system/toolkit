/**
 * @jest-environment node
 */

'use strict';

const { createFsFromVolume, Volume } = require('memfs');

describe('load', () => {
  // Config location variants
  // No config in project
  // Config in project
  //   -> Config is valid
  //   -> Config is invalid
  describe('with no configuration available', () => {
    let mockPackageJson;
    let mockVol;
    let mockFs;
    let load;

    beforeEach(() => {
      jest.resetModules();
      mockPackageJson = {
        name: 'project',
      };
      mockVol = Volume.fromJSON({
        '/project/package.json': JSON.stringify(mockPackageJson),
      });
      mockFs = createFsFromVolume(mockVol);
      jest.mock('fs', () => mockFs);

      load = require('../load');
    });

    it('should not report an error if no config is found', async () => {
      const { error } = await load({ cwd: '/project' });
      expect(error).not.toBeDefined();
    });
  });

  describe('with a valid configuration available', () => {
    let mockPluginPackageJson;
    let mockPresetPackageJson;
    let mockVol;
    let mockFs;
    let load;

    beforeEach(() => {
      jest.resetModules();
      mockPluginPackageJson = {
        name: 'plugins',
        toolkit: {
          plugins: ['a', ['b', { foo: 'bar' }]],
        },
      };
      mockPresetPackageJson = {
        name: 'presets',
        toolkit: {
          presets: ['x', ['y', { foo: 'bar' }]],
        },
      };
      mockVol = Volume.fromJSON({
        '/plugins/package.json': JSON.stringify(mockPluginPackageJson),
        '/presets/package.json': JSON.stringify(mockPresetPackageJson),
      });
      mockFs = createFsFromVolume(mockVol);
      jest.mock('fs', () => mockFs);

      load = require('../load');
    });

    it('should load a config with plugins', async () => {
      const { error, config } = await load({
        cwd: '/plugins',
        resolve() {
          return { module: jest.fn() };
        },
      });
      expect(error).not.toBeDefined();
      expect(config.plugins.length).toEqual(
        mockPluginPackageJson.toolkit.plugins.length
      );
    });

    it('should load a config with presets', async () => {
      const { error, config } = await load({
        cwd: '/presets',
        resolve(name) {
          // Presets
          if (name === 'x') {
            return {
              module: jest.fn(() => ({
                plugins: ['a', ['b', { foo: 'bar' }]],
              })),
            };
          }
          if (name === 'y') {
            return {
              module: jest.fn(() => ({
                plugins: ['c', ['d', { foo: 'bar' }]],
              })),
            };
          }

          // Plugins
          return {
            module: jest.fn(),
          };
        },
      });
      expect(error).not.toBeDefined();
      // Resolved with plugins a, b, c, d from above
      expect(config.plugins.length).toBe(4);
    });
  });

  describe('with an invalid configuration available', () => {
    let mockPackageJson;
    let mockVol;
    let mockFs;
    let load;

    beforeEach(() => {
      jest.resetModules();
      mockPackageJson = {
        name: 'project',
        toolkit: {
          plugins: [0],
        },
      };
      mockVol = Volume.fromJSON({
        '/project/package.json': JSON.stringify(mockPackageJson),
      });
      mockFs = createFsFromVolume(mockVol);
      jest.mock('fs', () => mockFs);

      load = require('../load');
    });

    it('should return a validation error if config is malformed', async () => {
      const { error } = await load({ cwd: '/project' });
      expect(error).toBeDefined();
    });
  });
});
