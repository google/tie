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
 * @fileoverview Unit tests for the PythonCodeRunnerService.
 */
describe('PythonCodeRunnerService', function() {
  var PythonCodeRunnerService;
  var responseDict = {};
  var VARNAME_CORRECTNESS_TEST_RESULTS = 'correctness_test_results';
  var VARNAME_BUGGY_OUTPUT_TEST_RESULTS = 'buggy_output_test_results';
  var VARNAME_PERFORMANCE_TEST_RESULTS = 'performance_test_results';
  var VARNAME_MOST_RECENT_INPUT = 'most_recent_input';

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    PythonCodeRunnerService = $injector.get(
      'PythonCodeRunnerService');
    responseDict.data = {};
    responseDict.data.stdout = 'hello world!';
    responseDict.data.stderr = '';
    responseDict.data.results = {};
    responseDict.data.results[VARNAME_MOST_RECENT_INPUT] = 'a b c d e f f';
    responseDict.data.results[VARNAME_CORRECTNESS_TEST_RESULTS] = [
      ['TEST', 'TEST', 'TEST', 'TEST', 'TEST', 'TEST', 'TEST', 'TEST']];
    responseDict.data.results[VARNAME_BUGGY_OUTPUT_TEST_RESULTS] = [
      [false, false, false]];
    responseDict.data.results[VARNAME_PERFORMANCE_TEST_RESULTS] = [
      ['linear']];
  }));

  describe('_processCodeExecutionServerResponse', function() {

    it('returns a CodeEvalResult based on responseDict when run', function() {
      var code = [
        'def myFunction(arg):',
        '    result = arg.rstrip()',
        '    return result',
        ''
      ].join('\n');
      var codeEvalResult = (
        PythonCodeRunnerService._processCodeExecutionServerResponse(
          responseDict, code));
      expect(codeEvalResult.getPerformanceTestResults()).toEqual(
          responseDict.data.results[VARNAME_PERFORMANCE_TEST_RESULTS]);
      expect(codeEvalResult.getCorrectnessTestResults()).toEqual(
          responseDict.data.results[VARNAME_CORRECTNESS_TEST_RESULTS]);
      expect(codeEvalResult.getBuggyOutputTestResults()).toEqual(
          responseDict.data.results[VARNAME_BUGGY_OUTPUT_TEST_RESULTS]);
    });

    it('returns a CodeEvalResult if stderr is not empty', function() {
      var code = [
        'def yourFunction(arg):',
        '    result = arg.rstrip()',
        '    return result',
        ''
      ].join('\n');
      responseDict.data.stderr = [
        'Traceback (most recent call last):',
        '  File "main.py", line 54, in <module>',
        '    StudentCode().fmcc, all_tasks_test_inputs[0][0]))',
        '  File "main.py", line 19, in runTest',
        '    output = func(input)',
        '  File "main.py", line 28, in fmcc',
        '    return 2 / 0',
        'ZeroDivisionError: integer division or modulo by zero'
      ].join('\n');
      var codeEvalResult = (
        PythonCodeRunnerService._processCodeExecutionServerResponse(
          responseDict, code));
      expect(codeEvalResult.getPerformanceTestResults()).toEqual([]);
      expect(codeEvalResult.getCorrectnessTestResults()).toEqual([]);
      expect(codeEvalResult.getBuggyOutputTestResults()).toEqual([]);
      expect(codeEvalResult.getErrorString()).toEqual(
          'ZeroDivisionError: integer division or modulo by zero on line 28');
    });

    it('throws an error for a bad urlFragment', function() {
      var code = [
        'def yourFunction(arg):',
        '    result = arg.rstrip()',
        '    return result',
        ''
      ].join('\n');
      responseDict.data.results = null;
      expect(function() {
        PythonCodeRunnerService._processCodeExecutionServerResponse(
          responseDict, code);
      }).toThrow(
        new Error('A server error occurred. Please try again.'));
    });
  });

  describe('_processCodeCompilationServerResponse', function() {

    it('returns a CodeEvalResult for compile-only mode', function() {
      var code = [
        'def yourFunction(arg):',
        '    result = arg.rstrip()',
        '    return result',
        ''
      ].join('\n');
      var codeEvalResult = (
        PythonCodeRunnerService._processCodeCompilationServerResponse(
          responseDict, code));
      expect(codeEvalResult.getPerformanceTestResults()).toEqual(null);
      expect(codeEvalResult.getCorrectnessTestResults()).toEqual(null);
      expect(codeEvalResult.getBuggyOutputTestResults()).toEqual(null);
      expect(codeEvalResult.getErrorInput()).toEqual(null);
    });
  });
});
