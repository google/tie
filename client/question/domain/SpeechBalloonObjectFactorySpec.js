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
 * @fileoverview Unit tests for SpeechBalloonObjectFactory domain objects.
 */

describe('SpeechBalloonObjectFactory', function() {
  var SpeechBalloonObjectFactory;
  var FeedbackParagraphObjectFactory;

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    SpeechBalloonObjectFactory = $injector.get('SpeechBalloonObjectFactory');
    FeedbackParagraphObjectFactory = $injector.get(
      'FeedbackParagraphObjectFactory');
  }));

  describe('getFeedbackParagraphs', function() {
    it('should correctly retrieve the feedback paragraphs', function() {
      var feedbackBalloon = SpeechBalloonObjectFactory.createFeedbackBalloon([
        FeedbackParagraphObjectFactory.fromDict({
          type: 'text',
          content: 'hello'
        })
      ]);
      expect(feedbackBalloon.getFeedbackParagraphs()).toEqual([
        FeedbackParagraphObjectFactory.fromDict({
          type: 'text',
          content: 'hello'
        })
      ]);

      var codeBalloon = SpeechBalloonObjectFactory.createCodeBalloon('code');
      expect(codeBalloon.getFeedbackParagraphs()).toEqual([
        FeedbackParagraphObjectFactory.fromDict({
          type: 'code',
          content: 'code'
        })
      ]);
    });
  });

  describe('isDisplayedOnLeft', function() {
    it('should correctly determine where to display the balloon', function() {
      var feedbackBalloon = SpeechBalloonObjectFactory.createFeedbackBalloon([
        FeedbackParagraphObjectFactory.fromDict({
          type: 'text',
          content: 'hello'
        })
      ]);
      expect(feedbackBalloon.isDisplayedOnLeft()).toBe(true);

      var codeBalloon = SpeechBalloonObjectFactory.createCodeBalloon('code');
      expect(codeBalloon.isDisplayedOnLeft()).toBe(false);
    });
  });

  describe('isCodeSubmission', function() {
    it('should determine if current balloon is code submission', function() {
      var codeBalloon = SpeechBalloonObjectFactory.createCodeBalloon('code');
      expect(codeBalloon.isCodeSubmission()).toBe(true);

      var feedbackBalloon = SpeechBalloonObjectFactory.createFeedbackBalloon([
        FeedbackParagraphObjectFactory.fromDict({
          type: 'text',
          content: 'hello'
        })
      ]);
      expect(feedbackBalloon.isCodeSubmission()).toBe(false);
    });
  });

  describe('toDict', function() {
    it('should convert a code balloon to a dict', function() {
      var codeBalloon = SpeechBalloonObjectFactory.createCodeBalloon('abc');
      expect(codeBalloon.toDict()).toEqual({
        type: 'code',
        feedbackParagraphDicts: [{
          type: 'code',
          content: 'abc'
        }]
      });
    });

    it('should convert a feedback balloon to a dict', function() {
      var feedbackBalloon = SpeechBalloonObjectFactory.createFeedbackBalloon([
        FeedbackParagraphObjectFactory.fromDict({
          type: 'text',
          content: 'hello'
        })
      ]);
      expect(feedbackBalloon.toDict()).toEqual({
        type: 'feedback',
        feedbackParagraphDicts: [{
          type: 'text',
          content: 'hello'
        }]
      });
    });
  });

  describe('fromDict', function() {
    it('should parse a dict representing a code balloon', function() {
      var codeBalloonDict = {
        type: 'code',
        feedbackParagraphDicts: [{
          type: 'code',
          content: 'abc'
        }]
      };

      var codeBalloon = SpeechBalloonObjectFactory.fromDict(codeBalloonDict);
      expect(codeBalloon.isCodeSubmission()).toBe(true);
      expect(codeBalloon.getFeedbackParagraphs().length).toBe(1);
      expect(codeBalloon.getFeedbackParagraphs()[0].toDict()).toEqual({
        type: 'code',
        content: 'abc'
      });

      expect(codeBalloon.toDict()).toEqual(codeBalloonDict);
    });

    it('should parse a dict representing a feedback balloon', function() {
      var feedbackBalloonDict = {
        type: 'feedback',
        feedbackParagraphDicts: [{
          type: 'text',
          content: 'hello'
        }]
      };

      var feedbackBalloon = SpeechBalloonObjectFactory.fromDict(
        feedbackBalloonDict);
      expect(feedbackBalloon.isCodeSubmission()).toBe(false);
      expect(feedbackBalloon.getFeedbackParagraphs().length).toBe(1);
      expect(feedbackBalloon.getFeedbackParagraphs()[0].toDict()).toEqual({
        type: 'text',
        content: 'hello'
      });

      expect(feedbackBalloon.toDict()).toEqual(feedbackBalloonDict);
    });
  });
});
