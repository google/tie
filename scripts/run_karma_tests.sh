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
install_node_module() {
  if [[ $NPM_INSTALLED_MODULES != *"$1@$2"* ]]; then
    echo Installing $1@$2
    npm install $1@$2
    NPM_INSTALLED_MODULES="$(npm list)"
  fi
}

# Install nvm if it is not already installed.
if [ ! $NVM_DIR ] || [ ! -d $NVM_DIR ]; then
  echo "Installing nvm..."
  curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash
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
