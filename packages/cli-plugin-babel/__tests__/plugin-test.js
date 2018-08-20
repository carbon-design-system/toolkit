/**
 * @jest-environment node
 */

'use strict';

describe('cli-plugin-babel', () => {
  let runtime;
  let config;
  let plugin;

  beforeEach(() => {
    jest.resetModules();
    jest.mock('@carbon/cli-runtime');

    runtime = require('@carbon/cli-runtime');
    config = require('../config');
    plugin = require('../');
  });

  describe('config', () => {
    it('should use the default babel config if no options specified', () => {
      const { api, env } = runtime.load();
      const plugins = [
        {
          name: '@carbon/cli-plugin-babel',
          options: {},
          plugin,
        },
      ];
      runtime.applyPlugins(api, plugins, env);

      const babelConfig = api.store.read('babel');
      expect(config()).toEqual(babelConfig);
    });

    it('should load an extended config if another plugin modifies babel', () => {
      const { api, env } = runtime.load();
      const plugins = [
        {
          name: '@carbon/cli-plugin-babel',
          options: {},
          plugin,
        },
        {
          name: 'mock-babel-plugin',
          options: {},
          plugin({ api }) {
            api.extend('babel', babelConfig => ({
              ...babelConfig,
              plugins: ['babel-plugin-a'],
            }));
          },
        },
      ];
      runtime.applyPlugins(api, plugins, env);

      const babelConfig = api.store.read('babel');
      expect(babelConfig).toEqual(
        expect.objectContaining({
          presets: expect.arrayContaining([
            expect.stringContaining('babel-preset-toolkit'),
          ]),
          plugins: expect.arrayContaining([
            expect.stringContaining('babel-plugin-a'),
          ]),
        })
      );
      expect(config()).toEqual(babelConfig);
    });

    it('should load a custom config is provided options', () => {
      const { api, env } = runtime.load();
      const mockOptions = {
        plugins: ['babel-plugin-a'],
      };
      const plugins = [
        {
          name: '@carbon/cli-plugin-babel',
          options: mockOptions,
          plugin,
        },
      ];
      runtime.applyPlugins(api, plugins, env);

      const babelConfig = api.store.read('babel');
      expect(babelConfig).toEqual(mockOptions);
      expect(config()).toEqual(mockOptions);
    });
  });

  describe('add lifecycle', () => {
    it("should modify the project's package.json file with a babel config", async () => {
      const { api, env } = runtime.load();
      const lifecycle = api.fork('mock-plugin');
      let mockExtendPackageJson;
      const mockAdd = {
        extendPackageJson: jest.fn(thunk => {
          mockExtendPackageJson = jest.fn(thunk);
        }),
      };

      await plugin({
        api: lifecycle,
        options: {},
        env,
      });

      await lifecycle.run('add', mockAdd);

      expect(mockAdd.extendPackageJson).toHaveBeenCalledTimes(1);
      expect(mockExtendPackageJson()).toEqual({
        babel: {
          presets: ['@carbon/cli-plugin-babel/config'],
        },
      });
    });
  });
});
