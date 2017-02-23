#!/usr/bin/env bash

# Copyright 2017 The TIE Authors. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS-IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

#############################################################
# Installs a node module at a particular version.
# Usage: install_node_module [module_name] [module_version]
# Globals:
#   NPM_INSTALLED_MODULES
# Arguments:
#   module_name: the name of the node module
#   module_version: the expected version of the module
# Returns:
#   None
#############################################################
# Install node.
export OS=`uname`
export MACHINE_TYPE=`uname -m`
export TOOLS_DIR=./tools
export NODE_DIR=$TOOLS_DIR/node-6.9.1
export NPM_CMD=$NODE_DIR/bin/npm

install_node_module() {
  if [[ $NPM_INSTALLED_MODULES != *"$1@$2"* ]]; then
    echo Installing $1@$2
    $NPM_CMD install $1@$2
    NPM_INSTALLED_MODULES="$(npm list)"
  fi
}

# Download and install node.js.
echo Checking if node.js is installed in $NODE_DIR
if [ ! -d "$NODE_DIR" ]; then
  echo Installing Node.js
  if [ ${OS} == "Darwin" ]; then
    if [ ${MACHINE_TYPE} == 'x86_64' ]; then
      NODE_FILE_NAME=node-v6.9.1-darwin-x64
    else
      NODE_FILE_NAME=node-v6.9.1-darwin-x86
    fi
  elif [ ${OS} == "Linux" ]; then
    if [ ${MACHINE_TYPE} == 'x86_64' ]; then
      NODE_FILE_NAME=node-v6.9.1-linux-x64
    else
      NODE_FILE_NAME=node-v6.9.1-linux-x86
    fi
  fi

  if [ ! -d "$TOOLS_DIR" ]; then
    mkdir tools
  fi

  curl -o node-download.tgz http://nodejs.org/dist/v6.9.1/$NODE_FILE_NAME.tar.gz
  tar xzf node-download.tgz --directory $TOOLS_DIR
  mv $TOOLS_DIR/$NODE_FILE_NAME $NODE_DIR
  rm node-download.tgz

  # Change ownership of $NODE_MODULE_DIR.
  # chown -R $ME $NODE_MODULE_DIR
  # chmod -R 744 $NODE_MODULE_DIR
fi

# Generate a list of already-installed modules.
NPM_INSTALLED_MODULES="$(npm list)"

# Install the following node modules if they aren't already installed.
install_node_module karma 1.4.1
install_node_module karma-jasmine 1.1.0
install_node_module karma-chrome-launcher 2.0.0
install_node_module jasmine-core 2.5.2

# Run Karma.
./node_modules/karma/bin/karma start
