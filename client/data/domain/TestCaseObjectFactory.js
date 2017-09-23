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
 * @fileoverview Factory for creating new frontend instances of TestCase
 * domain objects.
 */


tieData.factory('TestCaseObjectFactory', [
  function() {
    /**
     * Each TestCase objects represents a test case that is used to test the
     * correctness of a student's code submission.
     */

    /**
     * Constructor for TestCase
     *
     * @param {dict} testCaseDict contains all the properties needed to
     *    make a TestCase object
     * @constructor
     */
    var TestCase = function(testCaseDict) {
      /**
       * @type{*}
       * @private
       */
      this._input = testCaseDict.input;

      /**
       * @type{string}
       * @private
       */
      this._stringifiedInput = JSON.stringify(this._input);

      /**
       * @type {Array}
       * @private
       */
      this._allowedOutputs = testCaseDict.allowedOutputs;
    };

    // Instance methods.
    /**
     * A getter for the _input property.
     * This function should return an object for the input associated with this
     * TestCase.
     *
     * @returns {*}
     */
    TestCase.prototype.getInput = function() {
      return this._input;
    };

    /**
     * A getter for the _stringifiedInput property.
     * This function should return a string version of the input associated with
     * this test case.
     *
     * @returns {string}
     */
    TestCase.prototype.getStringifiedInput = function() {
      return this._stringifiedInput;
    };

    /**
     * Checks if the output param matches any of the allowed
     * outputs for this test case.
     *
     * @param {*} output the output being checked
     * @returns {boolean} true if output matches, false if not
     */
    TestCase.prototype.matchesOutput = function(output) {
      var allowedOutputs = this._allowedOutputs;
      var target = output;
      if (angular.isArray(output)) {
        target = JSON.stringify(output);
        allowedOutputs = this._allowedOutputs.map(JSON.stringify);
      }
      return allowedOutputs.some(function(allowedOutput) {
        return angular.equals(allowedOutput, target);
      });
    };

    /**
     * Returns the first object in the _allowedOutputs array
     *
     * @returns {*}
     */
    TestCase.prototype.getAnyAllowedOutput = function() {
      return this._allowedOutputs[0];
    };

    /**
     * A getter for the _allowedOutputs property.
     * In contrast to getAnyAllowedOutput, this method returns all of the
     * possible allowed outputs.
     *
     * @returns {Array}
     */
    TestCase.prototype.getAllAllowedOutputs = function() {
      return this._allowedOutputs;
    };

    // Static class methods.
    /**
     * Returns a TestCase object built from the properties specified in the
     * dictionary parameter.
     *
     * @param {dict} testCaseDict should specify all the properties necessary
     *     to make this TestCase.
     * @returns {TestCase}
     */
    TestCase.create = function(testCaseDict) {
      return new TestCase(testCaseDict);
    };

    return TestCase;
  }
]);
