/**
 * @jest-environment node
 */

'use strict';

describe('cli-plugin-eslint', () => {
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
    it('should use the default eslint config if no options specified', () => {
      const { api, env } = runtime.load();
      const plugins = [
        {
          name: '@carbon/cli-plugin-eslint',
          options: {},
          plugin,
        },
      ];
      runtime.applyPlugins(api, plugins, env);

      const eslintConfig = api.store.read('eslint');
      expect(eslintConfig).toEqual({
        extends: expect.arrayContaining([
          expect.stringContaining('eslint-config-toolkit'),
        ]),
      });
      expect(config()).toEqual(eslintConfig);
    });

    it('should load an extended config if another plugin modifies eslint', () => {
      const { api, env } = runtime.load();
      const plugins = [
        {
          name: '@carbon/cli-plugin-eslint',
          options: {},
          plugin,
        },
        {
          name: 'mock-eslint-plugin',
          options: {},
          plugin({ api }) {
            api.extend('eslint', eslintConfig => ({
              ...eslintConfig,
              plugins: ['eslint-plugin-a'],
            }));
          },
        },
      ];
      runtime.applyPlugins(api, plugins, env);

      const eslintConfig = api.store.read('eslint');
      expect(eslintConfig).toEqual(
        expect.objectContaining({
          extends: expect.arrayContaining([
            expect.stringContaining('eslint-config-toolkit'),
          ]),
          plugins: expect.arrayContaining([
            expect.stringContaining('eslint-plugin-a'),
          ]),
        })
      );
      expect(config()).toEqual(eslintConfig);
    });

    it('should load a custom config is provided options', () => {
      const { api, env } = runtime.load();
      const mockOptions = {
        plugins: ['eslint-plugin-a'],
      };
      const plugins = [
        {
          name: '@carbon/cli-plugin-eslint',
          options: mockOptions,
          plugin,
        },
      ];
      runtime.applyPlugins(api, plugins, env);

      const eslintConfig = api.store.read('eslint');
      expect(eslintConfig).toEqual(mockOptions);
      expect(config()).toEqual(mockOptions);
    });
  });
});
