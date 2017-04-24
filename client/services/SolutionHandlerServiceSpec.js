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

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    SolutionHandlerService = $injector.get(
      'SolutionHandlerService');
  }));

  // Mock tasks for preprocessing.
  beforeEach(inject(function($injector) {
    TaskObjectFactory = $injector.get(
      'TaskObjectFactory');

    var taskDict = [
      {
        instructions: [''],
        prerequisiteSkills: [''],
        acquiredSkills: [''],
        inputFunctionName: null,
        outputFunctionName: null,
        mainFunctionName: 'mockMainFunction',
        correctnessTests: [{
          input: 'testcase_0',
          allowedOutputs: [true]
        }, {
          input: 'testcase_1',
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
      },
      {
        instructions: [''],
        prerequisiteSkills: [''],
        acquiredSkills: [''],
        inputFunctionName: null,
        outputFunctionName: null,
        mainFunctionName: 'mockMainFunction',
        correctnessTests: [{
          input: 'testcase_2',
          allowedOutputs: [false]
        }, {
          input: 'testcase_3',
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
      }
    ];

    orderedTasks = taskDict.map(function(task) {
      return TaskObjectFactory.create(task);
    });
  }));

  // Mock auxiliary code for processing.
  beforeEach(function() {
    auxiliaryCode = [
      'class AuxiliaryCode(object):',
      '    @classmethod',
      '    def mockAuxiliaryCodeOne(cls, input):',
      '        return True',
      '    @classmethod',
      '    def mockAuxiliaryCodeTwo(cls, input):',
      '        return False'
    ].join('\n');
  });

  describe('processSolutionAsync', function() {
    describe('correctnessTests', function() {
      it('should check both task1 and task2 to ' +
          'verify that the learner has the correct answer', function() {
        var studentCode = [
          'def mockMainFunction(input):',
          '    if len(input) > 0 and (input[-1] == "0" or input[-1] == "1"):',
          '        return True',
          '    return False'
        ].join('\n');

        setTimeout(function() {
          SolutionHandlerService.processSolutionAsync(
            orderedTasks, studentCode,
            auxiliaryCode, 'python'
          ).then(function(feedback) {
            expect(feedback.isAnswerCorrect()).toEqual(true);
          });
        }, 0);
      });

      it('should check both task1 and task2 to ' +
          'verify that the learner fails on task1', function() {
        var studentCode = [
          'def mockMainFunction(input):',
          '    if len(input) > 0 and input[-1] == "0":',
          '        return True',
          '    return False'
        ].join('\n');

        setTimeout(function() {
          SolutionHandlerService.processSolutionAsync(
            orderedTasks, studentCode,
            auxiliaryCode, 'python'
          ).then(function(feedback) {
            expect(feedback.isAnswerCorrect()).toEqual(false);
            expect(feedback.getParagraphs()[1].getContent()).toEqual(
                "Input: \"testcase_1\"\nOutput: False");
          });
        }, 0);
      });

      it('should check both task1 and task2 to ' +
          'verify that the learner fails on task2', function() {
        var studentCode = [
          'def mockMainFunction(input):',
          '    if len(input) > 0 and input[-1] == "3":',
          '        return False',
          '    return True'
        ].join('\n');

        setTimeout(function() {
          SolutionHandlerService.processSolutionAsync(
            orderedTasks, studentCode,
            auxiliaryCode, 'python'
          ).then(function(feedback) {
            expect(feedback.isAnswerCorrect()).toEqual(false);
            expect(feedback.getParagraphs()[1].getContent()).toEqual(
               "Input: \"testcase_2\"\nOutput: True");
          });
        }, 0);
      });

      it('should check both task1 and task2, ' +
          'and though learner fails on both tasks, ' +
          'error message of task1 is displayed', function() {
        var studentCode = [
          'def mockMainFunction(input):',
          '    if len(input) > 0 and (input[-1] == "0" or input[-1] == "2"):',
          '        return False',
          '    return True'
        ].join('\n');

        setTimeout(function() {
          SolutionHandlerService.processSolutionAsync(
            orderedTasks, studentCode,
            auxiliaryCode, 'python'
          ).then(function(feedback) {
            expect(feedback.isAnswerCorrect()).toEqual(false);
            expect(feedback.getParagraphs()[1].getContent()).toEqual(
                "Input: \"testcase_0\"\nOutput: False");
          });
        }, 0);
      });
    });

    describe("buggyOutputTests", function() {
      it('should check both task1 and task2 to ' +
          'verify that the learner fails on task1', function() {
        var studentCode = [
          'def mockMainFunction(input):',
          '    return True'
        ].join('\n');

        setTimeout(function() {
          SolutionHandlerService.processSolutionAsync(
            orderedTasks, studentCode,
            auxiliaryCode, 'python'
          ).then(function(feedback) {
            expect(feedback.isAnswerCorrect()).toEqual(false);
            expect(feedback.getParagraphs()[0].getContent()).toEqual(
               "Mock BuggyOutputTest Message One for task1");
          });
        }, 0);
      });

      it('should check both task1 and task2, ' +
          'though learner fails on task2 buggy tests, ' +
          'error message of task1 is displayed', function() {
        var studentCode = [
          'def mockMainFunction(input):',
          '    return False'
        ].join('\n');

        setTimeout(function() {
          SolutionHandlerService.processSolutionAsync(
            orderedTasks, studentCode,
            auxiliaryCode, 'python'
          ).then(function(feedback) {
            expect(feedback.isAnswerCorrect()).toEqual(false);
            expect(feedback.getParagraphs()[1].getContent()).toEqual(
               "Input: \"testcase_0\"\nOutput: False");
          });
        }, 0);
      });
    });
  });
});
