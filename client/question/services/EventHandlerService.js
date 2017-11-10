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
    var _currentEventBatch = [];

    /**
     * Submits the current batch of event data to TIE's backend.
     *
     */
    var sendCurrentEventBatch = function() {
      if (getCurrentEventBatchLength() === 0) {
        // No point in sending an empty batch.
        return null;
      }
      var data = {
        events: _currentEventBatch,
        timeSentToBackendMsec: (new Date()).getTime()
      };
      return $http.post('/ajax/event/send_event_batch', data).then(
        function() {
          _currentEventBatch.length = 0;
        }, function() {
          // Otherwise, we should do nothing.
          // Since the call errored, don't dump the current batch.
      });
    };

    var getCurrentEventBatchLength = function() {
      return _currentEventBatch.length;
    };

    return {
      _getCurrentEventBatchLength: getCurrentEventBatchLength,

      sendCurrentEventBatch: sendCurrentEventBatch,

      /**
       * Submits data to TIE's backend to create a SessionPauseEvent.
       * @param {string} sessionId Unique ID for a user's question session.
       *
       */
      createSessionPauseEvent: function(sessionId) {
        if (ServerHandlerService.doesServerExist()) {
          _currentEventBatch.push({
            type: 'SessionPauseEvent',
            data: {
              sessionId: sessionId,
              createdMsec: (new Date()).getTime()
            }
          });
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
          _currentEventBatch.push({
            type: 'SessionResumeEvent',
            data: {
              sessionId: sessionId,
              createdMsec: (new Date()).getTime()
            }
          });
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
          _currentEventBatch.push({
            type: 'SessionPauseEvent',
            data: {
              sessionId: sessionId,
              questionId: questionId,
              questionVersion: questionVersion,
              createdMsec: (new Date()).getTime()
            }
          });
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
          _currentEventBatch.push({
            type: 'QuestionCompleteEvent',
            data: {
              sessionId: sessionId,
              questionId: questionId,
              questionVersion: questionVersion,
              createdMsec: (new Date()).getTime()
            }
          });
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
          _currentEventBatch.push({
            type: 'TaskStartEvent',
            data: {
              sessionId: sessionId,
              questionId: questionId,
              questionVersion: questionVersion,
              taskId: taskId,
              createdMsec: (new Date()).getTime()
            }
          });
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
          _currentEventBatch.push({
            type: 'TaskCompleteEvent',
            data: {
              sessionId: sessionId,
              questionId: questionId,
              questionVersion: questionVersion,
              taskId: taskId,
              createdMsec: (new Date()).getTime()
            }
          });
        }
      },

      /**
       * Submits data to TIE's backend to create a CodeResetEvent.
       * @param {string} sessionId Unique ID for a user's question session.
       *
       */
      createCodeResetEvent: function(sessionId) {
        if (ServerHandlerService.doesServerExist()) {
          _currentEventBatch.push({
            type: 'CodeResetEvent',
            data: {
              sessionId: sessionId,
              createdMsec: (new Date()).getTime()
            }
          });
        }
      },

      /**
       * Submits data to TIE's backend to create a CodeSubmitEvent.
       * @param {string} sessionId Unique ID for a user's question session.
       * @param [{string}] feedbackParagraphs The feedback shown to the user.
       * @param {string} feedbackCategory The type of feedback shown to the
       *   user.
       * @param {string} code The user's submitted code.
       *
       */
      createCodeSubmitEvent: function(
          sessionId, feedbackParagraphs, feedbackCategory, code) {
        if (ServerHandlerService.doesServerExist()) {
          _currentEventBatch.push({
            type: 'CodeSubmitEvent',
            data: {
              sessionId: sessionId,
              feedbackParagraphs: feedbackParagraphs,
              feedbackCategory: feedbackCategory,
              code: code,
              createdMsec: (new Date()).getTime()
            }
          });
        }
      }
    };
  }]);
