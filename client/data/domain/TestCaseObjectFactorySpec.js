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
 * @fileoverview Unit tests for TestCase domain objects.
 */

describe('TestCaseObjectFactory', function() {
  var TestCaseObjectFactory;

  beforeEach(module('tieData'));
  beforeEach(inject(function($injector) {
    TestCaseObjectFactory = $injector.get('TestCaseObjectFactory');
  }));

  describe('matchesOutput', function() {
    it('should correctly match outputs', function() {
      var test = TestCaseObjectFactory.create({
        input: 'cat',
        allowedOutputs: ['a', 'b']
      });

      expect(test.matchesOutput('a')).toBe(true);
      expect(test.matchesOutput('b')).toBe(true);
      expect(test.matchesOutput('c')).toBe(false);
    });
  });

  describe('matchesOutputArray', function() {
    it('should correctly match outputs that are arrays', function() {
      var test = TestCaseObjectFactory.create({
        input: 'cat',
        allowedOutputs: [['c', 'a'], ['c', 't']]
      });

      expect(test.matchesOutput(['c', 'a'])).toBe(true);
      expect(test.matchesOutput(['c', 't'])).toBe(true);
      expect(test.matchesOutput(['a', 't'])).toBe(false);
    });
  });

  describe('getAnyAllowedOutput', function() {
    it('should correctly retrieve an allowed output', function() {
      var test = TestCaseObjectFactory.create({
        input: 'cat',
        allowedOutputs: ['a', 'b']
      });

      expect(['a', 'b']).toContain(test.getAnyAllowedOutput());
    });
  });
});
