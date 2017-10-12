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
 * @fileoverview Service for retrieving question data from static storage and
 * maintaining a copy in the frontend.
 */

tieData.factory('QuestionDataService', [
  'QuestionObjectFactory', 'QuestionSetObjectFactory',
  function(QuestionObjectFactory, QuestionSetObjectFactory) {
    /** @type {null|QuestionSet} */
    var currentQuestionSet = null;

    return {
      /**
       * Initiatlizes the currentQuestionSet property to contain the QuestionSet
       * the user is currently using.
       *
       * @param {string} questionSetId
       */
      initCurrentQuestionSet: function(questionSetId) {
        if (!globalData.questionSets.hasOwnProperty(questionSetId)) {
          throw Error('Could not find question set with ID: ' + questionSetId);
        }
        currentQuestionSet = QuestionSetObjectFactory.create(
          globalData.questionSets[questionSetId]);
      },
      /**
       * A getter for the currentQuestionSet property. Returns null if property
       * is not initialized yet.
       *
       * @returns {null|QuestionSet}
       */
      getCurrentQuestionSet: function() {
        if (!currentQuestionSet) {
          throw Error('No question set has been initialized.');
        }
        return currentQuestionSet;
      },
      /**
       * Returns the Question in the QuestionSet with the given question ID.
       * If the questionId does not correspond to a Question in the QuestionSet,
       * then function throws an Error.
       *
       * @param {string} questionId
       * @returns {Question}
       */
      getQuestion: function(questionId) {
        if (!currentQuestionSet.hasQuestionId(questionId)) {
          throw Error(
            'The current question set does not contain a question with ID: ' +
            questionId);
        }
        return QuestionObjectFactory.create(globalData.questions[questionId]);
      },
      /**
       * Returns the question's user friendly title.
       *
       * @param {string} questionId
       * @returns {string}
       */
      getQuestionTitle: function(questionId) {
        var question = this.getQuestion(questionId);
        return question.getTitle();
      },
      /**
       * Returns the question's version.
       * Currently always returns 1, as question versioning isn't implemented
       * yet.
       * TODO(eyurko): Return correct question version, once implemented.
       *
       * @returns {int} Currently the number 1.
       */
      getQuestionVersion: function() {
        return 1;
      },
      /**
       * Returns the question's shortened instructions, which includes
       * only the text content in the first task (ignores code blocks).
       *
       * @param {string} questionId
       * @returns {string} concatenated string of all the text segments
       */
      getQuestionPreviewInstructions(questionId) {
        var question = this.getQuestion(questionId);
        var instructionsForFirstTask = question.getTasks()[0].getInstructions();
        var constructedInstructions = '';

        // We only need to grab the text portions of these instructions
        // for the preview content.
        for (var i = 0; i < instructionsForFirstTask.length; i++) {
          if (instructionsForFirstTask[i].type === 'text') {
            constructedInstructions +=
              instructionsForFirstTask[i].content + ' ';
          }
        }
        return constructedInstructions;
      },
      /**
       * Returns an array of question ids of the current question set
       * after initializing it. Throws an error if cannot initialize.
       *
       * @param {string} questionSetId
       * @returns {Array}
       */
      initAndGetQuestionIdsFromSet(questionSetId) {
        this.initCurrentQuestionSet(questionSetId);
        return currentQuestionSet.getQuestionIds();
      }
    };
  }
]);
