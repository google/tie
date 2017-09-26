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
 * @fileoverview Factory for creating new frontend instances of TestSuite
 * domain objects.
 */


tieData.factory('TestSuiteObjectFactory', [
  'TestCaseObjectFactory', function(TestCaseObjectFactory) {
    /**
     * Each TestSuite object represents a set of test cases that are used to
     * test the correctness of a student's code submission.
     */

    /**
     * Constructor for TestSuite
     *
     * @param {dict} testSuiteDict contains all the properties needed to
     *    make a TestSuite object.
     * @constructor
     */
    var TestSuite = function(testSuiteDict) {
      /**
       * @type{*}
       * @private
       */
      this._id = testSuiteDict.id;

      /**
       * @type{string}
       * @private
       */
      this._humanReadableName = testSuiteDict.humanReadableName;

      /**
       * @type {Array}
       * @private
       */
      this._testCases = testSuiteDict.testCases.map(function(testCase) {
        return TestCaseObjectFactory.create(testCase);
      });
    };

    // Instance methods.
    /**
     * A getter for the _id property.
     * This function should return the ID of the test suite.
     *
     * @returns {*}
     */
    TestSuite.prototype.getId = function() {
      return this._id;
    };

    /**
     * A getter for the _humanReadableName property.
     * This function should return a string that describes the role/purpose of
     * this test suite in human-readable terms.
     *
     * @returns {string}
     */
    TestSuite.prototype.getHumanReadableName = function() {
      return this._humanReadableName;
    };

    /**
     * Returns a list of TestCase objects, each representing a test case within
     * this test suite.
     *
     * @returns {Array}
     */
    TestSuite.prototype.getTestCases = function() {
      return this._testCases;
    };

    // Static class methods.
    /**
     * Returns a TestSuite object built from the properties specified
     * in the dictionary parameter.
     *
     * @param {dict} testSuiteDict should specify all the properties
     *    necessary to make this TestSuite
     * @returns {TestSuite}
     */
    TestSuite.create = function(testSuiteDict) {
      return new TestSuite(testSuiteDict);
    };

    return TestSuite;
  }
]);
