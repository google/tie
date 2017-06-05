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
 * @fileoverview Unit tests for CodeSubmission domain objects.
 */

describe('CodeSubmissionObjectFactory', function() {
  var CodeSubmissionObjectFactory;

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    CodeSubmissionObjectFactory = $injector.get('CodeSubmissionObjectFactory');
  }));

  describe('replace', function() {
    it('should correctly replace code', function() {
      var originalCode = 'line 1\nline 2\nline 3';
      var codeSubmission = CodeSubmissionObjectFactory.create(originalCode);

      expect(codeSubmission.getRawCode()).toEqual(originalCode);
      expect(codeSubmission.getPreprocessedCode()).toEqual(
        'line 1\nline 2\nline 3');
      expect(codeSubmission.getRawCodeLineIndexes()).toEqual([0, 1, 2]);

      codeSubmission.replace('newline 1\nnewline 2\nnewline 3');

      expect(codeSubmission.getRawCode()).toEqual(originalCode);
      expect(codeSubmission.getPreprocessedCode()).toEqual(
        'newline 1\nnewline 2\nnewline 3');
      expect(codeSubmission.getRawCodeLineIndexes()).toEqual([0, 1, 2]);
    });

    it('should throw an error if the number of lines changes', function() {
      var originalCode = 'line 1\nline 2\nline 3';
      var codeSubmission = CodeSubmissionObjectFactory.create(originalCode);

      expect(codeSubmission.getRawCode()).toEqual(originalCode);
      expect(codeSubmission.getPreprocessedCode()).toEqual(
        'line 1\nline 2\nline 3');
      expect(codeSubmission.getRawCodeLineIndexes()).toEqual([0, 1, 2]);

      expect(function() {
        codeSubmission.replace('this code has too few lines');
      }).toThrow();
      expect(function() {
        codeSubmission.replace('this\ncode\nhas\ntoo\nmany\nlines');
      }).toThrow();
    });
  });

  describe('append', function() {
    it('should correctly append code', function() {
      var originalCode = 'line 1\nline 2\nline 3';
      var codeSubmission = CodeSubmissionObjectFactory.create(originalCode);

      expect(codeSubmission.getRawCode()).toEqual(originalCode);
      expect(codeSubmission.getPreprocessedCode()).toEqual(
        'line 1\nline 2\nline 3');
      expect(codeSubmission.getRawCodeLineIndexes()).toEqual([0, 1, 2]);

      codeSubmission.append('line 4\nline 5');

      expect(codeSubmission.getRawCode()).toEqual(originalCode);
      expect(codeSubmission.getPreprocessedCode()).toEqual(
        'line 1\nline 2\nline 3\nline 4\nline 5');
      expect(codeSubmission.getRawCodeLineIndexes()).toEqual([
        0, 1, 2, null, null]);
    });
  });

  describe('prepend', function() {
    it('should correctly prepend code', function() {
      var originalCode = 'line 1\nline 2\nline 3';
      var codeSubmission = CodeSubmissionObjectFactory.create(originalCode);

      expect(codeSubmission.getRawCode()).toEqual(originalCode);
      expect(codeSubmission.getPreprocessedCode()).toEqual(
        'line 1\nline 2\nline 3');
      expect(codeSubmission.getRawCodeLineIndexes()).toEqual([0, 1, 2]);

      codeSubmission.prepend('line -1\nline 0');

      expect(codeSubmission.getRawCode()).toEqual(originalCode);
      expect(codeSubmission.getPreprocessedCode()).toEqual(
        'line -1\nline 0\nline 1\nline 2\nline 3');
      expect(codeSubmission.getRawCodeLineIndexes()).toEqual([
        null, null, 0, 1, 2]);
    });
  });
});
