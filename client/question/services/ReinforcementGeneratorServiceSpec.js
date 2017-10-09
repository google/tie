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
  var taskWithTwoSuites;
  // Task with 3 correctness tests
  var taskWithThreeSuites;
  // Task with 3 correctness tests with the same tag
  var taskWithThreeCases;

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

    var taskDictWithTwoSuites = [{
      instructions: [''],
      prerequisiteSkills: [''],
      acquiredSkills: [''],
      inputFunctionName: null,
      outputFunctionName: null,
      mainFunctionName: 'mockMainFunction',
      testSuites: [{
        id: 'TAG_ONE',
        humanReadableName: 'tag1',
        testCases: [{
          input: 'task_1_correctness_test_1',
          allowedOutputs: [true]
        }]
      }, {
        id: 'TAG_TWO',
        humanReadableName: 'tag2',
        testCases: [{
          input: 'task_1_correctness_test_2',
          allowedOutputs: [true]
        }]
      }],
      buggyOutputTests: [],
      suiteLevelTests: [],
      performanceTests: []
    }];

    var taskDictWithThreeSuites = [{
      instructions: [''],
      prerequisiteSkills: [''],
      acquiredSkills: [''],
      inputFunctionName: null,
      outputFunctionName: null,
      mainFunctionName: 'mockMainFunction',
      testSuites: [{
        id: 'TAG_ONE',
        humanReadableName: 'tag1',
        testCases: [{
          input: 'task_2_correctness_test_1',
          allowedOutputs: [true]
        }]
      }, {
        id: 'TAG_TWO',
        humanReadableName: 'tag2',
        testCases: [{
          input: 'task_2_correctness_test_2',
          allowedOutputs: [true]
        }]
      }, {
        id: 'TAG_THREE',
        humanReadableName: 'tag3',
        testCases: [{
          input: 'task_2_correctness_test_3',
          allowedOutputs: [true]
        }]
      }],
      buggyOutputTests: [],
      suiteLevelTests: [],
      performanceTests: []
    }];

    var taskDictWithThreeTestCases = [{
      instructions: [''],
      prerequisiteSkills: [''],
      acquiredSkills: [''],
      inputFunctionName: null,
      outputFunctionName: null,
      mainFunctionName: 'mockMainFunction',
      testSuites: [{
        id: 'TAG',
        humanReadableName: 'tag',
        testCases: [{
          input: 'task_3_correctness_test_1',
          allowedOutputs: [true]
        }, {
          input: 'task_3_correctness_test_2',
          allowedOutputs: [true]
        }, {
          input: 'task_3_correctness_test_3',
          allowedOutputs: [true]
        }]
      }],
      buggyOutputTests: [],
      suiteLevelTests: [],
      performanceTests: []
    }];

    taskWithTwoSuites = taskDictWithTwoSuites.map(function(task) {
      return TaskObjectFactory.create(task);
    });

    taskWithThreeSuites = taskDictWithThreeSuites.map(function(task) {
      return TaskObjectFactory.create(task);
    });

    taskWithThreeCases = taskDictWithThreeTestCases.map(function(task) {
      return TaskObjectFactory.create(task);
    });
  }));

  describe('getReinforcement', function() {
    it('copies and updates previous reinforcement if from the same task',
      function() {
        // Simulate most recent snapshot.
        var codeEvalResult = CodeEvalResultObjectFactory.create(
          'some code', 'some output', [[[false], [false]]],
          [], [], null, null);
        var feedback = FeedbackGeneratorService.getFeedback(
          taskWithTwoSuites, codeEvalResult, [0, 1, 2, 3, 4]);

        TranscriptService.recordSnapshot(null, codeEvalResult, feedback);

        var pastFailedCases = feedback.getReinforcement().getPastFailedCases();
        var passedTags = feedback.getReinforcement().getPassedTags();

        var expectedPastFailedCases = {
          '"task_1_correctness_test_1"': false
        };

        expect(pastFailedCases).toEqual(expectedPastFailedCases);
        expect(Object.keys(passedTags).length).toEqual(0);

        var codeEvalResult2 = CodeEvalResultObjectFactory.create(
          'some code', 'some output', [[[true], [false]]], [], [], null, null);

        var reinforcement = ReinforcementGeneratorService.getReinforcement(
          taskWithTwoSuites[0], codeEvalResult2);
        var reinforcementPassedTags = reinforcement.getPassedTags();
        pastFailedCases = reinforcement.getPastFailedCases();
        expectedPastFailedCases = {
          '"task_1_correctness_test_1"': true,
          '"task_1_correctness_test_2"': false
        };

        expect(pastFailedCases).toEqual(expectedPastFailedCases);
        expect(reinforcementPassedTags.tag1).toEqual(true);
      });

    it('does not copy reinforcement if the previous reinforcement is not from' +
      ' the same task', function() {
      var codeEvalResult = CodeEvalResultObjectFactory.create(
        'some code', 'some output', [[[false], [false], [false]]],
        [], [], null, null);
      var feedback = FeedbackGeneratorService.getFeedback(
        taskWithThreeSuites, codeEvalResult, [0, 1, 2, 3, 4]);

      TranscriptService.recordSnapshot(null, codeEvalResult, feedback);

      var pastFailedCases = feedback.getReinforcement().getPastFailedCases();
      var task = taskWithThreeSuites[0];
      var input1 = (
        task.getTestSuites()[0].getTestCases()[0].getStringifiedInput());

      expect(pastFailedCases[input1]).toEqual(false);

      var codeEvalResult2 = CodeEvalResultObjectFactory.create(
        'some code', 'some output', [[[false], [false]]], [], [], null, null);

      var reinforcement = ReinforcementGeneratorService.getReinforcement(
        taskWithTwoSuites[0], codeEvalResult2);
      pastFailedCases = reinforcement.getPastFailedCases();

      expect(pastFailedCases[input1]).toEqual(undefined);
      task = taskWithTwoSuites[0];
      input1 = task.getTestSuites()[0].getTestCases()[0].getStringifiedInput();
      expect(pastFailedCases[input1]).toEqual(false);
    });

    it('should only display one new failed case among all tasks', function() {
      var codeEvalResult = CodeEvalResultObjectFactory.create(
        'some code', 'some output', [[[false], [false], [false]]],
        [], [], null, null);
      var feedback = FeedbackGeneratorService.getFeedback(
        taskWithThreeSuites, codeEvalResult, [0, 1, 2, 3, 4]);

      TranscriptService.recordSnapshot(null, codeEvalResult, feedback);
      var reinforcement = ReinforcementGeneratorService.getReinforcement(
        taskWithThreeSuites[0], codeEvalResult);

      var pastFailedCases = reinforcement.getPastFailedCases();

      var expectedPastFailedCases = {
        '"task_2_correctness_test_1"': false
      };

      expect(Object.keys(pastFailedCases).length).toEqual(1);
      expect(pastFailedCases).toEqual(expectedPastFailedCases);

      var updatedCodeEvalResult = CodeEvalResultObjectFactory.create(
        'some code', 'some output', [[[true], [false], [false]]], [], [], null,
        null);
      reinforcement = ReinforcementGeneratorService.getReinforcement(
        taskWithThreeSuites[0], updatedCodeEvalResult);

      pastFailedCases = reinforcement.getPastFailedCases();
      expectedPastFailedCases = {
        '"task_2_correctness_test_1"': true,
        '"task_2_correctness_test_2"': false
      };

      expect(Object.keys(pastFailedCases).length).toEqual(2);
      expect(pastFailedCases).toEqual(expectedPastFailedCases);
      expect(reinforcement.getPassedTags().tag1).toEqual(true);
    });

    it('should update passedTags if previously passing testTag fails',
      function() {
        var codeEvalResult = CodeEvalResultObjectFactory.create(
          'some code', 'some output', [[[true], [true], [true]]],
          [], [], null, null);
        var feedback = FeedbackGeneratorService.getFeedback(
          taskWithThreeSuites, codeEvalResult, [0, 1, 2, 3, 4]);

        TranscriptService.recordSnapshot(null, codeEvalResult, feedback);

        var pastFailedCases = feedback.getReinforcement().getPastFailedCases();
        var task = taskWithThreeSuites[0];

        var expectedPastFailedCases = {};
        var expectedPassedTags = {
          tag1: true,
          tag2: true,
          tag3: true
        };

        expect(Object.keys(pastFailedCases).length).toEqual(0);
        expect(pastFailedCases).toEqual(expectedPastFailedCases);
        expect(feedback.getReinforcement().getPassedTags()).toEqual(
          expectedPassedTags);
        // Make the first test fail
        codeEvalResult = CodeEvalResultObjectFactory.create(
          'some code', 'some output', [[[false], [true], [true]]],
          [], [], null, null);
        var reinforcement = ReinforcementGeneratorService.getReinforcement(
          task, codeEvalResult);
        pastFailedCases = reinforcement.getPastFailedCases();

        expectedPassedTags = {
          tag1: false,
          tag2: true,
          tag3: true
        };

        expect(reinforcement.getPassedTags().tag1).toEqual(false);
      });

    it('should update pastFailedCases if previously passing tag fails',
      function() {
        var codeEvalResult = CodeEvalResultObjectFactory.create(
          'some code', 'some output', [[[false], [false], [false]]],
          [], [], null, null);
        var feedback = FeedbackGeneratorService.getFeedback(
          taskWithThreeSuites, codeEvalResult, [0, 1, 2, 3, 4]);

        TranscriptService.recordSnapshot(null, codeEvalResult, feedback);
        var pastFailedCases = feedback.getReinforcement().getPastFailedCases();

        var expectedPastFailedCases = {
          '"task_2_correctness_test_1"': false
        };

        expect(pastFailedCases).toEqual(expectedPastFailedCases);

        var codeEvalResult2 = CodeEvalResultObjectFactory.create(
          'some code', 'some output', [[[true], [false], [false]]],
          [], [], null, null);
        feedback = FeedbackGeneratorService.getFeedback(
          taskWithThreeSuites, codeEvalResult2, [0, 1, 2, 3, 4]);
        TranscriptService.recordSnapshot(null, codeEvalResult2, feedback);

        pastFailedCases = feedback.getReinforcement().getPastFailedCases();

        expectedPastFailedCases = {
          '"task_2_correctness_test_1"': true,
          '"task_2_correctness_test_2"': false
        };

        expect(pastFailedCases).toEqual(expectedPastFailedCases);

        var codeEvalResult3 = CodeEvalResultObjectFactory.create(
          'some code', 'some output', [[[true], [true], [false]]],
          [], [], null, null);
        feedback = FeedbackGeneratorService.getFeedback(
          taskWithThreeSuites, codeEvalResult3, [0, 1, 2, 3, 4]);

        TranscriptService.recordSnapshot(null, codeEvalResult3, feedback);

        pastFailedCases = feedback.getReinforcement().getPastFailedCases();

        expectedPastFailedCases = {
          '"task_2_correctness_test_1"': true,
          '"task_2_correctness_test_2"': true,
          '"task_2_correctness_test_3"': false
        };

        expect(pastFailedCases).toEqual(expectedPastFailedCases);

        var reinforcement = ReinforcementGeneratorService.getReinforcement(
          taskWithThreeSuites[0], codeEvalResult);
        pastFailedCases = reinforcement.getPastFailedCases();

        expectedPastFailedCases = {
          '"task_2_correctness_test_1"': false,
          '"task_2_correctness_test_2"': true,
          '"task_2_correctness_test_3"': false
        };

        expect(pastFailedCases).toEqual(expectedPastFailedCases);
      });

    it('should update pastFailedCases if previously passing case fails' +
      ' with the same tag', function() {
      var codeEvalResult = CodeEvalResultObjectFactory.create(
        'some code', 'some output', [[[false, false, false]]],
        [], [], null, null);
      var feedback = FeedbackGeneratorService.getFeedback(
        taskWithThreeCases, codeEvalResult, [0, 1, 2, 3, 4]);

      TranscriptService.recordSnapshot(null, codeEvalResult, feedback);
      var pastFailedCases = feedback.getReinforcement().getPastFailedCases();

      var expectedPastFailedCases = {
        '"task_3_correctness_test_1"': false
      };

      expect(pastFailedCases).toEqual(expectedPastFailedCases);

      var codeEvalResult2 = CodeEvalResultObjectFactory.create(
        'some code', 'some output', [[[true, false, false]]],
        [], [], null, null);
      feedback = FeedbackGeneratorService.getFeedback(
        taskWithThreeCases, codeEvalResult2, [0, 1, 2, 3, 4]);

      TranscriptService.recordSnapshot(null, codeEvalResult2, feedback);

      pastFailedCases = feedback.getReinforcement().getPastFailedCases();

      expectedPastFailedCases = {
        '"task_3_correctness_test_1"': true,
        '"task_3_correctness_test_2"': false
      };

      expect(pastFailedCases).toEqual(expectedPastFailedCases);

      var codeEvalResult3 = CodeEvalResultObjectFactory.create(
        'some code', 'some output', [[[true, true, false]]],
        [], [], null, null);
      feedback = FeedbackGeneratorService.getFeedback(
        taskWithThreeCases, codeEvalResult3, [0, 1, 2, 3, 4]);

      TranscriptService.recordSnapshot(null, codeEvalResult3, feedback);

      pastFailedCases = feedback.getReinforcement().getPastFailedCases();

      expectedPastFailedCases = {
        '"task_3_correctness_test_1"': true,
        '"task_3_correctness_test_2"': true,
        '"task_3_correctness_test_3"': false
      };

      expect(pastFailedCases).toEqual(expectedPastFailedCases);

      var reinforcement = ReinforcementGeneratorService.getReinforcement(
        taskWithThreeCases[0], codeEvalResult);
      pastFailedCases = reinforcement.getPastFailedCases();

      expectedPastFailedCases = {
        '"task_3_correctness_test_1"': false,
        '"task_3_correctness_test_2"': false,
        '"task_3_correctness_test_3"': false
      };

      expect(pastFailedCases).toEqual(expectedPastFailedCases);
    });

    it('should update passedTestTags if all cases in tag pass', function() {
      var codeEvalResult = CodeEvalResultObjectFactory.create(
        'some code', 'some output', [[[true, true, true]]],
        [], [], null, null);

      var reinforcement = ReinforcementGeneratorService.getReinforcement(
        taskWithThreeCases[0], codeEvalResult);
      var passedTags = reinforcement.getPassedTags();

      expect(passedTags.tag).toEqual(true);
    });
  });
});
