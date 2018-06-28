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
 * @fileoverview Unit tests for CodeEvalResultObject domain objects.
 */

describe('CodeEvalResultObjectFactory', function() {
  var CodeEvalResultObjectFactory;
  var TaskObjectFactory;

  var codeEvalResult;
  var CODE = 'code separator = "abcdefghijklmnopqrst"';
  var OUTPUT = ['1\nHi\n', '1\nHey\n', '1\nHello\n', '1\nSalutations\n'];
  var OBSERVED_OUTPUTS = [[[true, true]], [[false, false]]];
  var BUGGY_OUTPUT_TEST_RESULTS = [[false], [false]];
  var PERFORMANCE_TEST_RESULTS = [[], []];
  var ERROR_STRING = null;
  var ERROR_INPUT = 'errorInput';

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    CodeEvalResultObjectFactory = $injector.get(
      'CodeEvalResultObjectFactory');
    TaskObjectFactory = $injector.get('TaskObjectFactory');
    codeEvalResult = CodeEvalResultObjectFactory.create(CODE, OUTPUT,
      OBSERVED_OUTPUTS, BUGGY_OUTPUT_TEST_RESULTS,
      PERFORMANCE_TEST_RESULTS, ERROR_STRING, ERROR_INPUT);
  }));

  describe('getPreprocessedCode', function() {
    it('should correctly get preprocessed code', function() {
      expect(codeEvalResult.getPreprocessedCode()).toMatch(CODE);
    });
  });

  describe('hasSamePreprocessedCodeAs', function() {
    it('should correctly compare the code of two objects', function() {
      var matchingCodeEvalResult = CodeEvalResultObjectFactory.create(
        CODE, 'some output', [], [], [], '', '');
      expect(
        codeEvalResult.hasSamePreprocessedCodeAs(matchingCodeEvalResult)
      ).toBe(true);

      var nonMatchingCodeEvalResult = CodeEvalResultObjectFactory.create(
        'blah blah separator = "bcdefghijklmnopqrstu" not same code',
        'some output', [], [], [], '', '');
      expect(
        codeEvalResult.hasSamePreprocessedCodeAs(nonMatchingCodeEvalResult)
      ).toBe(false);
    });
  });

  describe('getOutput', function() {
    it('should correctly get output', function() {
      expect(codeEvalResult.getOutput()).toEqual(OUTPUT);
    });
  });

  describe('getObservedOutputs', function() {
    it('should correctly get the observed outputs', function() {
      expect(codeEvalResult.getObservedOutputs())
        .toEqual(OBSERVED_OUTPUTS);
    });
  });

  describe('getIndexOfFirstFailedTask', function() {
    it('should correctly get the index of the first failed task', function() {
      var tasks = [
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
            id: 'GENERAL_CASE',
            humanReadableName: 'the general case',
            testCases: [{
              input: 'task_2_correctness_test_1',
              allowedOutputs: [true]
            }, {
              input: 'task_2_correctness_test_2',
              allowedOutputs: [true]
            }]
          }],
          buggyOutputTests: [],
          suiteLevelTests: [],
          performanceTests: []
        })
      ];

      var codeEvalResult1 = CodeEvalResultObjectFactory.create(
        CODE, OUTPUT, [[[true, true]], [[true, true]]],
        BUGGY_OUTPUT_TEST_RESULTS, PERFORMANCE_TEST_RESULTS, ERROR_STRING,
        ERROR_INPUT);
      expect(codeEvalResult1.getIndexOfFirstFailedTask(tasks))
        .toEqual(null);

      var codeEvalResult2 = CodeEvalResultObjectFactory.create(
        CODE, OUTPUT, [[[true, false]], [[true, true]]],
        BUGGY_OUTPUT_TEST_RESULTS, PERFORMANCE_TEST_RESULTS, ERROR_STRING,
        ERROR_INPUT);
      expect(codeEvalResult2.getIndexOfFirstFailedTask(tasks))
        .toEqual(0);

      var codeEvalResult3 = CodeEvalResultObjectFactory.create(
        CODE, OUTPUT, [[[true, true]], [[false, true]]],
        BUGGY_OUTPUT_TEST_RESULTS, PERFORMANCE_TEST_RESULTS, ERROR_STRING,
        ERROR_INPUT);
      expect(codeEvalResult3.getIndexOfFirstFailedTask(tasks))
        .toEqual(1);

      var codeEvalResult4 = CodeEvalResultObjectFactory.create(
        CODE, OUTPUT, [[[true, false]], [[false, true]]],
        BUGGY_OUTPUT_TEST_RESULTS, PERFORMANCE_TEST_RESULTS, ERROR_STRING,
        ERROR_INPUT);
      expect(codeEvalResult4.getIndexOfFirstFailedTask(tasks))
        .toEqual(0);

      var codeEvalResult5 = CodeEvalResultObjectFactory.create(
        CODE, OUTPUT, [], BUGGY_OUTPUT_TEST_RESULTS, PERFORMANCE_TEST_RESULTS,
        ERROR_STRING, ERROR_INPUT);
      expect(codeEvalResult5.getIndexOfFirstFailedTask(tasks))
        .toEqual(0);
    });
  });

  describe('getIndexOfFirstFailedTest', function() {
    it('should correctly get the index of the first failed test', function() {
      var tasks = [
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

      var codeEvalResult1 = CodeEvalResultObjectFactory.create(
        CODE, OUTPUT, [[[true, true]], [[true], [true]]],
        BUGGY_OUTPUT_TEST_RESULTS, PERFORMANCE_TEST_RESULTS, ERROR_STRING,
        ERROR_INPUT);
      expect(codeEvalResult1.getIndexOfFirstFailedTest(tasks))
        .toEqual(null);

      var codeEvalResult2 = CodeEvalResultObjectFactory.create(
        CODE, OUTPUT, [[[true, false]], [[true], [true]]],
        BUGGY_OUTPUT_TEST_RESULTS, PERFORMANCE_TEST_RESULTS, ERROR_STRING,
        ERROR_INPUT);
      expect(codeEvalResult2.getIndexOfFirstFailedTest(tasks))
        .toEqual({
          taskNum: 0,
          testSuiteNum: 0,
          testNum: 1,
          overallTestNum: 1});

      var codeEvalResult3 = CodeEvalResultObjectFactory.create(
        CODE, OUTPUT, [[[true, true]], [[false], [true]]],
        BUGGY_OUTPUT_TEST_RESULTS, PERFORMANCE_TEST_RESULTS, ERROR_STRING,
        ERROR_INPUT);
      expect(codeEvalResult3.getIndexOfFirstFailedTest(tasks))
        .toEqual({
          taskNum: 1,
          testSuiteNum: 0,
          testNum: 0,
          overallTestNum: 2});

      var codeEvalResult4 = CodeEvalResultObjectFactory.create(
        CODE, OUTPUT, [[[true, true]], [[true], [false]]],
        BUGGY_OUTPUT_TEST_RESULTS, PERFORMANCE_TEST_RESULTS, ERROR_STRING,
        ERROR_INPUT);
      expect(codeEvalResult4.getIndexOfFirstFailedTest(tasks))
        .toEqual({
          taskNum: 1,
          testSuiteNum: 1,
          testNum: 0,
          overallTestNum: 3});

      var codeEvalResult5 = CodeEvalResultObjectFactory.create(
        CODE, OUTPUT, [[[true, false]], [[false], [true]]],
        BUGGY_OUTPUT_TEST_RESULTS, PERFORMANCE_TEST_RESULTS, ERROR_STRING,
        ERROR_INPUT);
      expect(codeEvalResult5.getIndexOfFirstFailedTest(tasks))
        .toEqual({
          taskNum: 0,
          testSuiteNum: 0,
          testNum: 1,
          overallTestNum: 1});

      var codeEvalResult6 = CodeEvalResultObjectFactory.create(
        CODE, OUTPUT, [[[false, false]], [[false], [true]]],
        BUGGY_OUTPUT_TEST_RESULTS, PERFORMANCE_TEST_RESULTS,
        ERROR_STRING, ERROR_INPUT);
      expect(codeEvalResult6.getIndexOfFirstFailedTest(tasks))
        .toEqual({
          taskNum: 0,
          testSuiteNum: 0,
          testNum: 0,
          overallTestNum: 0});

      var codeEvalResult7 = CodeEvalResultObjectFactory.create(
        CODE, [], [], [], [], ERROR_STRING, ERROR_INPUT);
      expect(codeEvalResult7.getIndexOfFirstFailedTest(tasks))
        .toEqual({
          taskNum: 0,
          testSuiteNum: 0,
          testNum: 0,
          overallTestNum: 0});

      var codeEvalResult8 = CodeEvalResultObjectFactory.create(
        CODE, OUTPUT, [[[true, true]]],
        BUGGY_OUTPUT_TEST_RESULTS, PERFORMANCE_TEST_RESULTS,
        ERROR_STRING, ERROR_INPUT);
      expect(codeEvalResult8.getIndexOfFirstFailedTest(tasks))
        .toEqual(null);

      var codeEvalResult9 = CodeEvalResultObjectFactory.create(
        CODE, OUTPUT, [[[true, false]]],
        BUGGY_OUTPUT_TEST_RESULTS, PERFORMANCE_TEST_RESULTS,
        ERROR_STRING, ERROR_INPUT);
      expect(codeEvalResult9.getIndexOfFirstFailedTest(tasks))
        .toEqual({
          taskNum: 0,
          testSuiteNum: 0,
          testNum: 1,
          overallTestNum: 1});

      var codeEvalResult10 = CodeEvalResultObjectFactory.create(
        CODE, OUTPUT, [[[false, true]]],
        BUGGY_OUTPUT_TEST_RESULTS, PERFORMANCE_TEST_RESULTS,
        ERROR_STRING, ERROR_INPUT);
      expect(codeEvalResult10.getIndexOfFirstFailedTest(tasks))
        .toEqual({
          taskNum: 0,
          testSuiteNum: 0,
          testNum: 0,
          overallTestNum: 0});
    });
  });

  describe('getOutputToDisplay', function() {
    it('should correctly get the output to display', function() {
      var tasks = [
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

      var codeEvalResult1 = CodeEvalResultObjectFactory.create(
        CODE, OUTPUT, [[[true, true]], [[true], [true]]],
        BUGGY_OUTPUT_TEST_RESULTS, PERFORMANCE_TEST_RESULTS, ERROR_STRING,
        ERROR_INPUT);
      expect(codeEvalResult1.getOutputToDisplay(tasks))
        .toEqual(OUTPUT[3]);

      var codeEvalResult2 = CodeEvalResultObjectFactory.create(
        CODE, OUTPUT, [[[true, false]], [[true], [true]]],
        BUGGY_OUTPUT_TEST_RESULTS, PERFORMANCE_TEST_RESULTS, ERROR_STRING,
        ERROR_INPUT);
      expect(codeEvalResult2.getOutputToDisplay(tasks))
        .toEqual(OUTPUT[1]);

      var codeEvalResult3 = CodeEvalResultObjectFactory.create(
        CODE, OUTPUT, [[[true, true]], [[false], [true]]],
        BUGGY_OUTPUT_TEST_RESULTS, PERFORMANCE_TEST_RESULTS, ERROR_STRING,
        ERROR_INPUT);
      expect(codeEvalResult3.getOutputToDisplay(tasks))
        .toEqual(OUTPUT[2]);

      var codeEvalResult4 = CodeEvalResultObjectFactory.create(
        CODE, OUTPUT, [[[true, true]], [[true], [false]]],
        BUGGY_OUTPUT_TEST_RESULTS, PERFORMANCE_TEST_RESULTS, ERROR_STRING,
        ERROR_INPUT);
      expect(codeEvalResult4.getOutputToDisplay(tasks))
        .toEqual(OUTPUT[3]);

      var codeEvalResult5 = CodeEvalResultObjectFactory.create(
        CODE, OUTPUT, [[[true, false]], [[false], [true]]],
        BUGGY_OUTPUT_TEST_RESULTS, PERFORMANCE_TEST_RESULTS, ERROR_STRING,
        ERROR_INPUT);
      expect(codeEvalResult5.getOutputToDisplay(tasks))
        .toEqual(OUTPUT[1]);

      var codeEvalResult6 = CodeEvalResultObjectFactory.create(
        CODE, OUTPUT, [[[false, false]], [[false], [true]]],
        BUGGY_OUTPUT_TEST_RESULTS, PERFORMANCE_TEST_RESULTS,
        ERROR_STRING, ERROR_INPUT);
      expect(codeEvalResult6.getOutputToDisplay(tasks))
        .toEqual(OUTPUT[0]);

      var codeEvalResult7 = CodeEvalResultObjectFactory.create(
        CODE, [], [], [], [], ERROR_STRING, ERROR_INPUT);
      expect(codeEvalResult7.getOutputToDisplay(tasks))
        .toEqual('');

      var codeEvalResult8 = CodeEvalResultObjectFactory.create(
        CODE, OUTPUT, [[[true, true]]],
        BUGGY_OUTPUT_TEST_RESULTS, PERFORMANCE_TEST_RESULTS,
        ERROR_STRING, ERROR_INPUT);
      expect(codeEvalResult8.getOutputToDisplay(tasks))
        .toEqual(OUTPUT[1]);

      var codeEvalResult9 = CodeEvalResultObjectFactory.create(
        CODE, OUTPUT, [[[true, false]]],
        BUGGY_OUTPUT_TEST_RESULTS, PERFORMANCE_TEST_RESULTS,
        ERROR_STRING, ERROR_INPUT);
      expect(codeEvalResult9.getOutputToDisplay(tasks))
        .toEqual(OUTPUT[1]);

      var codeEvalResult10 = CodeEvalResultObjectFactory.create(
        CODE, OUTPUT, [[[false, true]]],
        BUGGY_OUTPUT_TEST_RESULTS, PERFORMANCE_TEST_RESULTS,
        ERROR_STRING, ERROR_INPUT);
      expect(codeEvalResult10.getOutputToDisplay(tasks))
        .toEqual(OUTPUT[0]);
    });
  });

  describe('getLastTaskObservedOutputs', function() {
    it('should correctly get last task observed outputs', function() {
      expect(codeEvalResult.getLastTaskObservedOutputs())
        .toEqual([[false, false]]);
    });
  });

  describe('getBuggyOutputTestResults', function() {
    it('should correctly get buggy output test results', function() {
      expect(codeEvalResult.getBuggyOutputTestResults())
      .toEqual(BUGGY_OUTPUT_TEST_RESULTS);
    });
  });

  describe('getPerformanceTestResults', function() {
    it('should correctly get performance test results', function() {
      expect(codeEvalResult.getPerformanceTestResults())
      .toEqual(PERFORMANCE_TEST_RESULTS);
    });
  });

  describe('nullErrorString', function() {
    it('should return null if no error traceback is present', function() {
      expect(codeEvalResult.getErrorString()).toBe(null);
    });
  });
});
