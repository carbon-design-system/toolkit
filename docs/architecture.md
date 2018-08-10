# Architecture

> Brief overview of how everything (should) work.

<!-- To run doctoc, just do `npx doctoc docs/developing.md` -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Runtime](#runtime)
  - [The `load` command](#the-load-command)
- [Toolkit CLI](#toolkit-cli)
- [Plugins](#plugins)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Runtime

[`@carbon/cli-runtime`](../packages/cli-runtime) is the core package that
orchestrates the capabilities of `@carbon/toolkit`. It is also a module that
allows plugins and other ad-hoc pieces of code to load the current runtime
configuration to mirror what a CLI script may be executing. This is useful so
that we can retrieve this information in developer-related tooling like a UI.

The core method for the runtime is `load()` which will load the configuration
for the current working directory. There are a couple development-related flags
that you can turn on if you want to see what is happening under the hood while
running a command, namely:

- `LOG_LEVEL` environment variable, can be set to `trace` to view all info
- `TOOLKIT_CLI_ENV` environment variable, used to toggle between development and
  production capabilities

### The `load` command

The `load` command from `@carbon/cli-runtime` goes through the following steps
at a high-level:

- Read environment variables mentioned above to determine the CLI environment
- Initialize the API provided to plugins
- Load the configuration for the given current working directory
- Load the default plugins/commands for the Toolkit
- If a configuration exists, and plugins are available, execute each plugin with
  the Plugin API initialized above

## Toolkit CLI

[`@carbon/toolkit`](../packages/toolkit) is the entrypoint most folks will have
with the Toolkit. This package relies on `@carbon/cli-runtime` to load the
configuration and defaults for the toolkit, and then uses this information to
initialize a CLI instance using the `commander` module.

The main piece of code in the CLI is `addCommandToProgram`, which reads the
commands that were initialized from `load` and adds them to the initialized
`commander` program.

Afterwards, we process the arguments passed to the CLI and execute the command
as expected.

## Plugins

Plugins are the fundamental piece of architecture for `@carbon/toolkit`. At
their core, each plugin should be a module that exports a function. This
function is then executed during the `load` phase of the runtime, or during a
lifecycle method like when a plugin is added or upgraded.

This function is executed with an instance of a PluginAPI, which defines a
series of commands that the plugin itself can execute. For example, a plugin
that adds a command to the CLI might look like:

```js
'use strict';

module.exports = ({ api }) => {
  api.addCommand({
    name: 'my-custom-command',
    action() {
      console.log('Running my custom command');
    },
  });
};
```

When the runtime for `@carbon/toolkit` is initialized, this function is called
and the command is added through the `#addCommand` method.

There are a variety of hooks that plugins can use, from copying files to adding
hooks for plugin lifecycle events.
