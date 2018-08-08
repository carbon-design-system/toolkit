# `stylelint-config-toolkit`

## Usage

Run the following command using [npm](https://www.npmjs.com/):

```bash
npm i stylelint stylelint-config-toolkit --save-dev
```

If you prefer [Yarn](https://yarnpkg.com/en/), use the following command instead:

```bash
yarn add stylelint stylelint-config-toolkit --dev
```

## Configuration

Now that you've added `stylelint` and the `stylelint` configuration for toolkit,
you can specify your configuration in one of [these
locations](https://github.com/stylelint/stylelint/blob/master/docs/user-guide/configuration.md#loading-the-configuration-object).

For example, if I included a `stylelint` key in the `package.json` file in a
project then I would do the following:

```json
{
  "stylelint": {
    "extends": "stylelint-config-toolkit"
  }
}
```

You can always override any rule that `stylelint-config-toolkit` provides that
causes issues in your codebase by adding additional rules to the `rules` key.
You can also use `stylelint-config-toolkit` with any other `stylelint` plugins by
changing the `extends` value to an array and including the packages alongside
`stylelint-config-toolkit`.

## 🤲 Contributing

To learn more about how to contribute, look [here](/.github/CONTRIBUTING.md)!
