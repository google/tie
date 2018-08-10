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
 * @fileoverview Unit tests for ConversationManagerService.
 */

describe('ConversationManagerService', function() {
  var SUPPORTED_PYTHON_LIBS;
  var ConversationManagerService;
  var CurrentQuestionService;
  var ExpectedFeedbackObjectFactory;
  var QuestionObjectFactory;
  var TaskObjectFactory;
  var question;
  var orderedTasks;
  var auxiliaryCode;
  var starterCode;
  var CORRECTNESS_STATE_INPUT_DISPLAYED;
  var CORRECTNESS_FEEDBACK_TEXT;
  var TITLE = "title";
  var STARTER_CODE = "starterCode";
  var AUXILIARY_CODE = "auxiliaryCode";
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
    performanceTests: []
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
    performanceTests: []
  }];

  beforeEach(module('tie'));

  // Mock tasks for preprocessing.
  beforeEach(inject(function($injector) {
    ConversationManagerService = $injector.get('ConversationManagerService');
    TaskObjectFactory = $injector.get('TaskObjectFactory');
    ExpectedFeedbackObjectFactory = $injector.get(
      'ExpectedFeedbackObjectFactory');
    SUPPORTED_PYTHON_LIBS = $injector.get('SUPPORTED_PYTHON_LIBS');
    CORRECTNESS_STATE_INPUT_DISPLAYED = $injector.get(
      'CORRECTNESS_STATE_INPUT_DISPLAYED');
    CORRECTNESS_FEEDBACK_TEXT = $injector.get('CORRECTNESS_FEEDBACK_TEXT');
    QuestionObjectFactory = $injector.get(
      'QuestionObjectFactory');
    CurrentQuestionService = $injector.get('CurrentQuestionService');
    question = QuestionObjectFactory.create({
      title: TITLE,
      starterCode: STARTER_CODE,
      auxiliaryCode: AUXILIARY_CODE,
      tasks: taskDict
    });
    spyOn(
      CurrentQuestionService, 'getCurrentQuestion').and.returnValue(question);

    orderedTasks = taskDict.map(function(task) {
      return TaskObjectFactory.create(task);
    });

    auxiliaryCode = [
      'class AuxiliaryCode(object):',
      '    @classmethod',
      '    def mockAuxiliaryCodeOne(cls, input):',
      '        return input.endswith("1")',
      '    @classmethod',
      '    def mockAuxiliaryCodeTwo(cls, input):',
      '        return False'
    ].join('\n');

    starterCode = [
      'def mockMainFunction(input):',
      '    return True'
    ].join('\n');
  }));

  // Recursive method to verify submissions.
  var verifySubmissions = function(
      errorMessages, done, tasks, starterCodeToUse, auxiliaryCodeToUse,
      language, submissionSpecs) {
    ConversationManagerService.processSolutionAsync(
      tasks, starterCodeToUse, submissionSpecs[0].code, auxiliaryCodeToUse,
      language
    ).then(function(submissionResult) {
      var newErrorMessages = errorMessages.concat(
        submissionSpecs[0].expectedFeedback.verifyFeedback(
          submissionResult));

      if (submissionSpecs.length === 1) {
        expect(newErrorMessages).toEqual([]);
        done();
      } else {
        verifySubmissions(
          newErrorMessages, done, tasks, starterCode, auxiliaryCode,
          language, submissionSpecs.slice(1));
      }
    });
  };

  describe('processSolutionAsync', function() {
    describe('correctness tests', function() {
      it('should check both task1 and task2 to ' +
          'verify that the learner has the correct answer', function(done) {
        verifySubmissions(
          [], done, orderedTasks, starterCode, auxiliaryCode, 'python',
          [{
            code: [
              'def mockMainFunction(input):',
              '    if len(input) > 0 and input[:6] == "task_1":',
              '        return True',
              '    return False'
            ].join('\n'),
            expectedFeedback: ExpectedFeedbackObjectFactory.create(
              null, null, '', true)
          }]
        );
      });

      it('should contain the correct stdout upon question ' +
          'completion', function(done) {
        verifySubmissions(
          [], done, orderedTasks, starterCode, auxiliaryCode, 'python',
          [{
            code: [
              'def mockMainFunction(input):',
              '    print(input)',
              '    if len(input) > 0 and input[:6] == "task_1":',
              '        return True',
              '    return False'
            ].join('\n'),
            expectedFeedback: ExpectedFeedbackObjectFactory.create(
              null, null, 'task_2_correctness_test_2\n', true)
          }]
        );
      });

      it('should check both task1 and task2 to ' +
          'verify that the learner fails on task1', function(done) {
        verifySubmissions(
          [], done, orderedTasks, starterCode, auxiliaryCode, 'python',
          [{
            code: [
              'def mockMainFunction(input):',
              '    if len(input) > 0 and input == "task_1_correctness_test_1":',
              '        return True',
              '    return False'
            ].join('\n'),
            expectedFeedback: ExpectedFeedbackObjectFactory.create(
              null, 'Input: "task_1_correctness_test_2"')
          }]
        );
      });

      it('should contain correct stdout for task completion', function(done) {
        verifySubmissions(
          [], done, orderedTasks, starterCode, auxiliaryCode, 'python',
          [{
            code: [
              'def mockMainFunction(input):',
              '    print(input)',
              '    if len(input) > 0 and input == "task_1_correctness_test_1":',
              '        return True',
              '    return False'
            ].join('\n'),
            expectedFeedback: ExpectedFeedbackObjectFactory.create(
              null, 'Input: "task_1_correctness_test_2"',
              'task_1_correctness_test_2\n')
          }]
        );
      });

      it('should check both task1 and task2 to ' +
          'verify that the learner fails on task2', function(done) {
        verifySubmissions(
          [], done, orderedTasks, starterCode, auxiliaryCode, 'python',
          [{
            code: [
              'def mockMainFunction(input):',
              '    if len(input) > 0 and input == "task_2_correctness_test_2":',
              '        return False',
              '    return True'
            ].join('\n'),
            expectedFeedback: ExpectedFeedbackObjectFactory.create(
              null, 'Input: "task_2_correctness_test_1"')
          }]
        );
      });

      it('should contain the correct stdout if first test of second task ' +
         'failed', function(done) {
        verifySubmissions(
          [], done, orderedTasks, starterCode, auxiliaryCode, 'python',
          [{
            code: [
              'def mockMainFunction(input):',
              '    print(input)',
              '    if len(input) > 0 and input == "task_2_correctness_test_2":',
              '        return False',
              '    return True'
            ].join('\n'),
            expectedFeedback: ExpectedFeedbackObjectFactory.create(
              null, 'Input: "task_2_correctness_test_1"',
              'task_2_correctness_test_1\n')
          }]
        );
      });

      it('should check both task1 and task2, and though learner fails on ' +
         'both tasks, error message of task1 is displayed', function(done) {
        verifySubmissions(
          [], done, orderedTasks, starterCode, auxiliaryCode, 'python',
          [{
            code: [
              'def mockMainFunction(input):',
              '    if len(input) > 0 and input[-1] == "1":',
              '        return False',
              '    return True'
            ].join('\n'),
            expectedFeedback: ExpectedFeedbackObjectFactory.create(
              null, 'Input: "task_1_correctness_test_1"')
          }]
        );
      });

      it('should contain correct stdout if first test failed', function(done) {
        verifySubmissions(
          [], done, orderedTasks, starterCode, auxiliaryCode, 'python',
          [{
            code: [
              'def mockMainFunction(input):',
              '    print(input)',
              '    if len(input) > 0 and input[-1] == "1":',
              '        return False',
              '    return True'
            ].join('\n'),
            expectedFeedback: ExpectedFeedbackObjectFactory.create(
              null,
              'Input: "task_1_correctness_test_1"',
              'task_1_correctness_test_1\n')
          }]
        );
      });
    });

    describe('buggy output tests', function() {
      it('should check both task1 and task2 to ' +
          'verify that the learner fails on task1', function(done) {
        verifySubmissions(
          [], done, orderedTasks, starterCode, auxiliaryCode, 'python',
          [{
            code: [
              'def mockMainFunction(input):',
              '    return input.endswith("1")'
            ].join('\n'),
            expectedFeedback: ExpectedFeedbackObjectFactory.create(
              'Mock BuggyOutputTest Message One for task1')
          }]
        );
      });

      it('should check both task1 and task2, ' +
          'though learner fails on task2 buggy tests, ' +
          'error message of task1 is displayed', function(done) {
        verifySubmissions(
          [], done, orderedTasks, starterCode, auxiliaryCode, 'python',
          [{
            code: [
              'def mockMainFunction(input):',
              '    return False'
            ].join('\n'),
            expectedFeedback: ExpectedFeedbackObjectFactory.create(
              null,
              "Input: \"task_1_correctness_test_1\"")
          }]
        );
      });

      it('should show a new message only if the code changes', function(done) {
        var repeatedStudentCode = [
          'def mockMainFunction(input):',
          '    return input.endswith("1")'
        ].join('\n');

        verifySubmissions(
          [], done, orderedTasks, starterCode, auxiliaryCode, 'python',
          [{
            code: repeatedStudentCode,
            expectedFeedback: ExpectedFeedbackObjectFactory.create(
              'Mock BuggyOutputTest Message One for task1')
          }, {
            // The code has not changed, so the message stays the same.
            code: repeatedStudentCode,
            expectedFeedback: ExpectedFeedbackObjectFactory.create(
              'Mock BuggyOutputTest Message One for task1')
          }, {
            // The code has changed, so the message changes.
            code: [
              'def mockMainFunction(input):',
              '    return input.endswith("1") or input.endswith("1")'
            ].join('\n'),
            expectedFeedback: ExpectedFeedbackObjectFactory.create(
              'Mock BuggyOutputTest Message Two for task1')
          }]
        );
      });

      it([
        'should return correctness feedback if a student reaches the end of ',
        'the available hints.'
      ].join(''), function(done) {
        var wrongStudentCodeAlternative1 = [
          'def mockMainFunction(input):',
          '    return input.endswith("1")'
        ].join('\n');
        var wrongStudentCodeAlternative2 = [
          'def mockMainFunction(input):',
          '    return input.endswith("1") or input.endswith("1")'
        ].join('\n');

        verifySubmissions(
          [], done, orderedTasks, starterCode, auxiliaryCode, 'python',
          [{
            code: wrongStudentCodeAlternative1,
            expectedFeedback: ExpectedFeedbackObjectFactory.create(
              'Mock BuggyOutputTest Message One for task1')
          }, {
            code: wrongStudentCodeAlternative2,
            expectedFeedback: ExpectedFeedbackObjectFactory.create(
              'Mock BuggyOutputTest Message Two for task1')
          }, {
            code: wrongStudentCodeAlternative1,
            expectedFeedback: ExpectedFeedbackObjectFactory.create(
              'Mock BuggyOutputTest Message Three for task1')
          }, {
            // At this point, we have run out of buggy-output test feedback.
            code: wrongStudentCodeAlternative2,
            expectedFeedback: ExpectedFeedbackObjectFactory.create(
              null, null, '', false, function(submissionResult) {
                var feedback = submissionResult.getFeedback();
                var possibleFeedbackMessages = (
                  CORRECTNESS_FEEDBACK_TEXT[CORRECTNESS_STATE_INPUT_DISPLAYED]);
                var observedMessage = feedback.getParagraphs()[0].getContent();

                if (possibleFeedbackMessages.indexOf(observedMessage) === -1) {
                  return [
                    'Expected feedback messages to be part of ' +
                    'input-displayed feedback'];
                } else {
                  return [];
                }
              }
            )
          }]
        );
      });

      it([
        'should return the same hint multiple times for buggy outputs, ',
        'provided a new error happened in between'
      ].join(''), function(done) {
        var buggyOutputStudentCode = [
          'def mockMainFunction(input):',
          '    return input.endswith("1")'
        ].join('\n');
        var runtimeErrorStudentCode = [
          'def mockMainFunction(input):',
          '    return 5 / 0'
        ].join('\n');

        verifySubmissions(
          [], done, orderedTasks, starterCode, auxiliaryCode, 'python',
          [{
            code: buggyOutputStudentCode,
            expectedFeedback: ExpectedFeedbackObjectFactory.create(
              'Mock BuggyOutputTest Message One for task1')
          }, {
            code: runtimeErrorStudentCode,
            expectedFeedback: ExpectedFeedbackObjectFactory.create([
              'Looks like your code had a runtime error when evaluating the ',
              'input "task_1_correctness_test_1".'
            ].join(''), null, null)
          }, {
            // The cycle is broken, so we start from the top of the
            // buggy-message list.
            code: buggyOutputStudentCode,
            expectedFeedback: ExpectedFeedbackObjectFactory.create(
              'Mock BuggyOutputTest Message One for task1')
          }]
        );
      });
    });

    describe("prereqCheckFailures", function() {
      it('should return the correct feedback if there is code in global scope',
        function(done) {
          verifySubmissions(
            [], done, orderedTasks, starterCode, auxiliaryCode, 'python',
            [{
              code: [
                'def mockMainFunction(input):',
                '    return input',
                'mockMainFunction("input")'
              ].join('\n'),
              expectedFeedback: ExpectedFeedbackObjectFactory.create([
                'Please keep your code within the existing predefined ',
                'functions or define your own helper functions if you need ',
                'to -- we cannot process code in the global scope.'
              ].join(''), null, null)
            }]
          );
        }
      );

      it('should be correctly handled if missing starter code', function(done) {
        verifySubmissions(
          [], done, orderedTasks, starterCode, auxiliaryCode, 'python',
          [{
            code: '',
            expectedFeedback: ExpectedFeedbackObjectFactory.create([
              'It looks like you deleted or modified the starter code!  Our ',
              'evaluation program requires the function names given in the ',
              'starter code.  You can press the \'Reset Code\' button to ',
              'start over.  Or, you can copy the starter code below:'
            ].join(''), starterCode, null)
          }]
        );
      });

      it('should be correctly handled if has bad import', function(done) {
        verifySubmissions(
          [], done, orderedTasks, starterCode, auxiliaryCode, 'python',
          [{
            code: [
              'import pandas',
              'def mockMainFunction(input):',
              '    return True'
            ].join('\n'),
            expectedFeedback: ExpectedFeedbackObjectFactory.create([
              "It looks like you're importing an external library. However, ",
              'the following libraries are not supported:\n'
            ].join(''), 'pandas', null, false, function(submissionResult) {
              var errorMessages = [];

              var feedback = submissionResult.getFeedback();
              if (feedback.getParagraphs()[2].getContent() !==
                  'Here is a list of libraries we currently support:\n') {
                errorMessages.append('Bad content in 3rd paragraph');
              }
              if (feedback.getParagraphs()[3].getContent() !==
                  SUPPORTED_PYTHON_LIBS.join(', ')) {
                errorMessages.append('Bad content in 4th paragraph');
              }

              return errorMessages;
            })
          }]
        );
      });

      it('should return 1st errorLineNumber, when multiple errors',
        function(done) {
          verifySubmissions(
            [], done, orderedTasks, starterCode, auxiliaryCode, 'python',
            [{
              code: [
                'def mockMainFunction(input):',
                '    return True',
                'def myFunction(arg):',
                '    arg = arg / 2',
                '    arg--',
                '    return arg',
                'def myFunction2(arg):',
                '    arg++',
                '    return arg',
                ''
              ].join('\n'),
              expectedFeedback: ExpectedFeedbackObjectFactory.create(
                null, null, null, false, function(submissionResult) {
                  var feedback = submissionResult.getFeedback();
                  var expectedLineNumber = 5;
                  if (feedback.getErrorLineNumber() === expectedLineNumber) {
                    return [];
                  } else {
                    return ['Wrong error line number'];
                  }
                })
            }]
          );
        });
    });

    describe('potentialSyntaxError', function() {
      it('should correctly handle a syntax error', function(done) {
        verifySubmissions(
          [], done, orderedTasks, starterCode, auxiliaryCode, 'python',
          [{
            code: [
              'def mockMainFunction(input):',
              '    return True -'
            ].join('\n'),
            expectedFeedback: ExpectedFeedbackObjectFactory.create(
              null, 'SyntaxError: bad input on line 2', null)
          }]
        );
      });
    });

    describe('should return the correct feedback if', function() {
      it('there is a stack exceeded error', function(done) {
        verifySubmissions(
          [], done, orderedTasks, starterCode, auxiliaryCode, 'python',
          [{
            code: [
              'def mockMainFunction(input):',
              '    return mockMainFunction(input)',
              ''
            ].join('\n'),
            expectedFeedback: ExpectedFeedbackObjectFactory.create([
              "Your code appears to be hitting an infinite recursive loop. ",
              "Check to make sure that your recursive calls terminate."
            ].join(''), null, null)
          }]
        );
      });

      it('there is a runtime error', function(done) {
        verifySubmissions(
          [], done, orderedTasks, starterCode, auxiliaryCode, 'python',
          [{
            code: [
              'def mockMainFunction(input):',
              '    return greeting',
              ''
            ].join('\n'),
            expectedFeedback: ExpectedFeedbackObjectFactory.create([
              'It looks like greeting isn\'t a declared variable. ',
              'Did you make sure to spell it correctly? And is it ',
              'correctly initialized?'
            ].join(''), null, null)
          }]
        );
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
        question = QuestionObjectFactory.create({
          title: TITLE,
          starterCode: STARTER_CODE,
          auxiliaryCode: AUXILIARY_CODE,
          tasks: taskDict
        });
        CurrentQuestionService.getCurrentQuestion =
          jasmine.createSpy().and.returnValue(question);
      }));

      it('should check all buggy outputs if nothing is ignored',
        function(done) {
          taskDict[0].buggyOutputTests[0].ignoredTestSuiteIds = [];
          orderedTasks = taskDict.map(function(task) {
            return TaskObjectFactory.create(task);
          });

          verifySubmissions(
            [], done, orderedTasks, starterCode, auxiliaryCode, 'python',
            [{
              // The buggy function returns True for the first and third cases.
              // The student's code returns True in the first three cases and
              // False in the fourth.
              code: [
                'def mockMainFunction(input):',
                '    return input != "task_1_suite_2_test_2"',
                ''
              ].join('\n'),
              expectedFeedback: ExpectedFeedbackObjectFactory.create(
                null, null, '', false, function(submissionResult) {
                  var feedback = submissionResult.getFeedback();
                  var possibleFeedbackMessages = (
                    CORRECTNESS_FEEDBACK_TEXT[
                      CORRECTNESS_STATE_INPUT_DISPLAYED]);
                  var observedMessage = (
                    feedback.getParagraphs()[0].getContent());

                  if (possibleFeedbackMessages.indexOf(
                      observedMessage) === -1) {
                    return [
                      'Expected feedback messages to be part of ' +
                      'input-displayed feedback'];
                  } else {
                    return [];
                  }
                }
              )
            }]
          );
        }
      );

      it('should ignore buggy outputs for ignored suite ids', function(done) {
        taskDict[0].buggyOutputTests[0].ignoredTestSuiteIds = ['SUITE2'];
        orderedTasks = taskDict.map(function(task) {
          return TaskObjectFactory.create(task);
        });

        verifySubmissions(
          [], done, orderedTasks, starterCode, auxiliaryCode, 'python',
          [{
            // The buggy function returns True for the first and third cases.
            // The student's code returns True in the first case and False
            // for the rest.
            code: [
              'def mockMainFunction(input):',
              '    return input in [',
              '        "task_1_suite_1_test_1", "task_2_correctness_test_1"]',
              ''
            ].join('\n'),
            expectedFeedback: ExpectedFeedbackObjectFactory.create(
              'Mock BuggyOutputTest Message One for task1')
          }]
        );
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
            allowedOutputs: [false]
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
          messages: ['suite_message1', 'suite_message2']
        }];
        question = QuestionObjectFactory.create({
          title: TITLE,
          starterCode: STARTER_CODE,
          auxiliaryCode: AUXILIARY_CODE,
          tasks: taskDict
        });
        CurrentQuestionService.getCurrentQuestion =
          jasmine.createSpy().and.returnValue(question);
      }));

      it('should return suite-level feedback if the condition is triggered',
        function(done) {
          orderedTasks = taskDict.map(function(task) {
            return TaskObjectFactory.create(task);
          });

          verifySubmissions(
            [], done, orderedTasks, starterCode, auxiliaryCode, 'python',
            [{
              // This code passes suite 1 and fails suite 2.
              code: [
                'def mockMainFunction(input):',
                '    return input.endswith("1")',
                ''
              ].join('\n'),
              expectedFeedback: ExpectedFeedbackObjectFactory.create(
                'suite_message1')
            }]
          );
        }
      );

      it([
        'should not return suite-level feedback if the passing-suite ',
        ' prerequisites do not hold'
      ].join(''), function(done) {
        orderedTasks = taskDict.map(function(task) {
          return TaskObjectFactory.create(task);
        });

        verifySubmissions(
          [], done, orderedTasks, starterCode, auxiliaryCode, 'python',
          [{
            // This code passes one test case in suite 1 and fails the other,
            // thus failing the suite.
            code: [
              'def mockMainFunction(input):',
              '    return True',
              ''
            ].join('\n'),
            expectedFeedback: ExpectedFeedbackObjectFactory.create(
              null, null, '', false, function(submissionResult) {
                var feedback = submissionResult.getFeedback();
                var possibleFeedbackMessages = (
                  CORRECTNESS_FEEDBACK_TEXT[CORRECTNESS_STATE_INPUT_DISPLAYED]);
                var observedMessage = feedback.getParagraphs()[0].getContent();

                if (possibleFeedbackMessages.indexOf(observedMessage) === -1) {
                  return [
                    'Expected feedback messages to be part of ' +
                    'input-displayed feedback'];
                } else {
                  return [];
                }
              }
            )
          }]
        );
      });

      it([
        'should consider a suite failed if at least one test in it fails'
      ].join(''), function(done) {
        orderedTasks = taskDict.map(function(task) {
          return TaskObjectFactory.create(task);
        });

        verifySubmissions(
          [], done, orderedTasks, starterCode, auxiliaryCode, 'python',
          [{
            // This code passes suite 1, and passes one of the two tests in
            // suite 2.
            code: [
              'def mockMainFunction(input):',
              '    return input.endswith("1")',
              ''
            ].join('\n'),
            expectedFeedback: ExpectedFeedbackObjectFactory.create(
              'suite_message1')
          }]
        );
      });

      it([
        'should return the next hint in sequence for suite-level tests, but ',
        'only if the code has been changed'
      ].join(''), function(done) {
        orderedTasks = taskDict.map(function(task) {
          return TaskObjectFactory.create(task);
        });

        // This code passes suite 1, and fails suite 2.
        var studentCode1 = [
          'def mockMainFunction(input):',
          '    return input.endswith("1")',
          ''
        ].join('\n');

        // This code also passes suite 1, and fails suite 2.
        var studentCode2 = [
          'def mockMainFunction(input):',
          '    return input.endswith("1") or input.endswith("1")',
          ''
        ].join('\n');

        verifySubmissions(
          [], done, orderedTasks, starterCode, auxiliaryCode, 'python',
          [{
            code: studentCode1,
            expectedFeedback: ExpectedFeedbackObjectFactory.create(
              'suite_message1')
          }, {
            code: studentCode1,
            expectedFeedback: ExpectedFeedbackObjectFactory.create(
              'suite_message1')
          }, {
            code: studentCode2,
            expectedFeedback: ExpectedFeedbackObjectFactory.create(
              'suite_message2')
          }]
        );
      });

      it([
        'should return incorrect-output feedback if a student reaches the end ',
        'of the hints.'
      ].join(''), function(done) {
        orderedTasks = taskDict.map(function(task) {
          return TaskObjectFactory.create(task);
        });

        // This code passes suite 1, and fails suite 2.
        var studentCode1 = [
          'def mockMainFunction(input):',
          '    return input.endswith("1")',
          ''
        ].join('\n');

        // This code also passes suite 1, and fails suite 2.
        var studentCode2 = [
          'def mockMainFunction(input):',
          '    return input.endswith("1") or input.endswith("1")',
          ''
        ].join('\n');

        verifySubmissions(
          [], done, orderedTasks, starterCode, auxiliaryCode, 'python',
          [{
            code: studentCode1,
            expectedFeedback: ExpectedFeedbackObjectFactory.create(
              'suite_message1')
          }, {
            code: studentCode2,
            expectedFeedback: ExpectedFeedbackObjectFactory.create(
              'suite_message2')
          }, {
            // We've reached the end of the hints.
            code: studentCode1,
            expectedFeedback: ExpectedFeedbackObjectFactory.create(
              null, null, '', false, function(submissionResult) {
                var feedback = submissionResult.getFeedback();
                var possibleFeedbackMessages = (
                  CORRECTNESS_FEEDBACK_TEXT[CORRECTNESS_STATE_INPUT_DISPLAYED]);
                var observedMessage = feedback.getParagraphs()[0].getContent();

                if (possibleFeedbackMessages.indexOf(observedMessage) === -1) {
                  return [
                    'Expected feedback messages to be part of ' +
                    'input-displayed feedback'];
                } else {
                  return [];
                }
              }
            )
          }]
        );
      });

      it([
        'should reset the suite-level counter if other types of feedback are ',
        'given in between'
      ].join(''), function(done) {
        orderedTasks = taskDict.map(function(task) {
          return TaskObjectFactory.create(task);
        });

        // This code passes suite 1, and fails suite 2.
        var suiteLevelFailureStudentCode = [
          'def mockMainFunction(input):',
          '    return input.endswith("1")',
          ''
        ].join('\n');

        // This code leads to a runtime error.
        var runtimeErrorStudentCode = [
          'def mockMainFunction(input):',
          '    return 5 / 0',
          ''
        ].join('\n');

        verifySubmissions(
          [], done, orderedTasks, starterCode, auxiliaryCode, 'python',
          [{
            code: suiteLevelFailureStudentCode,
            expectedFeedback: ExpectedFeedbackObjectFactory.create(
              'suite_message1')
          }, {
            code: runtimeErrorStudentCode,
            expectedFeedback: ExpectedFeedbackObjectFactory.create([
              'Looks like your code had a runtime error when evaluating the ',
              'input "task_1_suite_1_test_1".'
            ].join(''), null, null)
          }, {
            // We start again at the beginning of the suite-level hints.
            code: suiteLevelFailureStudentCode,
            expectedFeedback: ExpectedFeedbackObjectFactory.create(
              'suite_message1')
          }]
        );
      });
    });
  });
});
