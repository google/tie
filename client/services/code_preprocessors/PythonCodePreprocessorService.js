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

    // Wraps a WRAPPER_CLASS_NAME class around the series of functions in a
    // given code snippet.
    var wrapCodeIntoClass = function(code) {
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
    };

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
      } else {
        throw Error('Non-string inputs are not yet supported.');
      }
    };

    var generateTestCode = function(mainFunctionName, correctnessTests) {
      var qualifiedMainFunctionName = (
        WRAPPER_CLASS_NAME + '().' + mainFunctionName);

      var testCode = [
        'def runTest(input):',
        '    return ' + qualifiedMainFunctionName + '(input)',
        '',
        VARNAME_TEST_RESULTS + ' = []'
      ].join('\n');

      correctnessTests.forEach(function(test, index) {
        testCode += '\n' + [
          VARNAME_TEST_RESULTS + '.append(',
          '    runTest(' + jsonVariableToPython(test.getInput()) + '))'
        ].join('\n');
      });

      return testCode;
    }

    return {
      preprocessCode: function(code, mainFunctionName, correctnessTests) {
        return (
          wrapCodeIntoClass(code) + '\n' +
          generateTestCode(mainFunctionName, correctnessTests));
      }
    };
  }
]);
