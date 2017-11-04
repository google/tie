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
 * @fileoverview Unit tests for TipsGeneratorService.
 */

describe('TipsGeneratorService', function() {
  var LANGUAGE_PYTHON;
  var TipsGeneratorService;
  var FeedbackParagraphObjectFactory;

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    LANGUAGE_PYTHON = $injector.get('LANGUAGE_PYTHON');
    TipsGeneratorService = $injector.get('TipsGeneratorService');
    FeedbackParagraphObjectFactory = $injector.get(
      'FeedbackParagraphObjectFactory');
  }));

  describe('getTipParagraphs', function() {
    it('returns a tip to avoid the print statement, where needed', function() {
      var tipParagraphs = TipsGeneratorService.getTipParagraphs(
        LANGUAGE_PYTHON, [
          'def func(a):',
          '    print a',
          ''
        ].join(''));

      expect(tipParagraphs.length).toBe(1);
      var tipParagraph = tipParagraphs[0];
      expect(tipParagraph instanceof FeedbackParagraphObjectFactory).toBe(true);
      expect(tipParagraph.isTextParagraph()).toBe(true);
      expect(tipParagraph.getContent()).toEqual([
        'We noticed that you\'re using a print statement within your code. ',
        'Since you will not be able to use such statements in a technical ',
        'interview, TIE does not support this feature. We encourage you to ',
        'instead step through your code by hand.'
      ].join(''));
    });
  });
});
