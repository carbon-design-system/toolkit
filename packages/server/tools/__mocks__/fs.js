'use strict';

const path = require.requireActual('path');

const fs = jest.genMockFromModule('fs');

let mockFiles = Object.create(null);
const __setMockFiles = newMockFiles => {
  mockFiles = Object.create(null);

  for (const file in newMockFiles) {
    const dir = path.dirname(file);

    if (mockFiles[dir] === undefined) {
      mockFiles[dir] = {};
    }

    mockFiles[dir][path.basename(file)] = newMockFiles[file];
  }
};

const writeFileSync = (filePath, contents) => {
  const dir = path.dirname(filePath);

  if (mockFiles[dir] === undefined) {
    mockFiles[dir] = {};
  }

  mockFiles[dir][path.basename(filePath)] = {
    readFileSync: contents,
  };
};

const existsSync = filePath => {
  const dir = path.dirname(filePath);
  const basename = path.basename(filePath);

  return mockFiles[dir] && mockFiles[dir][basename];
};

const __getMockFiles = () => mockFiles;

const mockFsMethod = method => filePath => {
  const dir = path.dirname(filePath);
  const fileName = path.basename(filePath);
  return mockFiles[dir][fileName][method];
};

fs.__setMockFiles = __setMockFiles;
fs.__getMockFiles = __getMockFiles;

fs.statSync = mockFsMethod('statSync');
fs.readFileSync = mockFsMethod('readFileSync');
fs.writeFileSync = writeFileSync;
fs.existsSync = existsSync;

module.exports = fs;
