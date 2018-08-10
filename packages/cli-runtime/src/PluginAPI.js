'use strict';

const Store = require('./Store');
const { validate } = require('./validation/command');

class PluginAPI {
  constructor({ store = new Store() } = {}) {
    this.commands = [];
    this.store = store;
  }

  // Store proxy methods
  read(...args) {
    return this.store.read(...args);
  }

  extend(...args) {
    return this.store.write(...args);
  }

  // CLI-related methods
  addCommand(command) {
    const { error } = validate(command);
    if (error) {
      throw error;
    }
    this.commands.push(command);
  }

  getCommands() {
    return this.commands;
  }

  add() {}
}

module.exports = PluginAPI;
