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
 * @fileoverview Service that provides methods to create events on TIE's
 * backend, if it exists.
 */
tie.factory('EventHandlerService', [
  '$http', 'ServerHandlerService', function($http, ServerHandlerService) {

    return {
      /**
       * Submits data to TIE's backend to create a SessionPauseEvent.
       * @param {string} sessionId Unique ID for a user's question session.
       *
       */
      createSessionPauseEvent: function(sessionId) {
        if (ServerHandlerService.doesServerExist()) {
          var data = {
            sessionId: sessionId
          };
          $http.post('/ajax/event/create_session_pause_event', data);
        }
      },

      /**
       * Submits data to TIE's backend to create a SessionResumeEvent.
       * @param {string} sessionId Unique ID for a user's question session.
       *
       */
      createSessionResumeEvent: function(sessionId) {
        if (ServerHandlerService.doesServerExist()) {
          var data = {
            sessionId: sessionId
          };
          $http.post('/ajax/event/create_session_resume_event', data);
        }
      },

      /**
       * Submits a QuestionStartEvent to TIE's backend.
       * @param {string} sessionId Unique ID for a user's question session.
       * @param {string} questionId ID of the question being attempted.
       * @param {string} questionVersion Version number of the question
       *  being attempted.
       *
       */
      createQuestionStartEvent: function(
        sessionId, questionId, questionVersion) {
        if (ServerHandlerService.doesServerExist()) {
          var data = {
            sessionId: sessionId,
            questionId: questionId,
            questionVersion: questionVersion
          };
          $http.post('/ajax/event/create_question_start_event', data);
        }
      },

      /**
       * Submits data to TIE's backend to create a QuestionCompleteEvent.
       * @param {string} sessionId Unique ID for a user's question session.
       * @param {string} questionId ID of the question being attempted.
       * @param {string} questionVersion Version number of the question
       *  being attempted.
       *
       */
      createQuestionCompleteEvent: function(
        sessionId, questionId, questionVersion) {
        if (ServerHandlerService.doesServerExist()) {
          var data = {
            sessionId: sessionId,
            questionId: questionId,
            questionVersion: questionVersion
          };
          $http.post('/ajax/event/create_question_complete_event', data);
        }
      },

      /**
       * Submits data to TIE's backend to create a TaskStartEvent.
       * @param {string} sessionId Unique ID for a user's question session.
       * @param {string} questionId ID of the question being attempted.
       * @param {string} questionVersion Version number of the question
       *  being attempted.
       * @param {string} taskId ID of the task being attempted.
       *
       */
      createTaskStartEvent: function(
        sessionId, questionId, questionVersion, taskId) {
        if (ServerHandlerService.doesServerExist()) {
          var data = {
            sessionId: sessionId,
            questionId: questionId,
            questionVersion: questionVersion,
            taskId: taskId
          };
          $http.post('/ajax/event/create_task_start_event', data);
        }
      },

      /**
       * Submits data to TIE's backend to create a TaskCompleteEvent.
       * @param {string} sessionId Unique ID for a user's question session.
       * @param {string} questionId ID of the question being attempted.
       * @param {string} questionVersion Version number of the question
       *  being attempted.
       * @param {string} taskId ID of the task being attempted.
       *
       */
      createTaskCompleteEvent: function(
        sessionId, questionId, questionVersion, taskId) {
        if (ServerHandlerService.doesServerExist()) {
          var data = {
            sessionId: sessionId,
            questionId: questionId,
            questionVersion: questionVersion,
            taskId: taskId
          };
          $http.post('/ajax/event/create_task_complete_event', data);
        }
      },

      /**
       * Submits data to TIE's backend to create a CodeSubmitEvent.
       * @param {string} sessionId Unique ID for a user's question session.
       * @param {string} feedbackText The feedback shown to the user.
       * @param {string} errorCategory The type of feedback shown
       *  to the user.
       * @param {string} code The user's submitted code.
       * @param {boolean} success Whether or not the question was completed.
       *
       */
      createCodeSubmitEvent: function(
        sessionId, feedbackText, errorCategory, code, success) {
        if (ServerHandlerService.doesServerExist()) {
          var data = {
            sessionId: sessionId,
            feedbackText: feedbackText,
            errorCategory: errorCategory,
            code: code,
            success: success
          };
          $http.post('/ajax/event/create_code_submit_event', data);
        }
      }
    };
  }]);
