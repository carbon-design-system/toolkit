#!/bin/bash

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

function setup {
  echo "#######################################################################"
  echo "# Running setup"
  echo "#######################################################################"
  echo ""

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
}

function teardown {
  echo ""
  echo "#######################################################################"
  echo "# Running teardown"
  echo "#######################################################################"

  cleanup
}
