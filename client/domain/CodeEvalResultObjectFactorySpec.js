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
  var codeEvalResult;
  var CODE = "code";
  var OUTPUT = "output";
  var CORRECTNESS_TEST_RESULTS = ["xyz", "xyz", "xyz", "xyz", "xyz"];
  var LAST_TASK_RESULTS = "xyz";
  var BUGGY_OUTPUT_TEST_RESULTS = "buggyOutputTestResults";
  var PERFORMANCE_TEST_RESULTS = "performanceTestResults";
  var ERROR_STRING = null;
  var ERROR_INPUT = "errorInput";

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    CodeEvalResultObjectFactory = $injector.get(
      'CodeEvalResultObjectFactory');
    codeEvalResult = CodeEvalResultObjectFactory.create(CODE, OUTPUT,
      CORRECTNESS_TEST_RESULTS, BUGGY_OUTPUT_TEST_RESULTS,
      PERFORMANCE_TEST_RESULTS, ERROR_STRING, ERROR_INPUT);
  }));

  describe('getOutput', function() {
    it('should correctly get output', function() {
      expect(codeEvalResult.getOutput()).toMatch(OUTPUT);
    });
  });

  describe('getCorrectnessTestResults', function() {
    it('should correctly get correctness test results', function() {
      expect(codeEvalResult.getCorrectnessTestResults())
      .toEqual(CORRECTNESS_TEST_RESULTS);
    });
  });

  describe('getLastTaskResults', function() {
    it('should correctly get last task results', function() {
      expect(codeEvalResult.getLastTaskResults())
      .toMatch(LAST_TASK_RESULTS);
    });
  });

  describe('getBuggyOutputTestResults', function() {
    it('should correctly get buggy output test results', function() {
      expect(codeEvalResult.getBuggyOutputTestResults())
      .toMatch(BUGGY_OUTPUT_TEST_RESULTS);
    });
  });

  describe('getPerformanceTestResults', function() {
    it('should correctly get performance test results', function() {
      expect(codeEvalResult.getPerformanceTestResults())
      .toMatch(PERFORMANCE_TEST_RESULTS);
    });
  });

  describe('nullErrorString', function() {
    it('should return null if no error traceback is present', function() {
      expect(codeEvalResult.getErrorString()).toBe(null);
    });
  });
});

