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
    var CodeEvalResult = function(
        preprocessedCode, output, correctnessTestResults,
        buggyOutputTestResults, performanceTestResults, errorTraceback,
        errorInput) {
      this._preprocessedCode = preprocessedCode;
      this._output = output;
      // Several lists of test results.
      this._correctnessTestResults = correctnessTestResults;
      this._buggyOutputTestResults = buggyOutputTestResults;
      this._performanceTestResults = performanceTestResults;
      this._errorTraceback = errorTraceback;
      // The input that caused the error message.
      this._errorInput = errorInput;
    };

    // Instance methods.
    CodeEvalResult.prototype.getPreprocessedCode = function() {
      return this._preprocessedCode;
    };

    CodeEvalResult.prototype.getOutput = function() {
      return this._output;
    };

    CodeEvalResult.prototype.getCorrectnessTestResults = function() {
      return this._correctnessTestResults;
    };

    CodeEvalResult.prototype.getLastTaskResults = function() {
      return this._correctnessTestResults[
        this._correctnessTestResults.length - 1];
    };

    CodeEvalResult.prototype.getBuggyOutputTestResults = function() {
      return this._buggyOutputTestResults;
    };

    CodeEvalResult.prototype.getPerformanceTestResults = function() {
      return this._performanceTestResults;
    };

    CodeEvalResult.prototype.getErrorString = function() {
      if (!this._errorTraceback) {
        return null;
      }
      return this._errorTraceback.getErrorString();
    };

    CodeEvalResult.prototype.getErrorInput = function() {
      return this._errorInput;
    };

    // Static class methods.
    CodeEvalResult.create = function(
        preprocessedCode, output, correctnessTestResults,
        buggyOutputTestResults, performanceTestResults, errorTraceback,
        errorInput) {
      return new CodeEvalResult(
        preprocessedCode, output, correctnessTestResults,
        buggyOutputTestResults, performanceTestResults, errorTraceback,
        errorInput);
    };

    return CodeEvalResult;
  }
]);
