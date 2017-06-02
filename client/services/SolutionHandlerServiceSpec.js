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
 * @fileoverview Unit tests for SolutionHandlerService.
 */

describe('SolutionHandlerService', function() {
  var SolutionHandlerService;
  var TaskObjectFactory;
  var orderedTasks;
  var auxiliaryCode;
  var starterCode;

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    SolutionHandlerService = $injector.get(
      'SolutionHandlerService');
  }));

  // Mock tasks for preprocessing.
  beforeEach(inject(function($injector) {
    TaskObjectFactory = $injector.get(
      'TaskObjectFactory');

    var taskDict = [{
      instructions: [''],
      prerequisiteSkills: [''],
      acquiredSkills: [''],
      inputFunctionName: null,
      outputFunctionName: null,
      mainFunctionName: 'mockMainFunction',
      correctnessTests: [{
        input: 'task_1_correctness_test_1',
        allowedOutputs: [true]
      }, {
        input: 'task_1_correctness_test_2',
        allowedOutputs: [true]
      }],
      buggyOutputTests: [{
        buggyFunctionName: 'AuxiliaryCode.mockAuxiliaryCodeOne',
        messages: [
          "Mock BuggyOutputTest Message One for task1",
          "Mock BuggyOutputTest Message Two for task1",
          "Mock BuggyOutputTest Message Three for task1"
        ]
      }],
      performanceTests: []
    }, {
      instructions: [''],
      prerequisiteSkills: [''],
      acquiredSkills: [''],
      inputFunctionName: null,
      outputFunctionName: null,
      mainFunctionName: 'mockMainFunction',
      correctnessTests: [{
        input: 'task_2_correctness_test_1',
        allowedOutputs: [false]
      }, {
        input: 'task_2_correctness_test_2',
        allowedOutputs: [false]
      }],
      buggyOutputTests: [{
        buggyFunctionName: 'AuxiliaryCode.mockAuxiliaryCodeTwo',
        messages: [
          "Mock BuggyOutputTest Message One for task2",
          "Mock BuggyOutputTest Message Two for task2",
          "Mock BuggyOutputTest Message Three for task2"
        ]
      }],
      performanceTests: []
    }];

    orderedTasks = taskDict.map(function(task) {
      return TaskObjectFactory.create(task);
    });

    auxiliaryCode = [
      'class AuxiliaryCode(object):',
      '    @classmethod',
      '    def mockAuxiliaryCodeOne(cls, input):',
      '        return True',
      '    @classmethod',
      '    def mockAuxiliaryCodeTwo(cls, input):',
      '        return False'
    ].join('\n');

    starterCode = [
      'def mockMainFunction(input):',
      '    return True'
    ].join('\n');
  }));

  describe('processSolutionAsync', function() {
    describe('correctnessTests', function() {
      it('should check both task1 and task2 to ' +
          'verify that the learner has the correct answer', function(done) {
        var studentCode = [
          'def mockMainFunction(input):',
          '    if len(input) > 0 and input[:6] == "task_1":',
          '        return True',
          '    return False'
        ].join('\n');

        SolutionHandlerService.processSolutionAsync(
          orderedTasks, starterCode, studentCode,
          auxiliaryCode, 'python'
        ).then(function(feedback) {
          expect(feedback.isAnswerCorrect()).toEqual(true);
          done();
        });
      });

      it('should check both task1 and task2 to ' +
          'verify that the learner fails on task1', function(done) {
        var studentCode = [
          'def mockMainFunction(input):',
          '    if len(input) > 0 and input == "task_1_correctness_test_1":',
          '        return True',
          '    return False'
        ].join('\n');

        SolutionHandlerService.processSolutionAsync(
          orderedTasks, starterCode, studentCode,
          auxiliaryCode, 'python'
        ).then(function(feedback) {
          expect(feedback.isAnswerCorrect()).toEqual(false);
          expect(feedback.getParagraphs()[1].getContent()).toEqual(
              "Input: \"task_1_correctness_test_2\"\nOutput: False");
          done();
        });
      });

      it('should check both task1 and task2 to ' +
          'verify that the learner fails on task2', function(done) {
        var studentCode = [
          'def mockMainFunction(input):',
          '    if len(input) > 0 and input == "task_2_correctness_test_2":',
          '        return False',
          '    return True'
        ].join('\n');

        SolutionHandlerService.processSolutionAsync(
          orderedTasks, starterCode, studentCode,
          auxiliaryCode, 'python'
        ).then(function(feedback) {
          expect(feedback.isAnswerCorrect()).toEqual(false);
          expect(feedback.getParagraphs()[1].getContent()).toEqual(
             "Input: \"task_2_correctness_test_1\"\nOutput: True");
          done();
        });
      });

      it('should check both task1 and task2, ' +
          'and though learner fails on both tasks, ' +
          'error message of task1 is displayed', function(done) {
        var studentCode = [
          'def mockMainFunction(input):',
          '    if len(input) > 0 and input[-1] == "1":',
          '        return False',
          '    return True'
        ].join('\n');

        SolutionHandlerService.processSolutionAsync(
          orderedTasks, starterCode, studentCode,
          auxiliaryCode, 'python'
        ).then(function(feedback) {
          expect(feedback.isAnswerCorrect()).toEqual(false);
          expect(feedback.getParagraphs()[1].getContent()).toEqual(
              "Input: \"task_1_correctness_test_1\"\nOutput: False");
          done();
        });
      });
    });

    describe("buggyOutputTests", function() {
      it('should check both task1 and task2 to ' +
          'verify that the learner fails on task1', function(done) {
        var studentCode = [
          'def mockMainFunction(input):',
          '    return True'
        ].join('\n');

        SolutionHandlerService.processSolutionAsync(
          orderedTasks, starterCode, studentCode,
          auxiliaryCode, 'python'
        ).then(function(feedback) {
          expect(feedback.isAnswerCorrect()).toEqual(false);
          expect(feedback.getParagraphs()[0].getContent()).toEqual(
             "Mock BuggyOutputTest Message One for task1");
          done();
        });
      });

      it('should check both task1 and task2, ' +
          'though learner fails on task2 buggy tests, ' +
          'error message of task1 is displayed', function(done) {
        var studentCode = [
          'def mockMainFunction(input):',
          '    return False'
        ].join('\n');

        SolutionHandlerService.processSolutionAsync(
          orderedTasks, starterCode, studentCode,
          auxiliaryCode, 'python'
        ).then(function(feedback) {
          expect(feedback.isAnswerCorrect()).toEqual(false);
          expect(feedback.getParagraphs()[1].getContent()).toEqual(
             "Input: \"task_1_correctness_test_1\"\nOutput: False");
          done();
        });
      });
    });
  });
});
