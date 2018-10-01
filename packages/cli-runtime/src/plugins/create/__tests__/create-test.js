/**
 * @jest-environment node
 */

'use strict';

const { createFsFromVolume, Volume } = require('memfs');

xdescribe('create plugin', () => {
  let mockApi;
  let mockName;
  let mockOptions;
  let mockEnv;
  let mockVol;
  let mockFs;

  let fs;
  let npmClient;
  let create;

  beforeEach(() => {
    jest.resetModules();

    mockApi = {};
    mockName = 'foo';
    mockOptions = {
      link: false,
      linkCli: false,
    };
    mockEnv = {
      cwd: '/',
      npmClient: 'npm',
    };

    mockVol = Volume.fromJSON({
      '/exists/package.json': '{ "name": "exists" }',
    });
    mockFs = createFsFromVolume(mockVol);

    jest.mock('@carbon/npm');
    jest.mock('fs', () => mockFs);

    fs = require('fs-extra');
    npmClient = require('@carbon/npm').createClient.mock;
    create = require('../create');
  });

  it('should warn if a folder already exists for the project name', () => {
    expect(create('exists', mockOptions, mockApi, mockEnv)).rejects.toThrow(
      'A folder already exists at `/exists`'
    );
  });

  it('should create a folder and package.json when starting a project', async () => {
    await create(mockName, mockOptions, mockApi, mockEnv);
    // Check for folder
    expect(await fs.exists(`/${mockName}`)).toBe(true);
    // Check for package.json
    expect(await fs.exists(`/${mockName}/package.json`)).toBe(true);
  });

  it('should install toolkit as a dependency', async () => {
    await create(mockName, mockOptions, mockApi, mockEnv);
    expect(npmClient.installDependencies).toHaveBeenCalledWith([
      '@carbon/toolkit',
    ]);
  });
});
