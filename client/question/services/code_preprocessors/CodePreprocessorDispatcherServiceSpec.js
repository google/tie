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
 * @fileoverview Unit tests for the CodePreprocessorDispatcherService.
 */

describe('CodePreprocessorDispatcherService', function() {
  var CodePreprocessorDispatcherService;
  var LANGUAGE_PYTHON;
  var CodeSubmissionObjectFactory;
  var TaskObjectFactory;

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    CodePreprocessorDispatcherService = $injector.get(
      'CodePreprocessorDispatcherService');
    LANGUAGE_PYTHON = $injector.get('LANGUAGE_PYTHON');
    CodeSubmissionObjectFactory = $injector.get('CodeSubmissionObjectFactory');
    TaskObjectFactory = $injector.get('TaskObjectFactory');
  }));

  describe('preprocess', function() {
    it('should throw error if the language passed in is unknown', function() {
      var unsupportedLanguage = 'someLanguage';
      var failingFunction = function() {
        CodePreprocessorDispatcherService.preprocess(
          unsupportedLanguage, '', '', '', '', '', '', '', '');
      };
      expect(failingFunction).toThrow(new Error(
        'Language not supported: someLanguage'));
    });

    it('should preprocess python source code', function() {
      var codeSubmission = CodeSubmissionObjectFactory.create('a = 1\nb= 2');
      var originProcessedCode = codeSubmission.getPreprocessedCode();
      var task = TaskObjectFactory.create({
        testSuites: [],
        buggyOutputTests: [],
        suiteLevelTests: [],
        performanceTests: []
      });
      CodePreprocessorDispatcherService.preprocess(
        LANGUAGE_PYTHON, codeSubmission, '', [task]);
      expect(codeSubmission.getPreprocessedCode())
        .not.toEqual(originProcessedCode);
    });
  });
});
