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
 * @fileoverview Unit tests for the LearnerStateService.
 */

describe('LearnerStateService', function() {
  var LearnerStateService;
  var FeedbackDetailsObjectFactory;
  var FEEDBACK_CATEGORIES;
  var CORRECTNESS_STATE_INPUT_DISPLAYED;
  var CORRECTNESS_STATE_EXPECTED_OUTPUT_DISPLAYED;
  var CORRECTNESS_STATE_OBSERVED_OUTPUT_DISPLAYED;
  var CORRECTNESS_STATE_NO_MORE_FEEDBACK;

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    LearnerStateService = $injector.get('LearnerStateService');
    FeedbackDetailsObjectFactory = $injector.get(
      'FeedbackDetailsObjectFactory');
    FEEDBACK_CATEGORIES = $injector.get('FEEDBACK_CATEGORIES');
    CORRECTNESS_STATE_INPUT_DISPLAYED = $injector.get(
      'CORRECTNESS_STATE_INPUT_DISPLAYED');
    CORRECTNESS_STATE_EXPECTED_OUTPUT_DISPLAYED = $injector.get(
      'CORRECTNESS_STATE_EXPECTED_OUTPUT_DISPLAYED');
    CORRECTNESS_STATE_OBSERVED_OUTPUT_DISPLAYED = $injector.get(
      'CORRECTNESS_STATE_OBSERVED_OUTPUT_DISPLAYED');
    CORRECTNESS_STATE_NO_MORE_FEEDBACK = $injector.get(
      'CORRECTNESS_STATE_NO_MORE_FEEDBACK');
  }));

  describe('raw code change monitoring', function() {
    it('should determine whether the code has changed', function() {
      expect(LearnerStateService.hasRawCodeChanged('new code')).toBe(true);

      // This checks that the function is stateless: its previous invocation
      // does not update the stored code, so the output of hasRawCodeChanged()
      // is still true.
      expect(LearnerStateService.hasRawCodeChanged('new code')).toBe(true);

      LearnerStateService.recordRawCode('some code');
      expect(LearnerStateService.hasRawCodeChanged('some code')).toBe(false);
      expect(LearnerStateService.hasRawCodeChanged('new code')).toBe(true);
    });
  });

  describe('feedback details recording', function() {
    it('should allow storing and retrieving of feedback details', function() {
      expect(LearnerStateService.getPreviousFeedbackDetails()).toBe(null);

      var feedbackDetails1 = (
        FeedbackDetailsObjectFactory.createTimeLimitErrorFeedbackDetails());
      LearnerStateService.recordFeedbackDetails(feedbackDetails1);
      expect(LearnerStateService.getPreviousFeedbackDetails()).toBe(
        feedbackDetails1);

      var feedbackDetails2 = (
        FeedbackDetailsObjectFactory.createServerErrorFeedbackDetails());
      LearnerStateService.recordFeedbackDetails(feedbackDetails2);
      expect(LearnerStateService.getPreviousFeedbackDetails()).toBe(
        feedbackDetails2);
    });
  });

  describe('get next feedback stage', function() {
    it('should return 0 if no prior feedback exists', function() {
      expect(LearnerStateService.getNextFeedbackStage(
        1, 'suiteId', 3, null, null, null)).toBe(0);
      expect(LearnerStateService.getNextFeedbackStage(
        2, 'suiteId', 2, FEEDBACK_CATEGORIES.KNOWN_BUG_FAILURE, 1, 4)).toBe(0);
      expect(LearnerStateService.getNextFeedbackStage(
        2, 'suiteId', 2, FEEDBACK_CATEGORIES.SUITE_LEVEL_FAILURE, 1, 4
      )).toBe(0);
    });

    it('should return 0 if the previous feedback is not relevant', function() {
      LearnerStateService.recordFeedbackDetails(
        FeedbackDetailsObjectFactory.createTimeLimitErrorFeedbackDetails());

      expect(LearnerStateService.getNextFeedbackStage(
        1, 'suiteId', 3, null, null, null)).toBe(0);
      expect(LearnerStateService.getNextFeedbackStage(
        2, 'suiteId', 2, FEEDBACK_CATEGORIES.KNOWN_BUG_FAILURE, 1, 4)).toBe(0);
      expect(LearnerStateService.getNextFeedbackStage(
        2, 'suiteId', 2, FEEDBACK_CATEGORIES.SUITE_LEVEL_FAILURE, 1, 4
      )).toBe(0);
    });

    it('should return the next stage for incorrect-output tests', function() {
      var feedbackDetails = (
        FeedbackDetailsObjectFactory.createIncorrectOutputFeedbackDetails(
          0, 'suiteId', 0, 'Hey, howareyou', 'yeH, uoyerawoh',
          CORRECTNESS_STATE_INPUT_DISPLAYED, null, null));
      LearnerStateService.recordFeedbackDetails(feedbackDetails);
      expect(LearnerStateService.getNextFeedbackStage(
        0, 'suiteId', 0, null, null, null)).toBe(1);

      feedbackDetails = (
        FeedbackDetailsObjectFactory.createIncorrectOutputFeedbackDetails(
          0, 'suiteId', 0, 'Hey, howareyou', 'yeH, uoyerawoh',
          CORRECTNESS_STATE_EXPECTED_OUTPUT_DISPLAYED, null, null));
      LearnerStateService.recordFeedbackDetails(feedbackDetails);
      expect(LearnerStateService.getNextFeedbackStage(
        0, 'suiteId', 0, null, null, null)).toBe(2);

      feedbackDetails = (
        FeedbackDetailsObjectFactory.createIncorrectOutputFeedbackDetails(
          0, 'suiteId', 0, 'Hey, howareyou', 'yeH, uoyerawoh',
          CORRECTNESS_STATE_OBSERVED_OUTPUT_DISPLAYED, null, null));
      LearnerStateService.recordFeedbackDetails(feedbackDetails);
      expect(LearnerStateService.getNextFeedbackStage(
        0, 'suiteId', 0, null, null, null)).toBe(3);

      feedbackDetails = (
        FeedbackDetailsObjectFactory.createIncorrectOutputFeedbackDetails(
          0, 'suiteId', 0, 'Hey, howareyou', 'yeH, uoyerawoh',
          CORRECTNESS_STATE_NO_MORE_FEEDBACK, null, null));
      LearnerStateService.recordFeedbackDetails(feedbackDetails);
      expect(LearnerStateService.getNextFeedbackStage(
        0, 'suiteId', 0, null, null, null)).toBe(3);
    });

    it('should update the stage based on buggy-output tests', function() {
      var feedbackDetails = (
        FeedbackDetailsObjectFactory.createBuggyOutputFeedbackDetails(
          0, 'unusedSuite1', 3, 0, ['message1', 'message2'], 0));
      LearnerStateService.recordFeedbackDetails(feedbackDetails);
      expect(LearnerStateService.getNextFeedbackStage(
        0, 'suiteId', 0, FEEDBACK_CATEGORIES.KNOWN_BUG_FAILURE, 0, 2)).toBe(1);

      feedbackDetails = (
        FeedbackDetailsObjectFactory.createBuggyOutputFeedbackDetails(
          0, 'unusedSuite1', 3, 0, ['message1', 'message2'], 1));
      LearnerStateService.recordFeedbackDetails(feedbackDetails);
      expect(LearnerStateService.getNextFeedbackStage(
        0, 'suiteId', 0, FEEDBACK_CATEGORIES.KNOWN_BUG_FAILURE, 0, 2)).toBe(2);

      feedbackDetails = (
        FeedbackDetailsObjectFactory.createIncorrectOutputFeedbackDetails(
          0, 'suiteId', 0, 'Hey, howareyou', 'yeH, uoyerawoh',
          CORRECTNESS_STATE_INPUT_DISPLAYED,
          FEEDBACK_CATEGORIES.KNOWN_BUG_FAILURE, 0));
      LearnerStateService.recordFeedbackDetails(feedbackDetails);
      expect(LearnerStateService.getNextFeedbackStage(
        0, 'suiteId', 0, FEEDBACK_CATEGORIES.KNOWN_BUG_FAILURE, 0, 2)).toBe(3);

      feedbackDetails = (
        FeedbackDetailsObjectFactory.createIncorrectOutputFeedbackDetails(
          0, 'suiteId', 0, 'Hey, howareyou', 'yeH, uoyerawoh',
          CORRECTNESS_STATE_EXPECTED_OUTPUT_DISPLAYED,
          FEEDBACK_CATEGORIES.KNOWN_BUG_FAILURE, 0));
      LearnerStateService.recordFeedbackDetails(feedbackDetails);
      expect(LearnerStateService.getNextFeedbackStage(
        0, 'suiteId', 0, FEEDBACK_CATEGORIES.KNOWN_BUG_FAILURE, 0, 2)).toBe(4);

      feedbackDetails = (
        FeedbackDetailsObjectFactory.createIncorrectOutputFeedbackDetails(
          0, 'suiteId', 0, 'Hey, howareyou', 'yeH, uoyerawoh',
          CORRECTNESS_STATE_OBSERVED_OUTPUT_DISPLAYED,
          FEEDBACK_CATEGORIES.KNOWN_BUG_FAILURE, 0));
      LearnerStateService.recordFeedbackDetails(feedbackDetails);
      expect(LearnerStateService.getNextFeedbackStage(
        0, 'suiteId', 0, FEEDBACK_CATEGORIES.KNOWN_BUG_FAILURE, 0, 2)).toBe(5);

      feedbackDetails = (
        FeedbackDetailsObjectFactory.createIncorrectOutputFeedbackDetails(
          0, 'suiteId', 0, 'Hey, howareyou', 'yeH, uoyerawoh',
          CORRECTNESS_STATE_NO_MORE_FEEDBACK,
          FEEDBACK_CATEGORIES.KNOWN_BUG_FAILURE, 0));
      LearnerStateService.recordFeedbackDetails(feedbackDetails);
      expect(LearnerStateService.getNextFeedbackStage(
        0, 'suiteId', 0, FEEDBACK_CATEGORIES.KNOWN_BUG_FAILURE, 0, 2)).toBe(5);
    });
  });

  describe('language unfamiliarity error detection', function() {
    it('should record when enough consecutive errors are detected', function() {
      expect(
        LearnerStateService.doesUserNeedLanguageUnfamiliarityPrompt()
      ).toBe(false);

      LearnerStateService.recordSyntaxError();
      LearnerStateService.recordPrereqWrongLanguageError();
      LearnerStateService.recordSyntaxError();
      LearnerStateService.recordPrereqWrongLanguageError();
      expect(
        LearnerStateService.doesUserNeedLanguageUnfamiliarityPrompt()
      ).toBe(false);

      LearnerStateService.recordPrereqWrongLanguageError();
      expect(
        LearnerStateService.doesUserNeedLanguageUnfamiliarityPrompt()
      ).toBe(true);

      LearnerStateService.recordPrereqWrongLanguageError();
      expect(
        LearnerStateService.doesUserNeedLanguageUnfamiliarityPrompt()
      ).toBe(true);
    });

    it('should reset counters correctly', function() {
      LearnerStateService.recordSyntaxError();
      LearnerStateService.recordPrereqWrongLanguageError();
      LearnerStateService.recordSyntaxError();
      LearnerStateService.recordPrereqWrongLanguageError();
      LearnerStateService.recordPrereqWrongLanguageError();
      expect(
        LearnerStateService.doesUserNeedLanguageUnfamiliarityPrompt()
      ).toBe(true);

      LearnerStateService.resetLanguageUnfamiliarityCounters();
      expect(
        LearnerStateService.doesUserNeedLanguageUnfamiliarityPrompt()
      ).toBe(false);
    });

    it('should reset when other types of errors are encountered', function() {
      LearnerStateService.recordSyntaxError();
      LearnerStateService.recordPrereqWrongLanguageError();
      LearnerStateService.recordSyntaxError();
      LearnerStateService.recordPrereqWrongLanguageError();
      expect(
        LearnerStateService.doesUserNeedLanguageUnfamiliarityPrompt()
      ).toBe(false);

      LearnerStateService.recordRuntimeError('runtime error');
      expect(
        LearnerStateService.doesUserNeedLanguageUnfamiliarityPrompt()
      ).toBe(false);

      // Now, recording a fifth wrong-language error shouldn't trigger the
      // counter, because the consecutive streak is broken.
      LearnerStateService.recordPrereqWrongLanguageError();
      expect(
        LearnerStateService.doesUserNeedLanguageUnfamiliarityPrompt()
      ).toBe(false);
    });
  });

  describe('consecutive runtime error detection', function() {
    it('should record when enough consecutive errors are detected', function() {
      expect(
        LearnerStateService.doesUserNeedLanguageUnfamiliarityPrompt()
      ).toBe(false);

      LearnerStateService.recordRuntimeError('runtime error');
      LearnerStateService.recordRuntimeError('runtime error');
      LearnerStateService.recordRuntimeError('runtime error');
      LearnerStateService.recordRuntimeError('runtime error');
      expect(
        LearnerStateService.doesUserNeedLanguageUnfamiliarityPrompt()
      ).toBe(false);

      LearnerStateService.recordRuntimeError('runtime error');
      expect(
        LearnerStateService.doesUserNeedLanguageUnfamiliarityPrompt()
      ).toBe(true);

      LearnerStateService.recordRuntimeError('runtime error');
      expect(
        LearnerStateService.doesUserNeedLanguageUnfamiliarityPrompt()
      ).toBe(true);
    });

    it('should reset counters correctly', function() {
      LearnerStateService.recordRuntimeError('runtime error');
      LearnerStateService.recordRuntimeError('runtime error');
      LearnerStateService.recordRuntimeError('runtime error');
      LearnerStateService.recordRuntimeError('runtime error');
      LearnerStateService.recordRuntimeError('runtime error');
      expect(
        LearnerStateService.doesUserNeedLanguageUnfamiliarityPrompt()
      ).toBe(true);

      LearnerStateService.resetLanguageUnfamiliarityCounters();
      expect(
        LearnerStateService.doesUserNeedLanguageUnfamiliarityPrompt()
      ).toBe(false);
    });

    it('should reset when other types of errors are encountered', function() {
      LearnerStateService.recordRuntimeError('runtime error');
      LearnerStateService.recordRuntimeError('runtime error');
      LearnerStateService.recordRuntimeError('runtime error');
      LearnerStateService.recordRuntimeError('runtime error');
      expect(
        LearnerStateService.doesUserNeedLanguageUnfamiliarityPrompt()
      ).toBe(false);

      LearnerStateService.recordSyntaxError();
      expect(
        LearnerStateService.doesUserNeedLanguageUnfamiliarityPrompt()
      ).toBe(false);

      // Now, recording a fifth runtime error shouldn't trigger the
      // counter, because the consecutive streak is broken.
      LearnerStateService.recordRuntimeError('runtime error');
      expect(
        LearnerStateService.doesUserNeedLanguageUnfamiliarityPrompt()
      ).toBe(false);
    });

    it('should reset when a different runtime error is seen', function() {
      LearnerStateService.recordRuntimeError('runtime error');
      LearnerStateService.recordRuntimeError('runtime error');
      LearnerStateService.recordRuntimeError('runtime error');
      LearnerStateService.recordRuntimeError('runtime error');
      expect(
        LearnerStateService.doesUserNeedLanguageUnfamiliarityPrompt()
      ).toBe(false);

      LearnerStateService.recordRuntimeError('runtime error 2');
      expect(
        LearnerStateService.doesUserNeedLanguageUnfamiliarityPrompt()
      ).toBe(false);

      // Now, recording a fifth runtime error of the old type shouldn't trigger
      // the counter, because the consecutive streak is broken.
      LearnerStateService.recordRuntimeError('runtime error');
      expect(
        LearnerStateService.doesUserNeedLanguageUnfamiliarityPrompt()
      ).toBe(false);

      // Four more runtime errors of the old type are needed to trigger the
      // streak.
      LearnerStateService.recordRuntimeError('runtime error');
      LearnerStateService.recordRuntimeError('runtime error');
      LearnerStateService.recordRuntimeError('runtime error');
      expect(
        LearnerStateService.doesUserNeedLanguageUnfamiliarityPrompt()
      ).toBe(false);
      LearnerStateService.recordRuntimeError('runtime error');
      expect(
        LearnerStateService.doesUserNeedLanguageUnfamiliarityPrompt()
      ).toBe(true);
    });
  });
});
