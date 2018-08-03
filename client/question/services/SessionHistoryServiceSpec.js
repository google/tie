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
  var DURATION_MSEC_WAIT_FOR_SUBMISSION_CONFIRMATION;
  var $timeout;

  beforeEach(module('tie'));
  beforeEach(inject(function($injector, _$timeout_) {
    SessionHistoryService = $injector.get('SessionHistoryService');
    FeedbackParagraphObjectFactory = $injector.get(
      'FeedbackParagraphObjectFactory');
    DURATION_MSEC_WAIT_FOR_FEEDBACK = $injector.get(
      'DURATION_MSEC_WAIT_FOR_FEEDBACK');
    DURATION_MSEC_WAIT_FOR_SUBMISSION_CONFIRMATION = $injector.get(
      'DURATION_MSEC_WAIT_FOR_SUBMISSION_CONFIRMATION');
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

      SessionHistoryService.addIntroMessageBalloon();

      expect(transcript.length).toBe(1);
      expect(SessionHistoryService.isNewBalloonPending()).toBe(false);
      var firstBalloon = transcript[0];
      expect(firstBalloon.isDisplayedOnLeft()).toBe(true);
      var firstBalloonParagraphs = firstBalloon.getFeedbackParagraphs();
      expect(firstBalloonParagraphs.length).toBe(1);
      expect(firstBalloonParagraphs[0].toDict()).toEqual({
        type: 'text',
        content: [
          'Code your answer in the coding window. You can click the ',
          '"Get Feedback" button at any time to get feedback on your ',
          'code (which will not be submitted for grading/credit). When you ',
          'are ready to submit your code for grading/credit, click the ',
          '"Submit for Grading" button.'
        ].join('\n')
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

    it('should add a new submission confirmation balloon correctly',
      function() {
        var transcript = SessionHistoryService.getBindableSessionTranscript();
        expect(transcript.length).toBe(0);

        SessionHistoryService.addSubmissionConfirmationBalloon();
        expect(transcript.length).toBe(0);
        $timeout.flush(DURATION_MSEC_WAIT_FOR_SUBMISSION_CONFIRMATION);

        expect(transcript.length).toBe(1);
        var firstBalloon = transcript[0];
        expect(firstBalloon.isCodeSubmission()).toBe(false);
        var firstBalloonParagraphs = firstBalloon.getFeedbackParagraphs();
        expect(firstBalloonParagraphs.length).toBe(1);
        expect(firstBalloonParagraphs[0].toDict()).toEqual({
          type: 'text',
          content: [
            'Your code has been submitted for grading. ',
            'Feel free to continue working on the exercise, ask for feedback ',
            'by clicking the "Get Feedback" button, or submit again with ',
            'the "Submit for Grading" button.'
          ].join('\n')
        });
      }
    );
  });
});
