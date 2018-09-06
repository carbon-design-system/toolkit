# Getting Started

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Project overview](#project-overview)
  - [Plugins](#plugins)
    - [Structure](#structure)
    - [Lifecycles](#lifecycles)
    - [Communication](#communication)
- [Development setup](#development-setup)
  - [Project files](#project-files)
- [Common tasks](#common-tasks)
- [FAQ](#faq)
    - [How do I generate a Table of Contents for a piece of documentation?](#how-do-i-generate-a-table-of-contents-for-a-piece-of-documentation)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Project overview

`@carbon/toolkit` is a project that hopes to make it easier to build great UIs on the web for everyone. It hopes to automate the repetitive tasks of setting up a project, ranging from configuring webpack to deploying to a cloud provider.

At its core, Toolkit wants to be a project generator for any target that uses a Node.js-based toolchain. However, it differs from other solutions by providing a way for generated projects to stay up-to-date on the latest and greatest technology. We accomplish this through our plugin system and its accompanying lifecycle hooks.

### Plugins

Plugins are the heart of Toolkit. Each plugin has the ability to do a myriad of things, from changing the runtime behavior of the CLI to changing the files in a project directory when the plugin is added. Plugins are defined through a project's `package.json` file, specifically in the `toolkit` field. Here's an example of a configuration that loads a babel plugin:

```json
{
  "name": "my-project",
  "version": "0.0.0",
  "toolkit": {
    "plugins": ["@carbon/cli-plugin-babel"]
  }
}
```

In this file, we can see the `toolkit` field being defined as an object with a `plugins` field. The plugins array here specifies all the plugins to load for the given project. Folks can add, edit, or remove plugins by just updating this field in their `package.json` file.

#### Structure

At their core, plugins are just `npm` packages that export a single function. This function takes in three arguments:

- `api` used to execute any of the Plugin-related commands
- `options` that allow an end-user to supply options for the plugin before it runs
- `env` which provides environment-specific information for the given Toolkit process

At the end of a day, a typical plugin might look like this:

```js
'use strict';

module.exports = ({ api }) => {
  api.addCommand({
    name: 'echo <message>',
    description: 'Print the given message to the console',
    action(message) {
      console.log(message);
    },
  });
};
```

Breaking down the structure, we have:

- A function being exported
- `api` being read from the arguments in the function
- `api.addCommand` which adds the command to the Toolkit CLI

When Toolkit is ran, the `echo` command will now show up in the CLI.

#### Lifecycles

In addition to adding commands to the CLI, plugins can also define functions that can be run when a plugin is added, updated, or removed. If a plugin author wanted to hook into the event when a plugin was added, they would need to do:

```js
'use strict';

module.exports = ({ api }) => {
  api.add(async () => {
    console.log('Plugin was added!');
  });
};
```

The function passed to `api.add` would only be called whenever the given plugin was added to a project. In addition to executing this function, there are also some helpers that are made available for common project-related tasks, for example:

```js
'use strict';

module.exports = ({ api, options }) => {
  api.add(async ({ extendPackageJson }) => {
    await extendPackageJson(() => ({
      babel: {
        presets: ['@carbon/cli-plugin-babel/config'],
      },
    }));
  });
};
```

In this case, we use the `extendPackageJson` helper to update the local `package.json` in the project.

#### Communication

After a while, plugins will start to become increasingly granular. As a result, we also provide a way for plugins to communicate with each other so that users can easily chain plugins together and still expect them to work.

For example, if we were starting by creating a plugin that managed our webpack configuration we might have a Toolkit configuration that looks like the following:

```json
{
  "name": "my-project",
  "version": "0.0.0",
  "toolkit": {
    "plugins": ["webpack-plugin"]
  }
}
```

This would load all of the details for webpack, it's accompanying CLI commands, and more. However, if one is working on another project, or wants to edit/extend their own configuration, all they would need to do is make another plugin that extends off of previous ones. This extend concept is present in a shared store between all plugins.

During the initial load of all plugins, Toolkit will expose a method `api#extends` that will allow plugins to write arbitrary data to arbitrary keys by doing:

```js
'use strict';

module.exports = ({ api }) => {
  api.extends('count', () => 1);
};
```

In another plugin, we could read this value from `api` by using the `read` method:

```js
'use strict';

module.exports = ({ api }) => {
  console.log(api.read('count')); // 1
};
```

We could also read and update the value in the `extends` writer callback:

```js
'use strict';

module.exports = ({ api }) => {
  api.extends('count', prevCount => prevCount + 1);
};
```

This chaining of plugins can allow us to great fine-grained plugins that can be used in a variety of ways. For example, if we wanted a webpack config that supported Sass we could in theory just add a sass plugin for webpack:

```json
{
  "name": "my-project",
  "version": "0.0.0",
  "toolkit": {
    "plugins": ["webpack-plugin", "webpack-plugin-for-sass"]
  }
}
```

We could even chain it to add support for Yaml or other filetypes. The shared store is essential for this kind of inter-plugin communication that enables chaining configuration through the project.

## Development setup

For development on Toolkit, you will need three things:

- [A forked version of the project](../.github/CONTRIBUTING.md#pull-requests)
- [Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/en/) installed on your machine
- [Docker](https://docs.docker.com/install/) installed on your machine

After following those steps above, downloading the relevant technologies, and installing them you will be able to run the following command at the root of the to install all of the project's dependencies:

```bash
yarn install
```

This install command from Yarn makes use of a feature called [workspaces](https://yarnpkg.com/en/docs/workspaces) which allows us to work on multiple `npm` packages for Toolkit all under the same project.

After installing all the dependencies for the project, you should be good to go!

### Project files

Here is a quick overview of the folders and files at the top-level of the project just to help give a sense of where things are located:

```bash
.
├── LICENSE
├── README.md
├── __mocks__      # Where top-level mocks live for node_modules
├── docs           # Documentation for project developers
├── e2e            # End-to-end tests for the CLI
├── examples       # Examples using the Toolkit project
├── fixtures       # Fixtures used to sanity-check common commands
├── lerna.json     # [Lerna](https://lernajs.io) configuration
├── node_modules
├── package.json
├── packages       # Folder holding all toolkit-related `npm` packages
├── tasks          # Tasks to run to help out with package management
├── test           # Empty folder used for tests
└── yarn.lock
```

Inside of the sub-directories you should find a README.md file with more details on how to use the contents of that folder.

## Common tasks

While working on the project, there are a couple of tasks that you'll most likely find yourself running over-and-over again. Here's a quick list of what might be useful early on to leverage:

- `yarn test`, `yarn test --watch` for running tests in the project
- `yarn clean && yarn install` to clean up the project and start from scratch helpful for resetting lerna or Yarn workspaces
- `yarn lint` for running ESLint on project files
- `yarn format` for running Prettier on project files
- `node tasks/link.js` to link all packages under the `packages` directory. Useful for local development
- `node tasks/sync.js` useful when creating new projects, it adds all package metadata to `package.json`
- `node tasks/unlink.js` to unlink all packages under the `packages` directory

## FAQ

#### How do I generate a Table of Contents for a piece of documentation?

```bash
npx doctoc --title '## Table of Contents' docs/my-docs-file.md
```
