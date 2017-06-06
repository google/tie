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
 * @fileoverview Unit tests the ReinforcementGeneratorService
 */

describe('ReinforcementGeneratorService', function() {
  // Task with 2 correctness tests
  var testTask;
  // Task with 3 correctness tests
  var testTask2;
  // Task with 3 correctness tests with the same tag
  var testTask3;

  var ReinforcementGeneratorService;
  var CodeEvalResultObjectFactory;
  var FeedbackGeneratorService;
  var TranscriptService;
  var TaskObjectFactory;

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    ReinforcementGeneratorService = $injector.get(
      'ReinforcementGeneratorService');
    CodeEvalResultObjectFactory = $injector.get('CodeEvalResultObjectFactory');
    FeedbackGeneratorService = $injector.get('FeedbackGeneratorService');
    TranscriptService = $injector.get('TranscriptService');
    TaskObjectFactory = $injector.get('TaskObjectFactory');

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
        tag: 'test1'
      }, {
        input: 'task_1_correctness_test_2',
        allowedOutputs: [true],
        tag: 'test2'
      }],
      buggyOutputTests: [],
      performanceTests: []
    }];

    var taskDict2 = [{
      instructions: [''],
      prerequisiteSkills: [''],
      acquiredSkills: [''],
      inputFunctionName: null,
      outputFunctionName: null,
      mainFunctionName: 'mockMainFunction',
      correctnessTests: [{
        input: 'task_2_correctness_test_1',
        allowedOutputs: [true],
        tag: 'test1'
      }, {
        input: 'task_2_correctness_test_2',
        allowedOutputs: [true],
        tag: 'test2'
      }, {
        input: 'task_2_correctness_test_3',
        allowedOutputs: [true],
        tag: 'test3'
      }],
      buggyOutputTests: [],
      performanceTests: []
    }];

    var taskDictMultCases = [{
      instructions: [''],
      prerequisiteSkills: [''],
      acquiredSkills: [''],
      inputFunctionName: null,
      outputFunctionName: null,
      mainFunctionName: 'mockMainFunction',
      correctnessTests: [{
        input: 'task_3_correctness_test_1',
        allowedOutputs: [true],
        tag: 'test1'
      }, {
        input: 'task_3_correctness_test_2',
        allowedOutputs: [true],
        tag: 'test1'
      }, {
        input: 'task_3_correctness_test_3',
        allowedOutputs: [true],
        tag: 'test1'
      }],
      buggyOutputTests: [],
      performanceTests: []
    }];

    testTask = taskDict.map(function(task) {
      return TaskObjectFactory.create(task);
    });

    testTask2 = taskDict2.map(function(task) {
      return TaskObjectFactory.create(task);
    });

    testTask3 = taskDictMultCases.map(function(task) {
      return TaskObjectFactory.create(task);
    });
  }));

  describe('getReinforcement', function() {
    it('copies and updates previous reinforcement if from the same task',
      function() {
        // Simulate most recent snapshot
        var codeEvalResult = CodeEvalResultObjectFactory.create(
          'some code', 'some output', [[false, false]],
          [], [], null, null);
        var feedback = FeedbackGeneratorService.getFeedback(
          testTask, codeEvalResult, [0, 1, 2, 3, 4]);

        TranscriptService.recordSnapshot(null, codeEvalResult, feedback);

        var pastFailedCases = feedback.getReinforcement().getPastFailedCases();
        var passedTags = feedback.getReinforcement().getPassedTags();
        var test1 = testTask[0].getCorrectnessTests()[0].getStringifiedInput();
        var test2 = testTask[0].getCorrectnessTests()[1].getStringifiedInput();

        expect(pastFailedCases[test1]).toEqual(false);
        expect(pastFailedCases[test2]).toEqual(undefined);
        expect(Object.keys(passedTags).length).toEqual(0);

        var codeEvalResult2 = CodeEvalResultObjectFactory.create(
          'some code', 'some output', [[true, false]], [], [], null, null);

        var reinforcement = ReinforcementGeneratorService.getReinforcement(
          testTask[0], codeEvalResult2);
        var reinforcementPassedTags = reinforcement.getPassedTags();
        pastFailedCases = reinforcement.getPastFailedCases();
        expect(pastFailedCases[test1]).toEqual(true);
        expect(pastFailedCases[test2]).toEqual(false);
        expect(reinforcementPassedTags.test1).toEqual(true);
      });

    it('does not copy reinforcement if the previous reinforcement is not from' +
      ' the same task', function() {
      var codeEvalResult = CodeEvalResultObjectFactory.create(
        'some code', 'some output', [[false, false, false]],
        [], [], null, null);
      var feedback = FeedbackGeneratorService.getFeedback(
        testTask2, codeEvalResult, [0, 1, 2, 3, 4]);

      TranscriptService.recordSnapshot(null, codeEvalResult, feedback);

      var pastFailedCases = feedback.getReinforcement().getPastFailedCases();
      var test1 = testTask2[0].getCorrectnessTests()[0].getStringifiedInput();

      expect(pastFailedCases[test1]).toEqual(false);

      var codeEvalResult2 = CodeEvalResultObjectFactory.create(
        'some code', 'some output', [[false, false]], [], [], null, null);

      var reinforcement = ReinforcementGeneratorService.getReinforcement(
        testTask[0], codeEvalResult2);
      pastFailedCases = reinforcement.getPastFailedCases();

      expect(pastFailedCases[test1]).toEqual(undefined);
      test1 = testTask[0].getCorrectnessTests()[0].getStringifiedInput();
      expect(pastFailedCases[test1]).toEqual(false);
    });

    it('should only display one new failed case among all tasks', function() {
      var codeEvalResult = CodeEvalResultObjectFactory.create(
        'some code', 'some output', [[false, false, false]],
        [], [], null, null);
      var feedback = FeedbackGeneratorService.getFeedback(
        testTask2, codeEvalResult, [0, 1, 2, 3, 4]);

      TranscriptService.recordSnapshot(null, codeEvalResult, feedback);
      var reinforcement = ReinforcementGeneratorService.getReinforcement(
        testTask2[0], codeEvalResult);

      var pastFailedCases = reinforcement.getPastFailedCases();
      var test1 = testTask2[0].getCorrectnessTests()[0].getStringifiedInput();
      var test2 = testTask2[0].getCorrectnessTests()[1].getStringifiedInput();
      var test3 = testTask2[0].getCorrectnessTests()[2].getStringifiedInput();

      expect(Object.keys(pastFailedCases).length).toEqual(1);
      expect(pastFailedCases[test1]).toEqual(false);
      expect(pastFailedCases[test2]).toEqual(undefined);
      expect(pastFailedCases[test3]).toEqual(undefined);

      var updatedCodeEvalResult = CodeEvalResultObjectFactory.create(
        'some code', 'some output', [[true, false, false]], [], [], null, null);
      reinforcement = ReinforcementGeneratorService.getReinforcement(
        testTask2[0], updatedCodeEvalResult);

      pastFailedCases = reinforcement.getPastFailedCases();

      expect(Object.keys(pastFailedCases).length).toEqual(2);
      expect(pastFailedCases[test1]).toEqual(true);
      expect(pastFailedCases[test2]).toEqual(false);
      expect(pastFailedCases[test3]).toEqual(undefined);
      expect(reinforcement.getPassedTags().test1).toEqual(true);
    });

    it('should update passedTags if previously passing testTag fails',
      function() {
        var codeEvalResult = CodeEvalResultObjectFactory.create(
          'some code', 'some output', [[true, true, true]],
          [], [], null, null);
        var feedback = FeedbackGeneratorService.getFeedback(
          testTask2, codeEvalResult, [0, 1, 2, 3, 4]);

        TranscriptService.recordSnapshot(null, codeEvalResult, feedback);

        var pastFailedCases = feedback.getReinforcement().getPastFailedCases();
        var test1 = testTask2[0].getCorrectnessTests()[0].getStringifiedInput();
        var test2 = testTask2[0].getCorrectnessTests()[1].getStringifiedInput();
        var test3 = testTask2[0].getCorrectnessTests()[2].getStringifiedInput();

        expect(Object.keys(pastFailedCases).length).toEqual(0);
        expect(pastFailedCases[test1]).toEqual(undefined);
        expect(pastFailedCases[test2]).toEqual(undefined);
        expect(pastFailedCases[test3]).toEqual(undefined);
        expect(feedback.getReinforcement().getPassedTags().test1).toEqual(
          true);
        expect(feedback.getReinforcement().getPassedTags().test2).toEqual(
          true);
        expect(feedback.getReinforcement().getPassedTags().test3).toEqual(
          true);
        // Make the first test fail
        codeEvalResult = CodeEvalResultObjectFactory.create(
          'some code', 'some output', [[false, true, true]],
          [], [], null, null);
        var reinforcement = ReinforcementGeneratorService.getReinforcement(
          testTask2[0], codeEvalResult);
        pastFailedCases = reinforcement.getPastFailedCases();

        expect(reinforcement.getPassedTags().test1).toEqual(false);
      });

    it('should update pastFailedCases if previously passing tag fails',
      function() {
        var codeEvalResult = CodeEvalResultObjectFactory.create(
          'some code', 'some output', [[false, false, false]],
          [], [], null, null);
        var feedback = FeedbackGeneratorService.getFeedback(
          testTask2, codeEvalResult, [0, 1, 2, 3, 4]);

        TranscriptService.recordSnapshot(null, codeEvalResult, feedback);
        var pastFailedCases = feedback.getReinforcement().getPastFailedCases();
        var test1 = testTask2[0].getCorrectnessTests()[0].getStringifiedInput();
        var test2 = testTask2[0].getCorrectnessTests()[1].getStringifiedInput();
        var test3 = testTask2[0].getCorrectnessTests()[2].getStringifiedInput();

        expect(pastFailedCases[test1]).toEqual(false);
        expect(pastFailedCases[test2]).toEqual(undefined);
        expect(pastFailedCases[test3]).toEqual(undefined);

        var codeEvalResult2 = CodeEvalResultObjectFactory.create(
          'some code', 'some output', [[true, false, false]],
          [], [], null, null);
        feedback = FeedbackGeneratorService.getFeedback(
          testTask2, codeEvalResult2, [0, 1, 2, 3, 4]);
        TranscriptService.recordSnapshot(null, codeEvalResult2, feedback);

        pastFailedCases = feedback.getReinforcement().getPastFailedCases();

        expect(pastFailedCases[test1]).toEqual(true);
        expect(pastFailedCases[test2]).toEqual(false);
        expect(pastFailedCases[test3]).toEqual(undefined);

        var codeEvalResult3 = CodeEvalResultObjectFactory.create(
          'some code', 'some output', [[true, true, false]],
          [], [], null, null);
        feedback = FeedbackGeneratorService.getFeedback(
          testTask2, codeEvalResult3, [0, 1, 2, 3, 4]);

        TranscriptService.recordSnapshot(null, codeEvalResult3, feedback);

        pastFailedCases = feedback.getReinforcement().getPastFailedCases();

        expect(pastFailedCases[test1]).toEqual(true);
        expect(pastFailedCases[test2]).toEqual(true);
        expect(pastFailedCases[test3]).toEqual(false);
        var reinforcement = ReinforcementGeneratorService.getReinforcement(
          testTask2[0], codeEvalResult);
        pastFailedCases = reinforcement.getPastFailedCases();

        expect(pastFailedCases[test1]).toEqual(false);
        expect(pastFailedCases[test2]).toEqual(true);
        expect(pastFailedCases[test3]).toEqual(false);
      });

    it('should update pastFailedCases if previously passing case fails' +
      ' with the same tag', function() {
      var codeEvalResult = CodeEvalResultObjectFactory.create(
        'some code', 'some output', [[false, false, false]],
        [], [], null, null);
      var feedback = FeedbackGeneratorService.getFeedback(
        testTask3, codeEvalResult, [0, 1, 2, 3, 4]);

      TranscriptService.recordSnapshot(null, codeEvalResult, feedback);
      var pastFailedCases = feedback.getReinforcement().getPastFailedCases();
      var test1 = testTask3[0].getCorrectnessTests()[0].getStringifiedInput();
      var test2 = testTask3[0].getCorrectnessTests()[1].getStringifiedInput();
      var test3 = testTask3[0].getCorrectnessTests()[2].getStringifiedInput();

      expect(pastFailedCases[test1]).toEqual(false);
      expect(pastFailedCases[test2]).toEqual(undefined);
      expect(pastFailedCases[test3]).toEqual(undefined);

      var codeEvalResult2 = CodeEvalResultObjectFactory.create(
        'some code', 'some output', [[true, false, false]],
        [], [], null, null);
      feedback = FeedbackGeneratorService.getFeedback(
        testTask3, codeEvalResult2, [0, 1, 2, 3, 4]);

      TranscriptService.recordSnapshot(null, codeEvalResult2, feedback);

      pastFailedCases = feedback.getReinforcement().getPastFailedCases();

      expect(pastFailedCases[test1]).toEqual(true);
      expect(pastFailedCases[test2]).toEqual(false);
      expect(pastFailedCases[test3]).toEqual(undefined);

      var codeEvalResult3 = CodeEvalResultObjectFactory.create(
        'some code', 'some output', [[true, true, false]],
        [], [], null, null);
      feedback = FeedbackGeneratorService.getFeedback(
        testTask3, codeEvalResult3, [0, 1, 2, 3, 4]);

      TranscriptService.recordSnapshot(null, codeEvalResult3, feedback);

      pastFailedCases = feedback.getReinforcement().getPastFailedCases();

      expect(pastFailedCases[test1]).toEqual(true);
      expect(pastFailedCases[test2]).toEqual(true);
      expect(pastFailedCases[test3]).toEqual(false);
      var reinforcement = ReinforcementGeneratorService.getReinforcement(
        testTask3[0], codeEvalResult);
      pastFailedCases = reinforcement.getPastFailedCases();

      expect(pastFailedCases[test1]).toEqual(false);
      expect(pastFailedCases[test2]).toEqual(false);
      expect(pastFailedCases[test3]).toEqual(false);
    });

    it('should update passedTestTags if all cases in tag pass', function() {
      var codeEvalResult = CodeEvalResultObjectFactory.create(
        'some code', 'some output', [[true, true, true]],
        [], [], null, null);

      var reinforcement = ReinforcementGeneratorService.getReinforcement(
        testTask3[0], codeEvalResult);
      var passedTags = reinforcement.getPassedTags();

      expect(passedTags.test1).toEqual(true);
    });
  });
});
