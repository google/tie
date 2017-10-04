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

  var SUPPORTED_PYTHON_LIBS;

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    SolutionHandlerService = $injector.get(
      'SolutionHandlerService');
  }));

  // Mock tasks for preprocessing.
  beforeEach(inject(function($injector) {
    TaskObjectFactory = $injector.get(
      'TaskObjectFactory');
    SUPPORTED_PYTHON_LIBS = $injector.get('SUPPORTED_PYTHON_LIBS');

    var taskDict = [{
      instructions: [''],
      prerequisiteSkills: [''],
      acquiredSkills: [''],
      inputFunctionName: null,
      outputFunctionName: null,
      mainFunctionName: 'mockMainFunction',
      testSuites: [{
        id: 'GENERAL_CASE',
        humanReadableName: 'the general case',
        testCases: [{
          input: 'task_1_correctness_test_1',
          allowedOutputs: [true]
        }, {
          input: 'task_1_correctness_test_2',
          allowedOutputs: [true]
        }]
      }],
      buggyOutputTests: [{
        buggyFunctionName: 'AuxiliaryCode.mockAuxiliaryCodeOne',
        messages: [
          "Mock BuggyOutputTest Message One for task1",
          "Mock BuggyOutputTest Message Two for task1",
          "Mock BuggyOutputTest Message Three for task1"
        ]
      }],
      performanceTests: [{
        inputDataAtom: 'meow ',
        transformationFunctionName: 'System.extendString',
        expectedPerformance: 'linear',
        evaluationFunctionName: 'mockMainFunction'
      }]
    }, {
      instructions: [''],
      prerequisiteSkills: [''],
      acquiredSkills: [''],
      inputFunctionName: null,
      outputFunctionName: null,
      mainFunctionName: 'mockMainFunction',
      testSuites: [{
        id: 'GENERAL_CASE',
        humanReadableName: 'the general case',
        testCases: [{
          input: 'task_2_correctness_test_1',
          allowedOutputs: [false]
        }, {
          input: 'task_2_correctness_test_2',
          allowedOutputs: [false]
        }]
      }],
      buggyOutputTests: [{
        buggyFunctionName: 'AuxiliaryCode.mockAuxiliaryCodeTwo',
        messages: [
          "Mock BuggyOutputTest Message One for task2",
          "Mock BuggyOutputTest Message Two for task2",
          "Mock BuggyOutputTest Message Three for task2"
        ]
      }],
      performanceTests: [{
        inputDataAtom: 'meow ',
        transformationFunctionName: 'System.extendString',
        expectedPerformance: 'linear',
        evaluationFunctionName: 'mockMainFunction'
      }]
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
    describe('correctness tests', function() {
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

    describe("prereqCheckFailures", function() {
      it('should return the correct feedback if there is code in global scope',
        function(done) {
          var studentCode = [
            'def mockMainFunction(input):',
            '    return input',
            'mockMainFunction("input")'
          ].join('\n');

          SolutionHandlerService.processSolutionAsync(
            orderedTasks, starterCode, studentCode,
            auxiliaryCode, 'python'
          ).then(function(feedback) {
            expect(feedback.isAnswerCorrect()).toEqual(false);
            expect(feedback.getParagraphs()[0].getContent()).toEqual([
              'Please keep your code within the existing predefined functions',
              '-- we cannot process code in the global scope.'
            ].join(' '));
            done();
          });
        }
      );

      it('should be correctly handled if missing starter code', function(done) {
        SolutionHandlerService.processSolutionAsync(
          orderedTasks, starterCode, '',
          auxiliaryCode, 'python'
        ).then(function(feedback) {
          expect(feedback.isAnswerCorrect()).toEqual(false);
          expect(feedback.getParagraphs()[0].getContent()).toEqual([
            'It looks like you deleted or modified the starter code!  Our ',
            'evaluation program requires the function names given in the ',
            'starter code.  You can press the \'Reset Code\' button to start ',
            'over.  Or, you can copy the starter code below:'
          ].join(''));
          expect(feedback.getParagraphs()[1].getContent()).toEqual(starterCode);
          done();
        });
      });

      it('should be correctly handled if has bad import', function(done) {
        var studentCode = [
          'import pandas',
          'def mockMainFunction(input):',
          '    return True'
        ].join('\n');

        SolutionHandlerService.processSolutionAsync(
          orderedTasks, starterCode, studentCode,
          auxiliaryCode, 'python'
        ).then(function(feedback) {
          expect(feedback.isAnswerCorrect()).toEqual(false);
          expect(feedback.getParagraphs()[0].getContent()).toEqual([
            "It looks like you're importing an external library. However, the ",
            'following libraries are not supported:\n'
          ].join(''));
          expect(feedback.getParagraphs()[1].getContent()).toEqual('pandas');
          expect(feedback.getParagraphs()[2].getContent()).toEqual(
            'Here is a list of libraries we currently support:\n');
          expect(feedback.getParagraphs()[3].getContent()).toEqual(
            SUPPORTED_PYTHON_LIBS.join(', '));
          done();
        });
      });
    });

    describe('potentialSyntaxError', function() {
      it('should correctly handle a syntax error', function(done) {
        var studentCode = [
          'def mockMainFunction(input):',
          '    return True -'
        ].join('\n');

        SolutionHandlerService.processSolutionAsync(
          orderedTasks, starterCode, studentCode,
          auxiliaryCode, 'python'
        ).then(function(feedback) {
          expect(feedback.isAnswerCorrect()).toEqual(false);
          expect(feedback.getParagraphs()[0].getContent().startsWith(
            'SyntaxError:')).toEqual(true);
          done();
        });
      });
    });

    describe('should return the correct feedback if', function() {
      it('there is an infinite loop', function(done) {
        var studentCode = [
          'def mockMainFunction(input):',
          '    return mockMainFunction(input)',
          ''
        ].join('\n');

        SolutionHandlerService.processSolutionAsync(
          orderedTasks, starterCode, studentCode,
          auxiliaryCode, 'python'
        ).then(function(feedback) {
          expect(feedback.getParagraphs()[0].getContent()).toEqual([
            "Looks like your code is hitting an infinite recursive loop.",
            "Check to see that your recursive calls terminate."
          ].join(' '));
          done();
        });
      });

      it('there is a runtime error', function(done) {
        var studentCode = [
          'def mockMainFunction(input):',
          '    return greeting',
          ''
        ].join('\n');

        SolutionHandlerService.processSolutionAsync(
          orderedTasks, starterCode, studentCode,
          auxiliaryCode, 'python'
        ).then(function(feedback) {
          expect(
            feedback.getParagraphs()[0].getContent().startsWith(
                'It looks like greeting isn\'t a declared variable.')
          ).toBe(true);
          done();
        });
      });
    });
  });
});
