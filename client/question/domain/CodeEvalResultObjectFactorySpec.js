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
  var CODE = 'code';
  var OUTPUT = '';
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
        'blah blah not same code', 'some output', [], [], [], '', '');
      expect(
        codeEvalResult.hasSamePreprocessedCodeAs(nonMatchingCodeEvalResult)
      ).toBe(false);
    });
  });

  describe('getOutput', function() {
    it('should correctly get output', function() {
      expect(codeEvalResult.getOutput()).toMatch(OUTPUT);
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

