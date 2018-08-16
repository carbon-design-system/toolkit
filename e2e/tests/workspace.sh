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
touch package.json
echo "workspaces-experimental true" >> .yarnrc
echo '{"name": "workspace", "private": true, "workspaces": ["packages/*"]}' >> package.json

npx @carbon/toolkit init --skip

cleanup
