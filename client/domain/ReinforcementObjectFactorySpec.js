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
 * @fileoverview Unit tests for FeedbackObject domain objects.
 */

describe('ReinforcementObjectFactory', function() {
  var CorrectnessTestObjectFactory;
  var ReinforcementObjectFactory;
  var reinforcement;
  var ReinforcementBulletObjectFactory;
  var reinforcementBullet;
  var TaskObjectFactory;
  var task;

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    var taskDict = [{
      instructions: [''],
      prerequisiteSkills: [''],
      acquiredSkills: [''],
      inputFunctionName: null,
      outputFunctionName: null,
      mainFunctionName: 'mockMainFunction',
      correctnessTests: [{
        input: 'task_1_correctness_test_1',
        allowedOutputs: [true],
        tag: 'tag1'
      }, {
        input: 'task_1_correctness_test_2',
        allowedOutputs: [true],
        tag: 'tag2'
      }],
      buggyOutputTests: [],
      performanceTests: []
    }];

    CorrectnessTestObjectFactory = $injector.get(
      'CorrectnessTestObjectFactory');

    TaskObjectFactory = $injector.get('TaskObjectFactory');
    task = TaskObjectFactory.create(taskDict);

    ReinforcementObjectFactory = $injector.get(
      'ReinforcementObjectFactory');
    reinforcement = ReinforcementObjectFactory.create(task);

    //reinforcement.addPassedTag(task.getCorrectnessTests()[0].getTag(), true);
    //reinforcement.addPassedTag(task.getCorrectnessTests()[1].getTag(), false);
  }));
  
  /*describe('getBullets', function() {
    it('should correctly get bullets', function() {
      //reinforcement.addPassedTag('test_tag_1', true);
      //console.log(reinforcement.getBullets());
      var myVar = 5;
      expect(myVar.toEqual(5));
    })
  })*/
/*
  describe('getTask', function()  {
    it('should correctly get task', function() {
      expect(reinforcement.getTask()).toEqual(task);
    })
  })
*/
});
