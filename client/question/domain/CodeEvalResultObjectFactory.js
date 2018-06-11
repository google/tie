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
  'SEPARATOR_LENGTH',
  function(SEPARATOR_LENGTH) {
    /**
     * CodeEvalResult stores all of the results for each test and any related
     * errors associated with a given code submission.
     */

    /**
     * Constructor for CodeEvalResult
     *
     * @param {string} preprocessedCode Unprocessed student code
     * @param {string} output Stdout resulting from running student code
     * @param {Array} observedOutputs Observed outputs from running the code
     *  against the test cases
     * @param {Array} buggyOutputTestResults Results of Buggy Output tests
     * @param {Array} performanceTestResults Results of Performance tests
     * @param {ErrorTraceback} errorTraceback Traceback of error (if there is
     *    one)
     * @param {string} errorInput Input that caused error (if there is one)
     * @constructor
     */
    var CodeEvalResult = function(
        preprocessedCode, output, observedOutputs, buggyOutputTestResults,
        performanceTestResults, errorTraceback, errorInput) {
      /**
       * @type {string}
       * @private
       */
      this._preprocessedCode = preprocessedCode;

      /**
       * @type {string}
       * @private
       */
      this._output = output;

      /**
       * @type {Array}
       * @private
       */
      this._observedOutputs = observedOutputs;

      /**
       * @type {Array}
       * @private
       */
      this._buggyOutputTestResults = buggyOutputTestResults;

      /**
       * @type {Array}
       * @private
       */
      this._performanceTestResults = performanceTestResults;

      /**
       * @type {ErrorTraceback}
       * @private
       */
      this._errorTraceback = errorTraceback;

      /**
       * @type {string}
       * @private
       */
      this._errorInput = errorInput;
    };

    // Instance methods.

    /**
     * A getter for the _preprocessedCode property.
     * It should return a string with code that has already been preprocessed.
     *
     * @returns {string}
     */
    CodeEvalResult.prototype.getPreprocessedCode = function() {
      return this._preprocessedCode;
    };

    /**
     * Returns a boolean indicating whether the preprocessed code in this
     * object matches the preprocessed code in the given CodeEvalResult.
     *
     * @param {CodeEvalResult} otherCodeEvalResult
     *
     * @returns {boolean}
     */
    CodeEvalResult.prototype.hasSamePreprocessedCodeAs = function(
        otherCodeEvalResult) {
      var separatorStart = this._preprocessedCode.indexOf('separator =');
      var otherCode = otherCodeEvalResult.getPreprocessedCode();
      var otherSeparatorStart = otherCode.indexOf('separator =');

      // No separator exists in the preprocess code.
      if (separatorStart === -1 && otherSeparatorStart === -1) {
        return this._preprocessedCode === otherCode;
      }
      // Separator values change per run.
      var offset = SEPARATOR_LENGTH + 'separator = ""'.length;
      var separatorLocSame = separatorStart === otherSeparatorStart;
      var preSeparatorSame = this._preprocessedCode.substring(0,
        separatorStart) === otherCode.substring(0, separatorStart);
      var postSeparatorSame = this._preprocessedCode.substring(separatorStart +
        offset) === otherCode.substring(separatorStart + offset);
      return separatorLocSame && preSeparatorSame && postSeparatorSame;
    };

    /**
     * A getter for the _output property.
     * The function should return a string of the output for the code that was
     * run.
     *
     * @returns {string}
     */
    CodeEvalResult.prototype.getOutput = function() {
      return this._output;
    };

    /**
     * A getter for the _observedOutputs property. The function should return a
     * triply-nested array, where each nesting level represents the results for
     * each task, suite, and test case. The elements of the innermost list are
     * the outputs generated by the learner's program for the corresponding
     * test cases.
     *
     * @returns {Array}
     */
    CodeEvalResult.prototype.getObservedOutputs = function() {
      return this._observedOutputs;
    };

    /**
     * Compares the observed outputs to the expected values of the test cases,
     * and returns the index of the first task with at least one failing test
     * case.
     *
     * @param {Array<Task>} The list of tasks for the current question.
     * @returns {number|null} The index of the first task that failed, or null
     * if all tasks passed.
     */
    CodeEvalResult.prototype.getIndexOfFirstFailedTask = function(tasks) {
      if (this._observedOutputs.length === 0) {
        // This can occur if there is a runtime or infinite-loop error.
        return 0;
      }

      for (var i = 0; i < tasks.length; i++) {
        var taskPassed = true;
        var testSuites = tasks[i].getTestSuites();
        for (var j = 0; j < testSuites.length; j++) {
          var suitePassed = true;
          var testCases = testSuites[j].getTestCases();
          for (var k = 0; k < testCases.length; k++) {
            if (!testCases[k].matchesOutput(this._observedOutputs[i][j][k])) {
              suitePassed = false;
              break;
            }
          }
          if (!suitePassed) {
            taskPassed = false;
            break;
          }
        }
        if (!taskPassed) {
          return i;
        }
      }

      return null;
    };

  /**
     * Compares the results to the expected values of the test cases, and returns
     * the test number of the first failed test case. The test number is
     * independent of tasks and testSuites but rather the overall test case
     * number.
     *
     * @param {Array<Task>} tasks The list of tasks for the current question.
     * @returns {number} The index of the first failed test case, or index of
     * last test case if all test cases passed.
     */
     CodeEvalResult.prototype.getIndexOfFirstFailedTest = function(tasks) {
       if (this._observedOutputs === 0) {
         return 0;
       }

       var userOutput = this._observedOutputs;
       var testNum = 0;
       for (var i = 0; i < userOutput.length; i++) {
         var testSuites = tasks[i].getTestSuites();
         for (var j = 0; j < userOutput[i].length; j++) {
           var testCases = testSuites[j].getTestCases();
           for (var k = 0; k < userOutput[i][j].length; k++) {
             if (!testCases[k].matchesOutput(this._observedOutputs[i][j][k])) {
               return testNum;
             }
             testNum += 1;
           }
         }
       }
       // Returns the number of last test case if all passed.
       return testNum - 1;
     };

    /**
     * Returns the observed outputs for the last task that is run. The function
     * should return the last subarray in _observedOutputs.
     *
     * @returns {Array}
     */
    CodeEvalResult.prototype.getLastTaskObservedOutputs = function() {
      return this._observedOutputs[this._observedOutputs.length - 1];
    };

    /**
     * A getter for the _buggyOutputTestResults
     * property. The function should return a list of buggy output test results.
     *
     * @returns {Array}
     */
    CodeEvalResult.prototype.getBuggyOutputTestResults = function() {
      return this._buggyOutputTestResults;
    };

    /**
     * A getter for the _performanceTestResults
     * property. The function should return a list of Objects where results
     * are stored for each task and test.
     *
     * @returns {Array}
     */
    CodeEvalResult.prototype.getPerformanceTestResults = function() {
      return this._performanceTestResults;
    };

    /**
     * Returns a string describing an error (if there is one) in
     * the code results.
     * The function should return a string if there is an error traceback in the
     * code results. Otherwise, it should return null.
     *
     * @returns {string}
     */
    CodeEvalResult.prototype.getErrorString = function() {
      if (!this._errorTraceback) {
        return null;
      }
      return this._errorTraceback.getErrorString();
    };

    /**
     * A getter for the _errorInput property.
     * This function should return a string containing the input that threw
     * the error seen in the _errorTraceback property.
     *
     * @returns {string}
     */
    CodeEvalResult.prototype.getErrorInput = function() {
      return this._errorInput;
    };

    // Static class methods.
    /**
     * This method creates and returns a CodeEvalResult object from the params
     * specified.
     *
     * @param {string} preprocessedCode Preprocessed submitted code
     * @param {string} output Stdout resulting from running student code
     * @param {Array} observedOutputs Observed outputs from running the code
     *  against the test cases
     * @param {Array} buggyOutputTestResults Buggy test results
     * @param {Array} performanceTestResults Performance test results
     * @param {ErrorTraceback} errorTraceback Traceback of the error
     * @param {string} errorInput Input that caused the error
     * @returns {CodeEvalResult}
     */
    CodeEvalResult.create = function(
        preprocessedCode, output, observedOutputs, buggyOutputTestResults,
        performanceTestResults, errorTraceback, errorInput) {
      return new CodeEvalResult(
        preprocessedCode, output, observedOutputs, buggyOutputTestResults,
        performanceTestResults, errorTraceback, errorInput);
    };

    return CodeEvalResult;
  }
]);
