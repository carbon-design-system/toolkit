/**
 * @jest-environment node
 */

'use strict';

const path = require('path');

const fixtures = path.resolve(__dirname, '../__fixtures__');

describe('config', () => {
  let Config;
  let name;

  beforeEach(() => {
    Config = require('../config');
    name = 'toolkit';
  });

  describe('load', () => {
    describe('with no config', () => {
      it('should return an empty config', () => {
        const fixture = path.join(fixtures, 'with-no-config');
        const { noConfig } = Config.load({ name, cwd: fixture });
        expect(noConfig).toBeDefined();
        expect(noConfig).toBe(true);
      });
    });

    describe('with invalid config', () => {
      it('should report a validation error', () => {
        const fixture = path.join(fixtures, 'with-invalid-config');
        const { error } = Config.load({ name, cwd: fixture });
        expect(error).toBeDefined();
      });
    });

    describe('with config', () => {
      it('should return the config and plugins to load', () => {
        const fixture = path.join(fixtures, 'with-config');
        const { config, filepath, plugins } = Config.load({
          name,
          cwd: fixture,
        });
        expect(filepath).toBeDefined();
        expect(config).toMatchSnapshot();
        expect(plugins).toMatchSnapshot();
      });
    });
  });
});
