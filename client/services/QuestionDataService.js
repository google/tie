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

tie.factory('QuestionDataService', [
  'QuestionObjectFactory', 'QuestionSetObjectFactory',
  function(QuestionObjectFactory, QuestionSetObjectFactory) {
    var currentQuestionSet = null;

    return {
      initCurrentQuestionSet: function(questionSetId) {
        if (!globalData.questionSets.hasOwnProperty(questionSetId)) {
          throw Error('Could not find question set with ID: ' + questionSetId);
        }
        currentQuestionSet = QuestionSetObjectFactory.create(
          globalData.questionSets[questionSetId]);
      },
      getCurrentQuestionSet: function() {
        if (!currentQuestionSet) {
          throw Error('No question set has been initialized.');
        }
        return currentQuestionSet;
      },
      getQuestion: function(questionId) {
        if (!currentQuestionSet.hasQuestionId(questionId)) {
          throw Error(
            'The current question set does not contain a question with ID: ' +
            questionId);
        }
        return QuestionObjectFactory.create(globalData.questions[questionId]);
      }
    };
  }
]);
