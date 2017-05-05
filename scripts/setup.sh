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
#
# Flags:
#   --disable-presubmit-checks: set to disable hooks that run presubmit checks.

set -e

export OS=`uname`
export MACHINE_TYPE=`uname -m`
export TOOLS_DIR=./tools
export NODE_DIR=$TOOLS_DIR/node-6.9.1
if [ ${OS} == "MINGW_NT-10.0" ]; then
  export NPM_CMD=$NODE_DIR/npm
else
  export NPM_CMD=$NODE_DIR/bin/npm
fi
export NODE_MODULES_DIR=./node_modules
# Adjust PATH to include a reference to node.
export PATH=$NODE_DIR/bin:$PATH

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
install_node_module() {
  if [[ $NPM_INSTALLED_MODULES != *"$1@$2"* ]]; then
    echo Installing $1@$2
    $NPM_CMD install $1@$2
    NPM_INSTALLED_MODULES="$(npm list)"
  fi
}

# Set up hooks if not disabled.
if ! [[ $* == *--disable-presubmit-checks* ]]; then
  git config core.hooksPath hooks
  chmod u+x hooks/pre-push
fi

export -f install_node_module

# Ensure that there is a node_modules folder in the root, otherwise node may
# put libraries in the wrong place. See
#
#     https://docs.npmjs.com/files/folders#more-information
if [ ! -d "$NODE_MODULES_DIR" ]; then
  mkdir $NODE_MODULES_DIR
fi

# Download and install node.js, if necessary.
echo Checking if node.js is installed in $NODE_DIR
if [ ! -d "$NODE_DIR" ]; then
  echo Installing Node.js for ${OS}
  ON_WIN=false
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
  elif [ ${OS} == MINGW64_NT-10.0 ]; then
    ON_WIN=true
    NODE_FILE_NAME=node-v6.9.1-win-x64
  fi

  if [ ! -d "$TOOLS_DIR" ]; then
    mkdir tools
  fi


  if $ON_WIN; then
    curl -o node-download.zip https://nodejs.org/dist/v6.9.1/$NODE_FILE_NAME.zip
    unzip node-download.zip -d $TOOLS_DIR
    mv $TOOLS_DIR/$NODE_FILE_NAME $NODE_DIR
    rm node-download.zip
  else
    curl -o node-download.tgz https://nodejs.org/dist/v6.9.1/$NODE_FILE_NAME.tar.gz
    tar xzf node-download.tgz --directory $TOOLS_DIR
    mv $TOOLS_DIR/$NODE_FILE_NAME $NODE_DIR
    rm node-download.tgz
  fi
fi

# Generate a list of already-installed modules.
NPM_INSTALLED_MODULES="$(npm list)"
