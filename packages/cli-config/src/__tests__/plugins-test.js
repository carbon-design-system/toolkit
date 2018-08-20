/**
 * @jest-environment node
 */

'use strict';

describe('plugins', () => {
  let loadPlugin;
  let loadPlugins;
  let mockModule;
  let mockResolve;

  beforeEach(() => {
    loadPlugin = require('../plugins').loadPlugin;
    loadPlugins = require('../plugins').loadPlugins;

    mockModule = jest.fn();
    mockResolve = jest.fn(name => {
      if (name.includes('should-resolve')) {
        return { module: mockModule };
      }
      return { error: new Error('error') };
    });
  });

  describe('loadPlugin', () => {
    it('should resolve to a plugin', () => {
      const descriptor = 'should-resolve';
      expect(loadPlugin(descriptor, mockResolve)).toEqual({
        name: descriptor,
        plugin: mockModule,
        options: {},
      });
    });

    it('should resolve with an error if the resolver fails', () => {
      const descriptor = 'should-not-resolve';
      expect(loadPlugin(descriptor, mockResolve)).toEqual({
        name: descriptor,
        error: expect.any(Error),
        options: {},
      });
    });

    it('should parse the options if they exist in the descriptor', () => {
      const mockOptions = { foo: 'bar' };
      const descriptor = ['should-resolve', mockOptions];
      expect(loadPlugin(descriptor, mockResolve)).toEqual({
        name: descriptor[0],
        plugin: mockModule,
        options: mockOptions,
      });
    });
  });

  describe('loadPlugins', () => {
    it('should correctly resolve valid plugin descriptors', () => {
      const config = {
        plugins: [
          'should-resolve-1',
          ['should-resolve-2', { foo: 'bar' }],
          './should-resolve-3',
          ['./should-resolve-3', { bar: 'baz' }],
        ],
      };
      const { error, plugins } = loadPlugins(config.plugins, mockResolve);

      expect(error).not.toBeDefined();
      expect(Array.isArray(plugins)).toBe(true);
      expect(plugins.length).toBe(config.plugins.length);
    });

    it('should report an error if one or more plugins fail to load', () => {
      const config = {
        plugins: ['should-not-resolve-1', 'should-resolve-1'],
      };
      const { error, plugins } = loadPlugins(config.plugins, mockResolve);

      expect(error).toBeDefined();
      expect(plugins.length).toBe(1);
    });
  });
});
