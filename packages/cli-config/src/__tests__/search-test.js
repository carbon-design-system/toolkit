/**
 * @jest-environment node
 */

'use strict';

const path = require('path');

const fixtures = path.resolve(__dirname, '../__fixtures__');

describe('search', () => {
  let search;

  beforeEach(() => {
    search = require('../search');
  });

  it('should return a result if a config is found in the cwd', () => {
    const fixturePath = path.join(fixtures, 'with-config');
    const result = search('toolkit', fixturePath);

    expect(result.noConfig).toBeFalsy();
    expect(result.config).toBeDefined();
    expect(result.filepath).toBeDefined();
    expect(result.isEmpty).toBeFalsy();
  });

  it('should return with no config if not found in cwd', () => {
    const fixturePath = path.join(fixtures, 'with-no-config');
    const result = search('toolkit', fixturePath);
    expect(result.noConfig).toBe(true);
  });
});
