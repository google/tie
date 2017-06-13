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
  'VARNAME_PERFORMANCE_TEST_RESULTS',
  'VARNAME_TASK_CORRECTNESS_TEST_RESULTS',
  'VARNAME_TASK_BUGGY_OUTPUT_TEST_RESULTS',
  'VARNAME_TASK_PERFORMANCE_TEST_RESULTS',
  function(
      CLASS_NAME_AUXILIARY_CODE, CLASS_NAME_STUDENT_CODE, SYSTEM_CODE,
      VARNAME_CORRECTNESS_TEST_RESULTS, VARNAME_BUGGY_OUTPUT_TEST_RESULTS,
      VARNAME_PERFORMANCE_TEST_RESULTS,
      VARNAME_TASK_CORRECTNESS_TEST_RESULTS,
      VARNAME_TASK_BUGGY_OUTPUT_TEST_RESULTS,
      VARNAME_TASK_PERFORMANCE_TEST_RESULTS) {
    /**
     * PythonCodePreprocessorService runs a series of utility functions to
     * make the user's Python code submission completely executable.
     */

    /**
     * Used to determine the definition of a function
     * @type {RegExp}
     * @constant
     **/
    var PYTHON_FUNCTION_DEF_REGEX = new RegExp(
        'def\\s+([A-Za-z_][A-Za-z_0-9]*\\s*\\()', 'g');

    /**
     * Used to recognize a valid whitespace.
     * @type {RegExp}
     * @constant
     */
    var VALID_WHITESPACE_REGEX = new RegExp('\\s');

    /**
     * Used to name and correctly retrieve the test inputs.
     * @type {string}
     * @constant
     */
    var VARNAME_ALL_TASKS_TEST_INPUTS = 'all_tasks_test_inputs';

    /**
     * Used to recognize indentation for the Python code.
     * @type {string}
     * @constant
     */
    var START_INDENT = '    ';

    /**
     * Used to recognize the size of a small input.
     *
     * @type {number}
     * @constant
     */
    var SMALL_INPUT_SIZE = 10;

    /**
     * Used to recognize the size of a large input.
     *
     * @type {number}
     * @constant
     */
    var LARGE_INPUT_SIZE = 100;

    /**
     * Used to recognize the upperbound for the ratio between large and small
     * input sizes to determine if the code submission is linear or nonlinear.
     * @type {number}
     * @constant
     */
    var UPPER_BOUND_RATIO_IF_LINEAR = (LARGE_INPUT_SIZE / SMALL_INPUT_SIZE) * 3;

    /**
     * This function converts a JSON variable to a Python variable.
     *
     * @param {*} jsonVariable
     * @returns {*}
     * @private
     */
    var _jsonVariableToPython = function(jsonVariable) {
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
      } else if (typeof jsonVariable === 'boolean') {
        return jsonVariable ? 'True' : 'False';
      } else if (typeof jsonVariable === 'number') {
        return parseFloat(jsonVariable);
      } else if (Array.isArray(jsonVariable)) {
        // We have to recursively convert the array's elements to Python
        // variables.
        var pythonElements = jsonVariable.map(function(arrayElement) {
          return _jsonVariableToPython(arrayElement);
        });
        return '[' + pythonElements.join(', ') + ']';
      } else {
        throw Error('Only string, array, and boolean inputs are supported.');
      }
    };


    /**
     * Transforms a bunch of functions into a bunch of instance methods, and
     * indents them. This results in code that looks like a class, except that
     * it does not have the class name header.
     *
     * *NOTE TO DEVELOPERS:* This function must preserve the number of lines in
     * the code.
     *
     * @param {string} code
     * @param {string} wrapperClassName
     * @private
     */
    var _transformCodeToInstanceMethods = function(code, wrapperClassName) {
      var wrappedCode = _addClassWrappingToHelperFunctions(
        code, wrapperClassName, true);
      var codeLines = wrappedCode.trim().split('\n');
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


    /**
     * Adds support for helper functions in student code by
     * dynamically inserting the specified class name into their code
     * during the preprocessing phase, allowing it to run normally without
     * any indication on the student side that this is happening.
     *
     * *NOTE TO DEVELOPERS:* This function must preserve the number of lines in
     * the code.
     *
     * @param {string} code
     * @param {string} wrapperClassName
     * @param {boolean} addInstanceWrapping
     * @private
     */
    var _addClassWrappingToHelperFunctions = function(
        code, wrapperClassName, addInstanceWrapping) {
      var functionPrefix = wrapperClassName;
      if (addInstanceWrapping) {
        functionPrefix += '()';
      }
      functionPrefix += '.';

      var remainingCode = code;
      while (true) {
        // Returns ['matching string', 'capture group']
        var regexResult = PYTHON_FUNCTION_DEF_REGEX.exec(remainingCode);
        if (!regexResult) {
          return remainingCode;
        }
        var matchingString = regexResult[0];
        var functionNameWithParen = regexResult[1];
        var functionName = functionNameWithParen.substring(
          0, functionNameWithParen.length - 1).trim();

        // Do not modify inner functions.
        var matchIndex = remainingCode.indexOf(matchingString);
        if (matchIndex > 0 && remainingCode[matchIndex - 1] !== '\n') {
          continue;
        }

        // We should make sure that we don't append our class name to
        // the student's function definition.
        var functionNameStart = (remainingCode.indexOf(matchingString) +
          matchingString.indexOf(functionNameWithParen));
        var lastFunctionNameLocation = 0;
        while (true) {
          var codeToAdd = '';
          lastFunctionNameLocation = remainingCode.indexOf(
            functionName, lastFunctionNameLocation);
          if (lastFunctionNameLocation === -1) {
            break;
          }
          if (lastFunctionNameLocation !== functionNameStart) {
            var whitespaceCheckLocation = (
              lastFunctionNameLocation + functionName.length);
            // We assume we found the matched function, but we might have found
            // a similarly-named other function / variable. This means that we
            // need to check until the parenthesis to make sure that there is
            // only whitespace, not other text (encode  () vs. encoded ()).
            if (!_checkMatchedFunctionForWhitespace(
              remainingCode, whitespaceCheckLocation)) {
              lastFunctionNameLocation++;
              continue;
            }
            codeToAdd = functionPrefix;
            remainingCode = (
              remainingCode.slice(0, lastFunctionNameLocation) + codeToAdd +
              remainingCode.slice(
                lastFunctionNameLocation, remainingCode.length)
            );
            // Since we're inserting text, we may need to
            // "move" up starting locations by the same amount.
            if (lastFunctionNameLocation < functionNameStart) {
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
    };

    /**
     * Checks if the function that has been matched has any whitespace.
     *
     * @param {string} code
     * @param {string} startingLocation
     * @returns {boolean}
     * @private
     */
    var _checkMatchedFunctionForWhitespace = function(
        code, startingLocation) {
      var currentLocation = startingLocation;
      // We can safely assume there's a left paren because we matched it
      // with the regular expression.
      while (code[currentLocation] !== '(') {
        var isWhitespace = _isWhitespaceChar(code[currentLocation]);
        currentLocation++;
        if (!isWhitespace) {
          return false;
        }
      }
      return true;
    };

    /**
     * Checks if the given string is a valid whitespace character.
     *
     * @param {string} c
     * @returns {boolean}
     * @private
     */
    var _isWhitespaceChar = function(c) {
      return VALID_WHITESPACE_REGEX.test(c);
    };

    /**
     * Creates and returns the code necessary to run all correctness tests.
     *
     * @param {Array} allTasksCorrectnessTests
     * @param {Array} allTasksInputFunctionNames
     * @param {Array} allTasksMainFunctionNames
     * @param {Array} allTasksOutputFunctionNames
     * @returns {string}
     * @private
     */
    var _generateCorrectnessTestCode = function(
        allTasksCorrectnessTests, allTasksInputFunctionNames,
        allTasksMainFunctionNames, allTasksOutputFunctionNames) {
      var pythonInputs = allTasksCorrectnessTests.map(function(tests) {
        return tests.map(function(test) {
          return _jsonVariableToPython(test.getInput());
        });
      });

      var testCode = [
        VARNAME_ALL_TASKS_TEST_INPUTS +
          ' = [' + pythonInputs.map(function(tests) {
            return '[' + tests.join(', ') + ']';
          }).join(', ') + ']',
        '',
        VARNAME_CORRECTNESS_TEST_RESULTS + ' = []'
      ].join('\n');

      for (var i = 0; i < allTasksCorrectnessTests.length; i++) {
        var qualifiedMainFunctionName = (
            CLASS_NAME_STUDENT_CODE + '().' + allTasksMainFunctionNames[i]);
        var inputFunctionName = allTasksInputFunctionNames[i];
        var outputFunctionName = allTasksOutputFunctionNames[i];

        var oneTaskCorrectnessTests = allTasksCorrectnessTests[i];
        testCode += ('\n' + VARNAME_TASK_CORRECTNESS_TEST_RESULTS + ' = []');

        for (var j = 0; j < oneTaskCorrectnessTests.length; j++) {
          var testInputCode = (
            inputFunctionName ?
            (inputFunctionName + '(' + VARNAME_ALL_TASKS_TEST_INPUTS +
             '[' + i + '][' + j + '])') :
            VARNAME_ALL_TASKS_TEST_INPUTS + '[' + i + '][' + j + ']');
          var testRunCode = (
            'System.runTest(\n    ' + qualifiedMainFunctionName + ', ' +
            testInputCode + ')');
          var testOutputCode = (
            outputFunctionName ?
            outputFunctionName + '(' + testRunCode + ')' : testRunCode);

          testCode += (
            '\n' +
            VARNAME_TASK_CORRECTNESS_TEST_RESULTS +
            '.append(' + testOutputCode + ')');
        }

        testCode += (
          '\n' +
          VARNAME_CORRECTNESS_TEST_RESULTS +
          '.append(' + VARNAME_TASK_CORRECTNESS_TEST_RESULTS + ')');
      }

      return testCode;
    };

    /**
     * Creates the code necessary to run one task for a Buggy output test.
     *
     * @param {Array} oneTaskBuggyOutputTests
     * @param {string} inputFunctionName
     * @param {string} outputFunctionName
     * @returns {string}
     * @private
     */
    var _generateOneTaskBuggyOutputTestCode = function(
        oneTaskBuggyOutputTests, inputFunctionName, outputFunctionName) {
      var code = (VARNAME_TASK_BUGGY_OUTPUT_TEST_RESULTS + ' = []\n');
      oneTaskBuggyOutputTests.forEach(function(buggyOutputTest) {
        var qualifiedBuggyFunctionName = buggyOutputTest.getBuggyFunctionName();
        code += (
          VARNAME_TASK_BUGGY_OUTPUT_TEST_RESULTS + '.append(\n' +
          '    matches_buggy_function(' + qualifiedBuggyFunctionName + ', ' +
          (inputFunctionName ? inputFunctionName : 'None') + ', ' +
          (outputFunctionName ? outputFunctionName : 'None') + '))\n');
      });

      code += (
        VARNAME_BUGGY_OUTPUT_TEST_RESULTS +
        '.append(' + VARNAME_TASK_BUGGY_OUTPUT_TEST_RESULTS + ')\n');

      return code;
    };

    /**
     * Creates the code necessary to run all Buggy Output tests.
     *
     * @param {Array} allTasksBuggyOutputTests
     * @param {Array} allTasksInputFunctionNames
     * @param {Array} allTasksOutputFunctionNames
     * @returns {string}
     * @private
     */
    var _generateBuggyOutputTestCode = function(
        allTasksBuggyOutputTests, allTasksInputFunctionNames,
        allTasksOutputFunctionNames) {
      // NOTE: This must be run after the correctness tests, since it assumes
      // that the test inputs and correctness test results already exist.
      // TODO(sll): Cache the results of running the buggy code, so that they
      // don't have to be recomputed for every run.

      for (var i = 0; i < allTasksInputFunctionNames.length; i++) {
        var inputFunctionName = allTasksInputFunctionNames[i];
        var outputFunctionName = allTasksOutputFunctionNames[i];

        var fullTestCode = [
          /* eslint-disable max-len */
          'def matches_buggy_function(func, inputFunctionName, outputFunctionName):',
          '    buggy_results = []',
          '    for task_tests in all_tasks_test_inputs:',
          '        task_results = []',
          '        for test_input in task_tests:',
          '            if inputFunctionName is None and outputFunctionName is None:',
          '                task_results.append(System.runTest(func, test_input))',
          '            elif inputFunctionName is None:',
          '                task_results.append(outputFunctionName(',
          '                    System.runTest(func, test_input)))',
          '            elif outputFunctionName is None:',
          '                task_results.append(',
          '                    System.runTest(func, inputFunctionName(test_input)))',
          '            else:',
          '               task_results.append(outputFunctionName(',
          '                   System.runTest(func, inputFunctionName(test_input))))',
          '        buggy_results.append(task_results)',
          '    return buggy_results == ' + VARNAME_CORRECTNESS_TEST_RESULTS,
          '',
          VARNAME_BUGGY_OUTPUT_TEST_RESULTS + ' = []',
          ''
          /* eslint-enable max-len */
        ].join('\n');

        allTasksBuggyOutputTests.forEach(function(oneTaskBuggyOutputTests) {
          fullTestCode += _generateOneTaskBuggyOutputTestCode(
            oneTaskBuggyOutputTests, inputFunctionName, outputFunctionName);
        });
      }

      return fullTestCode;
    };

    /**
     * Creates all of the code necessary to run performance tests on the user
     * submission.
     *
     * @param {Array} allTasksPerformanceTests
     * @returns {string}
     * @private
     */
    var _generatePerformanceTestCode = function(allTasksPerformanceTests) {
      var testCode = (VARNAME_PERFORMANCE_TEST_RESULTS + ' = []\n');

      testCode += [
        /* eslint-disable max-len */
        '',
        'def get_test_input(atom, input_size, qualifiedTransformationFunctionName):',
        '    return qualifiedTransformationFunctionName(atom, input_size)',
        '',
        'def run_performance_test(',
        '        test_input, qualifiedTransformationFunctionName,',
        '        qualifiedEvaluationFunctionName):',
        '    time_array = []',
        '    for input_size in [' + SMALL_INPUT_SIZE + ', ' + LARGE_INPUT_SIZE + ']:',
        '        start = time.clock()',
        '        output = qualifiedEvaluationFunctionName(get_test_input(',
        '            test_input, input_size, qualifiedTransformationFunctionName))',
        '        finish = time.clock() - start',
        '        time_array.append(finish)',
        '    if time_array[1] > ' + UPPER_BOUND_RATIO_IF_LINEAR + ' * time_array[0]:',
        '        return "not linear"',
        '    return "linear"',
        ''
        /* eslint-enable max-len */
      ].join('\n');

      allTasksPerformanceTests.forEach(function(oneTaskPerformanceTests) {
        testCode += ('\n' + VARNAME_TASK_PERFORMANCE_TEST_RESULTS + ' = []\n');
        oneTaskPerformanceTests.forEach(function(test) {
          var qualifiedEvaluationFunctionName = (
            CLASS_NAME_STUDENT_CODE + '().' + test.getEvaluationFunctionName());
          var qualifiedTransformationFunctionName = (
            test.getTransformationFunctionName());
          // TODO(eyurko): Make this work for non-linear runtimes, such as
          // log(n).
          // TODO(eyurko): Use linear regression to determine if the data
          // points "look" linear, quadratic, etc, and then provide feedback
          // accordingly.
          testCode += [
            VARNAME_TASK_PERFORMANCE_TEST_RESULTS + '.append(',
            '    run_performance_test(' +
            (_jsonVariableToPython(test.getInputDataAtom()) + ', ' +
             qualifiedTransformationFunctionName + ', ' +
             qualifiedEvaluationFunctionName + '))'),
            ''
          ].join('\n');
        });
        testCode += [
          (VARNAME_PERFORMANCE_TEST_RESULTS + '.append(' +
              VARNAME_TASK_PERFORMANCE_TEST_RESULTS + ')'),
          ''
        ].join('\n');
      });

      return testCode;
    };

    return {
      /**
       * Runs a series of necessary tasks to ensure that submission and its
       * tests are executable and ready to run.
       * @param codeSubmission
       * @param auxiliaryCode
       * @param tasks
       */
      preprocess: function(codeSubmission, auxiliaryCode, tasks) {
        var allTasksCorrectnessTests = [];
        var allTasksBuggyOutputTests = [];
        var allTasksPerformanceTests = [];
        for (var i = 0; i < tasks.length; i++) {
          allTasksCorrectnessTests.push(tasks[i].getCorrectnessTests());
          allTasksBuggyOutputTests.push(tasks[i].getBuggyOutputTests());
          allTasksPerformanceTests.push(tasks[i].getPerformanceTests());
        }

        var allTasksInputFunctionNames = tasks.map(function(task) {
          return task.getInputFunctionName();
        });
        var allTasksMainFunctionNames = tasks.map(function(task) {
          return task.getMainFunctionName();
        });
        var allTasksOutputFunctionNames = tasks.map(function(task) {
          return task.getOutputFunctionName();
        });

        // Transform the student code (without changing the number of lines) to
        // put it within a class.
        var transformedStudentCode = this._transformCodeToInstanceMethods(
          codeSubmission.getRawCode(), CLASS_NAME_STUDENT_CODE);
        codeSubmission.replace(transformedStudentCode);

        // Prepend the class header and the system code.
        var studentCodeFirstLine = (
          'class ' + CLASS_NAME_STUDENT_CODE + '(object):');
        codeSubmission.prepend(studentCodeFirstLine);
        codeSubmission.prepend(SYSTEM_CODE.python);
        codeSubmission.removeImportsFromStudentCode();
        // This newline separates the student code from the auxiliary code.
        codeSubmission.append('');

        // Append everything else.
        codeSubmission.append([
          auxiliaryCode,
          this._generateCorrectnessTestCode(
            allTasksCorrectnessTests, allTasksInputFunctionNames,
            allTasksMainFunctionNames, allTasksOutputFunctionNames),
          this._generateBuggyOutputTestCode(
            allTasksBuggyOutputTests, allTasksInputFunctionNames,
            allTasksOutputFunctionNames),
          this._generatePerformanceTestCode(allTasksPerformanceTests)
        ].join('\n\n'));
      },

      // These are seams to allow for Karma testing of the private functions.
      // They should not be invoked directly by non-test clients outside this
      // service.
      _addClassWrappingToHelperFunctions: (
        _addClassWrappingToHelperFunctions),
      _checkMatchedFunctionForWhitespace: _checkMatchedFunctionForWhitespace,
      _generateCorrectnessTestCode: _generateCorrectnessTestCode,
      _generateBuggyOutputTestCode: _generateBuggyOutputTestCode,
      _generatePerformanceTestCode: _generatePerformanceTestCode,
      _jsonVariableToPython: _jsonVariableToPython,
      _transformCodeToInstanceMethods: _transformCodeToInstanceMethods
    };
  }
]);
