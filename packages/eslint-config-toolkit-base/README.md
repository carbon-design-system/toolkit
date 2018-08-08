# `eslint-config-toolkit-base`

> Base ESLint config for `@carbon/toolkit` projects

## Usage

Run the following command using [npm](https://www.npmjs.com/):

```bash
npm install eslint-config-toolkit-base --save
```

If you prefer [Yarn](https://yarnpkg.com/en/), use the following command instead:

```base
yarn add eslint-config-toolkit-base
```

In addition, `eslint-config-toolkit-base` requires `eslint` and `eslint-plugin-import` to be installed. You can install the correct versions of each package by running the following command:

```bash
npm info "eslint-config-toolkit-base@latest" peerDependencies
```

This typically gives you an output like:

```bash
{ eslint: '^3.19.0', 'eslint-plugin-import': '^2.2.0' }
```

Which you can then use like:

```bash
npm i eslint@^3.19.0 eslint-plugin-import@^2.2.0 --save-dev
```

Finally, just add `"extends": "toolkit-base"` to your `.eslintrc`.

In addition, we also have a sample project available in the `examples` folder of this project.
