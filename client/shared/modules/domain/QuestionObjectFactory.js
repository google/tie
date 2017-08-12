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
 * @fileoverview Factory for creating new frontend instances of Question
 * domain objects.
 */

tieData.factory('QuestionObjectFactory', [
  'TaskObjectFactory', function(TaskObjectFactory) {
    /**
     * Question objects encapsulate all of the information necessary to
     * represent a given question in the UI in addition to all of the testing
     * information necessary to see if the code submissions pass.
     */

    /**
     * Constructor for Question objects.
     *
     * @param {dict} questionDict Dictionary with values for the properties to
     *    be used for this object.
     * @constructor
     */
    var Question = function(questionDict) {
      /**
       * Indicates title of this question.
       *
       * @type {string}
       * @private
       */
      this._title = questionDict.title;

      /**
       * The code the user is given when they start the task before adding
       * their own.
       *
       * @type {string}
       * @private
       */
      this._starterCode = questionDict.starterCode;

      /**
       * Code that the user doesn't write on their own but is needed to make
       * the submission run correctly.
       *
       * @type {string}
       * @private
       */
      this._auxiliaryCode = questionDict.auxiliaryCode;

      /**
       * List of Tasks that indicate what tests the user's submission needs
       * to pass.
       *
       * @type {Array}
       * @private
       */
      this._tasks = questionDict.tasks.map(function(taskDict) {
        return TaskObjectFactory.create(taskDict);
      });
    };

    // Instance methods.
    /**
     * A getter for the _title property.
     * Should return a string of the name/title for this question.
     *
     * @returns {string}
     */
    Question.prototype.getTitle = function() {
      return this._title;
    };

    /**
     * A getter for the _starterCode property.
     * If the language is supported for this question, then it should return a
     * string with the original functions and code that the user sees
     * before they start adding their own code.
     * If the language isn't supported, should throw an Error.
     *
     * @param {string} language
     * @returns {string}
     */
    Question.prototype.getStarterCode = function(language) {
      if (!this._starterCode.hasOwnProperty(language)) {
        throw Error('No starter code exists for language: ' + language);
      }
      return this._starterCode[language];
    };

    /**
     * A getter for the _auxiliaryCode property.
     * If the language is supported for this question, then it should return a
     * string with the functions and code that the user doesn't write but is
     * needed to make the submission run correctly.
     * If the language is not supported, should throw an Error.
     *
     * @param {string} language
     * @returns {string}
     */
    Question.prototype.getAuxiliaryCode = function(language) {
      if (!this._auxiliaryCode.hasOwnProperty(language)) {
        throw Error('No auxiliary code exists for language: ' + language);
      }
      return this._auxiliaryCode[language];
    };

    /**
     * Checks if the given task index is the last in the list of tasks for the
     * question.
     *
     * @param {number} taskIndex
     * @returns {boolean}
     */
    Question.prototype.isLastTask = function(taskIndex) {
      if (!this._tasks.length) {
        return false;
      }
      return taskIndex === this._tasks.length - 1;
    };

    /**
     * A getter for the _tasks property.
     * Should return an Array of Task objects detailing what tests the user's
     * submission must pass.
     *
     * @returns {Array}
     */
    Question.prototype.getTasks = function() {
      return this._tasks;
    };

    // Static class methods.
    /**
     * Returns a Question object with the properties detailed in the given
     * dictionary.
     *
     * @param {dict} questionDict Should have all the properties needed
     *    to create this Question object.
     * @returns {Question}
     */
    Question.create = function(questionDict) {
      return new Question(questionDict);
    };

    return Question;
  }
]);
