'use strict';

const get = require('lodash.get');
const set = require('lodash.set');

class Store {
  constructor() {
    this._store = {};
    this._writers = {};
  }

  async read(path) {
    const entry = get(this._store, path);
    const writers = this._writers[path] || [];

    if (entry && isEqual(entry.writers, writers)) {
      return entry.value;
    }

    // Initialize default value to an empty object
    let value = {};

    if (Array.isArray(this._writers[path])) {
      for (const writer of this._writers[path]) {
        value = await writer(value);
      }
    }

    set(this._store, path, {
      value,
      // Shallow clone of array so that array reference is not identical, but
      // the writer references are so we can compare them in a subsequent read
      writers: writers.slice(),
    });

    return value;
  }

  write(path, writer) {
    if (!Array.isArray(this._writers[path])) {
      this._writers[path] = [writer];
      return;
    }

    this._writers[path].push(writer);
  }
}

/**
 * Shallow equality comparison for two arrays
 * @param {Array[any]} collectionA
 * @param {Array[any]} collectionB
 * @return boolean
 */
function isEqual(collectionA, collectionB) {
  if (collectionA.length !== collectionB.length) {
    return false;
  }

  for (let i = 0; i < collectionA.length; i++) {
    if (collectionA[i] !== collectionB[i]) {
      return false;
    }
  }

  return true;
}

module.exports = Store;
