'use strict';

class Store {
  constructor() {
    this._store = new Map();
  }

  read(path) {
    return this._store.get(path);
  }

  write(path, updater) {
    const prevValue = this._store.has(path) ? this._store.get(path) : {};
    const value = updater(prevValue);
    return this._store.set(path, value);
  }
}

module.exports = Store;
