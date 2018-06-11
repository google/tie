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
 * @fileoverview Service for executing Python code snippets.
 */

tie.factory('PythonCodeRunnerService', [
  '$http', 'CodeEvalResultObjectFactory', 'ErrorTracebackObjectFactory',
  'ServerHandlerService', 'EventHandlerService', 'CurrentQuestionService',
  'StdOutSeparatorService', 'VARNAME_OBSERVED_OUTPUTS',
  'VARNAME_BUGGY_OUTPUT_TEST_RESULTS', 'VARNAME_PERFORMANCE_TEST_RESULTS',
  'VARNAME_MOST_RECENT_INPUT', 'CODE_EXECUTION_TIMEOUT_SECONDS',
  function(
      $http, CodeEvalResultObjectFactory, ErrorTracebackObjectFactory,
      ServerHandlerService, EventHandlerService, CurrentQuestionService,
      StdOutSeparatorService, VARNAME_OBSERVED_OUTPUTS,
      VARNAME_BUGGY_OUTPUT_TEST_RESULTS, VARNAME_PERFORMANCE_TEST_RESULTS,
      VARNAME_MOST_RECENT_INPUT, CODE_EXECUTION_TIMEOUT_SECONDS) {
    /** @type {number} @const */
    var SECONDS_TO_MILLISECONDS = 1000;
    /**
     * The output from running the code as strings with each
     * line taking one entry.
     *
     * @type {number}
     * */
    var outputLines = [];

    /**
     * Removes all entries from the outputLines array.
     */
    var clearOutput = function() {
      outputLines.length = 0;
    };

    /**
     * Adds the given line to the outputLines array.
     *
     * @param {string} line
     */
    var addOutputLine = function(line) {
      outputLines.push(line);
    };

    var _runCodeInClient = function(code) {
      clearOutput();
      Sk.configure({
        output: addOutputLine,
        execLimit: CODE_EXECUTION_TIMEOUT_SECONDS * SECONDS_TO_MILLISECONDS,
        read: function(name) {
          // This bit is necessary to import Python stdlib modules, like time.
          if (!Sk.builtinFiles.files.hasOwnProperty(name)) {
            throw Error('Could not find module ' + name);
          }
          return Sk.builtinFiles.files[name];
        }
      });
      return Sk.misceval.asyncToPromise(function() {
        return Sk.importMainWithBody('<stdin>', false, code, true);
      }).then(function() {
        var observedOutputs = [];
        var buggyOutputTestResults = [];
        var performanceTestResults = [];
        // These checks retrieve the values of Skulpt's representation of
        // the global Python 'test results' variables (which Skulpt stores in
        // Sk.globals), and maps each of them to a JS value for later
        // comparison against the "correct output" specification.
        if (Sk.globals.hasOwnProperty(VARNAME_OBSERVED_OUTPUTS)) {
          observedOutputs = Sk.ffi.remapToJs(
            Sk.globals[VARNAME_OBSERVED_OUTPUTS]);
        }
        if (Sk.globals.hasOwnProperty(VARNAME_BUGGY_OUTPUT_TEST_RESULTS)) {
          buggyOutputTestResults = Sk.ffi.remapToJs(
            Sk.globals[VARNAME_BUGGY_OUTPUT_TEST_RESULTS]);
        }
        if (Sk.globals.hasOwnProperty(VARNAME_PERFORMANCE_TEST_RESULTS)) {
          performanceTestResults = Sk.ffi.remapToJs(
            Sk.globals[VARNAME_PERFORMANCE_TEST_RESULTS]);
        }

        // The run was successful.
        var codeEvalResult = CodeEvalResultObjectFactory.create(
          code, outputLines.join('\n'), observedOutputs,
          buggyOutputTestResults, performanceTestResults, null, null);
        var question = CurrentQuestionService.getCurrentQuestion();
        if(!question) {
          return codeEvalResult;
        }
        var tasks = question.getTasks();
        var testToDisplay = codeEvalResult.getIndexOfFirstFailedTest(tasks);
        outputLines = StdOutSeparatorService.getTestCaseOutputInClient(
          outputLines, testToDisplay);

        return codeEvalResult;
      }, function(skulptError) {
        var errorInput = null;
        if (Sk.globals.hasOwnProperty(VARNAME_MOST_RECENT_INPUT)) {
          errorInput = Sk.ffi.remapToJs(
            Sk.globals[VARNAME_MOST_RECENT_INPUT]);
        }

        var errorTraceback = ErrorTracebackObjectFactory.fromSkulptError(
          skulptError);
        return CodeEvalResultObjectFactory.create(
          code, '', [], [], [], errorTraceback, errorInput);
      });
    };

    var _compileCodeAsync = function(code) {
      clearOutput();
      var data = {
        code: code,
        language: 'python'
      };
      return $http.post('/ajax/compile_code', data).then(
        function(response) {
          return _processCodeCompilationServerResponse(response.data, code);
        },
        function() {
          // A server error occurred, so we need to invalidate the session.
          EventHandlerService.createSessionInvalidEvent();

          var errorTraceback = ErrorTracebackObjectFactory.fromServerError();
          return CodeEvalResultObjectFactory.create(
            code, '', [], [], [], errorTraceback, '');
        }
      );
    };

    var _processCodeCompilationServerResponse = function(responseData, code) {
      var errorTraceback = null;
      if (responseData.stderr) {
        errorTraceback = ErrorTracebackObjectFactory.fromPythonError(
          responseData.stderr);
      }
      return CodeEvalResultObjectFactory.create(
          code, responseData.stdout, null, null, null, errorTraceback, null);
    };

    var _runCodeAsync = function(code) {
      clearOutput();
      var data = {
        code: code,
        language: 'python'
      };
      return $http.post('/ajax/run_code', data).then(
        function(response) {
          return _processCodeExecutionServerResponse(response.data, code);
        },
        function() {
          // A server error occurred, so we need to invalidate the session.
          EventHandlerService.createSessionInvalidEvent();

          var errorTraceback = ErrorTracebackObjectFactory.fromServerError();
          return CodeEvalResultObjectFactory.create(
            code, '', [], [], [], errorTraceback, '');
        }
      );
    };

    var _processCodeExecutionServerResponse = function(responseData, code) {
      if (responseData.stderr.length) {
        var errorTraceback = ErrorTracebackObjectFactory.fromPythonError(
          responseData.stderr);
        return CodeEvalResultObjectFactory.create(
            code, '', [], [], [], errorTraceback,
            responseData[VARNAME_MOST_RECENT_INPUT]);
      } else if (responseData.results) {
        var codeEvalResult = CodeEvalResultObjectFactory.create(
            code, responseData.stdout,
            responseData.results[VARNAME_OBSERVED_OUTPUTS],
            responseData.results[VARNAME_BUGGY_OUTPUT_TEST_RESULTS],
            responseData.results[VARNAME_PERFORMANCE_TEST_RESULTS],
            null, null);
        var question = CurrentQuestionService.getCurrentQuestion();
        if (!question) {
          return CodeEvalResult;
        }
        var tasks = question.getTasks();
        var testToDisplay = codeEvalResult.getIndexOfFirstFailedTask(tasks);
        var stdOutToDisplay = StdOutSeparatorService.getTestCaseOutput(
          responseData.stdout, testToDisplay);
          
        return codeEvalResult;
      } else {
        throw Error('A server error occurred. Please try again.');
      }
    };

    return {
      /**
       * Asynchronously compiles the given Python code.
       *
       * @param {string} code
       * @returns {Promise}
       */
      compileCodeAsync: function(code) {
        if (ServerHandlerService.doesServerExist()) {
          return _compileCodeAsync(code);
        } else {
          return _runCodeInClient(code);
        }
      },
      /**
       * Asynchronously runs the Python code against the given tests for that
       * task.
       *
       * @param {string} code
       * @returns {Promise}
       */
      runCodeAsync: function(code) {
        if (ServerHandlerService.doesServerExist()) {
          return _runCodeAsync(code);
        } else {
          return _runCodeInClient(code);
        }
      },
      _processCodeCompilationServerResponse: (
        _processCodeCompilationServerResponse),
      _processCodeExecutionServerResponse: _processCodeExecutionServerResponse
    };
  }
]);
