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
  'PreprocessedCodeObjectFactory', 'ServerHandlerService',
  'EventHandlerService', 'CurrentQuestionService',
  'VARNAME_OBSERVED_OUTPUTS',
  'VARNAME_BUGGY_OUTPUT_TEST_RESULTS', 'VARNAME_PERFORMANCE_TEST_RESULTS',
  'VARNAME_MOST_RECENT_INPUT', 'CODE_EXECUTION_TIMEOUT_SECONDS',
  function(
      $http, CodeEvalResultObjectFactory, ErrorTracebackObjectFactory,
      PreprocessedCodeObjectFactory, ServerHandlerService,
      EventHandlerService, CurrentQuestionService,
      VARNAME_OBSERVED_OUTPUTS,
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

    var _compileCode = function(code) {
      return _runCodeInClient(code, code, null);
    };

    var _runPreprocessedCode = function(preprocessedCodeObject) {
      return _runCodeInClient(
        preprocessedCodeObject.getPreprocessedCodeString(),
        preprocessedCodeObject.getRawCode(),
        preprocessedCodeObject.getSeparator());
    };

    var _runCodeInClient = function(codeToExecute, rawCode, separator) {
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
        return Sk.importMainWithBody('<stdin>', false, codeToExecute, true);
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

        // The output returned from the run is an array where each line of
        // stdout is an entry in the array. Here, the array is converted
        // into one consolidated string where it will later be split into
        // the corresponding test cases.
        var consolidatedOutputString = '';
        for (var i = 0; i < outputLines.length; i++) {
          consolidatedOutputString += outputLines[i];
        }
        var standardizedOutput = _createOutputArray(
          consolidatedOutputString, separator);
        return CodeEvalResultObjectFactory.create(
          codeToExecute, rawCode, standardizedOutput, observedOutputs,
          buggyOutputTestResults, performanceTestResults, null, null, false,
          false);
      }, function(skulptError) {
        var errorInput = null;
        if (Sk.globals.hasOwnProperty(VARNAME_MOST_RECENT_INPUT)) {
          errorInput = Sk.ffi.remapToJs(
            Sk.globals[VARNAME_MOST_RECENT_INPUT]);
        }

        var errorTraceback = ErrorTracebackObjectFactory.fromSkulptError(
          skulptError);
        var errorString = errorTraceback.getErrorString();
        var timeLimitExceeded = errorString.startsWith('TimeLimitError');
        // TODO(eyurko): Find out if a memory limit error is ... possible?
        var memoryLimitExceeded = false;
        return CodeEvalResultObjectFactory.create(
          codeToExecute, rawCode, null, [], [], [], errorTraceback, errorInput,
          timeLimitExceeded, memoryLimitExceeded);
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
            code, code, null, [], [], [], errorTraceback, '', false, false);
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
          code, code, responseData.stdout, null, null, null, errorTraceback,
          null, responseData.time_limit_exceeded,
          responseData.memory_limit_exceeded);
    };

    var _runCodeAsync = function(preprocessedCode) {
      clearOutput();
      var codeToExecute = preprocessedCode.getPreprocessedCodeString();
      var rawCode = preprocessedCode.getRawCode();
      var separator = preprocessedCode.getSeparator();
      var data = {
        code: codeToExecute,
        language: 'python'
      };
      return $http.post('/ajax/run_code', data).then(
        function(response) {
          return _processCodeExecutionServerResponse(
              response.data, codeToExecute, rawCode, separator);
        },
        function() {
          // A server error occurred, so we need to invalidate the session.
          EventHandlerService.createSessionInvalidEvent();

          var errorTraceback = ErrorTracebackObjectFactory.fromServerError();
          return CodeEvalResultObjectFactory.create(
            codeToExecute, rawCode, null, [], [], [], errorTraceback, '',
            false, false);
        }
      );
    };

    var _processCodeExecutionServerResponse = function(
        responseData, codeToExecute, rawCode, separator) {
      if (responseData.stderr.length || responseData.time_limit_exceeded ||
          responseData.memory_limit_exceeded) {
        var errorTraceback = ErrorTracebackObjectFactory.fromPythonError(
          responseData.stderr);
        return CodeEvalResultObjectFactory.create(
            codeToExecute, rawCode, null, [], [], [], errorTraceback,
            responseData[VARNAME_MOST_RECENT_INPUT],
            responseData.time_limit_exceeded,
            responseData.memory_limit_exceeded);
      } else if (responseData.results) {
        var standardizedOutput = _createOutputArray(
          responseData.stdout, separator);
        return CodeEvalResultObjectFactory.create(
            codeToExecute, rawCode, standardizedOutput,
            responseData.results[VARNAME_OBSERVED_OUTPUTS],
            responseData.results[VARNAME_BUGGY_OUTPUT_TEST_RESULTS],
            responseData.results[VARNAME_PERFORMANCE_TEST_RESULTS],
            null, null, responseData.time_limit_exceeded,
            responseData.memory_limit_exceeded);
      } else {
        throw Error('A server error occurred. Please try again.');
      }
    };

    // Converts the consolidated output string into an array where the
    // i-th entry in the array corresponds to the i-th overall test
    // case.
    var _createOutputArray = function(stdoutString, separator) {
      if (stdoutString.length === 0) {
        return [];
      }
      // If there are performance tests, stdoutString will have the stdout
      // resulting from the performance tests at the end. Here, the stdout
      // is cleaned up by removing any extraneous output that comes after
      // the last correctness test case.
      var lastSeparatorIndex = stdoutString.lastIndexOf(separator);
      var cleanedStdoutString = stdoutString.slice(
          0, lastSeparatorIndex);
      return cleanedStdoutString.split(separator + '\n');
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
          return _compileCode(code);
        }
      },
      /**
       * Asynchronously runs the Python code against the given tests for that
       * task.
       *
       * @param {PreprocessedCode} preprocessedCode
       * @returns {Promise}
       */
      runCodeAsync: function(preprocessedCode) {
        if (ServerHandlerService.doesServerExist()) {
          return _runCodeAsync(preprocessedCode);
        } else {
          return _runPreprocessedCode(preprocessedCode);
        }
      },
      _processCodeCompilationServerResponse: (
        _processCodeCompilationServerResponse),
      _processCodeExecutionServerResponse: _processCodeExecutionServerResponse,
      _createOutputArray: _createOutputArray
    };
  }
]);
