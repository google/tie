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

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    CorrectnessTestObjectFactory = $injector.get(
      'CorrectnessTestObjectFactory');
  }));

  describe('getAnyAllowedOutput', function() {
    it('should correctly match outputs', function() {
      var correctnessTest = CorrectnessTestObjectFactory.create({
        input: 'cat',
        allowedOutputs: ['a', 'b']
      });

      expect(correctnessTest.matchesOutput('a')).toBe(true);
      expect(correctnessTest.matchesOutput('b')).toBe(true);
      expect(correctnessTest.matchesOutput('c')).toBe(false);
    });
  });

  describe('getAnyAllowedOutput', function() {
    it('should correctly retrieve an allowed output', function() {
      var correctnessTest = CorrectnessTestObjectFactory.create({
        input: 'cat',
        allowedOutputs: ['a', 'b']
      });

      expect(['a', 'b']).toContain(correctnessTest.getAnyAllowedOutput());
    });
  });
});
