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

  var PARAGRAPH_TYPE_TEXT;
  var PARAGRAPH_TYPE_CODE;
  var PARAGRAPH_TYPE_SYNTAX_ERROR;

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    PARAGRAPH_TYPE_TEXT = $injector.get('PARAGRAPH_TYPE_TEXT');
    PARAGRAPH_TYPE_CODE = $injector.get('PARAGRAPH_TYPE_CODE');
    PARAGRAPH_TYPE_SYNTAX_ERROR = $injector.get('PARAGRAPH_TYPE_SYNTAX_ERROR');
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

  describe('appendFeedback', function() {
    it('should append any feedback paragraphs from a given Feedback object',
      function() {
        var feedbackToAppend = FeedbackObjectFactory.create(true);
        feedbackToAppend.appendTextParagraph('test1');
        feedbackToAppend.appendTextParagraph('test2');
        feedback.appendTextParagraph('testA');

        var paragraphs = feedback.getParagraphs();
        expect(paragraphs.length).toEqual(1);
        expect(paragraphs[0].isTextParagraph()).toBe(true);
        expect(paragraphs[0].getContent()).toEqual('testA');

        feedback.appendFeedback(feedbackToAppend);
        paragraphs = feedback.getParagraphs();

        expect(paragraphs.length).toEqual(3);
        expect(paragraphs[0].isTextParagraph()).toBe(true);
        expect(paragraphs[0].getContent()).toEqual('testA');
        expect(paragraphs[1].isTextParagraph()).toBe(true);
        expect(paragraphs[1].getContent()).toEqual('test1');
        expect(paragraphs[2].isTextParagraph()).toBe(true);
        expect(paragraphs[2].getContent()).toEqual('test2');
      }
    );
  });

  describe('getParagraphsAsListOfDicts', function() {
    it('should return an array of paragraphs as dictionaries', function() {
      feedback.appendTextParagraph("This");
      feedback.appendCodeParagraph("is");
      feedback.appendSyntaxErrorParagraph("fine");
      var dictionaries = feedback.getParagraphsAsListOfDicts();
      expect(dictionaries.length).toEqual(3);
      expect(dictionaries[0].content).toEqual("This");
      expect(dictionaries[0].type).toEqual(PARAGRAPH_TYPE_TEXT);
      expect(dictionaries[1].content).toEqual("is");
      expect(dictionaries[1].type).toEqual(PARAGRAPH_TYPE_CODE);
      expect(dictionaries[2].content).toEqual("fine");
      expect(dictionaries[2].type).toEqual(PARAGRAPH_TYPE_SYNTAX_ERROR);
    });
  });

  describe('clearParagraphs', function() {
    it('should clear all paragraphs in the current feedback', function() {
      feedback.appendTextParagraph("text");
      feedback.appendSyntaxErrorParagraph("error");
      feedback.clear();
      expect(feedback.getParagraphs.length).toEqual(0);
    });
  });
});
