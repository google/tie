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
 * @fileoverview Unit tests for the CodeRunnerDispatcherService.
 */

describe('CodeRunnerDispatcherService', function() {
  var CodeRunnerDispatcherService;
  var PythonCodeRunnerService;
  var LANGUAGE_PYTHON;

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    CodeRunnerDispatcherService = $injector.get(
      'CodeRunnerDispatcherService');
    PythonCodeRunnerService = $injector.get(
      'PythonCodeRunnerService');
    LANGUAGE_PYTHON = $injector.get(
      'LANGUAGE_PYTHON');
  }));

  describe('runCodeAsyncFunction', function() {
    // TODO: Should also test the success branch
    // once figure out how to use Sk lib in tests
    it('should throw error of Language not supported', function() {
      var unsupportedLanguage = "someLanguage";
      var code = "someCode";
      try {
        CodeRunnerDispatcherService.runCodeAsync(unsupportedLanguage, code);
        fail('Should throw unsupported language error');
      } catch(err) {
        expect(err.toString()).toEqual("Error: Language not supported: "
                                        + unsupportedLanguage);
      }
    });
  });
});
