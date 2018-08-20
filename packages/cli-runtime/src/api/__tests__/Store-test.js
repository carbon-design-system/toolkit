/**
 * @jest-environment node
 */

'use strict';

describe('Store', () => {
  let Store;
  let mockKey;
  let mockValue;
  let mockWriter;
  let mockChainWriter;

  beforeEach(() => {
    Store = require('../Store');

    mockKey = 'mock.key';
    mockValue = 0;
    mockWriter = jest.fn(() => mockValue);
    mockChainWriter = jest.fn(value => value + 1);
  });

  it('should record a write but not commit it to the store until a read', async () => {
    const store = new Store();

    await store.write(mockKey, mockWriter);

    const value = await store.read(mockKey);
    expect(mockWriter).toHaveBeenCalledTimes(1);
    expect(value).toEqual(mockValue);
  });

  it('should let multiple writers be defined that write in order of store call', async () => {
    const store = new Store();

    await store.write(mockKey, mockWriter);
    await store.read(mockKey);
    expect(mockWriter).toHaveBeenCalledTimes(1);

    await store.write(mockKey, mockChainWriter);

    const value = await store.read(mockKey);
    expect(mockChainWriter).toHaveBeenCalledTimes(1);
    expect(value).toBe(1);
  });
});
