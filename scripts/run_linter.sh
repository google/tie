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

# Usage:
#
#     bash scripts/run_linter.sh
set -e

source $(dirname $0)/setup.sh || exit 1

# Install the following node modules if they aren't already installed.
install_node_module eslint 3.18.0

# Run eslint.
./node_modules/eslint/bin/eslint.js -c ./.eslintrc.json assets/*/*.js client/*.js client/*/*.js client/*/*/*.js client/*/*/*/*.js tests/*.js
