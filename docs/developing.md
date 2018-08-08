# Developing

## Table of Contents

<!-- To run doctoc, just do `npx doctoc docs/developing.md` -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Getting Started](#getting-started)
- [Architecture](#architecture)
- [Tasks](#tasks)
  - [Linking & Unlinking](#linking--unlinking)
  - [Automating `package.json`](#automating-packagejson)
  - [Publishing](#publishing)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Getting Started

To get started, make sure that you have [Yarn](https://yarnpkg.com/en/)
installed on your machine. Afterwards, you'll need to do run `yarn install` at
the top-level of the project.

This installs all the dependencies for the workspace, and all the dependencies
of each package.

_Note: we're using [Yarn Workspaces](https://yarnpkg.com/blog/2017/08/02/introducing-workspaces/) in order to get this behavior_

## Architecture

TODO

## Tasks

### Linking & Unlinking

If you're looking to quickly link or unlink packages in this project, you can
use the `link` and `unlink` tasks by doing:

```bash
# Will link all packages
node tasks/link.js

# Will unlink all packages
node tasks/unlink.js
```

This is often if you're looking to develop the CLI or plugins locally.

### Automating `package.json`

If you're adding plugins, or just want to make sure all the fields are available
before publishing, you can use the `sync` task by doing the following:

```bash
node tasks/sync.js
```

The `sync` task will make sure that all the projects are in sync for
`package.json` fields like `license`, `repository`, `bugs`, and more.

### Publishing

In order to publish packages, you will need to use the `publish` tasks available
at `tasks/publish.sh`.
