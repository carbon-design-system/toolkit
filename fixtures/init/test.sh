#!/bin/bash

set -e

verbose=false

while [ "$1" != "" ]; do
  case $1 in
    "--verbose")
      verbose=true
      ;;
  esac
  shift
done

if [ "$verbose" == "true" ];
then
  set -x
  export LOG_LEVEL=trace
fi

rm package.json
cp package.json.tmp package.json

export TOOLKIT_CLI_ENV=development

node ../../packages/toolkit/bin/index.js init --link --link-cli --skip
