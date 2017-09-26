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
    var FEEDBACK_CATEGORIES = [
      'SYNTAX', 'MATCHED BUGGY OUTPUT', 'UNMATCHED BUGGY OUTPUT', 'RUNTIME',
      'PERFORMANCE', 'NO ERROR'];

    return {
      FEEDBACK_CATEGORIES: FEEDBACK_CATEGORIES,
      /**
       * Submits data to TIE's backend to create a SessionPauseEvent.
       *
       */
      createSessionPauseEvent: function(sessionId) {
        if (ServerHandlerService.doesServerExist()) {
          var data = {
            sessionId: sessionId
          };
          $http.post('/ajax/admin/create_session_pause_event', data);
        }
      },

      /**
       * Submits data to TIE's backend to create a SessionResumeEvent.
       *
       */
      createSessionResumeEvent: function(sessionId) {
        if (ServerHandlerService.doesServerExist()) {
          var data = {
            sessionId: sessionId
          };
          $http.post('/ajax/admin/create_session_resume_event', data);
        }
      },

      /**
       * Submits a QuestionStartEvent to TIE's backend.
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
          $http.post('/ajax/admin/create_question_start_event', data);
        }
      },

      /**
       * Submits data to TIE's backend to create a QuestionCompleteEvent.
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
          $http.post('/ajax/admin/create_question_complete_event', data);
        }
      },

      /**
       * Submits data to TIE's backend to create a TaskStartEvent.
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
          $http.post('/ajax/admin/create_task_start_event', data);
        }
      },

      /**
       * Submits data to TIE's backend to create a TaskCompleteEvent.
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
          $http.post('/ajax/admin/create_task_complete_event', data);
        }
      },

      /**
       * Submits data to TIE's backend to create a CodeSubmitEvent.
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
          $http.post('/ajax/admin/create_code_submit_event', data);
        }
      }
    };
  }]);
