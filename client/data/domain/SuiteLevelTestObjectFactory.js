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
 * @fileoverview Factory for creating new frontend instances of SuiteLevelTest
 * domain objects.
 */

tieData.factory('SuiteLevelTestObjectFactory', [
  function() {
    /**
     * A SuiteLevelTest domain object stores all the information needed to
     * complete one test meant to check which suites pass or fail, and give
     * feedback accordingly if the correct criteria are met.
     */

    /**
     * Constructor for SuiteLevelTest
     *
     * @param {dict} suiteLevelTestDict Contains all the properties needed to
     *    make a SuiteLevelTest
     * @constructor
     */
    var SuiteLevelTest = function(suiteLevelTestDict) {
      /**
       * @type {string}
       * @private
       */
      this._testSuiteIdsThatMustPass = (
        suiteLevelTestDict.testSuiteIdsThatMustPass);

      /**
       * @type {string}
       * @private
       */
      this._testSuiteIdsThatMustFail = (
        suiteLevelTestDict.testSuiteIdsThatMustFail);

      /**
       * @type {Array}
       * @private
       */
      this._messages = suiteLevelTestDict.messages;
    };

    // Instance methods.

    /**
     * Returns the list of test suite IDs that must pass. This should only be
     * used in validation tests; callers should use areConditionsMet() instead
     * for running tests.
     *
     * @returns {Array} Should be array of strings
     */
    SuiteLevelTest.prototype.getTestSuiteIdsThatMustPass = function() {
      return this._testSuiteIdsThatMustPass;
    };

    /**
     * Returns the list of test suite IDs that must fail. This should only be
     * used in validation tests; callers should use areConditionsMet() instead
     * for running tests.
     *
     * @returns {Array} Should be array of strings
     */
    SuiteLevelTest.prototype.getTestSuiteIdsThatMustFail = function() {
      return this._testSuiteIdsThatMustFail;
    };

    /**
     * Returns the list of messages attached to this suite-level test.
     *
     * @returns {Array} Should be array of strings
     */
    SuiteLevelTest.prototype.getMessages = function() {
      return this._messages;
    };

    /**
     * Returns whether this test should trigger, given the full list of suite
     * IDs that the learner's code passes fully.
     *
     * @param {Array} passingSuiteIds. A complete list of test suite IDs passed
     *   by the learner's submitted code.
     * @returns {bool}
     */
    SuiteLevelTest.prototype.areConditionsMet = function(passingSuiteIds) {
      return this._testSuiteIdsThatMustPass.every(function(suiteId) {
        return passingSuiteIds.indexOf(suiteId) !== -1;
      }) && this._testSuiteIdsThatMustFail.every(function(suiteId) {
        return passingSuiteIds.indexOf(suiteId) === -1;
      });
    };

    // Static class methods.
    /**
     * Returns a SuiteLevelTest object from the dictionary specified in
     * the parameter
     *
     * @param {dict} suiteLevelTestDict
     * @returns {SuiteLevelTest}
     */
    SuiteLevelTest.create = function(suiteLevelTestDict) {
      return new SuiteLevelTest(suiteLevelTestDict);
    };

    return SuiteLevelTest;
  }
]);
