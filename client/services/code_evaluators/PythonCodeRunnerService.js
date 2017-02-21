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
 * @fileoverview Service for executing Python code snippets.
 */

tie.factory('PythonCodeRunnerService', [
  'CodeEvalResultObjectFactory', 'VARNAME_TEST_RESULTS',
  function(CodeEvalResultObjectFactory, VARNAME_TEST_RESULTS) {
    var outputLines = [];

    var clearOutput = function() {
      outputLines.length = 0;
    };

    var addOutputLine = function(line) {
      outputLines.push(line);
    };

    return {
      // Returns a promise.
      runCodeAsync: function(code) {
        clearOutput();
        Sk.configure({
          output: addOutputLine
        });
        return Sk.misceval.asyncToPromise(function() {
          return Sk.importMainWithBody('<stdin>', false, code, true);
        }).then(function() {
          var resultList = [];
          if (Sk.globals.hasOwnProperty(VARNAME_TEST_RESULTS)) {
            // This retrieves the value of the Skulpt's representation of the
            // global Python 'test results' variable (which Skulpt stores in
            // Sk.globals), and maps it to a JS value so that it can be
            // compared against the "correct output" specification.
            resultList = Sk.ffi.remapToJs(Sk.globals[VARNAME_TEST_RESULTS]);
          }

          // The run was successful.
          return CodeEvalResultObjectFactory.create(
            code, outputLines.join('\n'), resultList, null);
        }, function(error) {
          return CodeEvalResultObjectFactory.create(
            code, '', [], error);
        });
      }
    };
  }
]);
