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
 * @fileoverview Unit tests for CorrectnessTest domain objects.
 */

describe('CorrectnessTestObjectFactory', function() {
  var CorrectnessTestObjectFactory;
  var MESSAGE = "hello";

  beforeEach(module('tieData'));
  beforeEach(inject(function($injector) {
    CorrectnessTestObjectFactory = $injector.get(
      'CorrectnessTestObjectFactory');
  }));

  describe('matchesOutput', function() {
    it('should correctly match outputs', function() {
      var correctnessTest = CorrectnessTestObjectFactory.create({
        input: 'cat',
        allowedOutputs: ['a', 'b'],
        tag: 'cats'
      });

      expect(correctnessTest.matchesOutput('a')).toBe(true);
      expect(correctnessTest.matchesOutput('b')).toBe(true);
      expect(correctnessTest.matchesOutput('c')).toBe(false);
    });
  });

  describe('matchesOutputArray', function() {
    it('should correctly match outputs that are arrays', function() {
      var correctnessTest = CorrectnessTestObjectFactory.create({
        input: 'cat',
        allowedOutputs: [['c', 'a'], ['c', 't']]
      });

      expect(correctnessTest.matchesOutput(['c', 'a'])).toBe(true);
      expect(correctnessTest.matchesOutput(['c', 't'])).toBe(true);
      expect(correctnessTest.matchesOutput(['a', 't'])).toBe(false);
    });
  });

  describe('getAnyAllowedOutput', function() {
    it('should correctly retrieve an allowed output', function() {
      var correctnessTest = CorrectnessTestObjectFactory.create({
        input: 'cat',
        allowedOutputs: ['a', 'b'],
        tag: 'cats'
      });

      expect(['a', 'b']).toContain(correctnessTest.getAnyAllowedOutput());
    });
  });

  describe('getTag', function() {
    it('should correctly retrieve the tag of the test case', function() {
      var correctnessTest = CorrectnessTestObjectFactory.create({
        input: 'cat',
        allowedOutputs: ['a', 'b'],
        tag: 'cats'
      });

      expect(correctnessTest.getTag()).toBe('cats');
    });
  });

  describe('getMessage', function() {
    it('should correctly get the message', function() {
      var correctnessTest = CorrectnessTestObjectFactory.create({
        input: 'cat',
        allowedOutputs: ['a', 'b'],
        message: MESSAGE
      });

      expect(correctnessTest.getMessage()).toMatch(MESSAGE);
    });
  });
});
