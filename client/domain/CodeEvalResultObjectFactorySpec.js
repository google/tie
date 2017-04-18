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

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    CodeEvalResultObjectFactory = $injector.get(
      'CodeEvalResultObjectFactory');
  }));

  describe('getOutput', function() {
    it('should correctly get output', function() {
      var codeEvalResult = CodeEvalResultObjectFactory.create("code", "output",
       "correctnessTestResults", "buggyOutputTestResults",
       "performanceTestResults", "errorTraceback", "errorInput");
      expect(codeEvalResult.getOutput()).toMatch("output");
    });
  });

  describe('getCorrectnessTestResults', function() {
    it('should correctly get correctness test results', function() {
      var codeEvalResult = CodeEvalResultObjectFactory.create("code", "output",
       "correctnessTestResults", "buggyOutputTestResults",
       "performanceTestResults", "errorTraceback", "errorInput");
      expect(codeEvalResult.getCorrectnessTestResults())
      .toMatch("correctnessTestResults");
    });
  });

  describe('getBuggyOutputTestResults', function() {
    it('should correctly get buggy output test results', function() {
      var codeEvalResult = CodeEvalResultObjectFactory.create("code", "output",
       "correctnessTestResults", "buggyOutputTestResults",
       "performanceTestResults", "errorTraceback", "errorInput");
      expect(codeEvalResult.getBuggyOutputTestResults())
      .toMatch("buggyOutputTestResults");
    });
  });

  describe('getPerformanceTestResults', function() {
    it('should correctly get performance test results', function() {
      var codeEvalResult = CodeEvalResultObjectFactory.create("code", "output",
       "correctnessTestResults", "buggyOutputTestResults",
       "performanceTestResults", "errorTraceback", "errorInput");
      expect(codeEvalResult.getPerformanceTestResults())
      .toMatch("performanceTestResults");
    });
  });

  describe('nullErrorString', function() {
    it('should return null if no error traceback', function() {
      var codeEvalResult = CodeEvalResultObjectFactory.create("code", "output",
       "correctnessTestResults", "buggyOutputTestResults",
       "performanceTestResults", null, "errorInput");
      expect(codeEvalResult.getErrorString()).toBe(null);
    });
  });
});
