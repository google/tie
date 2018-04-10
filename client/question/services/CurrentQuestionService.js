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
 * @fileoverview A service that maintains details of the currently-active
 * question in the learner view.
 */

tie.factory('CurrentQuestionService', [
  '$location', 'DEFAULT_QUESTION_ID', 'SERVER_URL', 'QuestionDataService',
  function($location, DEFAULT_QUESTION_ID, SERVER_URL, QuestionDataService) {
    var questionId = ($location.search().qid || DEFAULT_QUESTION_ID);
    // Currently this always returns 1, as question versioning isn't
    // implemented yet.
    // TODO(eyurko): Return correct question version, once implemented.
    var questionVersion = 1;
    var cachedQuestion = null;

    return {
      init: function(successCallback) {
        var that = this;

        var questionPromise = QuestionDataService.fetchQuestionAsync(
          questionId);
        questionPromise.then(function(question) {
          if (question) {
            cachedQuestion = question;
            successCallback();
          } else {
            // If the question ID in the URL is invalid, revert to using the
            // default question ID.
            questionId = DEFAULT_QUESTION_ID;
            that.init(successCallback);
          }
        });
      },
      getCurrentQuestionId: function() {
        return questionId;
      },
      getCurrentQuestionVersion: function() {
        return questionVersion;
      },
      getCurrentQuestion: function() {
        return cachedQuestion;
      }
    };
  }
]);
