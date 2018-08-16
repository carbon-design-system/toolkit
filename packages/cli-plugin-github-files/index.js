'use strict';

const fs = require('fs-extra');
const path = require('path');

const files = path.join(__dirname, 'files');

module.exports = ({ api, env, options }) => {
  api.add(async ({ copyFolder }) => {
    const folderPath = path.join(env.cwd, '.github');

    if (!(await fs.pathExists(folderPath))) {
      await copyFolder(files, '.github');
      return;
    }

    const { confirm } = await api.prompt([
      {
        name: 'confirm',
        message:
          'Looks like there is a GitHub folder already at ' +
          `${folderPath}.\nAre you sure you want to override it?`,
        type: 'confirm',
      },
    ]);

    if (confirm) {
      await copyFolder(files, '.github');
    }
  });
};
