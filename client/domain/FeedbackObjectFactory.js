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
       * Records what message was displayed with this feedback. If not message
       * is displayed, then remains null.
       *
       * @type {string}
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
     * Appends a FeedbackParagraph is of type text to the _paragraphs Array.
     *
     * @param {string} text string to be inserted in text paragraph
     */
    Feedback.prototype.appendTextParagraph = function(text) {
      this._paragraphs.push(
        FeedbackParagraphObjectFactory.createTextParagraph(text));
    };

    /**
     * Appends a FeedbackParagraph of type code to the _paragraphs Array
     *
     * @param {string} code string of code to be inserted into code paragraph
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
     * @param {string} text string describing the syntax error
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
     *
     * @returns {*|string}
     */
    Feedback.prototype.getHintIndex = function() {
      return this._hintIndex;
    };

    Feedback.prototype.setHintIndex = function(index) {
      this._hintIndex = index;
    };

    Feedback.prototype.getReinforcement = function() {
      return this._reinforcement;
    };

    Feedback.prototype.setReinforcement = function(reinforcement) {
      this._reinforcement = reinforcement;
    };

    // Static class methods.
    Feedback.create = function(answerIsCorrect) {
      return new Feedback(answerIsCorrect);
    };

    return Feedback;
  }
]);
