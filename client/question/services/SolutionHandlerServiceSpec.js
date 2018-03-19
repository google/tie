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
  var SUPPORTED_PYTHON_LIBS;
  var SolutionHandlerService;
  var TaskObjectFactory;
  var orderedTasks;
  var auxiliaryCode;
  var starterCode;
  var FEEDBACK_TYPE_INPUT_TO_TRY;
  var CORRECTNESS_FEEDBACK_TEXT;
  var taskDict = [{
    instructions: [''],
    prerequisiteSkills: [''],
    acquiredSkills: [''],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'mockMainFunction',
    languageSpecificTips: {
      python: []
    },
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
      ignoredTestSuiteIds: [],
      messages: [
        "Mock BuggyOutputTest Message One for task1",
        "Mock BuggyOutputTest Message Two for task1",
        "Mock BuggyOutputTest Message Three for task1"
      ]
    }],
    suiteLevelTests: [],
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
    languageSpecificTips: {
      python: []
    },
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
      ignoredTestSuiteIds: [],
      messages: [
        "Mock BuggyOutputTest Message One for task2",
        "Mock BuggyOutputTest Message Two for task2",
        "Mock BuggyOutputTest Message Three for task2"
      ]
    }],
    suiteLevelTests: [],
    performanceTests: [{
      inputDataAtom: 'meow ',
      transformationFunctionName: 'System.extendString',
      expectedPerformance: 'linear',
      evaluationFunctionName: 'mockMainFunction'
    }]
  }];

  beforeEach(module('tie'));

  // Mock tasks for preprocessing.
  beforeEach(inject(function($injector) {
    SolutionHandlerService = $injector.get('SolutionHandlerService');
    TaskObjectFactory = $injector.get('TaskObjectFactory');
    SUPPORTED_PYTHON_LIBS = $injector.get('SUPPORTED_PYTHON_LIBS');
    FEEDBACK_TYPE_INPUT_TO_TRY = $injector.get('FEEDBACK_TYPE_INPUT_TO_TRY');
    CORRECTNESS_FEEDBACK_TEXT = $injector.get('CORRECTNESS_FEEDBACK_TEXT');

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
              "Input: \"task_1_correctness_test_2\"");
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
             "Input: \"task_2_correctness_test_1\"");
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
              "Input: \"task_1_correctness_test_1\"");
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
             "Input: \"task_1_correctness_test_1\"");
          done();
        });
      });

      it('should display a new message only if the code changes',
        function(done) {
          var studentCode1 = [
            'def mockMainFunction(input):',
            '    return True'
          ].join('\n');
          var studentCode2 = [
            'def mockMainFunction(input):',
            '    return True or True'
          ].join('\n');

          SolutionHandlerService.processSolutionAsync(
            orderedTasks, starterCode, studentCode1,
            auxiliaryCode, 'python'
          ).then(function(feedback1) {
            expect(feedback1.isAnswerCorrect()).toEqual(false);
            expect(feedback1.getParagraphs()[0].getContent()).toEqual(
               'Mock BuggyOutputTest Message One for task1');

            SolutionHandlerService.processSolutionAsync(
              orderedTasks, starterCode, studentCode1,
              auxiliaryCode, 'python'
            ).then(function(feedback2) {
              expect(feedback2.isAnswerCorrect()).toEqual(false);
              expect(feedback2.getParagraphs()[0].getContent()).toEqual([
                "It looks like you haven't changed your code. Try addressing ",
                "the error before you run again."
              ].join(''));

              SolutionHandlerService.processSolutionAsync(
                orderedTasks, starterCode, studentCode2,
                auxiliaryCode, 'python'
              ).then(function(feedback3) {
                expect(feedback3.isAnswerCorrect()).toEqual(false);
                // The code has changed, so the message changes.
                expect(feedback3.getParagraphs()[0].getContent()).toEqual(
                   'Mock BuggyOutputTest Message One for task1');

                SolutionHandlerService.processSolutionAsync(
                  orderedTasks, starterCode, studentCode1,
                  auxiliaryCode, 'python'
                ).then(function(feedback4) {
                  expect(feedback4.isAnswerCorrect()).toEqual(false);
                  // The code has changed, so the message changes.
                  expect(feedback4.getParagraphs()[0].getContent()).toEqual(
                     'Mock BuggyOutputTest Message Two for task1');
                  done();
                });
              });
            });
          });
        }
      );
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
              'Please keep your code within the existing predefined functions ',
              'or define your own helper functions if you need to ',
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
          expect(feedback.getParagraphs()[1].getContent().startsWith(
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

    describe('buggy output ignored test suites', function() {
      beforeEach(inject(function() {
        // Reconfigure the test suites for the first task.
        taskDict[0].testSuites = [{
          id: 'SUITE1',
          humanReadableName: 'suite 1',
          testCases: [{
            input: 'task_1_suite_1_test_1',
            allowedOutputs: [true]
          }, {
            input: 'task_1_suite_1_test_2',
            allowedOutputs: [true]
          }]
        }, {
          id: 'SUITE2',
          humanReadableName: 'suite 2',
          testCases: [{
            input: 'task_1_suite_2_test_1',
            allowedOutputs: [false]
          }, {
            input: 'task_1_suite_2_test_2',
            allowedOutputs: [false]
          }]
        }];
      }));

      it('should check all buggy outputs if nothing is ignored',
        function(done) {
          taskDict[0].buggyOutputTests[0].ignoredTestSuiteIds = [];
          orderedTasks = taskDict.map(function(task) {
            return TaskObjectFactory.create(task);
          });

          // The buggy function returns True for all cases. The student's code
          // returns True in the first three cases and False in the fourth.
          var studentCode = [
            'def mockMainFunction(input):',
            '    return input != "task_1_suite_2_test_2"',
            ''
          ].join('\n');

          SolutionHandlerService.processSolutionAsync(
            orderedTasks, starterCode, studentCode, auxiliaryCode, 'python'
          ).then(function(feedback) {
            expect(
              CORRECTNESS_FEEDBACK_TEXT[FEEDBACK_TYPE_INPUT_TO_TRY]).toContain(
              feedback.getParagraphs()[0].getContent());
            done();
          });
        }
      );

      it('should ignore buggy outputs for ignored suite ids', function(done) {
        taskDict[0].buggyOutputTests[0].ignoredTestSuiteIds = ['SUITE2'];
        orderedTasks = taskDict.map(function(task) {
          return TaskObjectFactory.create(task);
        });

        // The buggy function returns True for all cases. The student's code
        // returns True in the first three cases and False in the fourth.
        var studentCode = [
          'def mockMainFunction(input):',
          '    return input != "task_1_suite_2_test_2"',
          ''
        ].join('\n');

        SolutionHandlerService.processSolutionAsync(
          orderedTasks, starterCode, studentCode, auxiliaryCode, 'python'
        ).then(function(feedback) {
          expect(feedback.getParagraphs()[0].getContent()).toBe(
            'Mock BuggyOutputTest Message One for task1');
          done();
        });
      });
    });

    describe('suite-level tests', function() {
      beforeEach(inject(function() {
        // Reconfigure the test suites, buggy output tests and suite-level
        // tests for the first task.
        taskDict[0].testSuites = [{
          id: 'SUITE1',
          humanReadableName: 'suite 1',
          testCases: [{
            input: 'task_1_suite_1_test_1',
            allowedOutputs: [true]
          }, {
            input: 'task_1_suite_1_test_2',
            allowedOutputs: [true]
          }]
        }, {
          id: 'SUITE2',
          humanReadableName: 'suite 2',
          testCases: [{
            input: 'task_1_suite_2_test_1',
            allowedOutputs: [false]
          }, {
            input: 'task_1_suite_2_test_2',
            allowedOutputs: [false]
          }]
        }];
        taskDict[0].buggyOutputTests = [];
        taskDict[0].suiteLevelTests = [{
          testSuiteIdsThatMustPass: ['SUITE1'],
          testSuiteIdsThatMustFail: ['SUITE2'],
          messages: ['suite_message1']
        }];
      }));

      it('should return suite-level feedback if the condition is triggered',
        function(done) {
          orderedTasks = taskDict.map(function(task) {
            return TaskObjectFactory.create(task);
          });

          // This code passes suite 1 and fails suite 2.
          var studentCode = [
            'def mockMainFunction(input):',
            '    return True',
            ''
          ].join('\n');

          SolutionHandlerService.processSolutionAsync(
            orderedTasks, starterCode, studentCode, auxiliaryCode, 'python'
          ).then(function(feedback) {
            expect(feedback.getParagraphs()[0].getContent()).toBe(
              'suite_message1');
            done();
          });
        }
      );

      it([
        'should not return suite-level feedback if the passing-suite ',
        ' prerequisites do not hold'
      ].join(''), function(done) {
        orderedTasks = taskDict.map(function(task) {
          return TaskObjectFactory.create(task);
        });

        // This code passes one test case in suite 1 and fails the other, thus
        // failing the suite.
        var studentCode = [
          'def mockMainFunction(input):',
          '    return input == "task_1_suite_1_test_1"',
          ''
        ].join('\n');

        SolutionHandlerService.processSolutionAsync(
          orderedTasks, starterCode, studentCode, auxiliaryCode, 'python'
        ).then(function(feedback) {
          expect(
            CORRECTNESS_FEEDBACK_TEXT[FEEDBACK_TYPE_INPUT_TO_TRY]).toContain(
            feedback.getParagraphs()[0].getContent());
          done();
        });
      });

      it([
        'should consider a suite failed if at least one test in it fails'
      ].join(''), function(done) {
        orderedTasks = taskDict.map(function(task) {
          return TaskObjectFactory.create(task);
        });

        // This code passes suite 1, and passes one of the two tests in suite 2.
        var studentCode = [
          'def mockMainFunction(input):',
          '    return input != "task_1_suite_2_test_2"',
          ''
        ].join('\n');

        SolutionHandlerService.processSolutionAsync(
          orderedTasks, starterCode, studentCode, auxiliaryCode, 'python'
        ).then(function(feedback) {
          expect(feedback.getParagraphs()[0].getContent()).toBe(
            'suite_message1');
          done();
        });
      });
    });
  });
});
