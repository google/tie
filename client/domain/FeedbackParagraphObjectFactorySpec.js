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
 * @fileoverview Unit tests for FeedbackParagraphObject domain objects.
 */

describe('FeedbackParagraphObjectFactory', function() {
  var FeedbackParagraphObjectFactory;

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    FeedbackParagraphObjectFactory = $injector.get(
      'FeedbackParagraphObjectFactory');
  }));

  describe('getErrorLineNumber', function() {
    it('should return the line number where the syntax error occurs',
      function() {
        var syntaxErrorFeedbackParagraph = FeedbackParagraphObjectFactory
          .createSyntaxErrorParagraph('SyntaxError: bad input on line 2');
        expect(syntaxErrorFeedbackParagraph.getErrorLineNumber()).toEqual(2);
      });

    it('should throw an error if it is used with a non-syntax error feedback',
      'paragraph', function() {
        var textFeedbackParagraph = FeedbackParagraphObjectFactory
          .createTextParagraph('Could you fix this?');
        expect(function() {
          textFeedbackParagraph.getErrorLineNumber();
        }).toThrowError('Incorrect feedback paragraph type.');

        var codeFeedbackParagraph = FeedbackParagraphObjectFactory
          .createCodeParagraph(
            'ZeroDivisionError: integer division or modulo by zero on line 5');
        expect(function() {
          codeFeedbackParagraph.getErrorLineNumber();
        }).toThrowError('Incorrect feedback paragraph type.');
      });
  });
});
