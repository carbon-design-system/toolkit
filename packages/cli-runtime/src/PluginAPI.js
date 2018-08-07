'use strict';

const Store = require('./Store');

class PluginAPI {
  constructor({ store = new Store() } = {}) {
    this.store = store;
  }

  // Store proxy methods
  read(...args) {
    return this.store.read(...args);
  }

  extend(...args) {
    return this.store.write(...args);
  }
}

module.exports = PluginAPI;
