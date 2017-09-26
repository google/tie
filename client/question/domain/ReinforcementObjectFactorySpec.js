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
 * @fileoverview Unit tests for ReinforcementObjectFactory domain objects.
 */

describe('ReinforcementObjectFactory', function() {
  var TestSuiteObjectFactory;
  var ReinforcementObjectFactory;
  var ReinforcementBulletObjectFactory;
  var TaskObjectFactory;
  var reinforcement;
  var task;

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    TestSuiteObjectFactory = $injector.get('TestSuiteObjectFactory');
    ReinforcementObjectFactory = $injector.get('ReinforcementObjectFactory');
    ReinforcementBulletObjectFactory = $injector.get(
      'ReinforcementBulletObjectFactory');
    TaskObjectFactory = $injector.get('TaskObjectFactory');

    task = TaskObjectFactory.create({
      instructions: [''],
      prerequisiteSkills: [],
      acquiredSkills: [],
      inputFunctionName: null,
      outputFunctionName: null,
      mainFunctionName: null,
      testSuites: TestSuiteObjectFactory.create([{
        input: 'abc',
        allowedOutputs: ['a']
      }]),
      buggyOutputTests: [],
      performanceTests: []
    });
    reinforcement = ReinforcementObjectFactory.create(task);
  }));

  describe('getBullets', function() {
    it('should correctly get bullets', function() {
      reinforcement.addPassedTag('handled_passed_tag', true);
      reinforcement.addPassedTag('failed_passed_tag', false);
      reinforcement.addPastFailedCase('handled_past_failed_case', true);
      reinforcement.addPastFailedCase('failed_past_failed_case', false);
      var bullet1 = ReinforcementBulletObjectFactory.createPassedBullet(
        'Handles handled_passed_tag');
      var bullet2 = ReinforcementBulletObjectFactory.createFailedBullet(
        'Fails failed_passed_tag');
      var bullet3 = ReinforcementBulletObjectFactory.createPassedBullet(
        'Handles \'handled_past_failed_case\'');
      var bullet4 = ReinforcementBulletObjectFactory.createFailedBullet(
        'Fails on \'failed_past_failed_case\'');
      expect(reinforcement.getBullets()).toEqual([
        bullet1, bullet2, bullet3, bullet4
      ]);
    });
  });

});
