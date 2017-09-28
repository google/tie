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
  'FeedbackParagraphObjectFactory', 'ReinforcementObjectFactory',
  function(FeedbackParagraphObjectFactory, ReinforcementObjectFactory) {
    /**
     * Feedback objects contain encapsulate all of the information
     * - including personalized feedback and Reinforcement - that are used to
     * provide constructive feedback to the user.
     */

    /**
     * Constructor for Feedback
     *
     * @param {boolean} answerIsCorrect indicates whether student's answer
     *    is correct or not
     * @constructor
     */
    var Feedback = function(answerIsCorrect) {
      /**
       * List of FeedbackParagraph objects associated with this feedback.
       *
       * @type {Array}
       * @private
       */
      this._paragraphs = [];

      /**
       * @type {boolean}
       * @private
       */
      this._answerIsCorrect = answerIsCorrect;

      /**
       * Records index of what message was displayed with this feedback.
       * If no message is displayed, then remains null.
       *
       * @type {number}
       * @private
       */
      this._hintIndex = null;

      /**
       * @type {Reinforcement}
       * @private
       */
      this._reinforcement = ReinforcementObjectFactory.create();
    };

    // Instance methods.
    /**
     * A getter for the _paragraphs property.
     * Should return an Array of FeedbackParagraph objects.
     *
     * @returns {Array}
     */
    Feedback.prototype.getParagraphs = function() {
      return this._paragraphs;
    };

    /**
     * A getter for _answerIsCorrect property.
     * Should return a boolean indicating if the student's submission is correct
     * or not.
     *
     * @returns {boolean}
     */
    Feedback.prototype.isAnswerCorrect = function() {
      return this._answerIsCorrect;
    };

    /**
     * Appends a FeedbackParagraph of type text to the _paragraphs Array.
     *
     * @param {string} text String to be inserted in text paragraph
     */
    Feedback.prototype.appendTextParagraph = function(text) {
      this._paragraphs.push(
        FeedbackParagraphObjectFactory.createTextParagraph(text));
    };

    /**
     * Appends a FeedbackParagraph of type code to the _paragraphs Array
     *
     * @param {string} code String of code to be inserted into code paragraph
     */
    Feedback.prototype.appendCodeParagraph = function(code) {
      if (this._paragraphs.length === 0) {
        throw Error('The first feedback paragraph should be a text paragraph.');
      }
      this._paragraphs.push(
        FeedbackParagraphObjectFactory.createCodeParagraph(code));
    };

    /**
     * Appends a FeedbackParagraph of type SyntaxError to the _paragraphs
     * Array
     *
     * @param {string} text String describing the syntax error
     */
    Feedback.prototype.appendSyntaxErrorParagraph = function(text) {
      this._paragraphs.push(
        FeedbackParagraphObjectFactory.createSyntaxErrorParagraph(text));
    };

    /**
     * Clears all FeedbackParagraph objects from the _paragraphs property.
     */
    Feedback.prototype.clear = function() {
      this._paragraphs.length = 0;
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
     * A getter for the _reinforcement property.
     * This function should return the Reinforcement object associated with
     * this feedback.
     *
     * @returns {Reinforcement}
     */
    Feedback.prototype.getReinforcement = function() {
      return this._reinforcement;
    };

    /**
     * A setter for the _reinforcement property.
     *
     * @param {Reinforcement} reinforcement
     */
    Feedback.prototype.setReinforcement = function(reinforcement) {
      this._reinforcement = reinforcement;
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
        this._paragraphs.push(paragraph);
      }.bind(this));

      var appendedHintIndex = feedbackToAppend.getHintIndex();
      if (appendedHintIndex !== null) {
        this.setHintIndex(appendedHintIndex);
      }
    };


    /**
     * Returns all of the feedback provided as a single text string.
     *
     * @returns [string] The feedback paragraphs as plaintext.
     */
    Feedback.prototype.getFeedbackParagraphsAsText = function() {
      var textParagraphs = [];

      for (var i = 0; i < this._paragraphs.length; i++) {
        textParagraphs.push(this._paragraphs[i].getContent());
      }

      return textParagraphs.join('\n');
    };

    // Static class methods.
    /**
     * Returns a Feedback object based on the param passed in.
     *
     * @param {boolean} answerIsCorrect Indicates if the student's answer is
     *    correct or not.
     * @returns {Feedback}
     */
    Feedback.create = function(answerIsCorrect) {
      return new Feedback(answerIsCorrect);
    };

    return Feedback;
  }
]);
