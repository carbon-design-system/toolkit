/**
 * @jest-environment node
 */

/* eslint-disable import/no-dynamic-require */

'use strict';

const path = require('path');

describe('loader', () => {
  let loader;

  beforeEach(() => {
    loader = require('../loader').loader;
  });

  it('should be able to safely require a module by a file path', () => {
    const fixturePath = path.resolve(__dirname, '../__fixtures__/modules/a.js');
    const fixture = require(fixturePath);

    expect(loader(fixturePath)).toEqual({
      module: fixture,
    });
  });

  it('should be able to safely require a module if it is installed', () => {
    expect(loader('path')).toEqual(
      expect.objectContaining({
        module: expect.any(Object),
      })
    );
  });

  it('should return an error if given an invalid module', () => {
    const { error } = loader('__abcd__efghi');
    expect(error).toBeDefined();
    expect(error.message).toMatch(`Cannot find module '__abcd__efghi'`);
  });
});
