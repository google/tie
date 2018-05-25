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
 * @fileoverview A service that maintains a local session transcript of TIE's
 * code submission and feedback history, used to populate the conversation log
 * in the TIE UI.
 */

tie.factory('SessionHistoryService', [
  '$timeout', 'SpeechBalloonObjectFactory', 'DURATION_MSEC_WAIT_FOR_FEEDBACK',
  function(
      $timeout, SpeechBalloonObjectFactory, DURATION_MSEC_WAIT_FOR_FEEDBACK) {
    var data = {
      // A list of SpeechBalloon objects, from newest to oldest.
      sessionTranscript: [],
      // The number of pending speech balloons to add to the transcript.
      numBalloonsPending: 0
    };

    return {
      /**
       * Returns a bindable reference to the session transcript.
       */
      getBindableSessionTranscript: function() {
        return data.sessionTranscript;
      },
      /**
       * Adds a new code balloon to the beginning of the list.
       */
      addCodeBalloon: function(submittedCode) {
        data.sessionTranscript.unshift(
          SpeechBalloonObjectFactory.createCodeBalloon(submittedCode));
      },
      /**
       * Adds a new feedback balloon to the beginning of the list.
       */
      addFeedbackBalloon: function(feedbackParagraphs) {
        data.numBalloonsPending++;
        $timeout(function() {
          data.sessionTranscript.unshift(
            SpeechBalloonObjectFactory.createFeedbackBalloon(
              feedbackParagraphs));
          data.numBalloonsPending--;
        }, DURATION_MSEC_WAIT_FOR_FEEDBACK);
      },
      /**
       * Resets the session transcript.
       */
      reset: function() {
        // Setting the length of the existing array to 0 allows us to preserve
        // the binding to data.sessionTranscript.
        data.sessionTranscript.length = 0;
        data.numBalloonsPending = 0;
      },
      /**
       * Returns whether a new balloon is pending.
       */
      isNewBalloonPending: function() {
        return data.numBalloonsPending > 0;
      },
      data: data
    };
  }
]);
