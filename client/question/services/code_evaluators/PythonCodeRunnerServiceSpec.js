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
  var $httpBackend;
  var PythonCodeRunnerService;
  var ServerHandlerService;
  var responseDict = {};
  var VARNAME_OBSERVED_OUTPUTS = 'correctness_test_results';
  var VARNAME_BUGGY_OUTPUT_TEST_RESULTS = 'buggy_output_test_results';
  var VARNAME_PERFORMANCE_TEST_RESULTS = 'performance_test_results';
  var VARNAME_MOST_RECENT_INPUT = 'most_recent_input';
  var HTTP_STATUS_CODE_OK = 200;

  beforeEach(module('tie', function($provide) {
    $provide.constant('SERVER_URL', 'http://katamari.com');
  }));
  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');
    PythonCodeRunnerService = $injector.get('PythonCodeRunnerService');
    ServerHandlerService = $injector.get('ServerHandlerService');
    responseDict.stdout = 'hello world!';
    responseDict.stderr = '';
    responseDict.results = {};
    responseDict.results[VARNAME_MOST_RECENT_INPUT] = 'a b c d e f f';
    responseDict.results[VARNAME_OBSERVED_OUTPUTS] = [
      ['TEST', 'TEST', 'TEST', 'TEST', 'TEST', 'TEST', 'TEST', 'TEST']];
    responseDict.results[VARNAME_BUGGY_OUTPUT_TEST_RESULTS] = [
      [false, false, false]];
    responseDict.results[VARNAME_PERFORMANCE_TEST_RESULTS] = [
      ['linear']];
  }));

  describe('compileCodeAsync', function() {

    it('sends a POST request to the backend to compile code', function() {
      var code = [
        'def myFunction(arg):',
        '    result = arg.rstrip()',
        '    return result',
        ''
      ].join('\n');
      $httpBackend.expectPOST('/ajax/compile_code').respond(
        HTTP_STATUS_CODE_OK, {});
      spyOn(ServerHandlerService, 'doesServerExist').and.returnValue(true);
      spyOn(PythonCodeRunnerService,
        '_processCodeCompilationServerResponse').and.returnValue(null);
      PythonCodeRunnerService.compileCodeAsync(code);
      $httpBackend.flush();
    });
  });

  describe('runCodeAsync', function() {

    it('sends a POST request to the backend to run code', function() {
      var code = [
        'def myFunction(arg):',
        '    result = arg.rstrip()',
        '    return result',
        ''
      ].join('\n');
      $httpBackend.expectPOST('/ajax/run_code').respond(
        HTTP_STATUS_CODE_OK, responseDict);
      spyOn(ServerHandlerService, 'doesServerExist').and.returnValue(true);
      spyOn(PythonCodeRunnerService,
        '_processCodeExecutionServerResponse').and.returnValue(null);
      PythonCodeRunnerService.runCodeAsync(code);
      $httpBackend.flush();
    });
  });

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
          responseDict.results[VARNAME_PERFORMANCE_TEST_RESULTS]);
      expect(codeEvalResult.getObservedOutputs()).toEqual(
          responseDict.results[VARNAME_OBSERVED_OUTPUTS]);
      expect(codeEvalResult.getBuggyOutputTestResults()).toEqual(
          responseDict.results[VARNAME_BUGGY_OUTPUT_TEST_RESULTS]);
    });

    it('returns a CodeEvalResult if stderr is not empty', function() {
      var code = [
        'def yourFunction(arg):',
        '    result = arg.rstrip()',
        '    return result',
        ''
      ].join('\n');
      responseDict.stderr = [
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
      expect(codeEvalResult.getObservedOutputs()).toEqual([]);
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
      responseDict.results = null;
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
      expect(codeEvalResult.getObservedOutputs()).toEqual(null);
      expect(codeEvalResult.getBuggyOutputTestResults()).toEqual(null);
      expect(codeEvalResult.getErrorInput()).toEqual(null);
    });
  });
});
