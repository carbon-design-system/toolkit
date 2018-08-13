#!/bin/bash

# Echo every command being executed
set -x

TOOLKIT_CLI_ENV=test
temp_app_path=`mktemp -d 2>/dev/null || mktemp -d -t 'temp_app_path'`

function cleanup {
  echo 'Cleaning up.'
  cd "$root_path"
  rm -rf "$temp_app_path"
}

cd "$temp_app_path"
yarn init -y
npx @carbon/toolkit init --skip
yarn toolkit add @carbon/cli-plugin-prettier @carbon/cli-plugin-editorconfig
cat package.json

cleanup
