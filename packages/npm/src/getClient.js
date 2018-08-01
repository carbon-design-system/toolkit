'use strict';

const { spawn } = require('@carbon/cli-tools');
const fs = require('fs-extra');
const path = require('path');

async function getClient(root) {
  const yarnLockfile = path.join(root, 'yarn.lock');
  if (await fs.pathExists(yarnLockfile)) {
    return {
      npmClient: 'yarn',
    };
  }

  const npmLockfile = path.join(root, 'package-lock.json');
  if (await fs.pathExists(npmLockfile)) {
    return {
      npmClient: 'npm',
    };
  }

  try {
    await spawn('yarn', ['--version'], { cwd: root });
    return {
      npmClient: 'yarn',
    };
  } catch (error) {}

  try {
    await spawn('npm', ['--version'], { cwd: root });
    return {
      npmClient: 'npm',
    };
  } catch (error) {}

  return {
    error: new Error(`Cannot infer npm client from: ${root}`),
  };
}

module.exports = getClient;
