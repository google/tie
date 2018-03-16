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
  var textDict;
  var errorDict;
  var codeDict;
  var outputDict;
  var imageDict;
  var textParagraph;
  var errorParagraph;
  var codeParagraph;
  var outputParagraph;
  var imageParagraph;


  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    FeedbackParagraphObjectFactory = $injector.get(
      'FeedbackParagraphObjectFactory');

    textDict = {
      type: 'text',
      content: 'Could you fix this?'
    };
    errorDict = {
      type: 'error',
      content: 'SyntaxError: bad input on line 2'
    };
    codeDict = {
      type: 'code',
      content: 'ZeroDivisionError: integer division or modulo by zero on line 5'
    };
    outputDict = {
      type: 'output',
      content: 'nhoJ ,olleH'
    };
    imageDict = {
      type: 'image',
      content: 'image.png'
    };

    textParagraph = FeedbackParagraphObjectFactory
      .createTextParagraph('Could you fix this?');
    errorParagraph = FeedbackParagraphObjectFactory
      .createErrorParagraph('SyntaxError: bad input on line 2');
    codeParagraph = FeedbackParagraphObjectFactory
      .createCodeParagraph(
        'ZeroDivisionError: integer division or modulo by zero on line 5');
    outputParagraph = FeedbackParagraphObjectFactory
      .createOutputParagraph('nhoJ ,olleH');
    imageParagraph = FeedbackParagraphObjectFactory
      .createImageParagraph('image.png');

  }));

  describe('fromDict', function() {
    it('should return FeedbackParagraphObjects from a dict', function() {
      expect(FeedbackParagraphObjectFactory.fromDict(textDict))
        .toEqual(textParagraph);
      expect(FeedbackParagraphObjectFactory.fromDict(errorDict))
        .toEqual(errorParagraph);
      expect(FeedbackParagraphObjectFactory.fromDict(codeDict))
        .toEqual(codeParagraph);
      expect(FeedbackParagraphObjectFactory.fromDict(outputDict))
        .toEqual(outputParagraph);
      expect(FeedbackParagraphObjectFactory.fromDict(imageDict))
        .toEqual(imageParagraph);
    });

    it('should return null if the dict has undefined type', function() {
      var undefinedDict = {
        type: 'newtype',
        content: 'new content'
      };
      expect(FeedbackParagraphObjectFactory.fromDict(undefinedDict))
        .toEqual(null);
    });
  });

  describe('toDict', function() {
    it('should convert a FeedbackParagraphObjectFactory to a dict', function() {
      expect(textParagraph.toDict()).toEqual(textDict);
      expect(errorParagraph.toDict()).toEqual(errorDict);
      expect(codeParagraph.toDict()).toEqual(codeDict);
      expect(outputParagraph.toDict()).toEqual(outputDict);
      expect(imageParagraph.toDict()).toEqual(imageDict);
    });
  });

  describe('getErrorLineNumber', function() {
    it('should return the line number where the syntax error occurs',
      function() {
        expect(errorParagraph.getErrorLineNumber()).toEqual(2);
      });

    it('should throw an error if the paragraph is not a syntax error',
      function() {
        expect(function() {
          textParagraph.getErrorLineNumber();
        }).toThrowError('Incorrect feedback paragraph type.');

        expect(function() {
          codeParagraph.getErrorLineNumber();
        }).toThrowError('Incorrect feedback paragraph type.');
      });
  });
});
