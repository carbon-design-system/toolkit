#!/bin/bash

# temp_app_path=`mktemp -d 2>/dev/null || mktemp -d -t 'temp_app_path'`
# custom_registry="verdaccio:4873"
# custom_registry_url="http://$custom_registry"
# original_npm_registry_url=`npm get registry`
# original_yarn_registry_url=`yarn config get registry`

# npm set registry "$custom_registry_url"
# yarn config set registry "$custom_registry_url"

# function cleanup {
  # echo 'Cleaning up.'
  # cd "$root_path"
  # rm -rf "$temp_app_path"
# }

# export TOOLKIT_CLI_ENV=test

# cd "$temp_app_path"
# yarn init -y
# npx @carbon/toolkit init --skip
# $(yarn bin)/toolkit add @carbon/cli-plugin-eslint
# yarn list

# # touch index.js
# # yarn lint

# cleanup
