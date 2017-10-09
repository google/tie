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
 * @fileoverview Unit tests for QuestionObject domain objects.
 */

describe('SuiteLevelTestObjectFactory', function() {
  var SuiteLevelTestObjectFactory;
  var suiteLevelTest;

  beforeEach(module('tie'));
  beforeEach(module('tieData'));
  beforeEach(inject(function($injector) {
    SuiteLevelTestObjectFactory = $injector.get('SuiteLevelTestObjectFactory');
    suiteLevelTest = SuiteLevelTestObjectFactory.create({
      testSuiteIdsThatMustPass: ['SUITE_P1', 'SUITE_P2'],
      testSuiteIdsThatMustFail: ['SUITE_F1'],
      messages: ['message 1', 'message 2', 'message 3']
    });
  }));

  describe('getSuiteIdsThatMustPass', function() {
    it('should correctly retrieve the suite IDs that must pass', function() {
      expect(suiteLevelTest.getTestSuiteIdsThatMustPass()).toEqual([
        'SUITE_P1', 'SUITE_P2']);
    });
  });

  describe('getSuiteIdsThatMustFail', function() {
    it('should correctly retrieve the suite IDs that must fail', function() {
      expect(suiteLevelTest.getTestSuiteIdsThatMustFail()).toEqual([
        'SUITE_F1']);
    });
  });

  describe('getMessages', function() {
    it('should correctly retrieve the list of messages', function() {
      expect(suiteLevelTest.getMessages()).toEqual([
        'message 1', 'message 2', 'message 3']);
    });
  });

  describe('areConditionsMet', function() {
    it('should check whether its triggering preconditions are met', function() {
      expect(suiteLevelTest.areConditionsMet(
        ['SUITE_P1', 'SUITE_P2'])).toEqual(true);

      // All "must pass" test suites must pass in order for the suite-level
      // test to be triggered.
      expect(suiteLevelTest.areConditionsMet(['SUITE_P1'])).toEqual(false);
      expect(suiteLevelTest.areConditionsMet(['SUITE_P2'])).toEqual(false);

      // All "must fail" test suites must fail in order for the suite-level
      // test to be triggered.
      expect(suiteLevelTest.areConditionsMet(['SUITE_F1'])).toEqual(false);
      expect(suiteLevelTest.areConditionsMet(
        ['SUITE_P1', 'SUITE_P2', 'SUITE_F1'])).toEqual(false);

      // It is fine for other test suites not mentioned in the suite-level test
      // to pass as well.
      expect(suiteLevelTest.areConditionsMet(
        ['SUITE_P1', 'SUITE_P2', 'SUITE_WHATEVER'])).toEqual(true);
    });
  });
});
