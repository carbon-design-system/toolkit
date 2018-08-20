#!/bin/bash

temp_app_path=`mktemp -d 2>/dev/null || mktemp -d -t 'temp_app_path'`
custom_registry="verdaccio:4873"
custom_registry_url="http://$custom_registry"
original_npm_registry_url=`npm get registry`
original_yarn_registry_url=`yarn config get registry`

function cleanup {
  echo 'Cleaning up.'
  cd "$root_path"
  rm -rf "$temp_app_path"
  npm set registry "$original_npm_registry_url"
  yarn config set registry "$original_yarn_registry_url"
}

# Error messages are redirected to stderr
function handle_error {
  echo "$(basename $0): ERROR! An error was encountered executing line $1." 1>&2;
  cleanup
  echo 'Exiting with error.' 1>&2;
  exit 1
}

function handle_exit {
  cleanup
  echo 'Exiting without error.' 1>&2;
  exit
}

# Check for the existence of one or more files.
function exists {
  for f in $*; do
    test -e "$f"
  done
}

# Exit the script with a helpful error message when any error is encountered
trap 'set +x; handle_error $LINENO $BASH_COMMAND' ERR

# Cleanup before exit on any termination signal
trap 'set +x; handle_exit' SIGQUIT SIGTERM SIGINT SIGKILL SIGHUP

# Echo every command being executed
set -x

# Update `npm` config settings to let packages like `node-sass` install
npm config set user 0
npm config set unsafe-perm true

# Handle network timeout issue with verdaccio
yarn config set network-timeout 1000000

# Start in e2e/ even if run from root directory
cd "$(dirname "$0")"

# Go to root
cd ..
root_path=$PWD
fixtures_path=$PWD/e2e/fixtures

export root_path

# Verify local registry has started
/bin/bash ./e2e/wait-for-it.sh "$custom_registry"

# Set registry to local registry
npm set registry "$custom_registry_url"
yarn config set registry "$custom_registry_url"

# Login so we can publish packages
npx npm-auth-to-token@1.0.0 -u user -p password -e user@example.com -r "$custom_registry_url"

# Publish the monorepo
./node_modules/.bin/lerna publish \
  --yes \
  --exact \
  --skip-git \
  --cd-version=prerelease \
  --force-publish=* \
  --npm-tag=latest

export TOOLKIT_CLI_ENV=test

for script in ./e2e/tests/*; do
  /bin/bash $script
done || exit 1
