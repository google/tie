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
  '$http', 'QuestionObjectFactory',
  function($http, QuestionObjectFactory) {
    return {
      /**
       * Returns the Question with the given question ID. If the questionId
       * does not correspond to a Question, the function throws an Error.
       *
       * @param {string} questionId
       * @returns {Question}
       */
      getQuestion: function(questionId) {
        if (!globalData.questions.hasOwnProperty(questionId)) {
          throw Error('There is no question with ID: ' + questionId);
        }
        return QuestionObjectFactory.create(globalData.questions[questionId]);
      },
      /**
       * Asynchronous call to get the data for a question with the given
       * question ID.
       *
       * @param {string} questionId
       * @returns {callback}
       */
      getQuestionAsync: function(questionId) {
        return $http.post('/ajax/get_question_data', {
          questionId: questionId
        }).then(
          function(responseData) {
            return QuestionObjectFactory.create(
                responseData.data.question_data);
          }, function() {
            throw Error('There was an error in retrieving the question.');
          }
        );
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
      }
    };
  }
]);
