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
    var questionVersion = null;
    var cachedQuestion = null;
    var serviceIsInitialized = false;

    return {
      init: function(callbackFunction) {
        var that = this;

        var questionPromise = QuestionDataService.fetchQuestionAsync(
          questionId);
        questionPromise.then(function(question) {
          if (question) {
            cachedQuestion = question;
            questionVersion = question.getVersion();
            serviceIsInitialized = true;
            callbackFunction();
          } else if (questionId === DEFAULT_QUESTION_ID) {
            // This is considered to be the failure case, but it should
            // call through; for instance, if extra setup / redirecting
            // is done after this method.
            callbackFunction();
          } else {
            // If the question ID in the URL is invalid, revert to using the
            // default question ID.
            questionId = DEFAULT_QUESTION_ID;
            serviceIsInitialized = true;
            that.init(callbackFunction);
          }
        });
      },
      isInitialized: function() {
        return serviceIsInitialized;
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
