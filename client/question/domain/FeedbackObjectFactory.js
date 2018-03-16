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
 * @fileoverview Factory for creating new frontend instances of Feedback
 * domain objects.
 */

tie.factory('FeedbackObjectFactory', [
  'FeedbackParagraphObjectFactory', 'FEEDBACK_CATEGORIES',
  function(FeedbackParagraphObjectFactory, FEEDBACK_CATEGORIES) {
    /**
     * Feedback objects encapsulate the personalized feedback that is used to
     * provide constructive feedback to the user.
     */

    /**
     * Constructor for Feedback
     *
     * @param {string} feedbackCategory The category of the feedback. Must be
     *    a valid entry in FEEDBACK_CATEGORIES.
     * @constructor
     */
    var Feedback = function(feedbackCategory) {
      if (!FEEDBACK_CATEGORIES.hasOwnProperty(feedbackCategory)) {
        throw Error('Invalid feedback category: ' + feedbackCategory);
      }

      /**
       * List of FeedbackParagraph objects associated with this feedback.
       *
       * @type {Array}
       * @private
       */
      this._feedbackParagraphs = [];

      /**
       * Records index of what message was displayed with this feedback.
       * If no message is displayed, then remains null.
       *
       * @type {number}
       * @private
       */
      this._hintIndex = null;

      /**
       * Records the category corresponding to this feedback.
       *
       * @type {string}
       * @private
       */
      this._feedbackCategory = feedbackCategory;
    };

    // Instance methods.
    /**
     * Retrieves the list of paragraphs associated with this Feedback object.
     *
     * @returns {Array} An array of FeedbackParagraph objects.
     */
    Feedback.prototype.getParagraphs = function() {
      return this._feedbackParagraphs;
    };

    /**
     * Returns a boolean indicating if the student's submission is correct
     * or not.
     *
     * @returns {boolean}
     */
    Feedback.prototype.isAnswerCorrect = function() {
      return this._feedbackCategory === FEEDBACK_CATEGORIES.SUCCESSFUL;
    };

    /**
     * Appends a FeedbackParagraph of type text to the _paragraphs Array.
     *
     * @param {string} text String to be inserted in text paragraph.
     */
    Feedback.prototype.appendTextParagraph = function(text) {
      this._feedbackParagraphs.push(
        FeedbackParagraphObjectFactory.createTextParagraph(text));
    };

    /**
     * Appends a FeedbackParagraph of type code to the _paragraphs Array.
     *
     * @param {string} code String of code to be inserted into code paragraph.
     */
    Feedback.prototype.appendCodeParagraph = function(code) {
      if (this._feedbackParagraphs.length === 0) {
        throw Error('The first feedback paragraph should be a text paragraph.');
      }
      this._feedbackParagraphs.push(
        FeedbackParagraphObjectFactory.createCodeParagraph(code));
    };

    /**
     * Appends a FeedbackParagraph of type error to the _paragraphs
     * Array.
     *
     * @param {string} text String describing the error.
     */
    Feedback.prototype.appendErrorParagraph = function(text) {
      this._feedbackParagraphs.push(
        FeedbackParagraphObjectFactory.createErrorParagraph(text));
    };

    /**
     * Appends a FeedbackParagraph of type output to the _paragraphs
     * Array.
     *
     * @param {string} outputString String of code to be inserted as code
     * output.
     */
    Feedback.prototype.appendOutputParagraph = function(outputString) {
      this._feedbackParagraphs.push(
        FeedbackParagraphObjectFactory.createOutputParagraph(outputString));
    };

    /**
     * Appends an ImageParagraph of type image to the _paragraphs Array.
     *
     * @param {string} imageFilename name of the image file.
     */
    Feedback.prototype.appendImageParagraph = function(imageFilename) {
      this._feedbackParagraphs.push(
        FeedbackParagraphObjectFactory.createImageParagraph(imageFilename));
    };

    /**
     * Clears all FeedbackParagraph objects from the _paragraphs property.
     */
    Feedback.prototype.clear = function() {
      this._feedbackParagraphs.length = 0;
    };

    /**
     * A getter for the _hintIndex property.
     * This function should return a number that indicates the index of the
     * hint given for this feedback (if one is given).
     *
     * @returns {*|number}
     */
    Feedback.prototype.getHintIndex = function() {
      return this._hintIndex;
    };

    /**
     * A setter for the _hintIndex property.
     *
     * @param {number} index
     */
    Feedback.prototype.setHintIndex = function(index) {
      this._hintIndex = index;
    };

    /**
     * A getter for the _feedbackCategory property.
     * This function should return the category which corresponds to this
     * feedback.
     *
     * @returns {string}
     */
    Feedback.prototype.getFeedbackCategory = function() {
      return this._feedbackCategory;
    };

    /**
     * Appends the feedback paragraphs in the given Feedback object to the
     * current feedback. If the appended feedback contains a hint index, that
     * index is updated too.
     *
     * @param {Feedback} feedbackToAppend
     */
    Feedback.prototype.appendFeedback = function(feedbackToAppend) {
      var paragraphsToAppend = feedbackToAppend.getParagraphs();
      paragraphsToAppend.forEach(function(paragraph) {
        this._feedbackParagraphs.push(paragraph);
      }.bind(this));

      var appendedHintIndex = feedbackToAppend.getHintIndex();
      if (appendedHintIndex !== null) {
        this.setHintIndex(appendedHintIndex);
      }
    };

    /**
     * Returns all of the feedback provided as a JSON dict, preserving type
     * and content information.
     *
     * @returns [{string, Object}] The feedback paragraphs list of dicts.
     */
    Feedback.prototype.getParagraphsAsListOfDicts = function() {
      return this._feedbackParagraphs.map(function(paragraph) {
        return paragraph.toDict();
      });
    };

    // Static class methods.
    /**
     * Returns a Feedback object based on the param passed in.
     *
     * @param {string} feedbackCategory The category of the feedback. Must be
     *    a valid entry in FEEDBACK_CATEGORIES.
     * @returns {Feedback}
     */
    Feedback.create = function(feedbackCategory) {
      return new Feedback(feedbackCategory);
    };

    return Feedback;
  }
]);
