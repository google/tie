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
 * @fileoverview Unit tests for PreprocessedCode domain objects.
 */

describe('PreprocessedCodeObjectFactory', function() {
  var PreprocessedCodeObjectFactory;

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    PreprocessedCodeObjectFactory = $injector.get(
      'PreprocessedCodeObjectFactory');
  }));

  describe('getPreprocessedCode', function() {
    it('should retrieve the corresponding preprocessed code', function() {
      var code = [
        'def preprocessedCode():',
        '    a = 3',
        '    return a'
      ].join('\n');
      var preprocessedCodeObject = PreprocessedCodeObjectFactory.create(
        code, 'separator');

      expect(preprocessedCodeObject.getPreprocessedCode()).toEqual(code);
    });
  });

  describe('getSeparator', function() {
    it('should retrieve the corresponding separator', function() {
      var code = [
        'def preprocessedCode():',
        '    a = 3',
        '    return a'
      ].join('\n');
      var separator = 'ABCDEFGHIJKLMNOPQRST';
      var preprocessedCodeObject = PreprocessedCodeObjectFactory.create(
        code, separator);

      expect(preprocessedCodeObject.getSeparator()).toEqual(separator);
    });
  });
});
