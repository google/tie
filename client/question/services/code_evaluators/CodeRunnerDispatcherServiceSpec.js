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
 * @fileoverview Unit tests for CodeRunnerDispatcherService
 */

describe('CodeRunnerDispatcherService', function() {
  var CodeRunnerDispatcherService;

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    CodeRunnerDispatcherService = $injector.get('CodeRunnerDispatcherService');
  }));

  describe('pythonCodeRunnerService', function() {
    it('should throw an error if passed a non-Python language', function() {
      var errorFunction = function() {
        CodeRunnerDispatcherService.runCodeAsync('java', 'some code');
      };
      expect(errorFunction).toThrow();
    });

    it('should throw TimeLimitError given infinite-loop code', function(done) {
      var code = [
        'while True:',
        "    print 'a'"
      ].join('\n');

      CodeRunnerDispatcherService.runCodeAsync('python', code).then(
        function(rawCodeEvalResult) {
          expect(rawCodeEvalResult.getErrorString()).toBe(
            'TimeLimitError: Program exceeded run time limit.');
          done();
        }
      );
    });

    it('should throw RangeError given infinite-recurse code', function(done) {
      var code = [
        'def forgetToIgnoreSpaces(string):',
        "    return forgetToIgnoreSpaces(string + 'b')",
        "forgetToIgnoreSpaces('a')"
      ].join('\n');
      CodeRunnerDispatcherService.runCodeAsync("python", code).then(
        function(rawCodeEvalResult) {
          expect(rawCodeEvalResult.getErrorString()).toBe([
            'ExternalError: RangeError: Maximum call stack size ',
            'exceeded on line 2'
          ].join(''));
          done();
        }
      );
    });
  });

  describe('compileCodeAsync', function() {
    it('should throw an error if passed a non-Python language', function() {
      var errorFunction = function() {
        CodeRunnerDispatcherService.compileCodeAsync('java', 'some code');
      };
      expect(errorFunction).toThrow();
    });
  });
});
