/**
 * @jest-environment node
 */

'use strict';

describe('normalize', () => {
  let normalize;

  beforeEach(() => {
    normalize = require('../normalize');
  });

  test('with empty config', () => {
    const config = {
      presets: [],
      plugins: [],
    };
    const { error, plugins } = normalize(config);
    expect(error).toBeFalsy();
    expect(plugins).toEqual([]);
  });

  test('with plugin', () => {
    const config = {
      presets: [],
      plugins: [
        {
          name: 'a',
          options: {},
          plugin: jest.fn(),
        },
      ],
    };
    const { error, plugins } = normalize(config);
    expect(error).toBeFalsy();
    expect(plugins.map(({ name }) => name)).toEqual(['a']);
  });

  test('with plugins', () => {
    const config = {
      presets: [],
      plugins: [
        {
          name: 'a',
          options: {},
          plugin: jest.fn(),
        },
        {
          name: 'b',
          options: {},
          plugin: jest.fn(),
        },
      ],
    };
    const { error, plugins } = normalize(config);
    expect(error).toBeFalsy();
    expect(plugins.map(({ name }) => name)).toEqual(['a', 'b']);
  });

  test('with duplicate plugins', () => {
    const config = {
      presets: [],
      plugins: [
        {
          name: 'a',
          options: {},
          plugin: jest.fn(),
        },
        {
          name: 'a',
          options: {},
          plugin: jest.fn(),
        },
      ],
    };
    const { error } = normalize(config);
    expect(error).toBeTruthy();
  });

  test('with preset', () => {
    const config = {
      presets: [
        {
          name: 'a',
          options: {},
          presets: [],
          plugins: [
            {
              name: 'x',
              options: {},
              plugin: jest.fn(),
            },
            {
              name: 'y',
              options: {},
              plugin: jest.fn(),
            },
            {
              name: 'z',
              options: {},
              plugin: jest.fn(),
            },
          ],
        },
      ],
      plugins: [],
    };
    const { error, plugins } = normalize(config);
    expect(error).toBeFalsy();
    expect(plugins.map(({ name }) => name)).toEqual(['x', 'y', 'z']);
  });

  test('with nested presets', () => {
    const config = {
      presets: [
        {
          name: 'a',
          options: {},
          presets: [
            {
              name: 'b',
              options: {},
              presets: [
                {
                  name: 'c',
                  options: {},
                  presets: [],
                  plugins: [
                    {
                      name: 'x',
                      options: {},
                      plugin: jest.fn(),
                    },
                  ],
                },
              ],
              plugins: [
                {
                  name: 'y',
                  options: {},
                  plugin: jest.fn(),
                },
              ],
            },
          ],
          plugins: [
            {
              name: 'z',
              options: {},
              plugin: jest.fn(),
            },
          ],
        },
      ],
      plugins: [],
    };
    const { error, plugins } = normalize(config);
    expect(error).toBeFalsy();
    expect(plugins.map(({ name }) => name)).toEqual(['x', 'y', 'z']);
  });
});
