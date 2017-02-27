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
  'WRAPPER_CLASS_NAME', 'VARNAME_TEST_RESULTS',
  function(WRAPPER_CLASS_NAME, VARNAME_TEST_RESULTS) {
    var START_INDENT = '    ';

<<<<<<< HEAD
    // Wraps a WRAPPER_CLASS_NAME class around the series of functions in a
    // given code snippet.
    var wrapCodeIntoClass = function(code) {
      var codeLines = code.trim().split('\n');
      var firstLine = 'import time\n\n\nclass ' + WRAPPER_CLASS_NAME + '(object):';
      var systemFunctions = [
        START_INDENT + 'def extendString(self, s, length):',
        START_INDENT + '    return s * length'
      ];
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
      var newCodeLines = [firstLine].concat(systemFunctions);
      newCodeLines = newCodeLines.concat(subsequentLines);
      return newCodeLines.join('\n');
    };

=======
>>>>>>> 3155700f148f979ec7522e2a07ec07c685378951
    var jsonVariableToPython = function(jsonVariable) {
      console.log('var = ' + jsonVariable);
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
      } else {
        throw Error('Non-string inputs are not yet supported.');
      }
    };

    var generateTestCode = function(
        mainFunctionName, correctnessTests, performanceTests) {
      testCode = generateCorrectnessTestCode(correctnessTests);
      testCode += generatePerformanceTestCode(performanceTests);

      return testCode;
    };

    var generateCorrectnessTestCode = function(
        mainFunctionName, correctnessTests) {
      var qualifiedMainFunctionName = (
        WRAPPER_CLASS_NAME + '().' + mainFunctionName);

      var testCode = [
        'def run_correctness_test(test_input):',
        '    return ' + qualifiedMainFunctionName + '(test_input)',
        '',
        VARNAME_TEST_RESULTS + ' = []'
      ].join('\n');

      correctnessTests.forEach(function(test, index) {
        testCode += '\n' + [
          VARNAME_TEST_RESULTS + '.append(',
          '    run_correctness_test(' + jsonVariableToPython(test.getInput()) + '))'
        ].join('\n');
      });

      return testCode;
    };

    var generatePerformanceTestCode = function(performanceTests) {
      performanceTests.forEach(function(test, index) {
        var qualifiedEvaluationFunctionName = (
          WRAPPER_CLASS_NAME + '().' + test.getEvaluationFunction());
        var qualifiedTransformationFunctionName = (
          WRAPPER_CLASS_NAME + '().' + test.getTransformationFunction());
        // TODO(eyurko): Make this work for other runtimes.
        // TODO(eyurko): 30 seems very scientific. Maybe stop hardcoding?
        testCode += [
          '',
          'def get_test_input(atom, input_size):',
          '    return ' + qualifiedTransformationFunctionName + '(atom, input_size)',
          '',
          'def run_performance_test(test_input):',
          '    time_array = []',
          '    for input_size in [10, 100]:',
          '        start = time.time()',
          '        output = ' + qualifiedEvaluationFunctionName + '(get_test_input(test_input, input_size))',
          '        finish = time.time() - start',
          '        time_array.append(finish)',
          '    return time_array',
          '    if time_array[1] > 30 * time_array[0]:',
          '        return "not linear"',
          '    return "linear"',
          ''
        ].join('\n');
        console.log(test);
        testCode += '\n' + [
          VARNAME_TEST_RESULTS + '.append(',
          '    run_performance_test(' + jsonVariableToPython(test.getInputDataAtom()) + '))'
        ].join('\n');
      });

      return testCode;
    };

    return {
<<<<<<< HEAD
      preprocessCode: function(
      code, mainFunctionName, correctnessTests, performanceTests) {
        return (
          wrapCodeIntoClass(code) + '\n' +
          generateTestCode(
              mainFunctionName, correctnessTests, performanceTests));
      },
      preprocessCorrectnessCode: function(code, mainFunctionName, correctnessTests) {
        return (
          wrapCodeIntoClass(code) + '\n' +
          generateCorrectnessTestCode(mainFunctionName, correctnessTests));
      },
      preprocessPerformanceCode: function(code, performanceTests) {
        return (
          wrapCodeIntoClass(code) + '\n' +
          generatePerformanceTestCode(performanceTests));
=======
      // Wraps a WRAPPER_CLASS_NAME class around the series of functions in a
      // given code snippet.
      _wrapCodeIntoClass: function(code) {
        var codeLines = code.trim().split('\n');

        var firstLine = 'class ' + WRAPPER_CLASS_NAME + '(object):';
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

        var newCodeLines = [firstLine].concat(subsequentLines);
        return newCodeLines.join('\n');
      },
      preprocessCode: function(code, mainFunctionName, correctnessTests) {
        return (
          this._wrapCodeIntoClass(code) + '\n' +
          generateTestCode(mainFunctionName, correctnessTests));
>>>>>>> 3155700f148f979ec7522e2a07ec07c685378951
      }
    };
  }
]);
