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
 * @fileoverview Factory for creating new frontend instances of BuggyOutputTest
 * domain objects.
 */

tieData.factory('BuggyOutputTestObjectFactory', [
  function() {
    /**
     * BuggyOutputTest is used to store all of the information needed to
     * complete one test meant to see if the student's code took into
     * consideration a common bug.
     */

    /**
     * Constructor for BuggyOutputTest
     *
     * @param {dict} buggyOutputTestDict Contains all the properties needed to
     *    make a BuggyOutputTest
     * @constructor
     */
    var BuggyOutputTest = function(buggyOutputTestDict) {
      /**
       * @type {string}
       * @private
       */
      this._buggyFunctionName = buggyOutputTestDict.buggyFunctionName;

      /**
       * @type {Array}
       * @private
       */
      this._ignoredTestSuiteIds = buggyOutputTestDict.ignoredTestSuiteIds;

      /**
       * @type {Array}
       * @private
       */
      this._messages = buggyOutputTestDict.messages;
    };

    // Instance methods.

    /**
     * Returns the name of the buggy function.
     *
     * @returns {string}
     */
    BuggyOutputTest.prototype.getBuggyFunctionName = function() {
      return this._buggyFunctionName;
    };

    /**
     * Returns a list of IDs of test suites that should not be considered when
     * comparing the output of the learner's code to the output of a buggy
     * function.
     *
     * @returns {Array}
     */
    BuggyOutputTest.prototype.getIgnoredTestSuiteIds = function() {
      return this._ignoredTestSuiteIds;
    };

    /**
     * Returns the list of messages that a buggy output test has attached to it.
     *
     * @returns {Array} Should be array of strings
     */
    BuggyOutputTest.prototype.getMessages = function() {
      return this._messages;
    };

    // Static class methods.
    /**
     * Returns a BuggyOutputTest object from the dictionary specified in
     * the parameter
     *
     * @param {dict} buggyOutputTestDict
     * @returns {BuggyOutputTest}
     */
    BuggyOutputTest.create = function(buggyOutputTestDict) {
      return new BuggyOutputTest(buggyOutputTestDict);
    };

    return BuggyOutputTest;
  }
]);
