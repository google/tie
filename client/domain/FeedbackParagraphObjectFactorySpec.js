

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
 * @fileoverview Unit tests for FeedbackParagraphObjectFactory domain objects.
 */

describe('FeedbackParagraphObjectFactory', function() {
  var FeedbackParagraphObjectFactory;

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    FeedbackParagraphObjectFactory = $injector.get(
      'FeedbackParagraphObjectFactory');
  }));

  describe('createFeedbackParagraphObjectFromDict', function() {
    it('should return FeedbackParagraphObjects from a dict', function() {
      var textDict = {
        _type: 'text',
        _content: 'FeedbackParagraphObject text content'
      };
      var errorDict = {
        _type: 'error',
        _content: 'FeedbackParagraphObject error content'
      };
      var codeDict = {
        _type: 'code',
        _content: 'FeedbackParagraphObject code content'
      };

      var textParagraph = FeedbackParagraphObjectFactory
        .createTextParagraph('FeedbackParagraphObject text content');
      var errorParagraph = FeedbackParagraphObjectFactory
        .createSyntaxErrorParagraph('FeedbackParagraphObject error content');
      var codeParagraph = FeedbackParagraphObjectFactory
        .createCodeParagraph('FeedbackParagraphObject code content');

      expect(FeedbackParagraphObjectFactory.fromDict(textDict))
        .toEqual(textParagraph);
      expect(FeedbackParagraphObjectFactory.fromDict(errorDict))
        .toEqual(errorParagraph);
      expect(FeedbackParagraphObjectFactory.fromDict(codeDict))
        .toEqual(codeParagraph);
    });

    it('should return null if the dict has undefined type', function() {
      var undefinedDict = {
        _type: 'newtype',
        _content: 'new content'
      };
      expect(FeedbackParagraphObjectFactory.fromDict(undefinedDict))
        .toEqual(null);
    });
  });
});
