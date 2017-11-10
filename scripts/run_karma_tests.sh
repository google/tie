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

# NOTE TO DEVELOPERS: Arguments passed into this script will also be passed to
# `karma start`. See CLI options here:
#
#     http://karma-runner.github.io/1.0/config/configuration-file.html

set -e

source $(dirname $0)/setup.sh || exit 1

# Install the following node modules if they aren't already installed.
install_node_module jasmine-core 2.5.2
install_node_module karma 1.4.1
install_node_module karma-jasmine 1.1.0
install_node_module karma-chrome-launcher 2.0.0
install_node_module karma-coverage 1.1.1
install_node_module karma-phantomjs-launcher
install_node_module karma-6to5-preprocessor
install_node_module karma-es6-shim

# Run Karma, passing in any arguments passed to this script.
./node_modules/karma/bin/karma start "$@"
