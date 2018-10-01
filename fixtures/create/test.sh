#!/bin/bash

set -e
set -x

modules="@carbon/cli-preset-test"
verbose=false

while [ "$1" != "" ]; do
  case $1 in
    '--verbose')
      verbose=true
      ;;
  esac
  shift
done

if [ "$verbose" == "true" ];
then
  export LOG_LEVEL=trace
fi

export TOOLKIT_CLI_ENV=development

rm -rf skip-prompt use-plugins use-presets

# Skip
node ../../packages/toolkit/bin/index.js create skip-prompt \
  --link \
  --link-cli \
  --skip

# Plugins
node ../../packages/toolkit/bin/index.js create use-plugins \
  --link \
  --link-cli \
  --plugins='@carbon/cli-plugin-prettier'

# Presets
node ../../packages/toolkit/bin/index.js create use-presets \
  --link \
  --link-cli \
  --presets='@carbon/cli-preset-test'
