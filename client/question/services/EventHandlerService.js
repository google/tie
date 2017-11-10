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


    /**
     * Global object to keep track of the current batch of events to send.
     * @type [Event]
     */
    var currentEventBatch = [];

    /**
     * Submits the current batch of event data to TIE's backend.
     *
     */
    var sendCurrentEventBatch = function() {
      var data = {
        events: currentEventBatch,
        createdMsec: (new Date()).getTime()
      };
      return $http.post('/ajax/event/send_event_batch', data).then(
        function() {
          while (currentEventBatch.length > 0) {
            currentEventBatch.pop();
          }
        }, function() {
          // Otherwise, we should do nothing.
          // Since the call errored, don't dump the current batch.
      });
    };

    return {
      currentEventBatch: currentEventBatch,

      sendCurrentEventBatch: sendCurrentEventBatch,

      /**
       * Submits data to TIE's backend to create a SessionPauseEvent.
       * @param {string} sessionId Unique ID for a user's question session.
       *
       */
      createSessionPauseEvent: function(sessionId) {
        if (ServerHandlerService.doesServerExist()) {
          var data = {
            sessionId: sessionId,
            createdMsec: (new Date()).getTime()
          };
          var event = {
            type: 'SessionPauseEvent',
            data: data
          };
          currentEventBatch.push(event);
          sendCurrentEventBatch();
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
            sessionId: sessionId,
            createdMsec: (new Date()).getTime()
          };
          var event = {
            type: 'SessionResumeEvent',
            data: data
          };
          currentEventBatch.push(event);
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
            questionVersion: questionVersion,
            createdMsec: (new Date()).getTime()
          };
          var event = {
            type: 'QuestionStartEvent',
            data: data
          };
          currentEventBatch.push(event);
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
            questionVersion: questionVersion,
            createdMsec: (new Date()).getTime()
          };
          var event = {
            type: 'QuestionCompleteEvent',
            data: data
          };
          currentEventBatch.push(event);
          sendCurrentEventBatch();
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
            taskId: taskId,
            createdMsec: (new Date()).getTime()
          };
          var event = {
            type: 'TaskStartEvent',
            data: data
          };
          currentEventBatch.push(event);
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
            taskId: taskId,
            createdMsec: (new Date()).getTime()
          };
          var event = {
            type: 'TaskCompleteEvent',
            data: data
          };
          currentEventBatch.push(event);
        }
      },

      /**
       * Submits data to TIE's backend to create a CodeResetEvent.
       * @param {string} sessionId Unique ID for a user's question session.
       *
       */
      createCodeResetEvent: function(sessionId) {
        if (ServerHandlerService.doesServerExist()) {
          var data = {
            sessionId: sessionId,
            createdMsec: (new Date()).getTime()
          };
          var event = {
            type: 'CodeResetEvent',
            data: data
          };
          currentEventBatch.push(event);
        }
      },

      /**
       * Submits data to TIE's backend to create a CodeSubmitEvent.
       * @param {string} sessionId Unique ID for a user's question session.
       * @param {string} feedbackText The feedback shown to the user.
       * @param {string} feedbackCategory The type of feedback shown to the
       *   user.
       * @param {string} code The user's submitted code.
       *
       */
      createCodeSubmitEvent: function(
          sessionId, feedbackText, feedbackCategory, code) {
        if (ServerHandlerService.doesServerExist()) {
          var data = {
            sessionId: sessionId,
            feedbackText: feedbackText,
            feedbackCategory: feedbackCategory,
            code: code,
            createdMsec: (new Date()).getTime()
          };
          var event = {
            type: 'CodeSubmitEvent',
            data: data
          };
          currentEventBatch.push(event);
        }
      }
    };
  }]);
