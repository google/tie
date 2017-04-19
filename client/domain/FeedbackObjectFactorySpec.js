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
 * @fileoverview Unit tests for FeedbackObject domain objects.
 */

describe('FeedbackObjectFactory', function() {
  var FeedbackObjectFactory;
  var feedback;

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    FeedbackObjectFactory = $injector.get(
      'FeedbackObjectFactory');
    feedback = FeedbackObjectFactory.create(true);
  }));

  describe('isAnswerCorrect', function() {
    it('should return whether or not answer is correct', function() {
      expect(feedback.isAnswerCorrect()).toBe(true);
    });
  });

  describe('firstParagraphText', function() {
    it('should throw an error when adding paragraph one as code', function() {
      var errorFunction = function() {
        feedback.appendCodeParagraph("code");
      };
      expect(errorFunction).toThrowError(Error);
    });
  });

  describe('clearParagraphs', function() {
    it('should clear all paragraphs in the current feedback', function() {
      feedback.appendTextParagraph("text");
      feedback.clear();
      expect(feedback.getParagraphs.length).toEqual(0);
    });
  });
});

