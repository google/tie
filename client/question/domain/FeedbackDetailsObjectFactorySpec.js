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

  describe('time-limit error feedback details', function() {
    it('should create a time-limit feedback details object', function() {
      var feedbackDetails = (
        FeedbackDetailsObjectFactory.createTimeLimitErrorFeedback());
      expect(feedbackDetails.getFeedbackCategory()).toBe(
        FEEDBACK_CATEGORIES.TIME_LIMIT_ERROR);
    });
  });

  describe('stack-exceeded error feedback details', function() {
    it('should create a stack-exceeded feedback details object', function() {
      var feedbackDetails = (
        FeedbackDetailsObjectFactory.createStackExceededFeedback());
      expect(feedbackDetails.getFeedbackCategory()).toBe(
        FEEDBACK_CATEGORIES.STACK_EXCEEDED_ERROR);
    });
  });

  describe('server error feedback details', function() {
    it('should create a server error feedback details object', function() {
      var feedbackDetails = (
        FeedbackDetailsObjectFactory.createServerErrorFeedback());
      expect(feedbackDetails.getFeedbackCategory()).toBe(
        FEEDBACK_CATEGORIES.SERVER_ERROR);
    });
  });

  describe('runtime error feedback', function() {
    it('should create a runtime feedback details object', function() {
      var feedbackDetails = (
        FeedbackDetailsObjectFactory.createRuntimeErrorFeedback());
      expect(feedbackDetails.getFeedbackCategory()).toBe(
        FEEDBACK_CATEGORIES.RUNTIME_ERROR);
    });
  });
});
