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
 * @fileoverview A service that stores and maintains the data used to populate
 * the conversation log in the TIE UI.
 */

tie.factory('ConversationLogDataService', [
  '$timeout', 'SpeechBalloonObjectFactory', 'DURATION_MSEC_WAIT_FOR_FEEDBACK',
  function(
      $timeout, SpeechBalloonObjectFactory, DURATION_MSEC_WAIT_FOR_FEEDBACK) {
    var data = {
      speechBalloonList: [],
      numBalloonsPending: 0
    };

    return {
      /**
       * Adds a new feedback balloon to the beginning of the list.
       */
      addFeedbackBalloon: function(feedbackParagraphs) {
        data.numBalloonsPending++;
        $timeout(function() {
          data.speechBalloonList.unshift(
              SpeechBalloonObjectFactory.createFeedbackBalloon(
                  feedbackParagraphs));
          data.numBalloonsPending--;
        }, DURATION_MSEC_WAIT_FOR_FEEDBACK);
      },
      /**
       * Adds a new code balloon to the beginning of the list.
       */
      addCodeBalloon: function(submittedCode) {
        data.speechBalloonList.unshift(
            SpeechBalloonObjectFactory.createCodeBalloon(submittedCode));
      },
      /**
       * Clears the feedback log.
       */
      clear: function() {
        data.speechBalloonList = [];
        data.numBalloonsPending = 0;
      },
      /**
       * Returns whether a new balloon is pending.
       */
      isNewBalloonPending: function() {
        return data.numBalloonsPending > 0;
      },
      /**
       * Returns a bindable reference to the list of speech balloons.
       */
      getSpeechBalloonList: function() {
        return data.speechBalloonList;
      },
      data: data
    };
  }
]);
