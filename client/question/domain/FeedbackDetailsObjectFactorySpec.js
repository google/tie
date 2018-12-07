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
 * @fileoverview Unit tests for FeedbackDetailsObject domain objects.
 */

describe('FeedbackDetailsObjectFactory', function() {
  var FEEDBACK_CATEGORIES;
  var CORRECTNESS_STATE_NO_MORE_FEEDBACK;
  var FeedbackDetailsObjectFactory;

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    FEEDBACK_CATEGORIES = $injector.get('FEEDBACK_CATEGORIES');
    CORRECTNESS_STATE_NO_MORE_FEEDBACK = $injector.get(
      'CORRECTNESS_STATE_NO_MORE_FEEDBACK');
    FeedbackDetailsObjectFactory = $injector.get(
      'FeedbackDetailsObjectFactory');
  }));

  describe('time-limit error FeedbackDetails object', function() {
    it('should create a time-limit FeedbackDetails object', function() {
      var feedbackDetails = (
        FeedbackDetailsObjectFactory.createTimeLimitErrorFeedbackDetails());
      expect(feedbackDetails.getFeedbackCategory()).toBe(
        FEEDBACK_CATEGORIES.TIME_LIMIT_ERROR);
      expect(feedbackDetails.getErrorString).toThrow();
      expect(feedbackDetails.getErrorLineNumber).toThrow();
      expect(feedbackDetails.getLanguage).toThrow();
      expect(feedbackDetails.getErrorInput).toThrow();
      expect(feedbackDetails.isLanguageUnfamiliarityFeedbackNeeded()).toBe(
        false);
    });
  });

  describe('memory-limit error FeedbackDetails object', function() {
    it('should create a memory-limit FeedbackDetails object', function() {
      var feedbackDetails = (
        FeedbackDetailsObjectFactory.createMemoryLimitErrorFeedbackDetails());
      expect(feedbackDetails.getFeedbackCategory()).toBe(
        FEEDBACK_CATEGORIES.MEMORY_LIMIT_ERROR);
      expect(feedbackDetails.getErrorString).toThrow();
      expect(feedbackDetails.getErrorLineNumber).toThrow();
      expect(feedbackDetails.getLanguage).toThrow();
      expect(feedbackDetails.getErrorInput).toThrow();
      expect(feedbackDetails.isLanguageUnfamiliarityFeedbackNeeded()).toBe(
        false);
    });
  });

  describe('stack-exceeded error FeedbackDetails object', function() {
    it('should create a stack exceeded FeedbackDetails object', function() {
      var feedbackDetails = (
        FeedbackDetailsObjectFactory.createStackExceededFeedbackDetails());
      expect(feedbackDetails.getFeedbackCategory()).toBe(
        FEEDBACK_CATEGORIES.STACK_EXCEEDED_ERROR);
      expect(feedbackDetails.getErrorString).toThrow();
      expect(feedbackDetails.getErrorLineNumber).toThrow();
      expect(feedbackDetails.getLanguage).toThrow();
      expect(feedbackDetails.getErrorInput).toThrow();
      expect(feedbackDetails.isLanguageUnfamiliarityFeedbackNeeded()).toBe(
        false);
    });
  });

  describe('server error FeedbackDetails object', function() {
    it('should create a server error FeedbackDetails object', function() {
      var feedbackDetails = (
        FeedbackDetailsObjectFactory.createServerErrorFeedbackDetails());
      expect(feedbackDetails.getFeedbackCategory()).toBe(
        FEEDBACK_CATEGORIES.SERVER_ERROR);
      expect(feedbackDetails.getErrorString).toThrow();
      expect(feedbackDetails.getErrorLineNumber).toThrow();
      expect(feedbackDetails.getLanguage).toThrow();
      expect(feedbackDetails.getErrorInput).toThrow();
      expect(feedbackDetails.isLanguageUnfamiliarityFeedbackNeeded()).toBe(
        false);
    });
  });

  describe('runtime error FeedbackDetails object', function() {
    it('should create a runtime error FeedbackDetails object', function() {
      var feedbackDetails = (
        FeedbackDetailsObjectFactory.createRuntimeErrorFeedbackDetails(
          5, 'error string', 'python', 'abc', true));
      expect(feedbackDetails.getFeedbackCategory()).toBe(
        FEEDBACK_CATEGORIES.RUNTIME_ERROR);
      expect(feedbackDetails.getErrorLineNumber()).toBe(5);
      expect(feedbackDetails.getErrorString()).toBe('error string');
      expect(feedbackDetails.getLanguage()).toBe('python');
      expect(feedbackDetails.getErrorInput()).toBe('abc');
      expect(feedbackDetails.isLanguageUnfamiliarityFeedbackNeeded()).toBe(
        true);
    });
  });

  describe('syntax error FeedbackDetails object', function() {
    it('should create a syntax error FeedbackDetails object', function() {
      var feedbackDetails = (
        FeedbackDetailsObjectFactory.createSyntaxErrorFeedbackDetails(
          5, 'error string', 'python', false));
      expect(feedbackDetails.getFeedbackCategory()).toBe(
        FEEDBACK_CATEGORIES.SYNTAX_ERROR);
      expect(feedbackDetails.getErrorLineNumber()).toBe(5);
      expect(feedbackDetails.getErrorString()).toBe('error string');
      expect(feedbackDetails.getLanguage()).toBe('python');
      expect(feedbackDetails.getErrorInput).toThrow();
      expect(feedbackDetails.isLanguageUnfamiliarityFeedbackNeeded()).toBe(
        false);
    });
  });

  describe('buggy-output FeedbackDetails object', function() {
    it('should create a buggy-output FeedbackDetails object', function() {
      var feedbackDetails = (
        FeedbackDetailsObjectFactory.createBuggyOutputFeedbackDetails(
          0, 'suite_id_1', 1, 2, ['a', 'b'], 1));
      expect(feedbackDetails.getFeedbackCategory()).toBe(
        FEEDBACK_CATEGORIES.KNOWN_BUG_FAILURE);
      expect(feedbackDetails.getTaskIndex()).toBe(0);
      expect(feedbackDetails.getTestSuiteId()).toBe('suite_id_1');
      expect(feedbackDetails.getTestCaseIndex()).toBe(1);
      expect(feedbackDetails.getSpecificTestIndex()).toBe(2);
      expect(feedbackDetails.getSpecificTestMessageIndex()).toBe(1);
      expect(feedbackDetails.getSpecificTestMessage()).toBe('b');
    });
  });

  describe('suite-level FeedbackDetails object', function() {
    it('should create a suite-level FeedbackDetails object', function() {
      var feedbackDetails = (
        FeedbackDetailsObjectFactory.createSuiteLevelFeedbackDetails(
          0, 'suite_id_1', 1, 2, ['a', 'b'], 1));
      expect(feedbackDetails.getFeedbackCategory()).toBe(
        FEEDBACK_CATEGORIES.SUITE_LEVEL_FAILURE);
      expect(feedbackDetails.getTaskIndex()).toBe(0);
      expect(feedbackDetails.getTestSuiteId()).toBe('suite_id_1');
      expect(feedbackDetails.getTestCaseIndex()).toBe(1);
      expect(feedbackDetails.getSpecificTestIndex()).toBe(2);
      expect(feedbackDetails.getSpecificTestMessageIndex()).toBe(1);
      expect(feedbackDetails.getSpecificTestMessage()).toBe('b');
    });
  });

  describe('incorrect-output FeedbackDetails object', function() {
    it('should create a incorrect-output FeedbackDetails object', function() {
      var feedbackDetails = (
        FeedbackDetailsObjectFactory.createIncorrectOutputFeedbackDetails(
          0, 'suite_id_1', 3, 'test_case', 'output_abc',
          CORRECTNESS_STATE_NO_MORE_FEEDBACK,
          FEEDBACK_CATEGORIES.KNOWN_BUG_FAILURE, 6, ['ab', 'cd']));
      expect(feedbackDetails.getFeedbackCategory()).toBe(
        FEEDBACK_CATEGORIES.INCORRECT_OUTPUT_FAILURE);
      expect(feedbackDetails.getTaskIndex()).toBe(0);
      expect(feedbackDetails.getTestSuiteId()).toBe('suite_id_1');
      expect(feedbackDetails.getTestCaseIndex()).toBe(3);
      expect(feedbackDetails.getTestCase()).toBe('test_case');
      expect(feedbackDetails.getObservedOutput()).toBe('output_abc');
      expect(feedbackDetails.getCorrectnessState()).toBe(
        CORRECTNESS_STATE_NO_MORE_FEEDBACK);
      expect(feedbackDetails.getSpecificCategory()).toBe(
        FEEDBACK_CATEGORIES.KNOWN_BUG_FAILURE);
      expect(feedbackDetails.getSpecificTestIndex()).toBe(6);
      expect(feedbackDetails.getSpecificTestMessageIndex).toThrow();
      expect(feedbackDetails.getSpecificTestMessage).toThrow();
    });
  });

  describe('performance FeedbackDetails object', function() {
    it('should create a performance FeedbackDetails object', function() {
      var feedbackDetails = (
        FeedbackDetailsObjectFactory.createPerformanceFeedbackDetails(
          'linear'));
      expect(feedbackDetails.getFeedbackCategory()).toBe(
        FEEDBACK_CATEGORIES.PERFORMANCE_TEST_FAILURE);
      expect(feedbackDetails.getExpectedPerformance()).toBe('linear');
    });
  });
});
