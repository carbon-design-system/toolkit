'use strict';

const fork = require('./fork');
const Store = require('./Store');
const { validate } = require('./validation/command');

function create({ env, store = new Store() }) {
  const commands = [];

  function addCommand(command, plugin) {
    const { error } = validate(command);
    if (error) {
      throw error;
    }
    commands.push({
      command,
      plugin,
    });
  }

  return {
    fork: fork({
      addCommand,
      env,
      extend(...args) {
        return store.write(...args);
      },
      read(...args) {
        return store.read(...args);
      },
    }),
    getCommands() {
      return commands.map(({ command }) => command);
    },
    store,
  };
}

module.exports = create;
