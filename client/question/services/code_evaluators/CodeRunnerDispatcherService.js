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
 * @fileoverview Dispatcher service that runs a user's submitted code using
 * the appropriate code evaluation engine.
 */

tie.factory('CodeRunnerDispatcherService', [
  'PythonCodeRunnerService', 'LANGUAGE_PYTHON',
  function(PythonCodeRunnerService, LANGUAGE_PYTHON) {
    return {
      /**
       * Asynchronously runs the code in the correct corresponding language
       * as passed in by the language parameter.
       *
       * @param {string} language
       * @param {string} code
       * @returns {Promise}
       */
      runCodeAsync: function(language, code) {
        if (language === LANGUAGE_PYTHON) {
          return PythonCodeRunnerService.runCodeAsync(code);
        } else {
          throw Error('Language not supported: ' + language);
        }
      },
      /**
       * Asynchronously compiles the code in the correct corresponding language
       * as passed in by the language parameter.
       *
       * @param {string} language
       * @param {string} code
       * @returns {Promise}
       */
      compileCodeAsync: function(language, code) {
        if (language === LANGUAGE_PYTHON) {
          return PythonCodeRunnerService.compileCodeAsync(code);
        } else {
          throw Error('Language not supported: ' + language);
        }
      }
    };
  }
]);
