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
  'CLASS_NAME_AUXILIARY_CODE', 'CLASS_NAME_STUDENT_CODE', 'SYSTEM_CODE',
  'VARNAME_CORRECTNESS_TEST_RESULTS', 'VARNAME_BUGGY_OUTPUT_TEST_RESULTS',
  'VARNAME_PERFORMANCE_TEST_RESULTS', 'VARNAME_MOST_RECENT_INPUT',
  function(
      CLASS_NAME_AUXILIARY_CODE, CLASS_NAME_STUDENT_CODE, SYSTEM_CODE,
      VARNAME_CORRECTNESS_TEST_RESULTS, VARNAME_BUGGY_OUTPUT_TEST_RESULTS,
      VARNAME_PERFORMANCE_TEST_RESULTS, VARNAME_MOST_RECENT_INPUT) {
    var PYTHON_FUNCTION_DEF_REGEX = new RegExp(
      'def\\s+([A-Za-z_][A-Za-z_0-9]*)\\s*\\(', 'g');
    var VARNAME_TEST_INPUTS = 'test_inputs';
    var START_INDENT = '    ';

    var SMALL_INPUT_SIZE = 10;
    var LARGE_INPUT_SIZE = 100;
    var UPPER_BOUND_RATIO_IF_LINEAR = (LARGE_INPUT_SIZE / SMALL_INPUT_SIZE) * 3;

    var _jsonVariableToPython = function(jsonVariable) {
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
      } else if (typeof jsonVariable == 'boolean') {
        return jsonVariable ? 'True' : 'False';
      } else if (Array.isArray(jsonVariable)) {
        // We have to recursively convert the array's elements to Python variables.
        var pythonElements = jsonVariable.map(function(arrayElement) {
          return _jsonVariableToPython(arrayElement);
        });
        return '[' + pythonElements.join(', ') + ']';
      } else {
        throw Error('Only string, array, and boolean inputs are supported.');
      }
    };

    // Transforms a bunch of functions into a bunch of instance methods, and
    // indents them. This results in code that looks like a class, except that
    // it does not have the class name header.
    //
    // NOTE TO DEVELOPERS: This function must preserve the number of lines in
    // the code.
    var _transformCodeToInstanceMethods = function(code, wrapperClassName) {
      code = _addClassWrappingToHelperFunctions(code, wrapperClassName, true);
      var codeLines = code.trim().split('\n');
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
      return subsequentLines.join('\n');
    };

    // Adds support for helper functions in student code by
    // dynamically inserting the specified class name into their code
    // during the preprocessing phase, allowing it to run normally without
    // any indication on the student side that this is happening.
    //
    // NOTE TO DEVELOPERS: This function must preserve the number of lines in
    // the code.
    var _addClassWrappingToHelperFunctions = function(
        code, wrapperClassName, addInstanceWrapping) {
      var functionPrefix = wrapperClassName;
      if (addInstanceWrapping) {
        functionPrefix += '()';
      }
      functionPrefix += '.';
      while (true) {
        // Returns ['matching string', 'capture group']
        var regexResult = PYTHON_FUNCTION_DEF_REGEX.exec(code);
        if (!regexResult) {
          return code;
        }
        var matchingString = regexResult[0];
        var functionName = regexResult[1];

        // Do not modify inner functions.
        var matchIndex = code.indexOf(matchingString);
        if (matchIndex > 0 && code[matchIndex - 1] !== '\n') {
          continue;
        }

        // We should make sure that we don't append our class name to
        // the student's function definition.
        var functionNameStart = (code.indexOf(matchingString) +
          matchingString.indexOf(functionName));
        var lastFunctionNameLocation = 0;
        while (true) {
          var codeToAdd = '';
          lastFunctionNameLocation = code.indexOf(
            functionName, lastFunctionNameLocation);
          if (lastFunctionNameLocation === -1) {
            break;
          }
          if (lastFunctionNameLocation !== functionNameStart) {
            codeToAdd = functionPrefix;
            code = (code.slice(0, lastFunctionNameLocation) + codeToAdd +
              code.slice(lastFunctionNameLocation, code.length));
            // Since we're inserting text, we may need to
            // "move" up starting locations by the same amount.
            if (lastFunctionNameLocation < functionNameStart){
              functionNameStart += codeToAdd.length;
            }
            if (lastFunctionNameLocation <
              PYTHON_FUNCTION_DEF_REGEX.lastIndex) {
              PYTHON_FUNCTION_DEF_REGEX.lastIndex += codeToAdd.length;
            }
          }
          // This one needs to get moved forward at least an extra character
          // to find the next available string.
          lastFunctionNameLocation += codeToAdd.length + 1;
        }
      }
      return code;
    };

    var _generateCorrectnessTestCode = function(
        correctnessTests, inputFunctionName, mainFunctionName, outputFunctionName) {
      var qualifiedMainFunctionName = (
        CLASS_NAME_STUDENT_CODE + '().' + mainFunctionName);

      var pythonInputs = correctnessTests.map(function(test) {
        return _jsonVariableToPython(test.getInput());
      });

      var testCode = [
        VARNAME_TEST_INPUTS + ' = [' + pythonInputs.join(', ') + ']',
        '',
        VARNAME_CORRECTNESS_TEST_RESULTS + ' = []',
      ].join('\n');



      for (var i = 0; i < correctnessTests.length; i++) {
        var testInputCode = (
          inputFunctionName ?
          inputFunctionName + '(' + VARNAME_TEST_INPUTS + '[' + i + '])' + ')' 
          : VARNAME_TEST_INPUTS + '[' + i + '])');
        var testRunCode = (
          'System.runTest(' + qualifiedMainFunctionName + ', ' +
          testInputCode);
        var testOutputCode = (
          outputFunctionName ?
          outputFunctionName + '(' + testRunCode + ')' : testRunCode);

        testCode += (
          '\n' +
          VARNAME_CORRECTNESS_TEST_RESULTS + '.append(' + testOutputCode + ')');
      };
      return testCode;
    };

    var _generateBuggyOutputTestCode = function(
        buggyOutputTests, inputFunctionName, outputFunctionName) {
      // NOTE: This must be run after the correctness tests, since it assumes
      // that the test inputs and correctness test results already exist.
      // TODO(sll): Cache the results of running the buggy code, so that they
      // don't have to be recomputed for every run.
      var testInputCode = inputFunctionName ? inputFunctionName + '(test_input)' : 'test_input'
      var testRunCode = 'System.runTest(func, ' + testInputCode + ')';
      var testOutputCode = (
        outputFunctionName ?
        outputFunctionName + '(' + testRunCode + ')' : testRunCode);

      var fullTestCode = [
        'def matches_buggy_function(func):',
        '    buggy_results = []',
        '    for test_input in test_inputs:',
        '        buggy_results.append(' + testOutputCode + ')',
        '    return buggy_results == ' + VARNAME_CORRECTNESS_TEST_RESULTS,
        '',
        VARNAME_BUGGY_OUTPUT_TEST_RESULTS + ' = []',
        ''
      ].join('\n');
      buggyOutputTests.forEach(function(buggyOutputTest) {
        var qualifiedBuggyFunctionName = (
          buggyOutputTest.getBuggyFunctionName());

        fullTestCode += (
          VARNAME_BUGGY_OUTPUT_TEST_RESULTS +
          '.append(matches_buggy_function(' +
          qualifiedBuggyFunctionName + '))\n');
      });
      return fullTestCode;
    };

    var _generatePerformanceTestCode = function(performanceTests) {
      var testCode = '';

      performanceTests.forEach(function(test, index) {
        var qualifiedEvaluationFunctionName = (
          CLASS_NAME_STUDENT_CODE + '().' + test.getEvaluationFunctionName());
        var qualifiedTransformationFunctionName = (
          test.getTransformationFunctionName());
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
            _jsonVariableToPython(test.getInputDataAtom()) + '))')
        ].join('\n');
      });

      return testCode;
    };

    return {
      preprocess: function(
          codeSubmission, auxiliaryCode, inputFunctionName, mainFunctionName, outputFunctionName,
          correctnessTests, buggyOutputTests, performanceTests) {
        // Transform the student code (without changing the number of lines) to
        // put it within a class.
        var transformedStudentCode = this._transformCodeToInstanceMethods(
          codeSubmission.getRawCode(), CLASS_NAME_STUDENT_CODE);
        codeSubmission.replace(transformedStudentCode);

        // Prepend the class header and the system code.
        var studentCodeFirstLine = (
          'class ' + CLASS_NAME_STUDENT_CODE + '(object):');
        codeSubmission.prepend(studentCodeFirstLine);
        codeSubmission.prepend(SYSTEM_CODE['python']);
        // This newline separates the student code from the auxiliary code.
        codeSubmission.append('');

        // Append everything else.
        codeSubmission.append([
          auxiliaryCode,
          this._generateCorrectnessTestCode(
            correctnessTests, inputFunctionName, mainFunctionName, outputFunctionName),
          this._generateBuggyOutputTestCode(
            buggyOutputTests, inputFunctionName, outputFunctionName),
          this._generatePerformanceTestCode(performanceTests)
        ].join('\n\n'));
      },

      // These are seams to allow for Karma testing of the private functions.
      // They should not be invoked directly by non-test clients outside this
      // service.
      _addClassWrappingToHelperFunctions: (
        _addClassWrappingToHelperFunctions),
      _generateCorrectnessTestCode: _generateCorrectnessTestCode,
      _generateBuggyOutputTestCode: _generateBuggyOutputTestCode,
      _generatePerformanceTestCode: _generatePerformanceTestCode,
      _jsonVariableToPython: _jsonVariableToPython,
      _transformCodeToInstanceMethods: _transformCodeToInstanceMethods
    };
  }
]);
