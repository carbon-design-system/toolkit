/**
 * @jest-environment node
 */

'use strict';

describe('errorf tools', () => {
  let errorf;

  beforeEach(() => {
    errorf = require('../errorf');
  });

  it('should generate an error message with a simple string', () => {
    const error = new Error('some error');
    expect(errorf(error, 'some detail')).toEqual({
      title: 'some error',
      details: ['some detail'],
    });
  });

  it('should add values to the format string', () => {
    const error = new Error('some error');
    const format = 'number %s string %s boolean %s';
    const args = [1, 'foo', true];

    expect(errorf(error, format, ...args)).toEqual({
      title: 'some error',
      details: ['number 1 string foo boolean true'],
    });
  });
});
