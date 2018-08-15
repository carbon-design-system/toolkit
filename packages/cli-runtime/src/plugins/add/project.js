'use strict';

const fs = require('fs-extra');
const merge = require('lodash.merge');
const path = require('path');

function create({
  cliPath,
  npmClient,
  readPackageJson,
  writePackageJson,
  installDependencies,
  installDevDependencies,
  linkDependencies,
  root,
}) {
  return {
    copyFolder(source, target = path.basename(source)) {
      return fs.copy(source, path.join(root, target));
    },
    write: write(root),
    extendPackageJson: extendPackageJson(
      cliPath,
      npmClient,
      readPackageJson,
      writePackageJson
    ),
    installDependencies,
    installDevDependencies,
    linkDependencies,
  };
}

function write(root) {
  return async (filename, content, ...args) => {
    const filePath = path.join(root, filename);
    await fs.ensureFile(filePath);
    return fs.writeFile(filePath, content, ...args);
  };
}

function extendPackageJson(
  cliPath,
  npmClient,
  readPackageJson,
  writePackageJson
) {
  return async updater => {
    const packageJson = await readPackageJson();
    const changes = updater({ cliPath, npmClient, packageJson });
    const nextPackageJson = merge(packageJson, changes);

    nextPackageJson.scripts = alphabetize(nextPackageJson.scripts);

    await writePackageJson(nextPackageJson);
  };
}

function alphabetize(object) {
  return Object.keys(object)
    .sort()
    .reduce((acc, key) => {
      const value = object[key];
      return {
        ...acc,
        [key]: typeof value === 'object' ? alphabetize(object) : value,
      };
    }, {});
}

module.exports = {
  create,
  copy,
  write,
};
