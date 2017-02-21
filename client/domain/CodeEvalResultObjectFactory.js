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
 * @fileoverview Factory for creating new frontend instances of CodeEvalResult
 * domain objects.
 */

tie.factory('CodeEvalResultObjectFactory', [
  function() {
    var CodeEvalResult = function(code, output, testResults, errorMessage) {
      this._code = code;
      this._output = output;
      // A list of test results.
      this._testResults = testResults;
      this._errorMessage = errorMessage;
    };

    // Instance methods.
    CodeEvalResult.prototype.getCode = function() {
      return this._code;
    };

    CodeEvalResult.prototype.getOutput = function() {
      return this._output;
    };

    CodeEvalResult.prototype.getTestResults = function() {
      return this._testResults;
    };

    CodeEvalResult.prototype.getErrorMessage = function() {
      return this._errorMessage;
    };

    // Static class methods.
    CodeEvalResult.create = function(code, output, testResults, errorMessage) {
      return new CodeEvalResult(code, output, testResults, errorMessage);
    };

    return CodeEvalResult;
  }
]);
