'use strict';

const fs = require('fs-extra');
const path = require('path');
const { createClient, getClient } = require('../packages/npm/src');

const ROOT_DIR = path.resolve(__dirname, '../');
const PACKAGES_DIR = path.join(ROOT_DIR, 'packages');

async function link() {
  const npmClient = await getClient(ROOT_DIR);
  const { error, linkDependency } = await createClient(npmClient, ROOT_DIR);
  if (error) {
    throw error;
  }

  const packages = (await fs.readdir(PACKAGES_DIR)).map(name =>
    path.join(PACKAGES_DIR, name)
  );

  for (const pkg of packages) {
    await linkDependency(pkg);
  }
}

link().catch(error => {
  console.error(error);
});
