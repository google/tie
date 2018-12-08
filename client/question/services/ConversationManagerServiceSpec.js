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
  var ConversationManagerService;
  var CurrentQuestionService;
  var ExpectedFeedbackObjectFactory;
  var QuestionObjectFactory;
  var TaskObjectFactory;

  var CORRECTNESS_STATE_INPUT_DISPLAYED;
  var CORRECTNESS_FEEDBACK_TEXT;
  var LANGUAGE_PYTHON;
  var SUPPORTED_PYTHON_LIBS;

  var taskDict = [{
    instructions: ['Return the input string.'],
    prerequisiteSkills: [''],
    acquiredSkills: [''],
    inputFunctionName: null,
    outputFunctionName: null,
    mainFunctionName: 'mockMainFunction',
    languageSpecificTips: {
      python: []
    },
    testSuites: [{
      id: 'TASK1SUITE1',
      humanReadableName: 'suite 1 -- single words',
      testCases: [{
        input: 'task1suite1test1',
        allowedOutputs: ['task1suite1test1']
      }, {
        input: 'task1suite1test2',
        allowedOutputs: ['task1suite1test2']
      }]
    }, {
      id: 'TASK1SUITE2',
      humanReadableName: 'suite 2 -- multiple words',
      testCases: [{
        input: 'task1 suite2 test1',
        allowedOutputs: ['task1 suite2 test1']
      }, {
        input: 'task1 suite2 test2',
        allowedOutputs: ['task1 suite2 test2']
      }]
    }],
    buggyOutputTests: [{
      buggyFunctionName: 'AuxiliaryCode.returnIAmBuggy',
      ignoredTestSuiteIds: [],
      messages: [
        'Mock BuggyOutputTest Message One for task1',
        'Mock BuggyOutputTest Message Two for task1',
        'Mock BuggyOutputTest Message Three for task1'
      ]
    }, {
      buggyFunctionName: 'AuxiliaryCode.returnYesIfInputHasNoSpaces',
      ignoredTestSuiteIds: [],
      messages: [
        'This buggy message should NOT trigger if code just returns Yes'
      ]
    }, {
      buggyFunctionName: 'AuxiliaryCode.returnYesIfInputHasNoSpaces',
      // TODO(sll): Remove GENERAL_CASE from here. This is due to an error in
      // the codebase that causes a suite in *any* task to influence a buggy
      // output match. Instead, buggy output checks should be localized to a
      // task.
      ignoredTestSuiteIds: ['TASK1SUITE2', 'GENERAL_CASE'],
      messages: [
        'This buggy message should trigger if code just returns Yes'
      ]
    }],
    suiteLevelTests: [{
      // This triggers if the code works correctly for 1-word cases but fails
      // the multi-word cases.
      testSuiteIdsThatMustPass: ['TASK1SUITE1'],
      testSuiteIdsThatMustFail: ['TASK1SUITE2'],
      messages: ['suite_message1', 'suite_message2']
    }],
    performanceTests: []
  }, {
    instructions: ['But, if there is an "!", return "!" instead.'],
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
      humanReadableName: 'the exclamation mark case',
      testCases: [{
        input: 'first test in task2!!!',
        allowedOutputs: ['!']
      }, {
        input: 'absolutely final test!',
        allowedOutputs: ['!']
      }]
    }],
    buggyOutputTests: [],
    suiteLevelTests: [],
    performanceTests: []
  }];

  var starterCode = [
    'def mockMainFunction(input):',
    '    return True'
  ].join('\n');

  var auxiliaryCode = [
    'class AuxiliaryCode(object):',
    '    @classmethod',
    '    def returnIAmBuggy(cls, input):',
    '        return "I am buggy"',
    '',
    '    @classmethod',
    '    def returnYesIfInputHasNoSpaces(cls, input):',
    '        return "Yes" if " " not in input else ""',
    '',
    '    @classmethod',
    '    def returnFalse(cls, input):',
    '        return False'
  ].join('\n');

  var codeThatFailsBuggyOutputForTaskOne = [
    'def mockMainFunction(input):',
    '    return "I am buggy"'
  ].join('\n');

  var anotherCodeThatFailsBuggyOutputForTaskOne = [
    'def mockMainFunction(input):',
    '    return "I am " + "buggy"'
  ].join('\n');

  var codeThatFailsBuggyOutputWithIgnoredSuiteForTaskOne = [
    'def mockMainFunction(input):',
    '    return "Yes"'
  ].join('\n');

  var codeThatFailsBuggyOutputForTaskTwo = [
    'def mockMainFunction(input):',
    '    return False'
  ].join('\n');

  var codeThatFailsSuiteLevelForTaskOne = [
    'def mockMainFunction(input):',
    '    return input if " " not in input else ""'
  ].join('\n');

  var codeThatFailsOnlyOneTestInTask1Suite2 = [
    'def mockMainFunction(input):',
    '    return input if input != "task1 suite2 test2" else ""'
  ].join('\n');

  var anotherCodeThatFailsSuiteLevelForTaskOne = [
    'def mockMainFunction(input):',
    '    return input + "" if " " not in input else ""'
  ].join('\n');

  var codeThatPassesBothTasks = [
    'def mockMainFunction(input):',
    '    return "!" if "!" in input else input'
  ].join('\n');

  var codeThatFailsFirstTaskOnly = [
    'def mockMainFunction(input):',
    '    return "!"'
  ].join('\n');

  var codeThatFailsSecondTaskOnly = [
    'def mockMainFunction(input):',
    '    return input'
  ].join('\n');

  var codeThatFailsBothTasks = [
    'def mockMainFunction(input):',
    '    return "hello"'
  ].join('\n');

  var codeThatPrintsAndPassesBothTasks = [
    'def mockMainFunction(input):',
    '    print input',
    '    return "!" if "!" in input else input'
  ].join('\n');

  var codeThatPrintsAndFailsFinalTest = [
    'def mockMainFunction(input):',
    '    print input',
    '    if input == "absolutely final test!":',
    '        return "wrong answer"',
    '    return "!" if "!" in input else input'
  ].join('\n');

  var codeThatPrintsAndFailsSecondTaskOnly = [
    'def mockMainFunction(input):',
    '    print input',
    '    return input'
  ].join('\n');

  var codeThatPrintsAndFailsBothTasks = [
    'def mockMainFunction(input):',
    '    print input',
    '    return "hello"'
  ].join('\n');

  var question;
  var orderedTasks;

  beforeEach(module('tie'));

  // Mock tasks for preprocessing.
  beforeEach(inject(function($injector) {
    ConversationManagerService = $injector.get('ConversationManagerService');
    CurrentQuestionService = $injector.get('CurrentQuestionService');
    ExpectedFeedbackObjectFactory = $injector.get(
      'ExpectedFeedbackObjectFactory');
    QuestionObjectFactory = $injector.get('QuestionObjectFactory');
    TaskObjectFactory = $injector.get('TaskObjectFactory');

    CORRECTNESS_FEEDBACK_TEXT = $injector.get('CORRECTNESS_FEEDBACK_TEXT');
    CORRECTNESS_STATE_INPUT_DISPLAYED = $injector.get(
      'CORRECTNESS_STATE_INPUT_DISPLAYED');
    LANGUAGE_PYTHON = $injector.get('LANGUAGE_PYTHON');
    SUPPORTED_PYTHON_LIBS = $injector.get('SUPPORTED_PYTHON_LIBS');

    question = QuestionObjectFactory.create({
      title: 'Question 1',
      starterCode: starterCode,
      auxiliaryCode: auxiliaryCode,
      tasks: taskDict
    });

    spyOn(CurrentQuestionService, 'getCurrentQuestion').and.returnValue(
      question);

    orderedTasks = taskDict.map(function(task) {
      return TaskObjectFactory.create(task);
    });
  }));

  // Recursive method to verify submissions.
  var verifySubmissions = function(errorMessages, done, submissionSpecs) {
    ConversationManagerService.processSolutionAsync(
      orderedTasks, starterCode, submissionSpecs[0].code, auxiliaryCode,
      LANGUAGE_PYTHON
    ).then(function(submissionResult) {
      var newErrorMessages = errorMessages.concat(
        submissionSpecs[0].expectedFeedback.verifyFeedback(submissionResult));
      if (submissionSpecs.length === 1) {
        expect(newErrorMessages).toEqual([]);
        done();
      } else {
        verifySubmissions(newErrorMessages, done, submissionSpecs.slice(1));
      }
    });
  };

  describe("prereqCheckFailures", function() {
    it('detects code in global scope', function(done) {
      verifySubmissions([], done, [{
        code: [
          'def mockMainFunction(input):',
          '    return input',
          'mockMainFunction("input")'
        ].join('\n'),
        expectedFeedback: ExpectedFeedbackObjectFactory.create(
          [['Please keep your code within the existing predefined ',
            'functions or define your own helper functions if you need ',
            'to -- we cannot process code in the global scope.'].join('')],
          null)
      }]);
    });

    it('detects missing starter code', function(done) {
      verifySubmissions([], done, [{
        code: '',
        expectedFeedback: ExpectedFeedbackObjectFactory.create(
          [['It looks like you deleted or modified the starter code!  Our ',
            'evaluation program requires the function names given in the ',
            'starter code.  You can press the \'Reset Code\' button to ',
            'start over.  Or, you can copy the starter code below:'].join(''),
            starterCode],
          null)
      }]);
    });

    it('detects bad imports', function(done) {
      verifySubmissions([], done, [{
        code: [
          'import pandas',
          'def mockMainFunction(input):',
          '    return True'
        ].join('\n'),
        expectedFeedback: ExpectedFeedbackObjectFactory.create(
          [["It looks like you're importing an external library. However, ",
            'the following libraries are not supported:\n'].join(''),
            'pandas'],
          null, false, function(submissionResult) {
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
      }]);
    });

    it('returns 1st errorLineNumber if there are many errors', function(done) {
      verifySubmissions([], done, [{
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
          [], null, null, false,
          function(submissionResult) {
            var feedback = submissionResult.getFeedback();
            var expectedLineNumber = 5;
            if (feedback.getErrorLineNumber() === expectedLineNumber) {
              return [];
            } else {
              return ['Wrong error line number'];
            }
          }
        )
      }]);
    });
  });

  describe('general syntax errors', function() {
    it('should correctly handle a syntax error', function(done) {
      verifySubmissions([], done, [{
        code: [
          'def mockMainFunction(input):',
          '    return True -'
        ].join('\n'),
        expectedFeedback: ExpectedFeedbackObjectFactory.create(
          ['Error detected on or near line 2:',
            '<code>SyntaxError: bad input</code>'],
            null)
      }]);
    });
  });

  describe('friendly syntax errors', function() {
    it('should correctly handle a friendly syntax error', function(done) {
      verifySubmissions([], done, [{
        code: [
          'def mockMainFunction(input):',
          '        a = 1',
          '    b = 2',
          '    return ""'
        ].join('\n'),
        expectedFeedback: ExpectedFeedbackObjectFactory.create(
          ['Error detected on or near line 3:',
            '<code>IndentationError: unindent does not match any outer ' +
            'indentation level</code>',
            'It looks like your code has some inconsistencies with ' +
            'indentation. Double-check that you indent after every statement ' +
            'that ends with a ":" and un-indent when necessary.'],
            null)
      }]);
    });
  });

  describe('stack-exceeded errors', function() {
    it('should correctly handle a stack-exceeded error', function(done) {
      verifySubmissions([], done, [{
        code: [
          'def mockMainFunction(input):',
          '    return mockMainFunction(input)',
          ''
        ].join('\n'),
        expectedFeedback: ExpectedFeedbackObjectFactory.create(
          [["Your code appears to be hitting an infinite recursive loop. ",
            "Check to make sure that your recursive calls terminate."
          ].join('')],
          null, null)
      }]);
    });
  });

  describe('runtime errors', function() {
    it('should correctly handle a runtime error', function(done) {
      verifySubmissions([], done, [{
        code: [
          'def mockMainFunction(input):',
          '    return greeting',
          ''
        ].join('\n'),
        expectedFeedback: ExpectedFeedbackObjectFactory.create(
          [['<code>greeting</code> appears to be a name that was not ',
            'previously declared or defined. E.g., if <code>greeting</code> ',
            'is a variable to hold a string, <code>greeting = \'\'</code> ',
            'would declare <code>greeting</code> as a string variable. ',
            'Similarly, <code>greeting = []</code> declares ',
            '<code>greeting</code> as an array variable. Another possibility ',
            'is that <code>greeting</code> was misspelled or uses incorrect ',
            'capitalization.'].join('')],
          null, null)
      }]);
    });
  });

  describe('buggy output tests', function() {
    it('should detect failures on task1', function(done) {
      verifySubmissions([], done, [{
        code: codeThatFailsBuggyOutputForTaskOne,
        expectedFeedback: ExpectedFeedbackObjectFactory.create(
          ['Mock BuggyOutputTest Message One for task1'])
      }]);
    });

    it('should show task 1 f/b over task 2 buggy-output f/b', function(done) {
      verifySubmissions([], done, [{
        code: codeThatFailsBuggyOutputForTaskTwo,
        expectedFeedback: ExpectedFeedbackObjectFactory.create(
          [null, "Input: \"task1suite1test1\""])
      }]);
    });

    it('should show a new message only if the code changes', function(done) {
      verifySubmissions([], done, [{
        code: codeThatFailsBuggyOutputForTaskOne,
        expectedFeedback: ExpectedFeedbackObjectFactory.create(
          ['Mock BuggyOutputTest Message One for task1'])
      }, {
        // The code has not changed, so the message stays the same.
        code: codeThatFailsBuggyOutputForTaskOne,
        expectedFeedback: ExpectedFeedbackObjectFactory.create(
          ['Mock BuggyOutputTest Message One for task1'])
      }, {
        // The code has changed, so the message changes.
        code: anotherCodeThatFailsBuggyOutputForTaskOne,
        expectedFeedback: ExpectedFeedbackObjectFactory.create(
          ['Mock BuggyOutputTest Message Two for task1'])
      }]);
    });

    it('shows correctness f/b after all buggy hints are shown', function(done) {
      verifySubmissions([], done, [{
        code: codeThatFailsBuggyOutputForTaskOne,
        expectedFeedback: ExpectedFeedbackObjectFactory.create(
          ['Mock BuggyOutputTest Message One for task1'])
      }, {
        code: anotherCodeThatFailsBuggyOutputForTaskOne,
        expectedFeedback: ExpectedFeedbackObjectFactory.create(
          ['Mock BuggyOutputTest Message Two for task1'])
      }, {
        code: codeThatFailsBuggyOutputForTaskOne,
        expectedFeedback: ExpectedFeedbackObjectFactory.create(
          ['Mock BuggyOutputTest Message Three for task1'])
      }, {
        // At this point, we have run out of buggy-output test feedback.
        code: anotherCodeThatFailsBuggyOutputForTaskOne,
        expectedFeedback: ExpectedFeedbackObjectFactory.create(
          [], '', false, function(submissionResult) {
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
      }]);
    });

    it('returns to first buggy hint after non-buggy error', function(done) {
      var runtimeErrorStudentCode = [
        'def mockMainFunction(input):',
        '    return 5 / 0'
      ].join('\n');

      verifySubmissions([], done, [{
        code: codeThatFailsBuggyOutputForTaskOne,
        expectedFeedback: ExpectedFeedbackObjectFactory.create(
          ['Mock BuggyOutputTest Message One for task1'])
      }, {
        code: runtimeErrorStudentCode,
        expectedFeedback: ExpectedFeedbackObjectFactory.create(
          [['Looks like your code had a runtime error when evaluating the ',
            'input "task1suite1test1".'].join('')],
          null, null)
      }, {
        // The cycle is broken, so we start from the top of the
        // buggy-message list.
        code: codeThatFailsBuggyOutputForTaskOne,
        expectedFeedback: ExpectedFeedbackObjectFactory.create(
          ['Mock BuggyOutputTest Message One for task1'])
      }]);
    });
  });

  describe('buggy output ignored test suites', function() {
    it('should ignore buggy outputs for ignored suite ids', function(done) {
      verifySubmissions([], done, [{
        code: codeThatFailsBuggyOutputWithIgnoredSuiteForTaskOne,
        expectedFeedback: ExpectedFeedbackObjectFactory.create(
          ['This buggy message should trigger if code just returns Yes'])
      }]);
    });
  });

  describe('suite-level tests', function() {
    it('should return suite-level feedback when triggered', function(done) {
      verifySubmissions([], done, [{
        code: codeThatFailsSuiteLevelForTaskOne,
        expectedFeedback: ExpectedFeedbackObjectFactory.create(
          ['suite_message1'])
      }]);
    });

    it('does not show suite-level f/b if passing-prereq fails', function(done) {
      verifySubmissions([], done, [{
        // This code passes one test case in suite 1 and fails the other,
        // thus failing the suite.
        code: [
          'def mockMainFunction(input):',
          '    return True',
          ''
        ].join('\n'),
        expectedFeedback: ExpectedFeedbackObjectFactory.create(
          [], '', false, function(submissionResult) {
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
      }]);
    });

    it('considers a suite failed if at least one test fails', function(done) {
      verifySubmissions([], done, [{
        code: codeThatFailsOnlyOneTestInTask1Suite2,
        expectedFeedback: ExpectedFeedbackObjectFactory.create(
          ['suite_message1'])
      }]);
    });

    it('shows next suite-level f/b only if code was changed', function(done) {
      verifySubmissions([], done, [{
        code: codeThatFailsSuiteLevelForTaskOne,
        expectedFeedback: ExpectedFeedbackObjectFactory.create(
          ['suite_message1'])
      }, {
        code: codeThatFailsSuiteLevelForTaskOne,
        expectedFeedback: ExpectedFeedbackObjectFactory.create(
          ['suite_message1'])
      }, {
        code: anotherCodeThatFailsSuiteLevelForTaskOne,
        expectedFeedback: ExpectedFeedbackObjectFactory.create(
          ['suite_message2'])
      }]);
    });

    it('returns correctness feedback after all suite-hints', function(done) {
      verifySubmissions([], done, [{
        code: codeThatFailsSuiteLevelForTaskOne,
        expectedFeedback: ExpectedFeedbackObjectFactory.create(
          ['suite_message1'])
      }, {
        code: anotherCodeThatFailsSuiteLevelForTaskOne,
        expectedFeedback: ExpectedFeedbackObjectFactory.create(
          ['suite_message2'])
      }, {
        // We've reached the end of the hints.
        code: codeThatFailsSuiteLevelForTaskOne,
        expectedFeedback: ExpectedFeedbackObjectFactory.create(
          [], '', false, function(submissionResult) {
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
      }]);
    });

    it('restarts suite-level feedback after unrelated errors', function(done) {
      // This code leads to a runtime error.
      var runtimeErrorStudentCode = [
        'def mockMainFunction(input):',
        '    return 5 / 0',
        ''
      ].join('\n');

      verifySubmissions([], done, [{
        code: codeThatFailsSuiteLevelForTaskOne,
        expectedFeedback: ExpectedFeedbackObjectFactory.create(
          ['suite_message1'])
      }, {
        code: runtimeErrorStudentCode,
        expectedFeedback: ExpectedFeedbackObjectFactory.create(
          [['Looks like your code had a runtime error when evaluating the ',
            'input "task1suite1test1".'].join('')],
          null, null)
      }, {
        // We start again at the beginning of the suite-level hints.
        code: codeThatFailsSuiteLevelForTaskOne,
        expectedFeedback: ExpectedFeedbackObjectFactory.create(
          ['suite_message1'])
      }]);
    });
  });

  describe('incorrect-output tests', function() {
    it('should check both tasks for full completion', function(done) {
      verifySubmissions([], done, [{
        code: codeThatPassesBothTasks,
        expectedFeedback: ExpectedFeedbackObjectFactory.create(
          [], '', true)
      }]);
    });

    it('should handle a failure on the first task', function(done) {
      verifySubmissions([], done, [{
        code: codeThatFailsFirstTaskOnly,
        expectedFeedback: ExpectedFeedbackObjectFactory.create(
          [null, 'Input: "task1suite1test1"'])
      }]);
    });

    it('should handle a failure on the second task', function(done) {
      verifySubmissions([], done, [{
        code: codeThatFailsSecondTaskOnly,
        expectedFeedback: ExpectedFeedbackObjectFactory.create(
          [null, 'Input: "first test in task2!!!"'])
      }]);
    });

    it('should show task1 error message if both tasks failed', function(done) {
      verifySubmissions([], done, [{
        code: codeThatFailsBothTasks,
        expectedFeedback: ExpectedFeedbackObjectFactory.create(
          [null, 'Input: "task1suite1test1"'])
      }]);
    });
  });

  describe('stdout generation', function() {
    it('should contain correct stdout on question completion', function(done) {
      verifySubmissions([], done, [{
        code: codeThatPrintsAndPassesBothTasks,
        expectedFeedback: ExpectedFeedbackObjectFactory.create(
          [], 'absolutely final test!\n', true)
      }]);
    });

    it('should have correct stdout if very last test failed', function(done) {
      verifySubmissions([], done, [{
        code: codeThatPrintsAndFailsFinalTest,
        expectedFeedback: ExpectedFeedbackObjectFactory.create(
          [null, 'Input: "absolutely final test!"'], 'absolutely final test!\n')
      }]);
    });

    it('should contain correct stdout if task 2 test 1 failed', function(done) {
      verifySubmissions([], done, [{
        code: codeThatPrintsAndFailsSecondTaskOnly,
        expectedFeedback: ExpectedFeedbackObjectFactory.create(
          [null, 'Input: "first test in task2!!!"'], 'first test in task2!!!\n')
      }]);
    });

    it('should contain correct stdout if first test failed', function(done) {
      verifySubmissions([], done, [{
        code: codeThatPrintsAndFailsBothTasks,
        expectedFeedback: ExpectedFeedbackObjectFactory.create(
          [null, 'Input: "task1suite1test1"'], 'task1suite1test1\n')
      }]);
    });
  });
});
