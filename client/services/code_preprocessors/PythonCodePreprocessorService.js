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
 * @fileoverview Service that preprocesses a submitted Python answer (a set of
 * functions) into a class.
 */

tie.factory('PythonCodePreprocessorService', [
  'CLASS_NAME_AUXILIARY_CODE', 'CLASS_NAME_STUDENT_CODE',
  'VARNAME_CORRECTNESS_TEST_RESULTS', 'VARNAME_BUGGY_OUTPUT_TEST_RESULTS',
  'VARNAME_PERFORMANCE_TEST_RESULTS',
  function(
      CLASS_NAME_AUXILIARY_CODE, CLASS_NAME_STUDENT_CODE,
      VARNAME_CORRECTNESS_TEST_RESULTS, VARNAME_BUGGY_OUTPUT_TEST_RESULTS,
      VARNAME_PERFORMANCE_TEST_RESULTS) {
    var VARNAME_TEST_INPUTS = 'test_inputs';
    var START_INDENT = '    ';
    var SYSTEM_CODE = [
      'import time',
      '',
      'class System(object):',
      '    @classmethod',
      '    def runTest(cls, func, input):',
      '        return func(input)',
      '',
      '    @classmethod',
      '    def extendString(cls, s, length):',
      '        return s * length'
    ].join('\n');

    var SMALL_INPUT_SIZE = 10;
    var LARGE_INPUT_SIZE = 100;
    var UPPER_BOUND_RATIO_IF_LINEAR = (LARGE_INPUT_SIZE / SMALL_INPUT_SIZE) * 3;

    var jsonVariableToPython = function(jsonVariable) {
      // Converts a JSON variable to a Python variable.
      if (typeof jsonVariable === 'string') {
        var pythonStringContent = '';
        for (var i = 0; i < jsonVariable.length; i++) {
          // Escape single quotes and backslashes.
          if (['\\', '\''].indexOf(jsonVariable[i]) !== -1) {
            pythonStringContent += '\\';
          }
          pythonStringContent += jsonVariable[i];
        }

        return "'" + pythonStringContent + "'";
      } else if (Array.isArray(jsonVariable)) {
        // We have to recursively convert the array's elements to Python variables.
        var pythonArrayContent = ''
        if (jsonVariable.length > 0) {
          pythonArrayContent += jsonVariableToPython(jsonVariable[0]);
        }
        for (var i = 1; i < jsonVariable.length; i++) {
          pythonArrayContent += ', '
          pythonArrayContent += jsonVariableToPython(jsonVariable[i]);
        }

        return "[" + pythonArrayContent + "]";
      } else {
        throw Error('Non-string inputs are not yet supported.');
      }
    };

    // Wraps a wrapperClassName class around the series of functions in a
    // given code snippet. We keep these as instance methods (instead of
    // classmethods) because that makes line number tracking less complicated,
    // since classmethods will need an extra '@classmethod' line.
    var _wrapCodeIntoClass = function(code, wrapperClassName) {
      var codeLines = code.trim().split('\n');
      var firstLine = 'class ' + wrapperClassName + '(object):';
      var subsequentLines = codeLines.map(function(line) {
        if (line.indexOf('def') === 0) {
          var leftParenIndex = line.indexOf('(');
          if (leftParenIndex === -1) {
            throw Error('Incomplete line: missing "(" in def statement.');
          }
          return (
            START_INDENT +
            line.slice(0, leftParenIndex + 1) +
            'self, ' +
            line.slice(leftParenIndex + 1));
        } else {
          return START_INDENT + line;
        }
      });
      return firstLine + '\n' + subsequentLines.join('\n');
    };

    var _generateCorrectnessTestCode = function(
        mainFunctionName, correctnessTests) {
      var qualifiedMainFunctionName = (
        CLASS_NAME_STUDENT_CODE + '().' + mainFunctionName);

      var pythonInputs = correctnessTests.map(function(test) {
        return jsonVariableToPython(test.getInput());
      });

      var testCode = [
        VARNAME_TEST_INPUTS + ' = [' + pythonInputs.join(', ') + ']',
        '',
        VARNAME_CORRECTNESS_TEST_RESULTS + ' = []',
      ].join('\n');
      for (var i = 0; i < correctnessTests.length; i++) {
        testCode += (
          '\n' +
          VARNAME_CORRECTNESS_TEST_RESULTS + '.append(System.runTest(' +
          qualifiedMainFunctionName + ', ' + VARNAME_TEST_INPUTS +
          '[' + i + ']))');
      };

      return testCode;
    };

    var _generateBuggyOutputTestCode = function(
        correctnessTests, buggyOutputTests) {
      // NOTE: This must be run after the correctness tests, since it assumes
      // that the test inputs and correctness test results already exist.
      // TODO(sll): Cache the results of running the buggy code, so that they
      // don't have to be recomputed for every run.
      var fullTestCode = [
        'def matches_buggy_function(func):',
        '    buggy_results = []',
        '    for test_input in test_inputs:',
        '        buggy_results.append(System.runTest(func, test_input))',
        '    return buggy_results == ' + VARNAME_CORRECTNESS_TEST_RESULTS,
        '',
        VARNAME_BUGGY_OUTPUT_TEST_RESULTS + ' = []',
        ''
      ].join('\n');
      buggyOutputTests.forEach(function(buggyOutputTest) {
        var qualifiedBuggyFunctionName = (
          buggyOutputTest.getBuggyFunction());

        fullTestCode += (
          VARNAME_BUGGY_OUTPUT_TEST_RESULTS +
          '.append(matches_buggy_function(' +
          qualifiedBuggyFunctionName + '))');
      });

      return fullTestCode;
    };

    var _generatePerformanceTestCode = function(performanceTests) {
      var testCode = '';

      performanceTests.forEach(function(test, index) {
        var qualifiedEvaluationFunctionName = (
          CLASS_NAME_STUDENT_CODE + '().' + test.getEvaluationFunction());
        var qualifiedTransformationFunctionName = (
          test.getTransformationFunction());
        // TODO(eyurko): Make this work for non-linear runtimes, such as log(n).
        // TODO(eyurko): Use linear regression to determine if the data points
        // "look" linear, quadratic, etc, and then provide feedback accordingly.
        testCode = [
          '',
          'def get_test_input(atom, input_size):',
          '    return ' + qualifiedTransformationFunctionName + (
            '(atom, input_size)'),
          '',
          'def run_performance_test(test_input):',
          '    time_array = []',
          '    for input_size in [' + SMALL_INPUT_SIZE + (
            ', ' + LARGE_INPUT_SIZE + ']:'),
          '        start = time.time()',
          '        output = ' + qualifiedEvaluationFunctionName + (
            '(get_test_input(test_input, input_size))'),
          '        finish = time.time() - start',
          '        time_array.append(finish)',
          '    if time_array[1] > ' + UPPER_BOUND_RATIO_IF_LINEAR + (
            ' * time_array[0]:'),
          '        return "not linear"',
          '    return "linear"',
          '',
          VARNAME_PERFORMANCE_TEST_RESULTS + ' = []'
        ].join('\n');
        testCode += '\n' + [
          VARNAME_PERFORMANCE_TEST_RESULTS + '.append(',
          '    run_performance_test(' + (
            jsonVariableToPython(test.getInputDataAtom()) + '))')
        ].join('\n');
      });

      return testCode;
    };

    return {
      preprocessCode: function(
          studentCode, auxiliaryCode, mainFunctionName, correctnessTests,
          buggyOutputTests, performanceTests) {
        return [
          SYSTEM_CODE,
          this._wrapCodeIntoClass(studentCode, CLASS_NAME_STUDENT_CODE),
          auxiliaryCode,
          this._generateCorrectnessTestCode(mainFunctionName, correctnessTests),
          this._generateBuggyOutputTestCode(correctnessTests, buggyOutputTests),
          this._generatePerformanceTestCode(performanceTests)
        ].join('\n\n');
      },

      // These are seams to allow for Karma testing of the private functions.
      // They should not be invoked directly by non-test clients outside this
      // service.
      _generateCorrectnessTestCode: _generateCorrectnessTestCode,
      _generateBuggyOutputTestCode: _generateBuggyOutputTestCode,
      _generatePerformanceTestCode: _generatePerformanceTestCode,
      _wrapCodeIntoClass: _wrapCodeIntoClass,
      jsonVariableToPython: jsonVariableToPython
    };
  }
]);
