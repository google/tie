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
  'WRAPPER_CLASS_NAME', function(WRAPPER_CLASS_NAME) {
    var START_INDENT = '    ';

    return {
      // Wraps a WRAPPER_CLASS_NAME class around the series of functions in a
      // given code snippet.
      preprocessCode: function(code) {
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
      }
    };
  }
]);
