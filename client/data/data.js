// Copyright 2017 The TIE Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Module for storing question and user data.
 */

window.globalData = {
  /**
   * Question data will be stored here, keyed by question ID.
   * Questions are instantiated in assets/questions, and they add themselves
   * to this dictionary when they're instantiated.
   *
   * @type {dict}
   */
  questions: {}
};

window.tieData = angular.module('tieData', []);

/**
 * Class name for wrapping auxiliary code, primarily used for test evaluation.
 *
 * @type {string}
 * @constant
 */
tieData.constant('CLASS_NAME_AUXILIARY_CODE', 'AuxiliaryCode');

/**
 * Class name for wrapping system code.
 *
 * @type {string}
 * @constant
 */
tieData.constant('CLASS_NAME_SYSTEM_CODE', 'System');
