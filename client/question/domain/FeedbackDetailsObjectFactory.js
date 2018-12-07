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
 * @fileoverview Factory for creating new frontend instances of FeedbackDetails
 * domain objects.
 */

tie.factory('FeedbackDetailsObjectFactory', [
  'FEEDBACK_CATEGORIES', 'CORRECTNESS_STATES',
  function(FEEDBACK_CATEGORIES, CORRECTNESS_STATES) {
    /**
     * Feedback objects encapsulate the personalized feedback that is used to
     * provide constructive feedback to the user.
     */

    /**
     * Constructor for FeedbackDetails
     *
     * @param {string} feedbackCategory The category of the feedback. Must be
     *    a valid entry in FEEDBACK_CATEGORIES.
     * @param {number|null} errorLineNumber The line number of the error.
     * @param {string|null} errorString The error message.
     * @param {language|null} language The language that the student's code is
     *    written in, if applicable.
     * @param {*|null} errorInput The specific input that caused the error, if
     *    applicable.
     * @param {boolean} languageUnfamiliarityFeedbackIsNeeded Whether we need
     *    to append a feedback paragraph prompting the user to consult
     *    language-specific references.
     * @param {number} taskIndex The index of the task that failed, if
     *    applicable.
     * @param {string} testSuiteId The ID of the test suite containing the
     *    first-failing test case, if applicable.
     * @param {number} testCaseIndex The index of the first-failing test case
     *    (relative to its suite), if applicable.
     * @param {TestCase} testCase The first-failing test case, if applicable.
     * @param {*} observedOutput Actual output from running the user's code on
     *    the failing test case, if applicable.
     * @param {string} correctnessState The "correctness state" used to derive
     *    the feedback to show for an incorrect-output test.
     * @param {string} specificCategory The category of failure found (possibly
     *    shadowed by incorrect output feedback). This is either
     *    FEEDBACK_CATEGORIES.KNOWN_BUG_FAILURE or
     *    FEEDBACK_CATEGORIES.SUITE_LEVEL_FAILURE.
     * @param {number} specificTestIndex The index of the "specific test" that
     *    failed, if applicable.
     * @param {Array<string>} specificTestMessages The list of messages
     *    corresponding to specific feedback, if applicable.
     * @param {number} specificTestMessageIndex The index of the message to
     *    use, if applicable.
     * @param {string} expectedPerformance A string describing the expected
     *    performance of the code (e.g. linear/quadratic), if applicable.
     *
     * @constructor
     */
    var FeedbackDetails = function(
        feedbackCategory, errorLineNumber, errorString, language, errorInput,
        languageUnfamiliarityFeedbackIsNeeded,
        taskIndex, testSuiteId, testCaseIndex,
        testCase, observedOutput, correctnessState,
        specificCategory, specificTestIndex, specificTestMessages,
        specificTestMessageIndex,
        expectedPerformance) {
      if (!FEEDBACK_CATEGORIES.hasOwnProperty(feedbackCategory)) {
        throw Error('Invalid feedback category: ' + feedbackCategory);
      }

      /**
       * Records the category corresponding to this feedback.
       *
       * @type {string}
       * @private
       */
      this._feedbackCategory = feedbackCategory;

      /**
       * A number representing where an error in the student code was detected.
       *
       * Should be null if feedback category is not SYNTAX_ERROR or
       * RUNTIME_ERROR.
       *
       * @type {number|null}
       * @private
       */

      this._errorLineNumber = (
          angular.isNumber(errorLineNumber) ? errorLineNumber : null);

      /**
       * A string with the error message for this feedback.
       *
       * Should be null if feedback category is not SYNTAX_ERROR or
       * RUNTIME_ERROR.
       *
       * @type {string|null}
       * @private
       */
      this._errorString = errorString || null;

      /**
       * A string with the language of the code that resulted in this feedback.
       *
       * Should be null if feedback category is not SYNTAX_ERROR or
       * RUNTIME_ERROR.
       *
       * @type {string|null}
       * @private
       */
      this._language = language || null;

      /**
       * A string with the error input that resulted in this feedback.
       *
       * Should be null if feedback category is not RUNTIME_ERROR.
       *
       * @type {*|null}
       * @private
       */
      this._errorInput = errorInput || null;

      /**
       * Whether to append language unfamiliarity feedback to what is shown
       * to the student.
       *
       * @type {boolean}
       * @private
       */
      this._languageUnfamiliarityFeedbackIsNeeded = (
        languageUnfamiliarityFeedbackIsNeeded || false);

      /**
       * The index of the task containing the first failing test.
       *
       * Should be null if feedback category is not KNOWN_BUG_FAILURE,
       * SUITE_LEVEL_FAILURE or INCORRECT_OUTPUT_FAILURE.
       *
       * @type {number}
       * @private
       */
      this._taskIndex = angular.isNumber(taskIndex) ? taskIndex : null;

      /**
       * The ID of the test suite containing first failing test case.
       *
       * Should be null if feedback category is not KNOWN_BUG_FAILURE,
       * SUITE_LEVEL_FAILURE or INCORRECT_OUTPUT_FAILURE.
       *
       * @type {string}
       * @private
       */
      this._testSuiteId = testSuiteId || null;

      /**
       * The index of the first failing test case (relative to its test suite).
       *
       * Should be null if feedback category is not KNOWN_BUG_FAILURE,
       * SUITE_LEVEL_FAILURE or INCORRECT_OUTPUT_FAILURE.
       *
       * @type {number}
       * @private
       */
      this._testCaseIndex = (
        angular.isNumber(testCaseIndex) ? testCaseIndex : null);

      /**
       * The first failing test case.
       *
       * Should be null if feedback category is not INCORRECT_OUTPUT_FAILURE.
       *
       * @type {TestCase}
       * @private
       */
      this._testCase = testCase || null;

      /**
       * The actual output from running the user's code on the first failing
       * test case.
       *
       * Should be null if feedback category is not INCORRECT_OUTPUT_FAILURE.
       *
       * @type {*}
       * @private
       */
      this._observedOutput = observedOutput || null;

      /**
       * The "correctness state" used to derive the feedback to show for an
       * incorrect-output test.
       *
       * Should be null if feedback category is not INCORRECT_OUTPUT_FAILURE.
       *
       * @type {string}
       * @private
       */
      this._correctnessState = correctnessState || null;

      /**
       * The "specific-test" category. This is either the feedback category for
       * this object, unless it is shadowed by INCORRECT_OUTPUT_FAILURE due to
       * the user receiving the same feedback multiple times.
       *
       * Should be null if feedback category is not INCORRECT_OUTPUT_FAILURE,
       * KNOWN_BUG_FAILURE or SUITE_LEVEL_FAILURE.
       *
       * @type {string} Either KNOWN_BUG_FAILURE or SUITE_LEVEL_FAILURE.
       * @private
       */
      this._specificCategory = specificCategory || null;
      var ALLOWED_SPECIFIC_CATEGORIES = [
        null, FEEDBACK_CATEGORIES.KNOWN_BUG_FAILURE,
        FEEDBACK_CATEGORIES.SUITE_LEVEL_FAILURE];
      if (ALLOWED_SPECIFIC_CATEGORIES.indexOf(this._specificCategory) === -1) {
        throw Error(
          'Invalid specific-test category: ' + this._specificCategory);
      }

      /**
       * The index of the specific test that caused the buggy-output or
       * suite-level checks to fail.
       *
       * Should be null if feedback category is not KNOWN_BUG_FAILURE or
       * SUITE_LEVEL_FAILURE.
       *
       * @type {number}
       * @private
       */
      this._specificTestIndex = (
        angular.isNumber(specificTestIndex) ? specificTestIndex : null);

      /**
       * The list of feedback messages corresponding to buggy-output or
       * suite-level feedback that is applicable to the student's code.
       *
       * Should be null if feedback category is not KNOWN_BUG_FAILURE or
       * SUITE_LEVEL_FAILURE.
       *
       * @type {Array<string>}
       * @private
       */
      this._specificTestMessages = specificTestMessages || null;

      /**
       * The index of the specific feedback message in this._testMessages to
       * use.
       *
       * Should be null if feedback category is not KNOWN_BUG_FAILURE or
       * SUITE_LEVEL_FAILURE.
       *
       * @type {number}
       * @private
       */
      this._specificTestMessageIndex = (
        angular.isNumber(specificTestMessageIndex) ? specificTestMessageIndex :
        null);

      /**
       * A string describing the expected performance of the user's code (e.g.
       * linear/quadratic).
       *
       * Should be null if feedback category is not PERFORMANCE_TEST_FAILURE.
       *
       * @type {string}
       * @private
       */
      this._expectedPerformance = expectedPerformance || null;
    };

    // Instance methods.
    /**
     * A getter for the _feedbackCategory property.
     * This function should return the category which corresponds to this
     * feedback.
     *
     * @returns {string}
     */
    FeedbackDetails.prototype.getFeedbackCategory = function() {
      return this._feedbackCategory;
    };

    /**
     * A getter for the _errorLineNumber property.
     * This function should return a number representing the line number
     * where an error in the student code was detected.
     *
     * @returns {number}
     */
    FeedbackDetails.prototype.getErrorLineNumber = function() {
      if (
          this._feedbackCategory !== FEEDBACK_CATEGORIES.SYNTAX_ERROR &&
          this._feedbackCategory !== FEEDBACK_CATEGORIES.RUNTIME_ERROR) {
        throw Error('Only syntax or runtime errors have error strings.');
      }
      return this._errorLineNumber;
    };

    /**
     * A getter for the _errorString property.
     * This function should return the error string.
     *
     * @returns {string}
     */
    FeedbackDetails.prototype.getErrorString = function() {
      if (
          this._feedbackCategory !== FEEDBACK_CATEGORIES.SYNTAX_ERROR &&
          this._feedbackCategory !== FEEDBACK_CATEGORIES.RUNTIME_ERROR) {
        throw Error('Only syntax or runtime errors have error strings.');
      }
      return this._errorString;
    };

    /**
     * A getter for the _language property.
     * This function should return the language that the student's code is
     * written in.)
     *
     * @returns {string}
     */
    FeedbackDetails.prototype.getLanguage = function() {
      if (
          this._feedbackCategory !== FEEDBACK_CATEGORIES.SYNTAX_ERROR &&
          this._feedbackCategory !== FEEDBACK_CATEGORIES.RUNTIME_ERROR) {
        throw Error('Only syntax or runtime errors have error strings.');
      }
      return this._language;
    };

    /**
     * A getter for the _errorInput property.
     * This function should return the specific input that caused the student's
     * code to fail.
     *
     * @returns {*}
     */
    FeedbackDetails.prototype.getErrorInput = function() {
      if (this._feedbackCategory !== FEEDBACK_CATEGORIES.RUNTIME_ERROR) {
        throw Error('Only syntax or runtime errors have error strings.');
      }
      return angular.copy(this._errorInput);
    };

    /**
     * A getter for the _languageUnfamiliarityFeedbackIsNeeded property.
     * This function should return whether we need to append a "consult
     * language reference" message to the feedback we provide.
     *
     * @returns {boolean}
     */
    FeedbackDetails.prototype.isLanguageUnfamiliarityFeedbackNeeded =
      function() {
        return this._languageUnfamiliarityFeedbackIsNeeded;
      };

    /**
     * A getter for the failing task index.
     *
     * @returns {number}
     */
    FeedbackDetails.prototype.getTaskIndex = function() {
      if (this._feedbackCategory !== FEEDBACK_CATEGORIES.KNOWN_BUG_FAILURE &&
          this._feedbackCategory !== FEEDBACK_CATEGORIES.SUITE_LEVEL_FAILURE &&
          this._feedbackCategory !==
          FEEDBACK_CATEGORIES.INCORRECT_OUTPUT_FAILURE) {
        throw Error(
          'Only incorrect-output failures and their variants have a task ' +
          'index.');
      }
      return this._taskIndex;
    };

    /**
     * A getter for the ID of the suite containing the first failing test case
     * for incorrect-output feedback.
     *
     * @returns {string}
     */
    FeedbackDetails.prototype.getTestSuiteId = function() {
      if (this._feedbackCategory !== FEEDBACK_CATEGORIES.KNOWN_BUG_FAILURE &&
          this._feedbackCategory !== FEEDBACK_CATEGORIES.SUITE_LEVEL_FAILURE &&
          this._feedbackCategory !==
          FEEDBACK_CATEGORIES.INCORRECT_OUTPUT_FAILURE) {
        throw Error(
          'Only incorrect-output failures and their variants have a test ' +
          'suite ID.');
      }
      return this._testSuiteId;
    };

    /**
     * A getter for the index of the first failing test case for
     * incorrect-output feedback.
     *
     * @returns {number}
     */
    FeedbackDetails.prototype.getTestCaseIndex = function() {
      if (this._feedbackCategory !== FEEDBACK_CATEGORIES.KNOWN_BUG_FAILURE &&
          this._feedbackCategory !== FEEDBACK_CATEGORIES.SUITE_LEVEL_FAILURE &&
          this._feedbackCategory !==
          FEEDBACK_CATEGORIES.INCORRECT_OUTPUT_FAILURE) {
        throw Error(
          'Only incorrect-output failures and their variants have a test ' +
          'case index.');
      }
      return this._testCaseIndex;
    };

    /**
     * A getter for the first failing test case for incorrect-output feedback.
     *
     * @returns {TestCase}
     */
    FeedbackDetails.prototype.getTestCase = function() {
      if (this._feedbackCategory !==
          FEEDBACK_CATEGORIES.INCORRECT_OUTPUT_FAILURE) {
        throw Error('Non-incorrect-output errors have no test case.');
      }
      return this._testCase;
    };

    /**
     * A getter for the observed output for the first failing test case for
     * incorrect-output feedback.
     *
     * @returns {*}
     */
    FeedbackDetails.prototype.getObservedOutput = function() {
      if (this._feedbackCategory !==
          FEEDBACK_CATEGORIES.INCORRECT_OUTPUT_FAILURE) {
        throw Error('Non-incorrect-output errors have no observed output.');
      }
      return angular.copy(this._observedOutput);
    };

    /**
     * A getter for the "correctness state" of the incorrect-output feedback to
     * show.
     *
     * @returns {string}
     */
    FeedbackDetails.prototype.getCorrectnessState = function() {
      if (this._feedbackCategory !==
          FEEDBACK_CATEGORIES.INCORRECT_OUTPUT_FAILURE) {
        throw Error('Non-incorrect-output errors have no correctness state.');
      }
      return this._correctnessState;
    };

    /**
     * A getter for the "specific test" category (which may be shadowed by
     * incorrect-output feedback).
     *
     * @returns {number}
     */
    FeedbackDetails.prototype.getSpecificCategory = function() {
      if (this._feedbackCategory !== FEEDBACK_CATEGORIES.KNOWN_BUG_FAILURE &&
          this._feedbackCategory !== FEEDBACK_CATEGORIES.SUITE_LEVEL_FAILURE &&
          this._feedbackCategory !==
          FEEDBACK_CATEGORIES.INCORRECT_OUTPUT_FAILURE) {
        throw Error(
          'Only incorrect-output errors and their variants have a specific ' +
          'category.');
      }
      return this._specificCategory;
    };

    /**
     * A getter for the "specific test" index corresponding to buggy-output or
     * suite-level feedback.
     *
     * @returns {number}
     */
    FeedbackDetails.prototype.getSpecificTestIndex = function() {
      if (this._feedbackCategory !== FEEDBACK_CATEGORIES.KNOWN_BUG_FAILURE &&
          this._feedbackCategory !== FEEDBACK_CATEGORIES.SUITE_LEVEL_FAILURE &&
          this._feedbackCategory !==
          FEEDBACK_CATEGORIES.INCORRECT_OUTPUT_FAILURE) {
        throw Error(
          'Only incorrect-output errors and their variants have a specific ' +
          'test index.');
      }
      return this._specificTestIndex;
    };

    /**
     * A getter for the message index used for specific feedback.
     *
     * @returns {number}
     */
    FeedbackDetails.prototype.getSpecificTestMessageIndex = function() {
      if (this._feedbackCategory !== FEEDBACK_CATEGORIES.KNOWN_BUG_FAILURE &&
          this._feedbackCategory !== FEEDBACK_CATEGORIES.SUITE_LEVEL_FAILURE) {
        throw Error('Non-specific errors have no feedback message index.');
      }
      return this._specificTestMessageIndex;
    };

    /**
     * A getter for the feedback message for specific feedback.
     *
     * @returns {string}
     */
    FeedbackDetails.prototype.getSpecificTestMessage = function() {
      if (this._feedbackCategory !== FEEDBACK_CATEGORIES.KNOWN_BUG_FAILURE &&
          this._feedbackCategory !== FEEDBACK_CATEGORIES.SUITE_LEVEL_FAILURE) {
        throw Error('Non-specific errors have no feedback message.');
      }
      return this._specificTestMessages[this._specificTestMessageIndex];
    };

    /**
     * A getter for the observed output for the first failing test case for
     * incorrect-output feedback.
     *
     * @returns {string}
     */
    FeedbackDetails.prototype.getExpectedPerformance = function() {
      if (this._feedbackCategory !==
          FEEDBACK_CATEGORIES.PERFORMANCE_TEST_FAILURE) {
        throw Error(
          'Non-performance-failure errors have no expected performance.');
      }
      return angular.copy(this._expectedPerformance);
    };

    /**
     * Whether this FeedbackDetails object is related to the output of the
     * user's code.
     *
     * @returns {string}
     */
    FeedbackDetails.prototype.hasOutputRelatedFailure = function() {
      return (
        this._feedbackCategory === FEEDBACK_CATEGORIES.KNOWN_BUG_FAILURE ||
        this._feedbackCategory === FEEDBACK_CATEGORIES.SUITE_LEVEL_FAILURE ||
        this._feedbackCategory === FEEDBACK_CATEGORIES.INCORRECT_OUTPUT_FAILURE
      );
    };


    // Static class methods.
    FeedbackDetails.createTimeLimitErrorFeedbackDetails = function() {
      return new FeedbackDetails(FEEDBACK_CATEGORIES.TIME_LIMIT_ERROR);
    };

    FeedbackDetails.createStackExceededFeedbackDetails = function() {
      return new FeedbackDetails(FEEDBACK_CATEGORIES.STACK_EXCEEDED_ERROR);
    };

    FeedbackDetails.createMemoryLimitErrorFeedbackDetails = function() {
      return new FeedbackDetails(FEEDBACK_CATEGORIES.MEMORY_LIMIT_ERROR);
    };

    FeedbackDetails.createServerErrorFeedbackDetails = function() {
      return new FeedbackDetails(FEEDBACK_CATEGORIES.SERVER_ERROR);
    };

    FeedbackDetails.createRuntimeErrorFeedbackDetails = function(
        errorLineNumber, errorString, language, errorInput,
        languageUnfamiliarityFeedbackIsNeeded) {
      return new FeedbackDetails(
        FEEDBACK_CATEGORIES.RUNTIME_ERROR,
        errorLineNumber,
        errorString,
        language,
        errorInput,
        languageUnfamiliarityFeedbackIsNeeded);
    };

    FeedbackDetails.createSyntaxErrorFeedbackDetails = function(
        errorLineNumber, errorString, language,
        languageUnfamiliarityFeedbackIsNeeded) {
      return new FeedbackDetails(
        FEEDBACK_CATEGORIES.SYNTAX_ERROR,
        errorLineNumber,
        errorString,
        language,
        null,
        languageUnfamiliarityFeedbackIsNeeded);
    };

    FeedbackDetails.createIncorrectOutputFeedbackDetails = function(
        taskIndex, testSuiteId, testCaseIndex, testCase, observedOutput,
        correctnessState, specificCategory, specificTestIndex) {
      if (CORRECTNESS_STATES.indexOf(correctnessState) === -1) {
        throw Error('Invalid correctness state: ' + correctnessState);
      }

      return new FeedbackDetails(
        FEEDBACK_CATEGORIES.INCORRECT_OUTPUT_FAILURE,
        null, null, null, null, null,
        taskIndex, testSuiteId, testCaseIndex,
        testCase, observedOutput, correctnessState,
        specificCategory, specificTestIndex);
    };

    FeedbackDetails.createBuggyOutputFeedbackDetails = function(
        taskIndex, testSuiteId, testCaseIndex, specificTestIndex,
        specificTestMessages, specificTestMessageIndex) {
      return new FeedbackDetails(
        FEEDBACK_CATEGORIES.KNOWN_BUG_FAILURE,
        null, null, null, null, null,
        taskIndex, testSuiteId, testCaseIndex,
        null, null, null,
        FEEDBACK_CATEGORIES.KNOWN_BUG_FAILURE, specificTestIndex,
        specificTestMessages, specificTestMessageIndex
      );
    };

    FeedbackDetails.createSuiteLevelFeedbackDetails = function(
        taskIndex, testSuiteId, testCaseIndex, specificTestIndex,
        specificTestMessages, specificTestMessageIndex) {
      return new FeedbackDetails(
        FEEDBACK_CATEGORIES.SUITE_LEVEL_FAILURE,
        null, null, null, null, null,
        taskIndex, testSuiteId, testCaseIndex,
        null, null, null,
        FEEDBACK_CATEGORIES.SUITE_LEVEL_FAILURE, specificTestIndex,
        specificTestMessages, specificTestMessageIndex
      );
    };

    FeedbackDetails.createPerformanceFeedbackDetails = function(
        expectedPerformance) {
      return new FeedbackDetails(
        FEEDBACK_CATEGORIES.PERFORMANCE_TEST_FAILURE,
        null, null, null, null, null,
        null, null, null,
        null, null, null,
        null, null, null, null,
        expectedPerformance);
    };

    FeedbackDetails.createSuccessFeedbackDetails = function() {
      return new FeedbackDetails(FEEDBACK_CATEGORIES.SUCCESSFUL);
    };

    return FeedbackDetails;
  }
]);
