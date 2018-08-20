'use strict';

const { spawn } = require('@carbon/cli-tools');
const fs = require('fs-extra');
const path = require('path');

async function getClient(root) {
  const yarnLockfile = path.join(root, 'yarn.lock');
  if (await fs.pathExists(yarnLockfile)) {
    return 'yarn';
  }

  const npmLockfile = path.join(root, 'package-lock.json');
  if (await fs.pathExists(npmLockfile)) {
    return 'npm';
  }

  try {
    await spawn('yarn', ['--version'], { cwd: root, stdio: 'ignore' });
    return 'yarn';
  } catch (error) {}

  try {
    await spawn('npm', ['--version'], { cwd: root });
    return 'npm';
  } catch (error) {}

  return 'npm';
}

function getClientSync(root) {
  const yarnLockfile = path.join(root, 'yarn.lock');
  if (fs.pathExistsSync(yarnLockfile)) {
    return 'yarn';
  }

  const npmLockfile = path.join(root, 'package-lock.json');
  if (fs.pathExistsSync(npmLockfile)) {
    return 'npm';
  }

  try {
    spawn.sync('yarn', ['--version'], { cwd: root, stdio: 'ignore' });
    return 'yarn';
  } catch (error) {}

  try {
    spawn.sync('npm', ['--version'], { cwd: root });
    return 'npm';
  } catch (error) {}

  return 'npm';
}

getClient.sync = getClientSync;

module.exports = getClient;
