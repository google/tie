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
 * @fileoverview Stateless service for retrieving question data from static
 * storage, given a question ID.
 */

tieData.factory('QuestionDataService', [
  '$q', '$http', '$log', 'QuestionObjectFactory', 'SERVER_URL',
  function($q, $http, $log, QuestionObjectFactory, SERVER_URL) {
    return {
      /**
       * Asynchronous call to get the data for a question with the given
       * question ID.
       *
       * @param {string} questionId
       * @returns {callback}
       */
      fetchQuestionAsync: function(questionId) {
        if (SERVER_URL) {
          return $http.post('/ajax/get_question_data', {
            questionId: questionId
          }).then(
            function(responseData) {
              return QuestionObjectFactory.create(
                  responseData.data.question_data,
                  responseData.data.question_version);
            }, function() {
              $log.error('There was an error in retrieving the question.');
              return null;
            }
          );
        } else {
          var deferred = $q.defer();
          var question = null;
          // We force question version = 1 for static questions.
          var questionVersion = 1;
          if (globalData.questions.hasOwnProperty(questionId)) {
            question = QuestionObjectFactory.create(
              globalData.questions[questionId], questionVersion);
          } else {
            $log.error('There is no question with ID: ' + questionId);
          }

          deferred.resolve(question);
          return deferred.promise;
        }
      }
    };
  }
]);
