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

# TODO(feiluo): Need a way to control the log level to avoid thounsands of lines of log.

set -e

source $(dirname $0)/setup.sh || exit 1

# Install the following node modules if they aren't already installed.
install_node_module protractor 5.1.1

# Start up a Selenium Server
./node_modules/protractor/bin/webdriver-manager update
./node_modules/protractor/bin/webdriver-manager start &

# Run the test
./node_modules/protractor/bin/protractor ./protractor.conf.js

