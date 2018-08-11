/**
 * @jest-environment node
 */

'use strict';

const { createFsFromVolume, Volume } = require('memfs');

// eslint-disable-next-line no-console
const originalConsoleLog = console.log;

xdescribe('create plugin', () => {
  let mockName;
  let mockCmd;
  let mockEnv;
  let mockVol;
  let mockFs;

  let fs;
  let create;

  beforeEach(() => {
    jest.resetModules();

    mockName = 'foo';
    mockCmd = {
      link: false,
      linkCli: false,
    };
    mockEnv = {
      cwd: '/',
      npmClient: 'npm',
      spinner: {
        start: jest.fn(),
        stop: jest.fn(),
        succeed: jest.fn(),
        fail: jest.fn(),
        warn: jest.fn(),
        info: jest.fn(),
      },
    };

    mockVol = Volume.fromJSON({
      '/exists/package.json': '{ "name": "exists" }',
    });
    mockFs = createFsFromVolume(mockVol);

    jest.mock('fs', () => mockFs);

    fs = require('fs-extra');
    create = require('../create');

    // eslint-disable-next-line no-console
    console.log = jest.fn();
  });

  afterEach(() => {
    // eslint-disable-next-line no-console
    console.log = originalConsoleLog;
  });

  it('should warn if a folder already exists for the project name', () => {
    expect(create('exists', mockCmd, mockEnv)).rejects.toThrow();
  });

  it('should create a folder to make the project in', async () => {
    await create(mockName, mockCmd, mockEnv);
    expect(await fs.exists(`/${mockName}`)).toBe(true);
  });

  it('should initialize the project with a `package.json` file', async () => {
    await create(mockName, mockCmd, mockEnv);
    expect(await fs.exists(`/${mockName}/package.json`)).toBe(true);
  });

  // Plugins arg in CLI
  // NO plugins from inquirer
  // plugins from inquirer
});
