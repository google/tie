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
 * @fileoverview Unit tests for TestSuite domain objects.
 */

describe('TestSuiteObjectFactory', function() {
  var TestCaseObjectFactory;
  var TestSuiteObjectFactory;

  beforeEach(module('tieData'));
  beforeEach(inject(function($injector) {
    TestSuiteObjectFactory = $injector.get('TestSuiteObjectFactory');
    TestCaseObjectFactory = $injector.get('TestCaseObjectFactory');
  }));

  describe('getId', function() {
    it('should correctly retrieve the ID of the test suite', function() {
      var suite = TestSuiteObjectFactory.create({
        id: 'ID',
        humanReadableName: 'human readable name',
        testCases: []
      });

      expect(suite.getId()).toBe('ID');
    });
  });

  describe('getHumanReadableName', function() {
    it('should correctly retrieve the human-readable name', function() {
      var suite = TestSuiteObjectFactory.create({
        id: 'ID',
        humanReadableName: 'human readable name',
        testCases: []
      });

      expect(suite.getHumanReadableName()).toBe('human readable name');
    });
  });

  describe('getTestCases', function() {
    it('should correctly retrieve the array of test cases', function() {
      var suite1 = TestSuiteObjectFactory.create({
        id: 'ID',
        humanReadableName: 'human readable name',
        testCases: []
      });

      expect(suite1.getTestCases()).toEqual([]);

      var suite2 = TestSuiteObjectFactory.create({
        id: 'ID',
        humanReadableName: 'human readable name',
        testCases: [{
          input: 'abc',
          allowedOutputs: ['def']
        }]
      });

      expect(suite2.getTestCases().length).toBe(1);
      expect(suite2.getTestCases()[0] instanceof TestCaseObjectFactory)
        .toBe(true);
      expect(suite2.getTestCases()[0].getInput()).toEqual('abc');
    });
  });
});
