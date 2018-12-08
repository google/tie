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
    /**
     * CodeEvalResult stores all of the results for each test and any related
     * errors associated with a given code submission.
     */

    /**
     * Constructor for CodeEvalResult
     *
     * @param {string} preprocessedCode Preprocessed submitted code
     * @param {string} rawCode Raw student input code
     * @param {Array<string>|null} observedStdouts Stdout resulting from
     * running the student code where the array has the i-th entry
     * corresponding to the stdout of the i-th overall test case. Overall test
     * case is defined to be the number of the test case when all test cases
     * across all tasks are concatenated into one list. If an error ocurred,
     * the corresponding stdout will be null.
     * The number of elements in the array will match the number of test cases
     * that were executed (which is all tests up until the last test of
     * the current task or up until the first test that error'ed,
     * whichever comes first).
     * @param {Array} observedOutputs Observed outputs from running the code
     *  against the test cases
     * @param {Array} buggyOutputTestResults Results of Buggy Output tests
     * @param {Array} performanceTestResults Results of Performance tests
     * @param {ErrorTraceback} errorTraceback Traceback of error (if there is
     *    one)
     * @param {string} errorInput Input that caused error (if there is one)
     * @param {string} timeLimitExceeded Whether or not the learner's code
     *    exceeded our set time limit
     * @param {string} memoryLimitExceeded Whether or not the learner's code
     *    exceeded our set memory limit
     * @constructor
     */
    var CodeEvalResult = function(
        preprocessedCode, rawCode, observedStdouts, observedOutputs,
        buggyOutputTestResults, performanceTestResults, errorTraceback,
        errorInput, timeLimitExceeded, memoryLimitExceeded) {
      /**
       * @type {string}
       * @private
       */
      this._preprocessedCode = preprocessedCode;

      /**
       * @type {string}
       * @private
       */
      this._rawCode = rawCode;

      /**
       * @type {Array<string>|null}
       * @private
       */
      this._observedStdouts = observedStdouts;

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

      /**
       * @type {boolean}
       * @private
       */
      this._timeLimitExceeded = timeLimitExceeded;

      /**
       * @type {boolean}
       * @private
       */
      this._memoryLimitExceeded = memoryLimitExceeded;
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
     * A getter for the _rawCode property.
     * It should return a string with the raw code that the student inputted.
     *
     * @returns {string}
     */
    CodeEvalResult.prototype.getRawCode = function() {
      return this._rawCode;
    };

    /**
     * Returns a boolean indicating whether the raw code in this
     * object matches the raw code in the given CodeEvalResult.
     *
     * @param {CodeEvalResult} otherCodeEvalResult
     *
     * @returns {boolean}
     */
    CodeEvalResult.prototype.hasSameRawCodeAs = function(
        otherCodeEvalResult) {
      return this._rawCode === otherCodeEvalResult.getRawCode();
    };

    /**
     * Returns a boolean indicating whether the code run exceeded the time
     * limit.
     *
     * @returns {boolean}
     */
    CodeEvalResult.prototype.hasTimeLimitError = function() {
      return this._timeLimitExceeded;
    };

    /**
     * Returns a boolean indicating whether the code run exceeded the memory
     * limit.
     *
     * @returns {boolean}
     */
    CodeEvalResult.prototype.hasMemoryLimitError = function() {
      return this._memoryLimitExceeded;
    };

    /**
     * Returns a boolean indicating whether the code recursed too many times.
     *
     * @returns {boolean}
     */
    CodeEvalResult.prototype.hasStackExceededError = function() {
      var errorString = this.getErrorString();
      return errorString && (
        errorString.startsWith('ExternalError: RangeError') ||
        errorString.includes('maximum recursion depth exceeded'));
    };

    /**
     * Returns a boolean indicating whether there was a server error during the
     * run.
     *
     * @returns {boolean}
     */
    CodeEvalResult.prototype.hasServerError = function() {
      var errorString = this.getErrorString();
      return errorString && (
        errorString.startsWith('A server error occurred.'));
    };

    /**
     * A getter for the _observedStdouts property.
     * The function should return the array of stdouts where the i-th
     * entry in the array corresponds to the output of the i-th overall test
     * case. Overall test case is defined to be the number of the test case
     * when all the test cases across all tasks are concatenated into one list.
     * If an error occurred, the corresponding output will be null.
     * The number of elements in the array will match the number of test cases
     * that were executed (which is all tests up until the last test of
     * the current task or up until the first test that error'ed,
     * whichever comes first).
     *
     * @returns {Array<string>|null}
     */
    CodeEvalResult.prototype.getObservedStdouts = function() {
      return this._observedStdouts;
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
     * Compares the results to the expected values of the test cases, and
     * returns the overall test number (0-indexed) of the first failed test
     * case. The overall test number is defined by concatenating all the
     * test cases together, in order.
     *
     * @param {Array<Task>} tasks The list of tasks for the current question.
     * @returns {number|null} The overall test number of the test case that
     * failed. Returns null if no tests for the past or current tasks failed.
     */
    CodeEvalResult.prototype.getIndexOfFirstFailedTest = function(tasks) {
      if (this._observedOutputs.length === 0) {
        return 0;
      }

      var overallTestNum = 0;
      for (var i = 0; i < this._observedOutputs.length; i++) {
        var testSuites = tasks[i].getTestSuites();
        for (var j = 0; j < this._observedOutputs[i].length; j++) {
          var testCases = testSuites[j].getTestCases();
          for (var k = 0; k < this._observedOutputs[i][j].length; k++) {
            if (!testCases[k].matchesOutput(this._observedOutputs[i][j][k])) {
              return overallTestNum;
            }
            overallTestNum += 1;
          }
        }
      }
      // Returns null if all test cases passed.
      return null;
    };

    /**
     * Returns the stdout corresponding to the first failed test case, or
     * the output associated with the last test case of the last task
     * completed if all tests passed.
     *
     * @param {Array} tasks Array of the current question's tasks.
     * @returns {string}
     */
    CodeEvalResult.prototype.getStdoutToDisplay = function(tasks) {
      if (this._observedOutputs.length === 0) {
        return null;
      }
      var testToDisplay = this.getIndexOfFirstFailedTest(tasks);

      // If user passed all tests, display output of the last test case of
      // the last task that they completed.
      if (testToDisplay === null) {
        var overallNumTests = 0;
        for (var i = 0; i < this._observedOutputs.length; i++) {
          for (var j = 0; j < this._observedOutputs[i].length; j++) {
            overallNumTests += this._observedOutputs[i][j].length;
          }
        }
        return this._observedStdouts[overallNumTests - 1];
      }
      return this._observedStdouts[testToDisplay];
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
     * Returns a number representing the line number where an error was
     * detected in the student code (if there is one).
     * The function should return a number if there is an error traceback in the
     * code results. Otherwise, it should return null.
     *
     * @returns {number|null}
     */
    CodeEvalResult.prototype.getErrorLineNumber = function() {
      if (!this._errorTraceback) {
        return null;
      }
      return this._errorTraceback.getErrorLineNumber();
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

    /**
     * Retrieves the IDs of passing test suites for a given task.
     *
     * @param {Array<Task>} The list of tasks associated with the problem that
     *   corresponds to this CodeEvalResult object.
     * @param {int} taskIndex The index of the task.
     * @returns {Array<string>} A list of IDs of the passing test suites. If no
     *   test cases have been run for this task, an empty array is returned.
     */
    CodeEvalResult.prototype.getPassingSuiteIds = function(tasks, taskIndex) {
      var passingSuiteIds = [];

      var that = this;
      var testSuites = tasks[taskIndex].getTestSuites();
      testSuites.forEach(function(suite, suiteIndex) {
        var testCases = suite.getTestCases();
        var observedSuiteOutputs = that._observedOutputs[taskIndex][suiteIndex];
        var allTestCasesPass = testCases.every(function(testCase, index) {
          return testCase.matchesOutput(observedSuiteOutputs[index]);
        });

        if (allTestCasesPass) {
          passingSuiteIds.push(suite.getId());
        }
      });

      return passingSuiteIds;
    };

    // Static class methods.
    /**
     * This method creates and returns a CodeEvalResult object from the params
     * specified.
     *
     * @param {string} preprocessedCode Preprocessed submitted code
     * @param {string} rawCode Raw student input code
     * @param {Array<string>} observedStdouts Stdout array resulting from
     * running student code
     * @param {Array} observedOutputs Observed outputs from running the code
     *  against the test cases
     * @param {Array} buggyOutputTestResults Buggy test results
     * @param {Array} performanceTestResults Performance test results
     * @param {ErrorTraceback} errorTraceback Traceback of the error
     * @param {string} errorInput Input that caused the error
     * @param {string} timeLimitExceeded Whether or not the learner's code
     *    exceeded our set time limit
     * @param {string} memoryLimitExceeded Whether or not the learner's code
     *    exceeded our set memory limit
     * @returns {CodeEvalResult}
     */
    CodeEvalResult.create = function(
        preprocessedCode, rawCode, observedStdouts, observedOutputs,
        buggyOutputTestResults, performanceTestResults, errorTraceback,
        errorInput, timeLimitExceeded, memoryLimitExceeded) {
      return new CodeEvalResult(
        preprocessedCode, rawCode, observedStdouts, observedOutputs,
        buggyOutputTestResults, performanceTestResults, errorTraceback,
        errorInput, timeLimitExceeded, memoryLimitExceeded);
    };

    return CodeEvalResult;
  }
]);
