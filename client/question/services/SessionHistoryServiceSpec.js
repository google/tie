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
 * @fileoverview Unit tests for the SessionHistoryService.
 */

describe('SessionHistoryService', function() {
  var SessionHistoryService;
  var FeedbackParagraphObjectFactory;
  var DURATION_MSEC_WAIT_FOR_FEEDBACK;
  var $timeout;

  beforeEach(module('tie'));
  beforeEach(inject(function($injector, _$timeout_) {
    SessionHistoryService = $injector.get('SessionHistoryService');
    FeedbackParagraphObjectFactory = $injector.get(
      'FeedbackParagraphObjectFactory');
    DURATION_MSEC_WAIT_FOR_FEEDBACK = $injector.get(
      'DURATION_MSEC_WAIT_FOR_FEEDBACK');
    $timeout = _$timeout_;
  }));

  describe('core behaviour', function() {
    it('should add a new code balloon correctly', function() {
      var transcript = SessionHistoryService.getBindableSessionTranscript();
      expect(transcript.length).toBe(0);

      SessionHistoryService.addCodeBalloon('some code');

      expect(transcript.length).toBe(1);
      var firstBalloon = transcript[0];
      expect(firstBalloon.isCodeSubmission()).toBe(true);
      var firstBalloonParagraphs = firstBalloon.getFeedbackParagraphs();
      expect(firstBalloonParagraphs.length).toBe(1);
      expect(firstBalloonParagraphs[0].toDict()).toEqual({
        type: 'code',
        content: 'some code'
      });
    });

    it('should add an intro balloon correctly', function() {
      var transcript = SessionHistoryService.getBindableSessionTranscript();
      expect(transcript.length).toBe(0);

      SessionHistoryService.addIntroMessageBalloon('intro message');

      expect(transcript.length).toBe(1);
      expect(SessionHistoryService.isNewBalloonPending()).toBe(false);
      var firstBalloon = transcript[0];
      expect(firstBalloon.isDisplayedOnLeft()).toBe(true);
      var firstBalloonParagraphs = firstBalloon.getFeedbackParagraphs();
      expect(firstBalloonParagraphs.length).toBe(1);
      expect(firstBalloonParagraphs[0].toDict()).toEqual({
        type: 'text',
        content: 'intro message'
      });
    });

    it('should add a new code balloon and signify awaiting a feedback balloon',
    function() {
      expect(
        SessionHistoryService.getBindableSessionTranscript().length
      ).toBe(0);
      expect(SessionHistoryService.isNewBalloonPending()).toBe(false);

      SessionHistoryService.addCodeBalloon('some code');

      expect(
        SessionHistoryService.getBindableSessionTranscript().length
      ).toBe(1);
      expect(SessionHistoryService.isNewBalloonPending()).toBe(true);
    });

    it('should add a new feedback balloon correctly', function() {
      var transcript = SessionHistoryService.getBindableSessionTranscript();
      expect(transcript.length).toBe(0);

      SessionHistoryService.addFeedbackBalloon([
        FeedbackParagraphObjectFactory.fromDict({
          type: 'text',
          content: 'hello'
        })
      ]);
      $timeout.flush(DURATION_MSEC_WAIT_FOR_FEEDBACK);

      expect(transcript.length).toBe(1);
      var firstBalloon = transcript[0];
      expect(firstBalloon.isCodeSubmission()).toBe(false);
      var firstBalloonParagraphs = firstBalloon.getFeedbackParagraphs();
      expect(firstBalloonParagraphs.length).toBe(1);
      expect(firstBalloonParagraphs[0].toDict()).toEqual({
        type: 'text',
        content: 'hello'
      });
    });

    it('should add a new feedback balloon with a delay', function() {
      expect(
        SessionHistoryService.getBindableSessionTranscript().length
      ).toBe(0);
      expect(SessionHistoryService.isNewBalloonPending()).toBe(false);

      SessionHistoryService.addCodeBalloon('some code');

      expect(
        SessionHistoryService.getBindableSessionTranscript().length
      ).toBe(1);
      expect(SessionHistoryService.isNewBalloonPending()).toBe(true);

      SessionHistoryService.addFeedbackBalloon([
        FeedbackParagraphObjectFactory.fromDict({
          type: 'text',
          content: 'hello'
        })
      ]);
      expect(SessionHistoryService.isNewBalloonPending()).toBe(true);
      expect(
        SessionHistoryService.getBindableSessionTranscript().length).toBe(1);

      $timeout.flush(DURATION_MSEC_WAIT_FOR_FEEDBACK);
      expect(
        SessionHistoryService.getBindableSessionTranscript().length
      ).toBe(2);
      expect(SessionHistoryService.isNewBalloonPending()).toBe(false);
    });

    it('should reset the session transcript', function() {
      var transcript = SessionHistoryService.getBindableSessionTranscript();
      SessionHistoryService.addCodeBalloon('some code');
      expect(transcript.length).toBe(1);

      SessionHistoryService.reset();
      expect(transcript.length).toBe(0);

      SessionHistoryService.addCodeBalloon('some other code');
      expect(transcript[0].getFeedbackParagraphs()[0].toDict()).toEqual({
        type: 'code',
        content: 'some other code'
      });
    });
  });
});
