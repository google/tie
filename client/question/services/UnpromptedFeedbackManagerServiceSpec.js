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
 * @fileoverview Unit tests for UnpromptedFeedbackManagerService.
 */

describe('UnpromptedFeedbackManagerService', function() {
  var LANGUAGE_PYTHON;
  var UnpromptedFeedbackManagerService;
  var PrintTerminalService;
  var TaskObjectFactory;
  var tasks;
  var taskId = 'taskId';

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    LANGUAGE_PYTHON = $injector.get('LANGUAGE_PYTHON');
    UnpromptedFeedbackManagerService = $injector.get(
      'UnpromptedFeedbackManagerService');
    PrintTerminalService = $injector.get(
      'PrintTerminalService');
    TaskObjectFactory = $injector.get('TaskObjectFactory');

    tasks = [TaskObjectFactory.create({
      id: taskId,
      instructions: [''],
      prerequisiteSkills: [''],
      acquiredSkills: [''],
      inputFunctionName: null,
      outputFunctionName: null,
      mainFunctionName: 'mockMainFunction',
      languageSpecificTips: {
        python: [{
          requirePrintToBeDisabled: false,
          regexString: 'import re|regex',
          message: 'You don\'t need to use regexes for this question.'
        }, {
          requirePrintToBeDisabled: false,
          regexString: 'import',
          message: 'For this question, you do not need to import libraries.'
        }]
      },
      testSuites: [{
        id: 'TAG_ONE',
        humanReadableName: 'tag1',
        testCases: [{
          input: 'task_1_correctness_test_1',
          allowedOutputs: [true]
        }]
      }],
      buggyOutputTests: [],
      suiteLevelTests: [],
      performanceTests: []
    })];
  }));

  describe('runTipsCheck', function() {
    it('activates a tip after the second consecutive detection', function() {
      UnpromptedFeedbackManagerService.reset(tasks);

      // The first check does not activate any feedback.
      expect(UnpromptedFeedbackManagerService.runTipsCheck(
        LANGUAGE_PYTHON, 'import', taskId)).toBe(null);

      // The second check does result in feedback.
      var feedbackParagraphs = UnpromptedFeedbackManagerService.runTipsCheck(
        LANGUAGE_PYTHON, 'import', taskId);
      expect(feedbackParagraphs.length).toBe(1);
      expect(feedbackParagraphs[0].isTextParagraph()).toBe(true);
      expect(feedbackParagraphs[0].getContent()).toBe(
        'For this question, you do not need to import libraries.');

      // Subsequent checks result in no further feedback.
      expect(UnpromptedFeedbackManagerService.runTipsCheck(
        LANGUAGE_PYTHON, 'import', taskId)).toBe(null);
      expect(UnpromptedFeedbackManagerService.runTipsCheck(
        LANGUAGE_PYTHON, 'import', taskId)).toBe(null);
    });

    it('resets its state if there are no consecutive detections', function() {
      UnpromptedFeedbackManagerService.reset(tasks);

      // The first check does not activate any feedback.
      expect(UnpromptedFeedbackManagerService.runTipsCheck(
        LANGUAGE_PYTHON, 'import', taskId)).toBe(null);
      // The error is fixed in the second check, so it was transient.
      expect(UnpromptedFeedbackManagerService.runTipsCheck(
        LANGUAGE_PYTHON, 'no problem', taskId)).toBe(null);
      // The error is re-activated...
      expect(UnpromptedFeedbackManagerService.runTipsCheck(
        LANGUAGE_PYTHON, 'import', taskId)).toBe(null);
      // ...but is, again, transient.
      expect(UnpromptedFeedbackManagerService.runTipsCheck(
        LANGUAGE_PYTHON, 'no problem', taskId)).toBe(null);
    });

    it('only shows one tip at a time', function() {
      UnpromptedFeedbackManagerService.reset(tasks);

      // The first check does not activate any feedback.
      expect(UnpromptedFeedbackManagerService.runTipsCheck(
        LANGUAGE_PYTHON, 'import regex', taskId)).toBe(null);

      // Two issues are found in the second check, but only one is surfaced.
      var feedbackParagraphs = UnpromptedFeedbackManagerService.runTipsCheck(
        LANGUAGE_PYTHON, 'import regex', taskId);
      expect(feedbackParagraphs.length).toBe(1);
      expect(feedbackParagraphs[0].isTextParagraph()).toBe(true);
      expect(feedbackParagraphs[0].getContent()).toMatch(
        'You don\'t need to use regexes for this question.');

      // When the regex issue is fixed, the import issue is surfaced.
      feedbackParagraphs = UnpromptedFeedbackManagerService.runTipsCheck(
        LANGUAGE_PYTHON, 'import', taskId);
      expect(feedbackParagraphs.length).toBe(1);
      expect(feedbackParagraphs[0].isTextParagraph()).toBe(true);
      expect(feedbackParagraphs[0].getContent()).toBe(
        'For this question, you do not need to import libraries.');
    });

    it('should not activate a warning for print statements if print is enabled',
      function() {
        UnpromptedFeedbackManagerService.reset(tasks);
        spyOn(PrintTerminalService,
          'isPrintingSupported').and.returnValue(true);

        // The first check does not activate any feedback.
        expect(UnpromptedFeedbackManagerService.runTipsCheck(
          LANGUAGE_PYTHON, 'print', taskId)).toBe(null);
        // Printing is supported, so once again nothing is activated.
        expect(UnpromptedFeedbackManagerService.runTipsCheck(
          LANGUAGE_PYTHON, 'print', taskId)).toBe(null);
      });

    it('should activate a warning for print statements if print is not enabled',
      function() {
        UnpromptedFeedbackManagerService.reset(tasks);
        spyOn(PrintTerminalService,
          'isPrintingSupported').and.returnValue(false);

        // The first check does not activate any feedback.
        expect(UnpromptedFeedbackManagerService.runTipsCheck(
          LANGUAGE_PYTHON, 'print', taskId)).toBe(null);
        // Printing is not supported, so print feedback should be activated.
        var feedbackParagraphs = UnpromptedFeedbackManagerService.runTipsCheck(
        LANGUAGE_PYTHON, 'print', taskId);
        expect(feedbackParagraphs.length).toBe(1);
        expect(feedbackParagraphs[0].isTextParagraph()).toBe(true);
        expect(feedbackParagraphs[0].getContent()).toMatch(
          'We noticed that you\'re using a print statement');
      });
  });
});
