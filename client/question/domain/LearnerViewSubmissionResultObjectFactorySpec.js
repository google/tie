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
 * @fileoverview Unit tests for LearnerViewSubmissionResult domain objects.
 */

describe('LearnerViewSubmissionResultObjectFactory', function() {
  var LearnerViewSubmissionResultObjectFactory;
  var FeedbackGeneratorService;

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    LearnerViewSubmissionResultObjectFactory = $injector.get(
      'LearnerViewSubmissionResultObjectFactory');
    FeedbackGeneratorService = $injector.get('FeedbackGeneratorService');
  }));

  describe('getFeedback', function() {
    it('should retrieve the corresponding feedback for code with no errors',
      function() {
        var feedback = FeedbackGeneratorService.getSuccessFeedback();
        var learnerViewSubmissionResult =
          LearnerViewSubmissionResultObjectFactory.create(
            feedback, 'some output');
        expect(learnerViewSubmissionResult.getFeedback()).toEqual(feedback);
      });

    it('should retrieve the corresponding feedback for error feedback',
      function() {
        var feedback = FeedbackGeneratorService.getTimeoutErrorFeedback();
        var learnerViewSubmissionResult =
          LearnerViewSubmissionResultObjectFactory.create(
            feedback, null);
        expect(learnerViewSubmissionResult.getFeedback()).toEqual(feedback);
      });
  });

  describe('getStdout', function() {
    it('should retrive the corresponding stdout for code with no errors',
      function() {
        var feedback = FeedbackGeneratorService.getSuccessFeedback();
        var learnerViewSubmissionResult =
          LearnerViewSubmissionResultObjectFactory.create(
            feedback, 'some output');
        expect(learnerViewSubmissionResult.getStdout()).toEqual('some output');
      });

    it('should retrieve the corresponding stdout for error feedback',
      function() {
        var feedback = FeedbackGeneratorService.getTimeoutErrorFeedback();
        var learnerViewSubmissionResult =
          LearnerViewSubmissionResultObjectFactory.create(
            feedback, null);
        expect(learnerViewSubmissionResult.getStdout()).toEqual(null);
      });
  });
});
