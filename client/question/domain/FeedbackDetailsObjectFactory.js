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
  'FEEDBACK_CATEGORIES', function(FEEDBACK_CATEGORIES) {
    /**
     * Feedback objects encapsulate the personalized feedback that is used to
     * provide constructive feedback to the user.
     */

    /**
     * Constructor for FeedbackDetails
     *
     * @param {string} feedbackCategory The category of the feedback. Must be
     *    a valid entry in FEEDBACK_CATEGORIES.
     * @param {string|null} errorString The error message.
     * @param {language|null} language The language that the student's code is
     *    written in.
     * @param {*|null} errorInput The specific input that caused the error, if
     *    applicable.
     * @param {boolean} languageUnfamiliarityFeedbackIsNeeded Whether we need
     *    to append a feedback paragraph prompting the user to consult
     *    language-specific references.
     * @constructor
     */
    var FeedbackDetails = function(
        feedbackCategory, errorString, language, errorInput,
        languageUnfamiliarityFeedbackIsNeeded) {
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
       * WHether to append language unfamiliarity feedback to what is shown
       * to the student.
       *
       * @type {boolean}
       * @private
       */
      this._languageUnfamiliarityFeedbackIsNeeded = (
        languageUnfamiliarityFeedbackIsNeeded || false);
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
     * A getter for the _errorString property.
     * This function should return the error string.
     *
     * @returns {string}
     */
    FeedbackDetails.prototype.getErrorString = function() {
      if (
          this._feedbackCategory !== FEEDBACK_CATEGORIES.SYNTAX_ERROR &&
          this._feedbackCategory !== FEEDBACK_CATEGORIES.RUNTIME_ERROR) {
        throw Error('Non-syntax or runtime errors have no error string.');
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
        throw Error('Non-syntax or runtime errors have no language.');
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
        throw Error('Non-runtime errors have no error input.');
      }
      return this._errorInput;
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

    // Static class methods.
    FeedbackDetails.createTimeLimitErrorFeedback = function() {
      return new FeedbackDetails(FEEDBACK_CATEGORIES.TIME_LIMIT_ERROR);
    };

    FeedbackDetails.createStackExceededFeedback = function() {
      return new FeedbackDetails(FEEDBACK_CATEGORIES.STACK_EXCEEDED_ERROR);
    };

    FeedbackDetails.createServerErrorFeedback = function() {
      return new FeedbackDetails(FEEDBACK_CATEGORIES.SERVER_ERROR);
    };

    FeedbackDetails.createRuntimeErrorFeedback = function(
        errorString, language, errorInput,
        languageUnfamiliarityFeedbackIsNeeded) {
      return new FeedbackDetails(
        FEEDBACK_CATEGORIES.RUNTIME_ERROR,
        errorString,
        language,
        errorInput,
        languageUnfamiliarityFeedbackIsNeeded);
    };

    FeedbackDetails.createSyntaxErrorFeedback = function(
        errorString, language, languageUnfamiliarityFeedbackIsNeeded) {
      return new FeedbackDetails(
        FEEDBACK_CATEGORIES.SYNTAX_ERROR,
        errorString,
        language,
        null,
        languageUnfamiliarityFeedbackIsNeeded);
    };

    return FeedbackDetails;
  }
]);
