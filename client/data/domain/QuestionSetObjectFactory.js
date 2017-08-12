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
 * @fileoverview Factory for creating new frontend instances of QuestionSet
 * objects, which are linear sequences of questions on a particular topic.
 */

tieData.factory('QuestionSetObjectFactory', [
  function() {
    /**
     * QuestionSet represents a component that bundles together questions of
     * similar types to be unpacked and represented in the UI.
     */

    /**
     * Constructor for QuestionSet.
     *
     * @param {dict} questionSetDict
     * @constructor
     */
    var QuestionSet = function(questionSetDict) {
      /**
       * Array of strings that have the ids for the questions included in this
       * set.
       *
       * @type {Array}
       * @private
       */
      this._questionIds = questionSetDict.questionIds;

      /**
       * Array of strings that will be displayed as an introduction to this
       * question set.
       *
       * @type {Array}
       * @private
       */
      this._introductionParagraphs = questionSetDict.introductionParagraphs;
    };

    // Instance methods.
    /**
     * A getter for the _questionIds property.
     * Should return an Array of strings with the ids of the questions included
     * in this set.
     *
     * @returns {Array}
     */
    QuestionSet.prototype.getQuestionIds = function() {
      return this._questionIds;
    };

    /**
     * Returns the id of the question at the given index.
     *
     * @param {number} index
     * @returns {string}
     */
    QuestionSet.prototype.getQuestionId = function(index) {
      if (index < 0 || index >= this._questionIds.length) {
        throw Error(
          'Index ' + index + ' is out of bounds for the number of questions ' +
          'in the current question set.');
      }
      return this._questionIds[index];
    };

    /**
     * Returns the first question's ID in the _questionIds Array.
     *
     * @returns {string}
     */
    QuestionSet.prototype.getFirstQuestionId = function() {
      return this.getQuestionId(0);
    };

    /**
     * Checks if the set's _questionIds property contains the given question id.
     *
     * @param {string} questionId
     * @returns {boolean}
     */
    QuestionSet.prototype.hasQuestionId = function(questionId) {
      return this._questionIds.indexOf(questionId) !== -1;
    };

    /**
     * Returns the number of questions in this question set.
     *
     * @returns {Number}
     */
    QuestionSet.prototype.getNumberOfQuestions = function() {
      return this._questionIds.length;
    };

    /**
     * A getter for the _introductionParagraphs property.
     * Should return an Array of strings to be displayed as an introduction
     * to this question set.
     *
     * @returns {Array}
     */
    QuestionSet.prototype.getIntroductionParagraphs = function() {
      return this._introductionParagraphs;
    };

    // Static class methods.
    /**
     * Returns a QuestionSet object with the properties given in the
     * questionSetDict param
     *
     * @param {dict} questionSetDict
     * @returns {QuestionSet}
     */
    QuestionSet.create = function(questionSetDict) {
      return new QuestionSet(questionSetDict);
    };

    return QuestionSet;
  }
]);
