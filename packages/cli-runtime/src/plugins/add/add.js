'use strict';

const {
  loadConfig,
  loadPlugin,
  loadPreset,
  resolve,
} = require('@carbon/cli-config');
const { createClient, getPackageInfoFrom } = require('@carbon/npm');
const invariant = require('invariant');
const { create } = require('./project');

async function add(api, env, descriptors, cmd) {
  const { cwd, npmClient: npmClientName } = env;
  const packages = descriptors.map(getPackageInfoFrom);

  const npmClient = createClient(npmClientName, cwd);
  const {
    error,
    readPackageJson,
    writePackageJson,
    linkDependencies,
    installDependencies,
  } = npmClient;
  if (error) {
    throw error;
  }

  const { error: loadConfigError, config } = await loadConfig({ cwd: env.cwd });
  if (loadConfigError) {
    throw loadConfigError;
  }

  if (!config) {
    throw new Error(`No configuration found for toolkit in: ${env.cwd}`);
  }
  const { presets = [], plugins = [] } = packages.reduce((acc, pkg) => {
    if (pkg.name.indexOf('plugin') !== -1) {
      if (Array.isArray(acc.plugins)) {
        return {
          ...acc,
          plugins: acc.plugins.concat(pkg),
        };
      }
      return {
        ...acc,
        plugins: [pkg],
      };
    }

    if (pkg.name.indexOf('preset') !== -1) {
      if (Array.isArray(acc.presets)) {
        return {
          ...acc,
          presets: acc.presets.concat(pkg),
        };
      }
      return {
        ...acc,
        presets: [pkg],
      };
    }

    // Default to just returning the collection so far if we can't parse the
    // package type
    return acc;
  }, {});

  for (const { name } of presets) {
    invariant(
      !config.presets.find(preset => preset.name === name),
      'Preset `%s` has already been added to your config in: %s',
      name,
      env.cwd
    );
  }
  for (const { name } of plugins) {
    invariant(
      !config.plugins.find(plugin => plugin.name === name),
      'Plugin `%s` has already been added to your config in: %s',
      name,
      env.cwd
    );
  }

  const packageNames = [...presets, ...plugins].map(({ name, version }) => {
    return cmd.link ? name : `${name}@${version}`;
  });
  const installer = cmd.link ? linkDependencies : installDependencies;

  await installer(packageNames);

  for (const { name } of presets) {
    invariant(
      !config.presets.find(preset => preset.name === name),
      'Preset `%s` has already been added to your config in: %s',
      name,
      env.cwd
    );

    const projectPackageJson = await readPackageJson();
    await writePackageJson({
      ...projectPackageJson,
      toolkit: {
        presets: Array.isArray(projectPackageJson.toolkit.presets)
          ? [...projectPackageJson.toolkit.presets, name]
          : [name],
      },
    });

    const { error: loadPresetError, plugins: presetPlugins } = await loadPreset(
      name,
      resolve
    );
    if (loadPresetError) {
      throw loadPresetError;
    }

    await addPlugins(
      presetPlugins,
      config,
      installer,
      npmClient,
      api,
      cmd,
      env
    );
  }

  if (Array.isArray(plugins) && plugins.length > 0) {
    await addPlugins(plugins, config, installer, npmClient, api, cmd, env);

    const pluginNames = plugins.map(({ name }) => name);
    const projectPackageJson = await readPackageJson();
    const toolkit = {
      ...projectPackageJson.toolkit,
      plugins: Array.isArray(projectPackageJson.toolkit.plugins)
        ? [...projectPackageJson.toolkit.plugins, ...pluginNames]
        : pluginNames,
    };

    await writePackageJson({
      ...projectPackageJson,
      toolkit,
    });
  }
}

async function addPlugins(
  plugins,
  config,
  installer,
  npmClient,
  api,
  cmd,
  env
) {
  for (const { name } of plugins) {
    invariant(
      !config.plugins.find(plugin => plugin.name === name),
      'Plugin `%s` has already been added to your config in: %s',
      name,
      env.cwd
    );
  }

  await installer(
    plugins.map(plugin => {
      const { name, version } = plugin;
      return cmd.link ? name : `${name}@${version}`;
    })
  );

  for (const { name } of plugins) {
    const { error: loadPluginError, options, plugin } = await loadPlugin(
      name,
      resolve
    );
    if (loadPluginError) {
      throw loadPluginError;
    }
    const lifecycle = api.fork(name);
    await plugin({
      api: lifecycle,
      options,
      env,
    });
    await lifecycle.run(
      'add',
      create({
        ...npmClient,
        cliPath: cmd.linkCli ? await api.which('toolkit') : 'toolkit',
        root: env.cwd,
      })
    );
  }
}

module.exports = add;
