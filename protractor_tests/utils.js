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
 * @fileoverview Functional components for end-to-end tests with protractor.
 */

/**
 * Defines the number of logs that the log can hold.
 *
 * @type {number}
 */
var CONSOLE_LOG_THRESHOLD = 900;
/**
 * Array defining which errors one can ignore printing in the console
 * automatically. Will be concatenated with errors to ignore that will be
 * passed in.
 *
 * @type {Array}
 */
var CONSOLE_ERRORS_TO_IGNORE = [];

/**
 * Manages the logs made in the browser's console to then select which ones
 * to push to the console and which ones can be ignored.
 *
 * @param {Array} errorsToIgnore
 */
var checkForConsoleErrors = function(errorsToIgnore) {
  var irrelevantErrors = errorsToIgnore.concat(CONSOLE_ERRORS_TO_IGNORE);
  browser.manage().logs().get('browser').then(function(browserLogs) {
    var fatalErrors = [];
    for (var i = 0; i < browserLogs.length; i++) {
      if (browserLogs[i].level.value > CONSOLE_LOG_THRESHOLD) {
        var errorFatal = true;
        for (var j = 0; j < irrelevantErrors.length; j++) {
          if (browserLogs[i].message.match(irrelevantErrors[j])) {
            errorFatal = false;
          }
        }
        if (errorFatal) {
          fatalErrors.push(browserLogs[i]);
        }
      }
    }
    expect(fatalErrors).toEqual([]);
  });
};

// This function doesn't need to do anything in the client version, but it's
// useful to have a method in case we need to do any setup.
var setUpPage = function(){};

// This function doesn't need to do anything in the client version, either.
var prepareEnvironment = function(){};

exports.setUpPage = setUpPage;
exports.prepareEnvironment = prepareEnvironment;
exports.checkForConsoleErrors = checkForConsoleErrors;
