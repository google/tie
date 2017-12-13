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
    var _currentSessionId = null;
    var _currentQuestionId = null;
    var _currentQuestionVersion = null;

    /**
     * Stores the current question state as service-level variables.
     *
     */
    var init = function(sessionId, questionId, questionVersion) {
      _currentSessionId = sessionId;
      _currentQuestionId = questionId;
      _currentQuestionVersion = questionVersion;
    };

    /**
     * Checks to see if the EventHandler state is properly initialized.
     *
     */
    var isInitialized = function() {
      return (
        _currentSessionId !== null && _currentQuestionId !== null &&
        _currentQuestionVersion !== null);
    };

    /**
     * Submits the current batch of event data to TIE's backend.
     *
     */
    var sendCurrentEventBatch = function() {
      // Checking for null here in the off chance that a user pauses
      // before the question is loaded, creating a minor race condition.
      if (getCurrentEventBatchLength() === 0 || !isInitialized()) {
        // No point in sending an empty batch, either.
        return null;
      }
      var data = {
        events: _currentEventBatch,
        sessionId: _currentSessionId,
        questionId: _currentQuestionId,
        questionVersion: _currentQuestionVersion,
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
      init: init,
      sendCurrentEventBatch: sendCurrentEventBatch,

      /**
       * Submits data to TIE's backend to create a SessionPauseEvent.
       * @param {string} taskId Id of the task being paused.
       *
       */
      createSessionPauseEvent: function(taskId) {
        if (ServerHandlerService.doesServerExist()) {
          _currentEventBatch.push({
            type: 'SessionPauseEvent',
            data: {
              taskId: taskId,
              createdMsec: (new Date()).getTime()
            }
          });
          sendCurrentEventBatch();
        }
      },

      /**
       * Submits data to TIE's backend to create a SessionResumeEvent.
       * @param {string} taskId Id of the task being resumed.
       *
       */
      createSessionResumeEvent: function(taskId) {
        if (ServerHandlerService.doesServerExist()) {
          _currentEventBatch.push({
            type: 'SessionResumeEvent',
            data: {
              taskId: taskId,
              createdMsec: (new Date()).getTime()
            }
          });
        }
      },

      /**
       * Submits a QuestionStartEvent to TIE's backend.
       *
       */
      createQuestionStartEvent: function() {
        if (ServerHandlerService.doesServerExist()) {
          _currentEventBatch.push({
            type: 'QuestionStartEvent',
            data: {
              createdMsec: (new Date()).getTime()
            }
          });
        }
      },

      /**
       * Submits data to TIE's backend to create a QuestionCompleteEvent.
       *
       */
      createQuestionCompleteEvent: function() {
        if (ServerHandlerService.doesServerExist()) {
          _currentEventBatch.push({
            type: 'QuestionCompleteEvent',
            data: {
              createdMsec: (new Date()).getTime()
            }
          });
          sendCurrentEventBatch();
        }
      },

      /**
       * Submits data to TIE's backend to create a TaskStartEvent.
       * @param {string} taskId ID of the task being attempted.
       *
       */
      createTaskStartEvent: function(taskId) {
        if (ServerHandlerService.doesServerExist()) {
          _currentEventBatch.push({
            type: 'TaskStartEvent',
            data: {
              taskId: taskId,
              createdMsec: (new Date()).getTime()
            }
          });
        }
      },

      /**
       * Submits data to TIE's backend to create a TaskCompleteEvent.
       * @param {string} taskId ID of the task being attempted.
       *
       */
      createTaskCompleteEvent: function(taskId) {
        if (ServerHandlerService.doesServerExist()) {
          _currentEventBatch.push({
            type: 'TaskCompleteEvent',
            data: {
              taskId: taskId,
              createdMsec: (new Date()).getTime()
            }
          });
        }
      },

      /**
       * Submits data to TIE's backend to create a CodeResetEvent.
       *
       */
      createCodeResetEvent: function() {
        if (ServerHandlerService.doesServerExist()) {
          _currentEventBatch.push({
            type: 'CodeResetEvent',
            data: {
              createdMsec: (new Date()).getTime()
            }
          });
        }
      },

      /**
       * Submits data to TIE's backend to create a CodeSubmitEvent.
       * @param {string} taskId ID of the task being attempted.
       * @param [{string}] feedbackParagraphs The feedback shown to the user.
       * @param {string} feedbackCategory The type of feedback shown to the
       *   user.
       * @param {string} code The user's submitted code.
       *
       */
      createCodeSubmitEvent: function(
          taskId, feedbackParagraphs, feedbackCategory, code) {
        if (ServerHandlerService.doesServerExist()) {
          _currentEventBatch.push({
            type: 'CodeSubmitEvent',
            data: {
              taskId: taskId,
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
