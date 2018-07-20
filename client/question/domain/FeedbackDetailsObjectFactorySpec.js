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

  var FeedbackDetailsObjectFactory;

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    FEEDBACK_CATEGORIES = $injector.get('FEEDBACK_CATEGORIES');
    FeedbackDetailsObjectFactory = $injector.get(
      'FeedbackDetailsObjectFactory');
  }));

  describe('time-limit error FeedbackDetails object', function() {
    it('should create a time-limit FeedbackDetails object', function() {
      var feedbackDetails = (
        FeedbackDetailsObjectFactory.createTimeLimitErrorFeedback());
      expect(feedbackDetails.getFeedbackCategory()).toBe(
        FEEDBACK_CATEGORIES.TIME_LIMIT_ERROR);
      expect(feedbackDetails.getErrorString).toThrow();
      expect(feedbackDetails.getLanguage).toThrow();
      expect(feedbackDetails.getErrorInput).toThrow();
      expect(feedbackDetails.isLanguageUnfamiliarityFeedbackNeeded()).toBe(
        false);
    });
  });

  describe('stack-exceeded error FeedbackDetails object', function() {
    it('should create a stack exceeded FeedbackDetails object', function() {
      var feedbackDetails = (
        FeedbackDetailsObjectFactory.createStackExceededFeedback());
      expect(feedbackDetails.getFeedbackCategory()).toBe(
        FEEDBACK_CATEGORIES.STACK_EXCEEDED_ERROR);
      expect(feedbackDetails.getErrorString).toThrow();
      expect(feedbackDetails.getLanguage).toThrow();
      expect(feedbackDetails.getErrorInput).toThrow();
      expect(feedbackDetails.isLanguageUnfamiliarityFeedbackNeeded()).toBe(
        false);
    });
  });

  describe('server error FeedbackDetails object', function() {
    it('should create a server error FeedbackDetails object', function() {
      var feedbackDetails = (
        FeedbackDetailsObjectFactory.createServerErrorFeedback());
      expect(feedbackDetails.getFeedbackCategory()).toBe(
        FEEDBACK_CATEGORIES.SERVER_ERROR);
      expect(feedbackDetails.getErrorString).toThrow();
      expect(feedbackDetails.getLanguage).toThrow();
      expect(feedbackDetails.getErrorInput).toThrow();
      expect(feedbackDetails.isLanguageUnfamiliarityFeedbackNeeded()).toBe(
        false);
    });
  });

  describe('runtime error FeedbackDetails object', function() {
    it('should create a runtime error FeedbackDetails object', function() {
      var feedbackDetails = (
        FeedbackDetailsObjectFactory.createRuntimeErrorFeedback(
          'error string', 'python', 'abc', true));
      expect(feedbackDetails.getFeedbackCategory()).toBe(
        FEEDBACK_CATEGORIES.RUNTIME_ERROR);
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
        FeedbackDetailsObjectFactory.createSyntaxErrorFeedback(
          'error string', 'python', false));
      expect(feedbackDetails.getFeedbackCategory()).toBe(
        FEEDBACK_CATEGORIES.SYNTAX_ERROR);
      expect(feedbackDetails.getErrorString()).toBe('error string');
      expect(feedbackDetails.getLanguage()).toBe('python');
      expect(feedbackDetails.getErrorInput).toThrow();
      expect(feedbackDetails.isLanguageUnfamiliarityFeedbackNeeded()).toBe(
        false);
    });
  });


});
