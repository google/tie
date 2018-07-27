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
  var QuestionObjectFactory;
  var TaskObjectFactory;
  var question;
  var orderedTasks;
  var auxiliaryCode;
  var starterCode;
  var FEEDBACK_TYPE_INPUT_TO_TRY;
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
    SUPPORTED_PYTHON_LIBS = $injector.get('SUPPORTED_PYTHON_LIBS');
    FEEDBACK_TYPE_INPUT_TO_TRY = $injector.get('FEEDBACK_TYPE_INPUT_TO_TRY');
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

        ConversationManagerService.processSolutionAsync(
          orderedTasks, starterCode, studentCode,
          auxiliaryCode, 'python'
        ).then(function(learnerViewSubmissionResult) {
          var feedback = learnerViewSubmissionResult.getFeedback();
          var stdout = learnerViewSubmissionResult.getStdout();
          expect(feedback.isAnswerCorrect()).toEqual(true);
          expect(stdout).toBe('');
          done();
        });
      });

      it('should contain the correct stdout upon question ' +
          'completion', function(done) {
        var studentCode = [
          'def mockMainFunction(input):',
          '    print(input)',
          '    if len(input) > 0 and input[:6] == "task_1":',
          '        return True',
          '    return False'
        ].join('\n');

        ConversationManagerService.processSolutionAsync(
          orderedTasks, starterCode, studentCode,
          auxiliaryCode, 'python'
        ).then(function(learnerViewSubmissionResult) {
          var feedback = learnerViewSubmissionResult.getFeedback();
          var stdout = learnerViewSubmissionResult.getStdout();
          expect(feedback.isAnswerCorrect()).toEqual(true);
          expect(stdout).toBe('task_2_correctness_test_2\n');
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

        ConversationManagerService.processSolutionAsync(
          orderedTasks, starterCode, studentCode,
          auxiliaryCode, 'python'
        ).then(function(learnerViewSubmissionResult) {
          var feedback = learnerViewSubmissionResult.getFeedback();
          var stdout = learnerViewSubmissionResult.getStdout();
          expect(feedback.isAnswerCorrect()).toEqual(false);
          expect(feedback.getParagraphs()[1].getContent()).toEqual(
              "Input: \"task_1_correctness_test_2\"");
          expect(stdout).toBe('');
          done();
        });
      });

      it('should contain the correct stdout for task completion',
        function(done) {
          var studentCode = [
            'def mockMainFunction(input):',
            '    print(input)',
            '    if len(input) > 0 and input == "task_1_correctness_test_1":',
            '        return True',
            '    return False'
          ].join('\n');

          ConversationManagerService.processSolutionAsync(
            orderedTasks, starterCode, studentCode,
            auxiliaryCode, 'python'
          ).then(function(learnerViewSubmissionResult) {
            var feedback = learnerViewSubmissionResult.getFeedback();
            var stdout = learnerViewSubmissionResult.getStdout();
            expect(feedback.isAnswerCorrect()).toEqual(false);
            expect(feedback.getParagraphs()[1].getContent()).toEqual(
                "Input: \"task_1_correctness_test_2\"");
            expect(stdout).toBe('task_1_correctness_test_2\n');
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

        ConversationManagerService.processSolutionAsync(
          orderedTasks, starterCode, studentCode,
          auxiliaryCode, 'python'
        ).then(function(learnerViewSubmissionResult) {
          var feedback = learnerViewSubmissionResult.getFeedback();
          var stdout = learnerViewSubmissionResult.getStdout();
          expect(feedback.isAnswerCorrect()).toEqual(false);
          expect(feedback.getParagraphs()[1].getContent()).toEqual(
             "Input: \"task_2_correctness_test_1\"");
          expect(stdout).toBe('');
          done();
        });
      });

      it('should contain the correct stdout if first test of second ' +
          'task failed', function(done) {
        var studentCode = [
          'def mockMainFunction(input):',
          '    print(input)',
          '    if len(input) > 0 and input == "task_2_correctness_test_2":',
          '        return False',
          '    return True'
        ].join('\n');

        ConversationManagerService.processSolutionAsync(
          orderedTasks, starterCode, studentCode,
          auxiliaryCode, 'python'
        ).then(function(learnerViewSubmissionResult) {
          var feedback = learnerViewSubmissionResult.getFeedback();
          var stdout = learnerViewSubmissionResult.getStdout();
          expect(feedback.isAnswerCorrect()).toEqual(false);
          expect(feedback.getParagraphs()[1].getContent()).toEqual(
             "Input: \"task_2_correctness_test_1\"");
          expect(stdout).toBe('task_2_correctness_test_1\n');
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

        ConversationManagerService.processSolutionAsync(
          orderedTasks, starterCode, studentCode,
          auxiliaryCode, 'python'
        ).then(function(learnerViewSubmissionResult) {
          var feedback = learnerViewSubmissionResult.getFeedback();
          var stdout = learnerViewSubmissionResult.getStdout();
          expect(feedback.isAnswerCorrect()).toEqual(false);
          expect(feedback.getParagraphs()[1].getContent()).toEqual(
              "Input: \"task_1_correctness_test_1\"");
          expect(stdout).toBe('');
          done();
        });
      });

      it('should contain the correct stdout if first test failed',
        function(done) {
          var studentCode = [
            'def mockMainFunction(input):',
            '    print(input)',
            '    if len(input) > 0 and input[-1] == "1":',
            '        return False',
            '    return True'
          ].join('\n');

          ConversationManagerService.processSolutionAsync(
            orderedTasks, starterCode, studentCode,
            auxiliaryCode, 'python'
          ).then(function(learnerViewSubmissionResult) {
            var feedback = learnerViewSubmissionResult.getFeedback();
            var stdout = learnerViewSubmissionResult.getStdout();
            expect(feedback.isAnswerCorrect()).toEqual(false);
            expect(feedback.getParagraphs()[1].getContent()).toEqual(
                "Input: \"task_1_correctness_test_1\"");
            expect(stdout).toBe('task_1_correctness_test_1\n');
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

        ConversationManagerService.processSolutionAsync(
          orderedTasks, starterCode, studentCode,
          auxiliaryCode, 'python'
        ).then(function(learnerViewSubmissionResult) {
          var feedback = learnerViewSubmissionResult.getFeedback();
          var stdout = learnerViewSubmissionResult.getStdout();
          expect(feedback.isAnswerCorrect()).toEqual(false);
          expect(feedback.getParagraphs()[0].getContent()).toEqual(
             "Mock BuggyOutputTest Message One for task1");
          expect(stdout).toBe('');
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

        ConversationManagerService.processSolutionAsync(
          orderedTasks, starterCode, studentCode,
          auxiliaryCode, 'python'
        ).then(function(learnerViewSubmissionResult) {
          var feedback = learnerViewSubmissionResult.getFeedback();
          var stdout = learnerViewSubmissionResult.getStdout();
          expect(feedback.isAnswerCorrect()).toEqual(false);
          expect(feedback.getParagraphs()[1].getContent()).toEqual(
             "Input: \"task_1_correctness_test_1\"");
          expect(stdout).toBe('');
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

          ConversationManagerService.processSolutionAsync(
            orderedTasks, starterCode, studentCode1,
            auxiliaryCode, 'python'
          ).then(function(learnerViewSubmissionResult1) {
            var feedback1 = learnerViewSubmissionResult1.getFeedback();
            var stdout1 = learnerViewSubmissionResult1.getStdout();
            expect(feedback1.isAnswerCorrect()).toEqual(false);
            expect(feedback1.getParagraphs()[0].getContent()).toEqual(
               'Mock BuggyOutputTest Message One for task1');
            expect(stdout1).toBe('');

            ConversationManagerService.processSolutionAsync(
              orderedTasks, starterCode, studentCode1,
              auxiliaryCode, 'python'
            ).then(function(learnerViewSubmissionResult2) {
              var feedback2 = learnerViewSubmissionResult2.getFeedback();
              var stdout2 = learnerViewSubmissionResult2.getStdout();
              expect(feedback2.isAnswerCorrect()).toEqual(false);
              // The code has not changed, so the message stays the same.
              expect(feedback2.getParagraphs()[0].getContent()).toEqual(
                'Mock BuggyOutputTest Message One for task1');
              expect(stdout2).toBe('');

              ConversationManagerService.processSolutionAsync(
                orderedTasks, starterCode, studentCode2,
                auxiliaryCode, 'python'
              ).then(function(learnerViewSubmissionResult3) {
                var feedback3 = learnerViewSubmissionResult3.getFeedback();
                var stdout3 = learnerViewSubmissionResult3.getStdout();
                expect(feedback3.isAnswerCorrect()).toEqual(false);
                // The code has changed, so the message changes.
                expect(feedback3.getParagraphs()[0].getContent()).toEqual(
                  'Mock BuggyOutputTest Message Two for task1');
                expect(stdout3).toBe('');
                done();
              });
            });
          });
        }
      );

      // IMPLEMENT THE FOLLOWING

      it([
        'should return null if a student reaches the end of the available hints.'
      ].join(''), function() {
        var buggyOutputTest = BuggyOutputTestObjectFactory.create(
          buggyOutputTestDict);
        var codeEvalResult = CodeEvalResultObjectFactory.create(
          'some code separator = "a"', 'some code', 'same output',
          [], [true], [], null, null);
        var codeEvalResultWithSameBug = CodeEvalResultObjectFactory.create(
          'new code separator = "a"', 'new code', 'same output',
          [], [true], [], null, null);
        var codeEvalResultWithStillSameBug = CodeEvalResultObjectFactory.create(
          'newer code separator = "a"', 'newer code', 'same output',
          [], [true], [], null, null);

        var feedback = FeedbackGeneratorService._getBuggyOutputTestFeedback(
          buggyOutputTest, true);
        var paragraphs = feedback.getParagraphs();

        expect(paragraphs.length).toEqual(1);
        expect(paragraphs[0].isTextParagraph()).toBe(true);
        expect(paragraphs[0].getContent()).toBe(buggyOutputTestDict.messages[0]);

        feedback = FeedbackGeneratorService._getBuggyOutputTestFeedback(
          buggyOutputTest, true);
        paragraphs = feedback.getParagraphs();

        expect(paragraphs.length).toEqual(1);
        expect(paragraphs[0].isTextParagraph()).toBe(true);
        expect(paragraphs[0].getContent()).toBe(buggyOutputTestDict.messages[1]);

        feedback = FeedbackGeneratorService._getBuggyOutputTestFeedback(
          buggyOutputTest, true);
        paragraphs = feedback.getParagraphs();

        expect(paragraphs.length).toEqual(1);
        expect(paragraphs[0].isTextParagraph()).toBe(true);
        expect(paragraphs[0].getContent()).toBe(buggyOutputTestDict.messages[2]);

        expect(
          FeedbackGeneratorService._getBuggyOutputTestFeedback(
            buggyOutputTest, true)
        ).toBe(null);
      });

      it([
        'should return the same hint multiple times for buggy outputs, ',
        'provided a new error happened in between'
      ].join(''), function() {
        var buggyOutputTest = BuggyOutputTestObjectFactory.create(
          buggyOutputTestDict);
        var codeEvalResult = CodeEvalResultObjectFactory.create(
          'some code separator = "a"', 'some code', 'same output', [], [true],
          [], null, null);
        var codeEvalResultWithNewError = CodeEvalResultObjectFactory.create(
          'other code separator = "a"', 'other code', 'some output',
          [], [], [], 'ERROR MESSAGE', 'testInput');

        var feedback = FeedbackGeneratorService._getBuggyOutputTestFeedback(
          buggyOutputTest, true);
        var paragraphs = feedback.getParagraphs();

        expect(paragraphs.length).toEqual(1);
        expect(paragraphs[0].isTextParagraph()).toBe(true);
        expect(paragraphs[0].getContent()).toBe(buggyOutputTestDict.messages[0]);

        var unusedRuntimeErrorFeedback = (
          FeedbackGeneratorService._getBuggyOutputTestFeedback(
            buggyOutputTest, true));

        feedback = FeedbackGeneratorService._getBuggyOutputTestFeedback(
          buggyOutputTest, true).getParagraphs();

        expect(paragraphs.length).toEqual(1);
        expect(paragraphs[0].isTextParagraph()).toBe(true);
        expect(paragraphs[0].getContent()).toBe(buggyOutputTestDict.messages[0]);
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

          ConversationManagerService.processSolutionAsync(
            orderedTasks, starterCode, studentCode,
            auxiliaryCode, 'python'
          ).then(function(learnerViewSubmissionResult) {
            var feedback = learnerViewSubmissionResult.getFeedback();
            var stdout = learnerViewSubmissionResult.getStdout();
            expect(feedback.isAnswerCorrect()).toEqual(false);
            expect(feedback.getParagraphs()[0].getContent()).toEqual([
              'Please keep your code within the existing predefined functions ',
              'or define your own helper functions if you need to ',
              '-- we cannot process code in the global scope.'
            ].join(' '));
            expect(stdout).toBe(null);
            done();
          });
        }
      );

      it('should be correctly handled if missing starter code', function(done) {
        ConversationManagerService.processSolutionAsync(
          orderedTasks, starterCode, '',
          auxiliaryCode, 'python'
        ).then(function(learnerViewSubmissionResult) {
          var feedback = learnerViewSubmissionResult.getFeedback();
          var stdout = learnerViewSubmissionResult.getStdout();
          expect(feedback.isAnswerCorrect()).toEqual(false);
          expect(feedback.getParagraphs()[0].getContent()).toEqual([
            'It looks like you deleted or modified the starter code!  Our ',
            'evaluation program requires the function names given in the ',
            'starter code.  You can press the \'Reset Code\' button to start ',
            'over.  Or, you can copy the starter code below:'
          ].join(''));
          expect(feedback.getParagraphs()[1].getContent()).toEqual(starterCode);
          expect(stdout).toBe(null);
          done();
        });
      });

      it('should be correctly handled if has bad import', function(done) {
        var studentCode = [
          'import pandas',
          'def mockMainFunction(input):',
          '    return True'
        ].join('\n');

        ConversationManagerService.processSolutionAsync(
          orderedTasks, starterCode, studentCode,
          auxiliaryCode, 'python'
        ).then(function(learnerViewSubmissionResult) {
          var feedback = learnerViewSubmissionResult.getFeedback();
          var stdout = learnerViewSubmissionResult.getStdout();
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
          expect(stdout).toBe(null);
          done();
        });
      });

      it('should return 1st errorLineNumber, when multiple errors',
        function(done) {
          var studentCode = [
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
          ].join('\n');

          ConversationManagerService.processSolutionAsync(
            orderedTasks, starterCode, studentCode,
            auxiliaryCode, 'python'
          ).then(function(learnerViewSubmissionResult) {
            var feedback = learnerViewSubmissionResult.getFeedback();
            var stdout = learnerViewSubmissionResult.getStdout();
            expect(feedback.isAnswerCorrect()).toEqual(false);
            expect(feedback.getErrorLineNumber()).toBe(5);
            expect(stdout).toBe(null);
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

        ConversationManagerService.processSolutionAsync(
          orderedTasks, starterCode, studentCode,
          auxiliaryCode, 'python'
        ).then(function(learnerViewSubmissionResult) {
          var feedback = learnerViewSubmissionResult.getFeedback();
          var stdout = learnerViewSubmissionResult.getStdout();
          expect(feedback.isAnswerCorrect()).toEqual(false);
          expect(feedback.getParagraphs()[1].getContent().startsWith(
            'SyntaxError:')).toEqual(true);
          expect(stdout).toBe(null);
          done();
        });
      });
    });

    describe('should return the correct feedback if', function() {
      it('there is a stack exceeded error', function(done) {
        var studentCode = [
          'def mockMainFunction(input):',
          '    return mockMainFunction(input)',
          ''
        ].join('\n');
        ConversationManagerService.processSolutionAsync(
          orderedTasks, starterCode, studentCode,
          auxiliaryCode, 'python'
        ).then(function(learnerViewSubmissionResult) {
          var feedback = learnerViewSubmissionResult.getFeedback();
          var stdout = learnerViewSubmissionResult.getStdout();
          expect(feedback.getParagraphs()[0].getContent()).toEqual([
            "Your code appears to be hitting an infinite recursive loop. ",
            "Check to make sure that your recursive calls terminate."
          ].join(''));
          expect(stdout).toBe(null);
          done();
        });
      });

      it('there is a runtime error', function(done) {
        var studentCode = [
          'def mockMainFunction(input):',
          '    return greeting',
          ''
        ].join('\n');

        ConversationManagerService.processSolutionAsync(
          orderedTasks, starterCode, studentCode,
          auxiliaryCode, 'python'
        ).then(function(learnerViewSubmissionResult) {
          var feedback = learnerViewSubmissionResult.getFeedback();
          var stdout = learnerViewSubmissionResult.getStdout();
          expect(
            feedback.getParagraphs()[0].getContent().startsWith(
                'It looks like greeting isn\'t a declared variable.')
          ).toBe(true);
          expect(stdout).toBe(null);
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

          // The buggy function returns True for all cases. The student's code
          // returns True in the first three cases and False in the fourth.
          var studentCode = [
            'def mockMainFunction(input):',
            '    return input != "task_1_suite_2_test_2"',
            ''
          ].join('\n');

          ConversationManagerService.processSolutionAsync(
            orderedTasks, starterCode, studentCode, auxiliaryCode, 'python'
          ).then(function(learnerViewSubmissionResult) {
            var feedback = learnerViewSubmissionResult.getFeedback();
            var stdout = learnerViewSubmissionResult.getStdout();
            expect(
              CORRECTNESS_FEEDBACK_TEXT[FEEDBACK_TYPE_INPUT_TO_TRY]).toContain(
              feedback.getParagraphs()[0].getContent());
            expect(stdout).toBe('');
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

        ConversationManagerService.processSolutionAsync(
          orderedTasks, starterCode, studentCode, auxiliaryCode, 'python'
        ).then(function(learnerViewSubmissionResult) {
          var feedback = learnerViewSubmissionResult.getFeedback();
          var stdout = learnerViewSubmissionResult.getStdout();
          expect(feedback.getParagraphs()[0].getContent()).toBe(
            'Mock BuggyOutputTest Message One for task1');
          expect(stdout).toBe('');
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

          // This code passes suite 1 and fails suite 2.
          var studentCode = [
            'def mockMainFunction(input):',
            '    return True',
            ''
          ].join('\n');

          ConversationManagerService.processSolutionAsync(
            orderedTasks, starterCode, studentCode, auxiliaryCode, 'python'
          ).then(function(learnerViewSubmissionResult) {
            var feedback = learnerViewSubmissionResult.getFeedback();
            var stdout = learnerViewSubmissionResult.getStdout();
            expect(feedback.getParagraphs()[0].getContent()).toBe(
              'suite_message1');
            expect(stdout).toBe('');
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

        ConversationManagerService.processSolutionAsync(
          orderedTasks, starterCode, studentCode, auxiliaryCode, 'python'
        ).then(function(learnerViewSubmissionResult) {
          var feedback = learnerViewSubmissionResult.getFeedback();
          var stdout = learnerViewSubmissionResult.getStdout();
          expect(
            CORRECTNESS_FEEDBACK_TEXT[FEEDBACK_TYPE_INPUT_TO_TRY]).toContain(
            feedback.getParagraphs()[0].getContent());
          expect(stdout).toBe('');
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

        ConversationManagerService.processSolutionAsync(
          orderedTasks, starterCode, studentCode, auxiliaryCode, 'python'
        ).then(function(learnerViewSubmissionResult) {
          var feedback = learnerViewSubmissionResult.getFeedback();
          var stdout = learnerViewSubmissionResult.getStdout();
          expect(feedback.getParagraphs()[0].getContent()).toBe(
            'suite_message1');
          expect(stdout).toBe('');
          done();
        });
      });


      // IMPLEMENT THE FOLLOWING THREE TESTS


    var suiteLevelTestDict = {
      testSuiteIdsThatMustPass: ['SUITE_P1', 'SUITE_P2', 'SUITE_P3'],
      testSuiteIdsThatMustFail: ['SUITE_F1'],
      messages: ['message1', 'message2', 'message3']
    };

    it([
      'should return the next hint in sequence for suite-level tests, but ',
      'only if the code has been changed'
    ].join(''), function() {
      var suiteLevelTest = SuiteLevelTestObjectFactory.create(
        suiteLevelTestDict);
      var codeEvalResult1 = CodeEvalResultObjectFactory.create(
        'some code separator = "a"', 'some code', 'same output',
        [], [true], [], null, null);
      var codeEvalResult2 = CodeEvalResultObjectFactory.create(
        'new code separator = "a"', 'new code', 'same output',
        [], [true], [], null, null);

      var feedback = FeedbackGeneratorService._getSuiteLevelTestFeedback(
        suiteLevelTest, true);
      expect(feedback.getFeedbackCategory()).toEqual(
        FEEDBACK_CATEGORIES.SUITE_LEVEL_FAILURE);

      var paragraphs = feedback.getParagraphs();
      expect(paragraphs.length).toEqual(1);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe(suiteLevelTestDict.messages[0]);

      // The code is changed. The feedback changes.
      feedback = FeedbackGeneratorService._getSuiteLevelTestFeedback(
        suiteLevelTest, true);
      paragraphs = feedback.getParagraphs();
      expect(paragraphs.length).toEqual(1);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe(suiteLevelTestDict.messages[1]);

      // The code is not changed. The feedback remains the same.
      paragraphs = FeedbackGeneratorService._getSuiteLevelTestFeedback(
        suiteLevelTest, false).getParagraphs();
      expect(paragraphs.length).toEqual(1);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe(suiteLevelTestDict.messages[1]);
    });

    it([
      'should return null if a student reaches the end of the available hints.'
    ].join(''), function() {
      var suiteLevelTest = SuiteLevelTestObjectFactory.create(
        suiteLevelTestDict);
      var codeEvalResults = [
        CodeEvalResultObjectFactory.create(
          'code 1 separator = "a"', 'code 1', 'same output',
          [], [true], [], null, null),
        CodeEvalResultObjectFactory.create(
          'code 2 separator = "a"', 'code 2', 'same output',
          [], [true], [], null, null),
        CodeEvalResultObjectFactory.create(
          'code 3 separator = "a"', 'code 3', 'same output',
          [], [true], [], null, null)
      ];

      for (var i = 0; i < 3; i++) {
        var feedback = FeedbackGeneratorService._getSuiteLevelTestFeedback(
          suiteLevelTest, true);

        var paragraphs = feedback.getParagraphs();
        expect(paragraphs.length).toEqual(1);
        expect(paragraphs[0].isTextParagraph()).toBe(true);
        expect(paragraphs[0].getContent()).toBe(suiteLevelTestDict.messages[i]);
      }

      // We've now exhausted the list of messages.
      expect(
        FeedbackGeneratorService._getSuiteLevelTestFeedback(
          suiteLevelTest, true)
      ).toBe(null);
    });

    it([
      'should reset the suite-level counter if other types of feedback are ' +
      'given in between'
    ].join(''), function() {
      var buggyOutputTestDict = {
        buggyFunction: 'AuxiliaryCode.countNumberOfParentheses',
        messages: ['buggy1', 'buggy2']
      };

      var suiteLevelTest = SuiteLevelTestObjectFactory.create(
        suiteLevelTestDict);
      var buggyOutputTest = BuggyOutputTestObjectFactory.create(
        buggyOutputTestDict);

      var codeEvalResult1 = CodeEvalResultObjectFactory.create(
        'code 1 separator = "a"', 'code 1', 'same output',
        [], [true], [], null, null);
      var codeEvalResult2 = CodeEvalResultObjectFactory.create(
        'code 2 separator = "a"', 'code 2', 'same output',
        [], [true], [], null, null);

      var feedback = FeedbackGeneratorService._getSuiteLevelTestFeedback(
        suiteLevelTest, true);
      feedback = FeedbackGeneratorService._getSuiteLevelTestFeedback(
        suiteLevelTest, true);

      var paragraphs = feedback.getParagraphs();
      expect(paragraphs.length).toEqual(1);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe(suiteLevelTestDict.messages[1]);

      // Now get buggy output feedback once.
      feedback = FeedbackGeneratorService._getBuggyOutputTestFeedback(
        buggyOutputTest, true);
      paragraphs = feedback.getParagraphs();
      expect(paragraphs.length).toEqual(1);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe(buggyOutputTestDict.messages[0]);

      // The index of suite-level feedback then gets reset to 0.
      feedback = FeedbackGeneratorService._getSuiteLevelTestFeedback(
        suiteLevelTest, true);
      paragraphs = feedback.getParagraphs();
      expect(paragraphs.length).toEqual(1);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe(suiteLevelTestDict.messages[0]);
    });







    });

    describe('incorrect-output tests', function() {
      beforeEach(inject(function() {
        taskDict[0].testSuites = [{
          id: 'SAMPLE_INPUT',
          humanReadableName: 'sampleInputSuite',
          testCases: [{
            input: 'Hello, John',
            allowedOutputs: ['olleH, nhoJ']
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

      it('should allow user to display output if suite id is \'SAMPLE_INPUT\'',
        function() {
          orderedTasks = taskDict.map(function(task) {
            return TaskObjectFactory.create(task);
          });

          // This code passes suite 1 and fails suite 2.
          var studentCode = [
            'def mockMainFunction(input):',
            '    return "incorrect answer"',
            ''
          ].join('\n');

          ConversationManagerService.processSolutionAsync(
            orderedTasks, starterCode, studentCode, auxiliaryCode, 'python'
          ).then(function(learnerViewSubmissionResult) {
            var feedback = learnerViewSubmissionResult.getFeedback();
            var correctnessFeedbackParagraphs = feedback.getParagraphs();
            expect(correctnessFeedbackParagraphs.length).toEqual(2);
            expect(correctnessFeedbackParagraphs[0].isTextParagraph()).toEqual(
              true);
            expect(CORRECTNESS_FEEDBACK_TEXT.OUTPUT_ENABLED).toContain(
              correctnessFeedbackParagraphs[0].getContent());
            expect(
              correctnessFeedbackParagraphs[1].isOutputParagraph()
            ).toEqual(true);

            var expectedOutputParagraph =
              'Input: "Hello, John"\n' +
              'Expected Output: "olleH, nhoJ"\n' +
              'Actual Output: "incorrect answer"';
            expect(correctnessFeedbackParagraphs[1].getContent()).toEqual(
              expectedOutputParagraph);
            done();
          });
        }
      );
    });
  });
});
