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
 * @fileoverview Dispatcher service that preprocesses a user's submitted code
 * using the appropriate language-specific service.
 */

tie.factory('CodePreprocessorDispatcherService', [
  'PythonCodePreprocessorService', 'LANGUAGE_PYTHON',
  function(PythonCodePreprocessorService, LANGUAGE_PYTHON) {
    return {
      preprocess: function(
          language, codeSubmission, auxiliaryCode, inputFunctionName, mainFunctionName,
          outputFunctionName, correctnessTests, buggyOutputTests,
          performanceTests) {
        if (language === LANGUAGE_PYTHON) {
          return PythonCodePreprocessorService.preprocess(
            codeSubmission, auxiliaryCode, inputFunctionName, mainFunctionName, outputFunctionName,
            correctnessTests, buggyOutputTests, performanceTests);
        } else {
          throw Error('Language not supported: ' + language);
        }
      }
    };
  }
]);
