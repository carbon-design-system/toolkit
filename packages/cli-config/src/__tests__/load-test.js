/**
 * @jest-environment node
 */

'use strict';

const { loadConfig } = require('../load');

class Registry {
  constructor() {
    this._modules = new Map();

    this.add = this.add.bind(this);
    this.resolve = this.resolve.bind(this);
  }

  add(name, value = jest.fn()) {
    if (this._modules.has(name)) {
      throw new Error('Module already exists for name: ' + name);
    }
    this._modules.set(name, value);

    return name;
  }

  resolve(name) {
    if (this._modules.has(name)) {
      return {
        module: this._modules.get(name),
      };
    }

    return {
      error: new Error('Module not found'),
    };
  }
}

describe('load', () => {
  it('should return an error if a preset is not found', () => {
    const registry = new Registry();
    const config = loadConfig(
      {
        presets: ['unknown-preset'],
        plugins: [],
      },
      registry.resolve
    );

    expect(config.presets[0].error).toBeDefined();
  });

  it('should return an error if a plugin is not found', () => {
    const registry = new Registry();
    const config = loadConfig(
      {
        presets: [],
        plugins: ['unknown-plugin'],
      },
      registry.resolve
    );

    expect(config.plugins[0].error).toBeDefined();
  });

  it('should return an error if a preset is not a function', () => {
    const registry = new Registry();
    const preset = registry.add('preset', 'string');
    const config = loadConfig(
      {
        presets: [preset],
        plugins: [],
      },
      registry.resolve
    );
    expect(config.presets[0].error).toBeDefined();
  });

  it('should return an error if a plugin is not a function', () => {
    const registry = new Registry();
    const plugin = registry.add('plugin', 'string');
    const config = loadConfig(
      {
        presets: [],
        plugins: [plugin],
      },
      registry.resolve
    );
    expect(config.plugins[0].error).toBeDefined();
  });

  it('should return an error if a preset fails to initialize', () => {
    const registry = new Registry();
    const preset = registry.add('preset', () => {
      throw new Error('error');
    });
    const config = loadConfig(
      {
        presets: [preset],
        plugins: [],
      },
      registry.resolve
    );
    expect(config.presets[0].error).toBeDefined();
  });

  it('should load the definition for a plugin', () => {
    const registry = new Registry();
    const x = registry.add('cli-plugin-x');
    const config = loadConfig(
      {
        presets: [],
        plugins: [x],
      },
      registry.resolve
    );
    expect(config).toMatchSnapshot();
  });

  it('should load the definition for a preset', () => {
    const registry = new Registry();
    const x = registry.add('cli-plugin-x');
    const y = registry.add('cli-plugin-y');
    const z = registry.add('cli-plugin-z');
    const a = registry.add(
      'cli-preset-a',
      jest.fn(() => ({
        plugins: [x, y, z],
      }))
    );
    const b = registry.add(
      'cli-preset-b',
      jest.fn(() => ({
        presets: [a],
      }))
    );
    const config = loadConfig(
      {
        presets: [b],
        plugins: [],
      },
      registry.resolve
    );

    expect(config).toMatchSnapshot();
  });
});
