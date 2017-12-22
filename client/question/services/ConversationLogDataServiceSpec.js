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
 * @fileoverview Unit tests for the ConversationLogDataService.
 */

describe('ConversationLogDataService', function() {
  var ConversationLogDataService;
  var FeedbackParagraphObjectFactory;
  var DURATION_MSEC_WAIT_FOR_FEEDBACK;
  var $timeout;

  beforeEach(module('tie'));
  beforeEach(inject(function($injector, _$timeout_) {
    ConversationLogDataService = $injector.get('ConversationLogDataService');
    FeedbackParagraphObjectFactory = $injector.get(
      'FeedbackParagraphObjectFactory');
    DURATION_MSEC_WAIT_FOR_FEEDBACK = $injector.get(
      'DURATION_MSEC_WAIT_FOR_FEEDBACK');
    $timeout = _$timeout_;
  }));

  describe('addFeedbackBalloon', function() {
    it('should add a new feedback balloon with a delay', function() {
      expect(ConversationLogDataService.getSpeechBalloonList().length).toBe(0);
      expect(ConversationLogDataService.isNewBalloonPending()).toBe(false);

      ConversationLogDataService.addFeedbackBalloon([
        FeedbackParagraphObjectFactory.fromDict({
          type: 'text',
          content: 'hello'
        })
      ]);
      expect(ConversationLogDataService.isNewBalloonPending()).toBe(true);
      expect(ConversationLogDataService.getSpeechBalloonList().length).toBe(0);

      $timeout.flush(DURATION_MSEC_WAIT_FOR_FEEDBACK);
      expect(ConversationLogDataService.getSpeechBalloonList().length).toBe(1);
    });

    it('should add a new code balloon without a delay', function() {
      expect(ConversationLogDataService.getSpeechBalloonList().length).toBe(0);
      expect(ConversationLogDataService.isNewBalloonPending()).toBe(false);

      ConversationLogDataService.addCodeBalloon('some code');
      expect(ConversationLogDataService.isNewBalloonPending()).toBe(false);
      expect(ConversationLogDataService.getSpeechBalloonList().length).toBe(1);
    });

    it('should clear the list', function() {
      ConversationLogDataService.addCodeBalloon('some code');
      expect(ConversationLogDataService.getSpeechBalloonList().length).toBe(1);

      ConversationLogDataService.clear();
      expect(ConversationLogDataService.getSpeechBalloonList().length).toBe(0);
    });
  });
});
