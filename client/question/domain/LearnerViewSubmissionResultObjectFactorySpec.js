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
  var CodeEvalResultObjectFactory;
  var TaskObjectFactory;
  var FeedbackGeneratorService;
  var tasks;
  var PREPROCESSED_CODE = 'code separator = "abcdefghijklmnopqrst"';
  var RAW_CODE = 'code';
  var OUTPUT = ['1\nHi\n', '1\nHey\n', '1\nHello\n', '1\nSalutations\n'];
  var BUGGY_OUTPUT_TEST_RESULTS = [[false], [false]];
  var PERFORMANCE_TEST_RESULTS = [[], []];
  var ERROR_STRING = null;
  var ERROR_INPUT = 'errorInput';

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    LearnerViewSubmissionResultObjectFactory = $injector.get(
      'LearnerViewSubmissionResultObjectFactory');
    CodeEvalResultObjectFactory = $injector.get(
      'CodeEvalResultObjectFactory');
    TaskObjectFactory = $injector.get('TaskObjectFactory');
    FeedbackGeneratorService = $injector.get('FeedbackGeneratorService');
    tasks = [
      TaskObjectFactory.create({
        instructions: [''],
        prerequisiteSkills: [''],
        acquiredSkills: [''],
        inputFunctionName: null,
        outputFunctionName: null,
        mainFunctionName: 'mockMainFunction',
        languageSpecificTips: {
          python: []
        },
        testSuites: [{
          id: 'GENERAL_CASE',
          humanReadableName: 'the general case',
          testCases: [{
            input: 'task_1_correctness_test_1',
            allowedOutputs: [true]
          }, {
            input: 'task_1_correctness_test_2',
            allowedOutputs: [true]
          }]
        }],
        buggyOutputTests: [],
        suiteLevelTests: [],
        performanceTests: []
      }),
      TaskObjectFactory.create({
        instructions: [''],
        prerequisiteSkills: [''],
        acquiredSkills: [''],
        inputFunctionName: null,
        outputFunctionName: null,
        mainFunctionName: 'mockMainFunction',
        languageSpecificTips: {
          python: []
        },
        testSuites: [{
          id: 'FIRST_CASE',
          humanReadableName: 'the first case',
          testCases: [{
            input: 'task_2_correctness_test_1',
            allowedOutputs: [true]
          }]
        },
        {
          id: 'SECOND_CASE',
          humanReadableName: 'the second case',
          testCases: [{
            input: 'task_2_correctness_test_2',
            allowedOutputs: [true]
          }]
        }],
        buggyOutputTests: [],
        suiteLevelTests: [],
        performanceTests: []
      })
    ];
  }));

  describe('getFeedback', function() {
    it('should retrive the corresponding feedback for code with no errors',
      function() {
        var codeEvalResult = CodeEvalResultObjectFactory.create(
          PREPROCESSED_CODE, RAW_CODE, OUTPUT,
          [[[true, true]], [[true], [true]]],
          BUGGY_OUTPUT_TEST_RESULTS, PERFORMANCE_TEST_RESULTS, ERROR_STRING,
          ERROR_INPUT);
        var feedback = FeedbackGeneratorService.getFeedback(
          tasks, codeEvalResult, []);

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
        var codeEvalResult = CodeEvalResultObjectFactory.create(
          PREPROCESSED_CODE, RAW_CODE, OUTPUT,
          [[[true, true]], [[true], [true]]],
          BUGGY_OUTPUT_TEST_RESULTS, PERFORMANCE_TEST_RESULTS, ERROR_STRING,
          ERROR_INPUT);
        var feedback = FeedbackGeneratorService.getFeedback(
          tasks, codeEvalResult, []);

        var learnerViewSubmissionResult =
          LearnerViewSubmissionResultObjectFactory.create(
            feedback, 'some output');
        expect(learnerViewSubmissionResult.getStdout()).toEqual('some output');

        var stdout = codeEvalResult.getStdoutToDisplay(tasks);
        var learnerViewSubmissionResult1 =
          LearnerViewSubmissionResultObjectFactory.create(
            feedback, stdout);
        expect(learnerViewSubmissionResult1.getStdout()).toEqual(stdout);
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
