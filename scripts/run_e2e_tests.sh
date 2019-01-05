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

function cleanup {
  # Send a kill signal to all protractor processes. The [Pp] is to avoid the
  # grep finding the 'grep protractor' process as well.
  kill `ps aux | grep [Pp]rotractor | awk '{print $2}'`

  echo Done!
}

source $(dirname $0)/setup.sh

# Forces the cleanup function to run on exit.
# Developers: note that at the end of this script, the cleanup() function at
# the top of the file is run.
trap cleanup EXIT

# Install the following node modules if they aren't already installed.
install_node_module protractor 5.4.0

# Start up a Selenium Server.
# Note: We use --gecko=false to avoid rate limit reached error.
# See https://github.com/angular/webdriver-manager/issues/307.
./node_modules/protractor/bin/webdriver-manager update --gecko=false
./node_modules/protractor/bin/webdriver-manager start &

# Run the test
./node_modules/protractor/bin/protractor ./tests/e2e/protractor.conf.js
