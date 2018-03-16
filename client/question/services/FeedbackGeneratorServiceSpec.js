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
 * @fileoverview Unit tests for the FeedbackGeneratorService.
 */

describe('FeedbackGeneratorService', function() {
  var BuggyOutputTestObjectFactory;
  var CodeEvalResultObjectFactory;
  var ErrorTracebackObjectFactory;
  var FeedbackGeneratorService;
  var PrereqCheckFailureObjectFactory;
  var SuiteLevelTestObjectFactory;
  var TaskObjectFactory;
  var TestCaseObjectFactory;
  var TracebackCoordinatesObjectFactory;
  var TranscriptService;
  var sampleErrorTraceback;
  var timeLimitErrorTraceback;
  var testTask;
  var PREREQ_CHECK_TYPE_MISSING_STARTER_CODE;
  var PREREQ_CHECK_TYPE_BAD_IMPORT;
  var PREREQ_CHECK_TYPE_GLOBAL_CODE;
  var PREREQ_CHECK_TYPE_WRONG_LANG;
  var PREREQ_CHECK_TYPE_INVALID_SYSTEM_CALL;
  var PREREQ_CHECK_TYPE_INVALID_AUXILIARYCODE_CALL;
  var PREREQ_CHECK_TYPE_INVALID_STUDENTCODE_CALL;
  var LANGUAGE_PYTHON;
  var FEEDBACK_CATEGORIES;
  var PYTHON_PRIMER_BUTTON_NAME;
  var UNFAMILIARITY_THRESHOLD;
  var CORRECTNESS_FEEDBACK_TEXT;

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    BuggyOutputTestObjectFactory = $injector.get(
      'BuggyOutputTestObjectFactory');
    CodeEvalResultObjectFactory = $injector.get('CodeEvalResultObjectFactory');
    ErrorTracebackObjectFactory = $injector.get('ErrorTracebackObjectFactory');
    FeedbackGeneratorService = $injector.get('FeedbackGeneratorService');
    PrereqCheckFailureObjectFactory = $injector.get(
      'PrereqCheckFailureObjectFactory');
    SuiteLevelTestObjectFactory = $injector.get('SuiteLevelTestObjectFactory');
    TaskObjectFactory = $injector.get('TaskObjectFactory');
    TestCaseObjectFactory = $injector.get('TestCaseObjectFactory');
    TracebackCoordinatesObjectFactory = $injector
      .get('TracebackCoordinatesObjectFactory');
    TranscriptService = $injector.get('TranscriptService');
    PREREQ_CHECK_TYPE_BAD_IMPORT = $injector.get(
      'PREREQ_CHECK_TYPE_BAD_IMPORT');
    PREREQ_CHECK_TYPE_MISSING_STARTER_CODE = $injector.get(
      'PREREQ_CHECK_TYPE_MISSING_STARTER_CODE');
    PREREQ_CHECK_TYPE_GLOBAL_CODE = $injector.get(
      'PREREQ_CHECK_TYPE_GLOBAL_CODE');
    PREREQ_CHECK_TYPE_WRONG_LANG = $injector.get(
      'PREREQ_CHECK_TYPE_WRONG_LANG');
    PREREQ_CHECK_TYPE_INVALID_SYSTEM_CALL = $injector.get(
      'PREREQ_CHECK_TYPE_INVALID_SYSTEM_CALL');
    PREREQ_CHECK_TYPE_INVALID_AUXILIARYCODE_CALL = $injector.get(
      'PREREQ_CHECK_TYPE_INVALID_AUXILIARYCODE_CALL');
    PREREQ_CHECK_TYPE_INVALID_STUDENTCODE_CALL = $injector.get(
      'PREREQ_CHECK_TYPE_INVALID_STUDENTCODE_CALL');
    LANGUAGE_PYTHON = $injector.get('LANGUAGE_PYTHON');
    FEEDBACK_CATEGORIES = $injector.get('FEEDBACK_CATEGORIES');
    PYTHON_PRIMER_BUTTON_NAME = $injector.get('PYTHON_PRIMER_BUTTON_NAME');
    UNFAMILIARITY_THRESHOLD = $injector.get('UNFAMILIARITY_THRESHOLD');
    CORRECTNESS_FEEDBACK_TEXT = $injector.get('CORRECTNESS_FEEDBACK_TEXT');

    var taskDict = [{
      instructions: [''],
      prerequisiteSkills: [''],
      acquiredSkills: [''],
      inputFunctionName: null,
      outputFunctionName: null,
      mainFunctionName: 'mockMainFunction',
      testSuites: [],
      buggyOutputTests: [],
      suiteLevelTests: [],
      performanceTests: [{
        inputDataAtom: 'meow ',
        transformationFunctionName: 'System.extendString',
        expectedPerformance: 'linear',
        evaluationFunctionName: 'mockMainFunction'
      }]
    }];

    testTask = taskDict.map(function(task) {
      return TaskObjectFactory.create(task);
    });

    sampleErrorTraceback = ErrorTracebackObjectFactory.create(
      'ZeroDivisionError: integer division or modulo by zero',
      [TracebackCoordinatesObjectFactory.create(5, 1)]);
    timeLimitErrorTraceback = ErrorTracebackObjectFactory.create(
      'TimeLimitError: Program exceeded run time limit.',
      [TracebackCoordinatesObjectFactory.create(5, 1)]);

    FeedbackGeneratorService._resetCounters();
  }));

  describe('_jsToHumanReadable', function() {
    it('should return "stringified" (readable) versions of input variables',
      function() {
        expect(
          FeedbackGeneratorService._jsToHumanReadable(null)
        ).toEqual('None');
        expect(
          FeedbackGeneratorService._jsToHumanReadable(undefined)
        ).toEqual('None');
        expect(
          FeedbackGeneratorService._jsToHumanReadable('cat')
        ).toEqual('"cat"');
        expect(
          FeedbackGeneratorService._jsToHumanReadable('cat  \t   \t\n')
        ).toEqual('"cat  \\t   \\t\\n"');
        expect(
          FeedbackGeneratorService._jsToHumanReadable(1)
        ).toEqual('1');
        expect(
          FeedbackGeneratorService._jsToHumanReadable(true)
        ).toEqual('True');
        expect(
          FeedbackGeneratorService._jsToHumanReadable(false)
        ).toEqual('False');
        expect(
          FeedbackGeneratorService._jsToHumanReadable([1, 3, 5])
        ).toEqual('[1, 3, 5]');
        expect(
          FeedbackGeneratorService._jsToHumanReadable({
            a: 3,
            b: 5,
            c: 'j'
          })
        ).toEqual('{"a": 3, "b": 5, "c": "j"}');
      }
    );
  });

  describe('_jsToHumanReadableUnknownObject', function() {
    it('should throw an error if the provided input cannot be converted',
      function() {
        // Define and call blankFunction to pass lint test add 100% coverage
        var blankFunction = function() {
          return null;
        };
        blankFunction();
        expect(function() {
          FeedbackGeneratorService._jsToHumanReadable(blankFunction);
        }).toThrowError(
          'Could not make the following object human-readable: ');
      }
    );
  });

  describe('_getCorrectnessTestFeedback', function() {
    var sampleInputTestSuite = {
      id: 'SAMPLE_INPUT',
      testCase: {
        input: 'Hello, John',
        allowedOutputs: ['olleH, nhoJ']
      }
    };
    var generalTestSuite = {
      id: 'GENERAL_CASE',
      testCase: {
        input: 'Hi, world',
        allowedOutputs: ['iH, dlrow']
      }
    };
    var whitespaceTestSuite = {
      id: 'WHITESPACE',
      testCase: {
        input: 'hello    ',
        allowedOutputs: ['olleh    ']
      }
    };
    var sampleInputTestCase;
    var generalInputTestCase;
    var whitespaceTestCase;

    beforeEach(function() {
      sampleInputTestCase =
        TestCaseObjectFactory.create(sampleInputTestSuite.testCase);
      generalInputTestCase =
        TestCaseObjectFactory.create(generalTestSuite.testCase);
      whitespaceTestCase =
        TestCaseObjectFactory.create(whitespaceTestSuite.testCase);
    });

    it('should allow user to display output if suite id is \'SAMPLE_INPUT\'',
      function() {
        var correctnessFeedbackParagraphs =
          FeedbackGeneratorService._getCorrectnessTestFeedback(
          sampleInputTestCase, sampleInputTestSuite.id, 0,
          'incorrect answer').getParagraphs();
        expect(correctnessFeedbackParagraphs.length).toEqual(2);
        expect(correctnessFeedbackParagraphs[0].isTextParagraph()).toEqual(
          true);
        expect(CORRECTNESS_FEEDBACK_TEXT.OUTPUT_ENABLED).toContain(
          correctnessFeedbackParagraphs[0].getContent());
        expect(correctnessFeedbackParagraphs[1].isOutputParagraph()).toEqual(
          true);
        var expectedOutputParagraph =
          'Input: "Hello, John"\n' +
          'Expected Output: "olleH, nhoJ"\n' +
          'Actual Output: "incorrect answer"';
        expect(correctnessFeedbackParagraphs[1].getContent()).toEqual(
          expectedOutputParagraph);
      }
    );

    it('should suggest input to try first', function() {
      var correctnessFeedbackParagraphs =
        FeedbackGeneratorService._getCorrectnessTestFeedback(
        generalInputTestCase, generalTestSuite.id, 0,
        'yeH, uoyerawoh').getParagraphs();
      expect(correctnessFeedbackParagraphs.length).toEqual(2);
      expect(correctnessFeedbackParagraphs[0].isTextParagraph()).toEqual(
        true);
      expect(CORRECTNESS_FEEDBACK_TEXT.INPUT_TO_TRY).toContain(
        correctnessFeedbackParagraphs[0].getContent());
      expect(correctnessFeedbackParagraphs[1].isCodeParagraph()).toEqual(
        true);
      var expectedInputCodeParagraph = 'Input: "Hi, world"';
      expect(correctnessFeedbackParagraphs[1].getContent()).toEqual(
        expectedInputCodeParagraph);
    });

    it('should present expected output second', function() {
      FeedbackGeneratorService._getCorrectnessTestFeedback(
        generalInputTestCase, generalTestSuite.id, 0,
        'yeH, uoyerawoh').getParagraphs();
      var correctnessFeedbackParagraphs =
        FeedbackGeneratorService._getCorrectnessTestFeedback(
        generalInputTestCase, generalTestSuite.id, 0,
        'yeH, uoyerawoh').getParagraphs();
      expect(correctnessFeedbackParagraphs.length).toEqual(2);
      expect(correctnessFeedbackParagraphs[0].isTextParagraph()).toEqual(
        true);
      expect(CORRECTNESS_FEEDBACK_TEXT.EXPECTED_OUTPUT).toContain(
        correctnessFeedbackParagraphs[0].getContent());
      expect(correctnessFeedbackParagraphs[1].isCodeParagraph()).toEqual(
        true);
      var expectedExpectedOutputParagraph =
        'Input: "Hi, world"\n' +
        'Expected Output: "iH, dlrow"';
      expect(correctnessFeedbackParagraphs[1].getContent()).toEqual(
        expectedExpectedOutputParagraph);
    });

    it('should allow user to display code output last', function() {
      FeedbackGeneratorService._getCorrectnessTestFeedback(
        generalInputTestCase, generalTestSuite.id, 0,
        'yeH, uoyerawoh').getParagraphs();
      FeedbackGeneratorService._getCorrectnessTestFeedback(
        generalInputTestCase, generalTestSuite.id, 0,
        'yeH, uoyerawoh').getParagraphs();
      var correctnessFeedbackParagraphs =
        FeedbackGeneratorService._getCorrectnessTestFeedback(
        generalInputTestCase, generalTestSuite.id, 0,
        'yeH, uoyerawoh').getParagraphs();
      expect(correctnessFeedbackParagraphs.length).toEqual(2);
      expect(correctnessFeedbackParagraphs[0].isTextParagraph()).toEqual(
        true);
      expect(CORRECTNESS_FEEDBACK_TEXT.OUTPUT_ENABLED).toContain(
        correctnessFeedbackParagraphs[0].getContent());
      expect(correctnessFeedbackParagraphs[1].isOutputParagraph()).toEqual(
        true);
      var expectedOutputParagraph =
        'Input: "Hi, world"\n' +
        'Expected Output: "iH, dlrow"\n' +
        'Actual Output: "yeH, uoyerawoh"';
      expect(correctnessFeedbackParagraphs[1].getContent()).toEqual(
        expectedOutputParagraph);
    });

    it('should catch regressions in user code', function() {
      FeedbackGeneratorService._getCorrectnessTestFeedback(
        generalInputTestCase, generalTestSuite.id, 0,
        'yeH, uoyerawoh').getParagraphs();
      FeedbackGeneratorService._getCorrectnessTestFeedback(
        whitespaceTestCase, whitespaceTestSuite.id, 0,
        'olleh ').getParagraphs();
      var correctnessFeedbackParagraphs =
        FeedbackGeneratorService._getCorrectnessTestFeedback(
        generalInputTestCase, generalTestSuite.id, 0,
        'yeH, uoyerawoh').getParagraphs();
      expect(correctnessFeedbackParagraphs.length).toEqual(2);
      expect(correctnessFeedbackParagraphs[0].isTextParagraph()).toEqual(
        true);
      expect(correctnessFeedbackParagraphs[0].getContent()).toEqual(
        'It looks like there was a regression in your code. Your code ' +
        'used to work for the following, but it now fails:');
      expect(correctnessFeedbackParagraphs[1].isCodeParagraph()).toEqual(
        true);
      var expectedRegressionParagraph =
        'Input: "Hi, world"\n' +
        'Expected Output: "iH, dlrow"';
      expect(correctnessFeedbackParagraphs[1].getContent()).toEqual(
        expectedRegressionParagraph);
    });
  });

  describe('_getPerformanceTestFeedback', function() {
    it([
      'should return feedback if user\'s function is running ',
      'significantly more slowly than expected'
    ].join(''), function() {
      var feedback = FeedbackGeneratorService._getPerformanceTestFeedback(
        'linear');
      var paragraphs = feedback.getParagraphs();

      expect(feedback.getFeedbackCategory()).toEqual(
        FEEDBACK_CATEGORIES.PERFORMANCE_TEST_FAILURE);
      expect(paragraphs.length).toEqual(1);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe([
        'Your code is running more slowly than expected. Can you ',
        'reconfigure it such that it runs in linear time?'
      ].join(''));
    });
  });

  describe('_getInfiniteLoopFeedback', function() {
    it('should return an error if an infinite loop is detected', function() {
      var feedback = FeedbackGeneratorService._getInfiniteLoopFeedback();
      var paragraphs = feedback.getParagraphs();

      expect(feedback.getFeedbackCategory()).toEqual(
        FEEDBACK_CATEGORIES.STACK_EXCEEDED_ERROR);
      expect(paragraphs.length).toEqual(1);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe([
        'Looks like your code is hitting an infinite recursive loop.',
        'Check to see that your recursive calls terminate.'
      ].join(' '));
    });
  });

  describe('_getUnfamiliarLanguageFeedback', function() {
    it('should return the string for the text feedback for python', function() {
      var feedbackString = FeedbackGeneratorService
        ._getUnfamiliarLanguageFeedback(LANGUAGE_PYTHON);
      expect(feedbackString).toEqual([
        "Seems like you're having some trouble with Python. Why ",
        "don't you take a look at the page linked through the '",
        PYTHON_PRIMER_BUTTON_NAME + "' button at the bottom of the screen?"
      ].join(''));
      expect(function() {
        FeedbackGeneratorService._updateCounters('Not a counter');
      }).toThrowError('Invalid parameter');
    });
  });

  describe('_getRuntimeErrorFeedback', function() {
    it('should return an error if a runtime error occurred', function() {
      var codeEvalResult = CodeEvalResultObjectFactory.create(
        'some code', 'some output', [], [], [], sampleErrorTraceback,
        'testInput');

      var feedback = FeedbackGeneratorService._getRuntimeErrorFeedback(
        codeEvalResult, [0, 1, 2, 3, 4]);
      var paragraphs = feedback.getParagraphs();

      expect(feedback.getFeedbackCategory()).toEqual(
        FEEDBACK_CATEGORIES.RUNTIME_ERROR);
      expect(paragraphs.length).toEqual(2);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe([
        'Looks like your code had a runtime error when evaluating the input ' +
        '"testInput".'
      ].join(''));
      expect(paragraphs[1].isErrorParagraph()).toBe(true);
      expect(paragraphs[1].getContent()).toBe(
        'ZeroDivisionError: integer division or modulo by zero on line 5');
    });

    it('should throw an error if the line number index is less than 0',
      function() {
        var buggyErrorTraceback = ErrorTracebackObjectFactory.create(
            'ZeroDivisionError: integer division or modulo by zero',
            [TracebackCoordinatesObjectFactory.create(0, 1)]);
        var codeEvalResult = CodeEvalResultObjectFactory.create(
          'some code', 'some output', [], [], [], buggyErrorTraceback,
          'testInput');
        expect(function() {
          FeedbackGeneratorService._getRuntimeErrorFeedback(
            codeEvalResult, [0, 1, 2, 3, 4]
          );
        }).toThrow(new Error("Line number index out of range: -1"));
      }
    );

    it('should throw an error if the line number index is greater than the ' +
        'length of rawCodeLineIndexes', function() {
      var codeEvalResult = CodeEvalResultObjectFactory.create(
          'some code', 'some output', [], [], [], sampleErrorTraceback,
          'testInput');

      expect(function() {
        FeedbackGeneratorService._getRuntimeErrorFeedback(codeEvalResult, [0]);
      }).toThrow();
    });

    it('should throw an error if the line number index is equal to the ' +
        'length of rawCodeLineIndexes', function() {
      var codeEvalResult = CodeEvalResultObjectFactory.create(
          'some code', 'some output', [], [], [], sampleErrorTraceback,
          'testInput');
      expect(function() {
        FeedbackGeneratorService._getRuntimeErrorFeedback(codeEvalResult,
            [0, 1, 2, 3]);
      }).toThrow();
    });

    it('should adjust the line numbers correctly', function() {
      var codeEvalResult = CodeEvalResultObjectFactory.create(
        'some code', 'some output', [], [], [], sampleErrorTraceback,
        'testInput');

      // This maps line 4 (0-indexed) of the preprocessed code to line 1
      // (0-indexed) of the raw code, which becomes line 2 (when 1-indexed).
      var paragraphs = FeedbackGeneratorService._getRuntimeErrorFeedback(
        codeEvalResult, [0, null, null, null, 1]).getParagraphs();

      expect(paragraphs.length).toEqual(2);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe([
        'Looks like your code had a runtime error when evaluating the input ' +
        '"testInput".'
      ].join(''));
      expect(paragraphs[1].isErrorParagraph()).toBe(true);
      expect(paragraphs[1].getContent()).toBe(
        'ZeroDivisionError: integer division or modulo by zero on line 2');
    });

    it('should correctly handle errors due to the test code', function() {
      var codeEvalResult = CodeEvalResultObjectFactory.create(
        'some code', 'some output', [], [], [], sampleErrorTraceback,
        'testInput');

      // This maps line 5 (1-indexed) to null, which means that there is no
      // corresponding line in the raw code.
      var paragraphs = FeedbackGeneratorService._getRuntimeErrorFeedback(
        codeEvalResult, [0, null, null, null, null]).getParagraphs();

      expect(paragraphs.length).toEqual(2);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe([
        'Looks like your code had a runtime error when evaluating the input ' +
        '"testInput".'
      ].join(''));
      expect(paragraphs[1].isErrorParagraph()).toBe(true);
      expect(paragraphs[1].getContent()).toBe(
        'ZeroDivisionError: integer division or modulo by zero on a line ' +
        'in the test code');
    });
  });

  describe('_getHumanReadableRuntimeFeedback', function() {
    it([
      'should return the correct feedback string if the code throws an ',
      'IndentationError'
    ].join(''), function() {
      var errorString = "IndentationError: ...";
      var feedbackString =
          FeedbackGeneratorService._getHumanReadableRuntimeFeedback(
            errorString, LANGUAGE_PYTHON);
      expect(feedbackString).toEqual(
          ['It looks like your code has some inconsistencies with ',
            'indentation. Double check that you indent after every statement ',
            'that ends with a ":" and un-indent when necessary.'].join('')
      );
    });

    it(['should return the correct feedback string if the code throws a ',
      'TypeError where the user tries to assign items in a string without ',
      'splice'].join(''),
      function() {
        var errorString = "TypeError: 'str' does not support item " +
            "assignment";
        var feedbackString =
            FeedbackGeneratorService._getHumanReadableRuntimeFeedback(
              errorString, LANGUAGE_PYTHON);
        expect(feedbackString).toEqual(
          [
            "Unfortunately Python doesn't support directly assigning ",
            "characters in a string. If you need to do so, try slicing the ",
            "string and adding new characters instead of assigning them. ",
            "If you need a refresher on slicing, check out the primer."
          ].join('')
        );
      }
    );

    it(['should return the correct feedback string if the user tries to ',
      'implicitly convert a non-string object to a string'].join(''),
      function() {
        var errorString = "TypeError: cannot concatenate 'str' and 'int'" +
            "objects";
        var feedbackString =
            FeedbackGeneratorService._getHumanReadableRuntimeFeedback(
              errorString, LANGUAGE_PYTHON);
        expect(feedbackString).toEqual(
          ["Did you remember to explicitly convert all objects to strings",
            " when necessary (like when you're concatenating a string)? Make ",
            "sure everything that isn't a string gets converted using the ",
            "str() method or by using a formatted string."].join("")
        );
      }
    );

    it(['should return the correct feedback string if the code submission ',
      'throws a NameError'].join(''), function() {
      var errorString = "NameError: name 'hello' is not defined";
      var feedbackString =
          FeedbackGeneratorService._getHumanReadableRuntimeFeedback(
            errorString, LANGUAGE_PYTHON);
      expect(feedbackString).toEqual([
        "It looks like hello isn't a declared variable. ",
        "Did you make sure to spell it correctly? And is it correctly ",
        "initialized?"].join('')
      );
    });

    it(['should return the correct feedback string if the code throws an ',
      'AttributeError'].join(''), function() {
      var errorString = "AttributeError: 'str' object has no attribute " +
          "'lowerr'";
      var feedbackString =
          FeedbackGeneratorService._getHumanReadableRuntimeFeedback(
            errorString, LANGUAGE_PYTHON);
      expect(feedbackString).toEqual(
          ["str doesn't have a property or method named ",
            "lowerr. Double check to make sure everything is spelled ",
            "correctly."].join("")
      );
    });

    it(['should return the correct feedback string if the code throws an ',
      'IndexError where index is out of list bounds'].join(''), function() {
      var errorString = "IndexError: list index out of range";
      var feedbackString =
          FeedbackGeneratorService._getHumanReadableRuntimeFeedback(
            errorString, LANGUAGE_PYTHON);
      expect(feedbackString).toEqual(
            ["It looks like you're trying to access an index that is out ",
              "of the bounds for the list. Double check that your loops and ",
              "assignments don't try to retrieve from indexes below 0 or above",
              " the length of the string."].join('')
      );
    });

    it(['should return the correct feedback string if the code throws a ',
      'KeyError'].join(''), function() {
      var errorString = "KeyError: key on line 1";
      var feedbackString =
          FeedbackGeneratorService._getHumanReadableRuntimeFeedback(
            errorString, LANGUAGE_PYTHON);
      expect(feedbackString).toEqual(
              ["The key key is not in the dictionary you're trying to ",
                "retrieve from. Double check to make sure everything is ",
                "spelled correctly and that you haven't forgotten to add any ",
                "key-value pairs."].join('')
      );
    });

    it(['should return a null if it doesn\'t recognize the given ',
      'error'].join(''), function() {
      var errorString = "not known error";
      var feedbackString =
          FeedbackGeneratorService._getHumanReadableRuntimeFeedback(
            errorString, LANGUAGE_PYTHON);
      expect(feedbackString).toBeNull();
    });
  });

  describe('getSyntaxErrorFeedback', function() {
    it([
      'should return feedback if a syntax / compiler error is ',
      'found in the user\'s code'
    ].join(''), function() {
      var feedback = FeedbackGeneratorService.getSyntaxErrorFeedback(
        'some error');
      expect(feedback.getFeedbackCategory()).toEqual(
        FEEDBACK_CATEGORIES.SYNTAX_ERROR);

      var paragraphs = feedback.getParagraphs();
      expect(paragraphs.length).toEqual(2);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[1].isErrorParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe(
          'It looks like your code has a syntax error. ' +
          'Try to figure out what the error is.');
      expect(paragraphs[1].getContent()).toBe('some error');
    });

    it('should correctly append language unfamiliarity feedback if ' +
       'consecutiveUnfamiliarityLanguageCounter reaches the ' +
       'UNFAMILIARITY_THRESHOLD count with syntax errors', function() {
      var errorString = 'some error';

      var feedback;

      for (var i = 0; i < UNFAMILIARITY_THRESHOLD; i++) {
        feedback = FeedbackGeneratorService.getSyntaxErrorFeedback(
          errorString);
      }
      var paragraphs = feedback.getParagraphs();
      expect(paragraphs.length).toEqual(3);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toEqual(
          'It looks like your code has a syntax error. ' +
          'Try to figure out what the error is.');
      expect(paragraphs[1].isErrorParagraph()).toBe(true);
      expect(paragraphs[1].getContent()).toEqual('some error');
      expect(paragraphs[2].isTextParagraph()).toBe(true);
      expect(paragraphs[2].getContent()).toEqual(
        FeedbackGeneratorService._getUnfamiliarLanguageFeedback(
          LANGUAGE_PYTHON));
    });
  });

  describe('_getTimeoutErrorFeedback', function() {
    it('should return a specific error for TimeLimitErrors', function() {
      var questionMock = {};
      var codeEvalResult = CodeEvalResultObjectFactory.create(
        'some code', 'some output', [], [], [], timeLimitErrorTraceback,
        'testInput');

      var feedback = FeedbackGeneratorService.getFeedback(
        questionMock, codeEvalResult, []);
      expect(feedback.getFeedbackCategory()).toEqual(
        FEEDBACK_CATEGORIES.TIME_LIMIT_ERROR);

      var paragraphs = feedback.getParagraphs();
      expect(paragraphs.length).toEqual(1);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe([
        "Your program's exceeded the time limit (",
        "3 seconds) we've set. Can you try to make it run ",
        "more efficiently?"
      ].join(''));
    });
  });

  describe('_getBuggyOutputTestFeedback', function() {
    var buggyOutputTestDict = {
      buggyFunction: 'AuxiliaryCode.countNumberOfParentheses',
      messages: [
        [
          "Try running your code on '))((' on paper. ",
          'Did you expect that result?'
        ].join(''),
        [
          'Are you making sure the parentheses are properly balanced? () ',
          'is balanced, but )( is not.'
        ].join(''),
        [
          "It looks like you're counting the number of parentheses, and if ",
          "you have the same # of each kind, returning true. That's not ",
          "quite correct. See if you can figure out why."
        ].join('')
      ]
    };

    it([
      'should return the next hint in sequence for buggy outputs, provided ',
      'the code has been changed'
    ].join(''), function() {
      var buggyOutputTest = BuggyOutputTestObjectFactory.create(
        buggyOutputTestDict);
      var codeEvalResult = CodeEvalResultObjectFactory.create(
        'some code', 'same output', [], [true], [], null, null);

      var feedback = FeedbackGeneratorService._getBuggyOutputTestFeedback(
        buggyOutputTest, false);
      TranscriptService.recordSnapshot(null, codeEvalResult, feedback, null);

      var paragraphs = feedback.getParagraphs();
      expect(feedback.getFeedbackCategory()).toEqual(
        FEEDBACK_CATEGORIES.KNOWN_BUG_FAILURE);
      expect(paragraphs.length).toEqual(1);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe(buggyOutputTestDict.messages[0]);

      paragraphs = FeedbackGeneratorService._getBuggyOutputTestFeedback(
        buggyOutputTest, true).getParagraphs();
      expect(paragraphs.length).toEqual(1);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe(buggyOutputTestDict.messages[1]);
    });

    it([
      'should return the same hint multiple times for buggy outputs, ',
      'provided the code has NOT been changed'
    ].join(''), function() {
      var buggyOutputTest = BuggyOutputTestObjectFactory.create(
        buggyOutputTestDict);
      var codeEvalResult = CodeEvalResultObjectFactory.create(
        'some code', 'same output', [], [true], [], null, null);

      var feedback = FeedbackGeneratorService._getBuggyOutputTestFeedback(
        buggyOutputTest, true);
      var paragraphs = feedback.getParagraphs();
      TranscriptService.recordSnapshot(null, codeEvalResult, feedback, null);

      expect(paragraphs.length).toEqual(1);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe(buggyOutputTestDict.messages[0]);

      // We pass in false to indicate the code has not changed.
      feedback = FeedbackGeneratorService._getBuggyOutputTestFeedback(
        buggyOutputTest, false).getParagraphs();

      expect(paragraphs.length).toEqual(1);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe(buggyOutputTestDict.messages[0]);
    });

    it([
      'should return null if a student reaches the end of the available hints.'
    ].join(''), function() {
      var buggyOutputTest = BuggyOutputTestObjectFactory.create(
        buggyOutputTestDict);
      var codeEvalResult = CodeEvalResultObjectFactory.create(
        'some code', 'same output', [], [true], [], null, null);
      var codeEvalResultWithSameBug = CodeEvalResultObjectFactory.create(
        'new code', 'same output', [], [true], [], null, null);
      var codeEvalResultWithStillSameBug = CodeEvalResultObjectFactory.create(
        'newer code', 'same output', [], [true], [], null, null);

      var feedback = FeedbackGeneratorService._getBuggyOutputTestFeedback(
        buggyOutputTest, true);
      var paragraphs = feedback.getParagraphs();
      TranscriptService.recordSnapshot(null, codeEvalResult, feedback, null);

      expect(paragraphs.length).toEqual(1);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe(buggyOutputTestDict.messages[0]);

      feedback = FeedbackGeneratorService._getBuggyOutputTestFeedback(
        buggyOutputTest, true);
      paragraphs = feedback.getParagraphs();
      TranscriptService.recordSnapshot(
        null, codeEvalResultWithSameBug, feedback, null);

      expect(paragraphs.length).toEqual(1);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe(buggyOutputTestDict.messages[1]);

      feedback = FeedbackGeneratorService._getBuggyOutputTestFeedback(
        buggyOutputTest, true);
      paragraphs = feedback.getParagraphs();
      TranscriptService.recordSnapshot(
        null, codeEvalResultWithStillSameBug, feedback, null);

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
        'some code', 'same output', [], [true], [], null,
        null);
      var codeEvalResultWithNewError = CodeEvalResultObjectFactory.create(
        'other code', 'some output', [], [], [], 'ERROR MESSAGE', 'testInput');

      var feedback = FeedbackGeneratorService._getBuggyOutputTestFeedback(
        buggyOutputTest, true);
      var paragraphs = feedback.getParagraphs();
      TranscriptService.recordSnapshot(null, codeEvalResult, feedback, null);

      expect(paragraphs.length).toEqual(1);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe(buggyOutputTestDict.messages[0]);

      var unusedRuntimeErrorFeedback = (
        FeedbackGeneratorService._getBuggyOutputTestFeedback(
          buggyOutputTest, true));
      TranscriptService.recordSnapshot(
        null, codeEvalResultWithNewError, unusedRuntimeErrorFeedback, null);

      feedback = FeedbackGeneratorService._getBuggyOutputTestFeedback(
        buggyOutputTest, true).getParagraphs();

      expect(paragraphs.length).toEqual(1);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe(buggyOutputTestDict.messages[0]);
    });
  });

  describe('_getSuiteLevelTestFeedback', function() {
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
        'some code', 'same output', [], [true], [], null, null);
      var codeEvalResult2 = CodeEvalResultObjectFactory.create(
        'new code', 'same output', [], [true], [], null, null);

      var feedback = FeedbackGeneratorService._getSuiteLevelTestFeedback(
        suiteLevelTest, true);
      expect(feedback.getFeedbackCategory()).toEqual(
        FEEDBACK_CATEGORIES.SUITE_LEVEL_FAILURE);
      TranscriptService.recordSnapshot(null, codeEvalResult1, feedback, null);

      var paragraphs = feedback.getParagraphs();
      expect(paragraphs.length).toEqual(1);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe(suiteLevelTestDict.messages[0]);

      // The code is changed. The feedback changes.
      feedback = FeedbackGeneratorService._getSuiteLevelTestFeedback(
        suiteLevelTest, true);
      TranscriptService.recordSnapshot(null, codeEvalResult2, feedback, null);
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
          'code 1', 'same output', [], [true], [], null, null),
        CodeEvalResultObjectFactory.create(
          'code 2', 'same output', [], [true], [], null, null),
        CodeEvalResultObjectFactory.create(
          'code 3', 'same output', [], [true], [], null, null)
      ];

      for (var i = 0; i < 3; i++) {
        var feedback = FeedbackGeneratorService._getSuiteLevelTestFeedback(
          suiteLevelTest, true);
        TranscriptService.recordSnapshot(
          null, codeEvalResults[i], feedback, null);

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
        'code 1', 'same output', [], [true], [], null, null);
      var codeEvalResult2 = CodeEvalResultObjectFactory.create(
        'code 2', 'same output', [], [true], [], null, null);

      var feedback = FeedbackGeneratorService._getSuiteLevelTestFeedback(
        suiteLevelTest, true);
      TranscriptService.recordSnapshot(null, codeEvalResult1, feedback, null);
      feedback = FeedbackGeneratorService._getSuiteLevelTestFeedback(
        suiteLevelTest, true);
      TranscriptService.recordSnapshot(null, codeEvalResult2, feedback, null);

      var paragraphs = feedback.getParagraphs();
      expect(paragraphs.length).toEqual(1);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe(suiteLevelTestDict.messages[1]);

      // Now get buggy output feedback once.
      feedback = FeedbackGeneratorService._getBuggyOutputTestFeedback(
        buggyOutputTest, true);
      TranscriptService.recordSnapshot(null, codeEvalResult1, feedback, null);
      paragraphs = feedback.getParagraphs();
      expect(paragraphs.length).toEqual(1);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe(buggyOutputTestDict.messages[0]);

      // The index of suite-level feedback then gets reset to 0.
      feedback = FeedbackGeneratorService._getSuiteLevelTestFeedback(
        suiteLevelTest, true);
      TranscriptService.recordSnapshot(null, codeEvalResult1, feedback, null);
      paragraphs = feedback.getParagraphs();
      expect(paragraphs.length).toEqual(1);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe(suiteLevelTestDict.messages[0]);
    });
  });

  describe('getFeedback', function() {
    it('should correctly return feedback if the performance does not meet ' +
      'expectations', function() {
      var codeEvalResult = CodeEvalResultObjectFactory.create(
        'some code', 'some output', [], [], ['not linear'], null, null);

      var feedback = FeedbackGeneratorService.getFeedback(
        testTask, codeEvalResult, []);

      var paragraphs = feedback.getParagraphs();
      expect(paragraphs.length).toEqual(1);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toEqual('Your code is running more ' +
        'slowly than expected. Can you reconfigure it such that it runs in ' +
        'linear time?');
    });

    it('should correctly append language unfamiliarity feedback if ' +
        'consecutiveUnfamiliarityLanguageCounter reaches the ' +
        'UNFAMILIARITY_THRESHOLD count with wrong language errors', function() {
      var starterCode = [
        'def myFunction(arg):',
        '    return arg',
        ''
      ].join('\n');

      var prereqFailure = PrereqCheckFailureObjectFactory.create(
        PREREQ_CHECK_TYPE_WRONG_LANG, null, starterCode, 'push');

      var feedback;

      for (var i = 0; i < UNFAMILIARITY_THRESHOLD; i++) {
        feedback = FeedbackGeneratorService.getPrereqFailureFeedback(
            prereqFailure);
      }

      var paragraphs = feedback.getParagraphs();
      expect(paragraphs.length).toEqual(2);
      expect(paragraphs[0].getContent()).toEqual([
        "It seems like you're using a `push` method to add an element ",
        "to an array, which is valid in Java, but the Python equivalent ",
        "is called `append`."
      ].join(''));
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[1].getContent()).toEqual(
        FeedbackGeneratorService._getUnfamiliarLanguageFeedback(
          LANGUAGE_PYTHON));
      expect(paragraphs[1].isTextParagraph()).toBe(true);
    });

    it('should correctly append language unfamiliarity feedback if ' +
       'consecutiveSameRuntimeErrorCounter reaches the ' +
       'UNFAMILIARITY_THRESHOLD count', function() {
      var codeEvalResult = CodeEvalResultObjectFactory.create(
        'some code', 'some output', [], [], [], sampleErrorTraceback,
        'testInput');

      var feedback;

      for (var i = 0; i <= UNFAMILIARITY_THRESHOLD; i++) {
        feedback = FeedbackGeneratorService.getFeedback(
          testTask, codeEvalResult, [0, 1, 2, 3, 4, 5]);
        TranscriptService.recordSnapshot(null, codeEvalResult, feedback);
      }

      var paragraphs = feedback.getParagraphs();
      expect(paragraphs.length).toEqual(3);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe([
        'Looks like your code had a runtime error when evaluating the input ' +
        '"testInput".'
      ].join(''));
      expect(paragraphs[1].isErrorParagraph()).toBe(true);
      expect(paragraphs[1].getContent()).toBe(
        'ZeroDivisionError: integer division or modulo by zero on line 5');
      expect(paragraphs[2].isTextParagraph()).toBe(true);
      expect(paragraphs[2].getContent()).toBe(
        FeedbackGeneratorService._getUnfamiliarLanguageFeedback(
          LANGUAGE_PYTHON));
    });
  });

  describe('getPrereqFailureFeedback', function() {
    it('should throw error if there is no prereqCheckFailure', function() {
      expect(function() {
        FeedbackGeneratorService.getPrereqFailureFeedback(null);
      }).toThrow();
    });

    it('should return the correct info if Missing Starter Code', function() {
      var starterCode = [
        'def myFunction(arg):',
        '    return arg',
        ''
      ].join('\n');
      var prereqFailure = PrereqCheckFailureObjectFactory.create(
        PREREQ_CHECK_TYPE_MISSING_STARTER_CODE, null, starterCode);
      var feedback = FeedbackGeneratorService.getPrereqFailureFeedback(
        prereqFailure);
      expect(feedback.isAnswerCorrect()).toEqual(false);
      var paragraphs = feedback.getParagraphs();
      expect(paragraphs[0].getContent()).toEqual([
        'It looks like you deleted or modified the starter code!  Our ',
        'evaluation program requires the function names given in the ',
        'starter code.  You can press the \'Reset Code\' button to start ',
        'over.  Or, you can copy the starter code below:'
      ].join(''));
      expect(paragraphs[1].getContent()).toEqual(starterCode);
      expect(feedback.getFeedbackCategory()).toEqual(
        FEEDBACK_CATEGORIES.FAILS_STARTER_CODE_CHECK);
    });

    it('should return the correct info if using a bad import', function() {
      var prereqFailure = PrereqCheckFailureObjectFactory.create(
        PREREQ_CHECK_TYPE_BAD_IMPORT, ['panda'], null);

      var feedback = FeedbackGeneratorService.getPrereqFailureFeedback(
        prereqFailure);
      expect(feedback.isAnswerCorrect()).toEqual(false);
      var paragraphs = feedback.getParagraphs();
      expect(paragraphs[0].getContent()).toEqual([
        "It looks like you're importing an external library. However, the ",
        'following libraries are not supported:\n'
      ].join(''));
      expect(paragraphs[1].getContent()).toEqual('panda');
      expect(paragraphs[2].getContent()).toEqual('Here is a list of libraries' +
        ' we currently support:\n');
      expect(paragraphs[3].getContent()).toEqual('collections, ' +
        'math, operator, random, re, string, time');
      expect(feedback.getFeedbackCategory()).toEqual(
        FEEDBACK_CATEGORIES.FAILS_BAD_IMPORT_CHECK);
    });

    it('should return the correct info if it has code in the global scope',
      function() {
        var prereqFailure = PrereqCheckFailureObjectFactory.create(
          PREREQ_CHECK_TYPE_GLOBAL_CODE, null, null);

        var feedback = FeedbackGeneratorService.getPrereqFailureFeedback(
          prereqFailure);
        expect(feedback.isAnswerCorrect()).toEqual(false);
        var paragraphs = feedback.getParagraphs();
        expect(paragraphs[0].getContent()).toEqual([
          'Please keep your code within the existing predefined functions ',
          'or define your own helper functions if you need to ',
          '-- we cannot process code in the global scope.'
        ].join(' '));
        expect(paragraphs[0].isTextParagraph()).toBe(true);
        expect(feedback.getFeedbackCategory()).toEqual(
          FEEDBACK_CATEGORIES.FAILS_GLOBAL_CODE_CHECK);
      }
    );

    it('should throw an error if it uses the increment operator for the wrong' +
        'language', function() {
      var prereqFailure = PrereqCheckFailureObjectFactory.create(
        PREREQ_CHECK_TYPE_WRONG_LANG, null, null, 'incrementOp');
      var feedback = FeedbackGeneratorService.getPrereqFailureFeedback(
        prereqFailure);
      expect(feedback.isAnswerCorrect()).toEqual(false);
      var paragraphs = feedback.getParagraphs();
      expect(paragraphs[0].getContent()).toEqual([
        "Hmm... It looks like you're trying to use '++' to increment a ",
        "number, but unfortunately, this isn't valid in Python. Try ",
        "using '+= 1' instead."
      ].join(''));
      expect(feedback.getFeedbackCategory()).toEqual(
        FEEDBACK_CATEGORIES.FAILS_LANGUAGE_DETECTION_CHECK);
    });

    it('should throw an error if it uses the decrement operator for the wrong' +
        'language', function() {
      var prereqFailure = PrereqCheckFailureObjectFactory.create(
        PREREQ_CHECK_TYPE_WRONG_LANG, null, null, 'decrementOp');
      var feedback = FeedbackGeneratorService.getPrereqFailureFeedback(
        prereqFailure);
      expect(feedback.isAnswerCorrect()).toEqual(false);
      var paragraphs = feedback.getParagraphs();
      expect(paragraphs[0].getContent()).toEqual([
        "Hmm... It looks like you're trying to use '--' to decrement a ",
        "number, but unfortunately, this isn't valid in Python. Try ",
        "using '-= 1' instead."
      ].join(''));
    });

    it('should throw an error if it uses the push method instead of append',
      function() {
        var prereqFailure = PrereqCheckFailureObjectFactory.create(
          PREREQ_CHECK_TYPE_WRONG_LANG, null, null, 'push');
        var feedback = FeedbackGeneratorService.getPrereqFailureFeedback(
          prereqFailure);
        expect(feedback.isAnswerCorrect()).toEqual(false);
        var paragraphs = feedback.getParagraphs();
        expect(paragraphs[0].getContent()).toEqual([
          "It seems like you're using a `push` method to add an element ",
          "to an array, which is valid in Java, but the Python equivalent ",
          "is called `append`."
        ].join(''));
      }
    );

    it('should throw an error if it uses a catch statement in the wrong ' +
        'language', function() {
      var prereqFailure = PrereqCheckFailureObjectFactory.create(
        PREREQ_CHECK_TYPE_WRONG_LANG, null, null, 'catch');
      var feedback = FeedbackGeneratorService.getPrereqFailureFeedback(
        prereqFailure);
      expect(feedback.isAnswerCorrect()).toEqual(false);
      var paragraphs = feedback.getParagraphs();
      expect(paragraphs[0].getContent()).toEqual([
        "Are you trying to use a `catch` statement to catch an ",
        "Exception? In Python, we use `except` instead."
      ].join(''));
    });

    it('should throw an error if it uses a Java/C-like comment syntax ' +
        'in the wrong language', function() {
      var prereqFailure = PrereqCheckFailureObjectFactory.create(
        PREREQ_CHECK_TYPE_WRONG_LANG, null, null, 'javaComment');
      var feedback = FeedbackGeneratorService.getPrereqFailureFeedback(
        prereqFailure);
      expect(feedback.isAnswerCorrect()).toEqual(false);
      var paragraphs = feedback.getParagraphs();
      expect(paragraphs[0].getContent()).toEqual([
        "Hmmm... It seems like you're using the Java syntax to write ",
        "comments. Make sure you're using the '#' character on lines ",
        "you want to comment out."
      ].join(''));
    });

    it('should throw an error if it uses a do-while loop in a language ' +
        'that doesn\'t support such loops', function() {
      var prereqFailure = PrereqCheckFailureObjectFactory.create(
        PREREQ_CHECK_TYPE_WRONG_LANG, null, null, 'doWhile');
      var feedback = FeedbackGeneratorService.getPrereqFailureFeedback(
        prereqFailure);
      expect(feedback.isAnswerCorrect()).toEqual(false);
      var paragraphs = feedback.getParagraphs();
      expect(paragraphs[0].getContent()).toEqual([
        "Unfortunately, Python doesn't support do-while statements. ",
        "Perhaps try using a flag or different condition instead?"
      ].join(''));
    });

    it('should throw an error if it uses an else-if statement in a language ' +
        'that doesn\'t support it', function() {
      var prereqFailure = PrereqCheckFailureObjectFactory.create(
        PREREQ_CHECK_TYPE_WRONG_LANG, null, null, 'elseIf');
      var feedback = FeedbackGeneratorService.getPrereqFailureFeedback(
        prereqFailure);
      expect(feedback.isAnswerCorrect()).toEqual(false);
      var paragraphs = feedback.getParagraphs();
      expect(paragraphs[0].getContent()).toEqual([
        "Make sure to double check that you're using `elif` instead of ",
        "`else if` for your if-else statements."
      ].join(''));
    });

    it('should throw an error if it uses a switch statement in a language ' +
        'that does not support it', function() {
      var prereqFailure = PrereqCheckFailureObjectFactory.create(
        PREREQ_CHECK_TYPE_WRONG_LANG, null, null, 'switch');
      var feedback = FeedbackGeneratorService.getPrereqFailureFeedback(
        prereqFailure);
      expect(feedback.isAnswerCorrect()).toEqual(false);
      var paragraphs = feedback.getParagraphs();
      expect(paragraphs[0].getContent()).toEqual([
        "Oops, Python doesn't support switch statements. You'll ",
        "just have to use if-else statements instead."
      ].join(''));
    });

    it('should throw an error if it uses a C-style import in a language ' +
        'that does not support it', function() {
      var prereqFailure = PrereqCheckFailureObjectFactory.create(
        PREREQ_CHECK_TYPE_WRONG_LANG, null, null, 'cImport');
      var feedback = FeedbackGeneratorService.getPrereqFailureFeedback(
        prereqFailure);
      expect(feedback.isAnswerCorrect()).toEqual(false);
      var paragraphs = feedback.getParagraphs();
      expect(paragraphs[0].getContent()).toEqual([
        "It looks like you're using a C-like syntax to try and import ",
        "packages. In Python, your imports should be in the format: "
      ].join(''));
      expect(paragraphs[1].getContent()).toEqual(
          "import [insert package name here]");
    });

    it('should throw an error if it uses a NOT operator that is not valid ' +
        'in the current language', function() {
      var prereqFailure = PrereqCheckFailureObjectFactory.create(
        PREREQ_CHECK_TYPE_WRONG_LANG, null, null, 'notOp');
      var feedback = FeedbackGeneratorService.getPrereqFailureFeedback(
        prereqFailure);
      expect(feedback.isAnswerCorrect()).toEqual(false);
      var paragraphs = feedback.getParagraphs();
      expect(paragraphs[0].getContent()).toEqual([
        "Are you using the right NOT operator? In Python, it's just `not`."
      ].join(''));
    });

    it('should throw an error if it uses an OR operator that is not valid ' +
        'in the current language', function() {
      var prereqFailure = PrereqCheckFailureObjectFactory.create(
        PREREQ_CHECK_TYPE_WRONG_LANG, null, null, 'orOp');
      var feedback = FeedbackGeneratorService.getPrereqFailureFeedback(
        prereqFailure);
      expect(feedback.isAnswerCorrect()).toEqual(false);
      var paragraphs = feedback.getParagraphs();
      expect(paragraphs[0].getContent()).toEqual([
        "Hmmm... It seems like you're trying to use the OR operator ",
        "syntax from Java. Be sure you're using the Python appropriate ",
        "operator - `or`."
      ].join(''));
    });

    it('should throw an error if it uses an AND operator that is not valid ' +
        'in the current language', function() {
      var prereqFailure = PrereqCheckFailureObjectFactory.create(
        PREREQ_CHECK_TYPE_WRONG_LANG, null, null, 'andOp');
      var feedback = FeedbackGeneratorService.getPrereqFailureFeedback(
        prereqFailure);
      expect(feedback.isAnswerCorrect()).toEqual(false);
      var paragraphs = feedback.getParagraphs();
      expect(paragraphs[0].getContent()).toEqual([
        "Triple check you're using the right AND operator. For Python, ",
        "the AND operator is simply `and`."
      ].join(''));
    });

    it('should return the correct info if it has an invalid AuxiliaryCode call',
      function() {
        var prereqFailure = PrereqCheckFailureObjectFactory.create(
          PREREQ_CHECK_TYPE_INVALID_AUXILIARYCODE_CALL, null, null);
        var feedback = FeedbackGeneratorService.getPrereqFailureFeedback(
            prereqFailure);
        var paragraphs = feedback.getParagraphs();
        expect(paragraphs[0].getContent()).toEqual([
          'Looks like your code had a runtime error. Here is the error',
          'message: '
        ].join(' '));
        expect(paragraphs[0].isTextParagraph()).toBe(true);
        expect(paragraphs[1].getContent()).toEqual([
          'ForbiddenNamespaceError: It looks like you\'re trying to call ',
          'the AuxiliaryCode class or its methods, which is forbidden. ',
          'Please resubmit without using this class.'
        ].join(''));
        expect(paragraphs[1].isCodeParagraph()).toBe(true);
        expect(feedback.getFeedbackCategory()).toEqual(
          FEEDBACK_CATEGORIES.FAILS_FORBIDDEN_NAMESPACE_CHECK);
      }
    );

    it('should return the correct info if it has an invalid System call',
      function() {
        var prereqFailure = PrereqCheckFailureObjectFactory.create(
            PREREQ_CHECK_TYPE_INVALID_SYSTEM_CALL, null, null);
        var feedback = FeedbackGeneratorService.getPrereqFailureFeedback(
            prereqFailure);
        expect(feedback.isAnswerCorrect()).toEqual(false);
        var paragraphs = feedback.getParagraphs();
        expect(paragraphs[0].getContent()).toEqual([
          'Looks like your code had a runtime error. Here is the error',
          'message: '
        ].join(' '));
        expect(paragraphs[0].isTextParagraph()).toBe(true);
        expect(paragraphs[1].getContent()).toEqual([
          'ForbiddenNamespaceError: It looks you\'re using the System class ',
          'or its methods, which is forbidden. Please resubmit without ',
          'using this class.'
        ].join(''));
        expect(paragraphs[1].isCodeParagraph()).toBe(true);
        expect(feedback.getFeedbackCategory()).toEqual(
          FEEDBACK_CATEGORIES.FAILS_FORBIDDEN_NAMESPACE_CHECK);
      }
    );

    it('should return the correct info if it has an invalid StudentCode call',
      function() {
        var prereqFailure = PrereqCheckFailureObjectFactory.create(
            PREREQ_CHECK_TYPE_INVALID_STUDENTCODE_CALL, null, null);
        var feedback = FeedbackGeneratorService.getPrereqFailureFeedback(
            prereqFailure);
        expect(feedback.isAnswerCorrect()).toEqual(false);
        var paragraphs = feedback.getParagraphs();
        expect(paragraphs[0].getContent()).toEqual([
          'Looks like your code had a runtime error. Here is the error',
          'message: '
        ].join(' '));
        expect(paragraphs[0].isTextParagraph()).toBe(true);
        expect(paragraphs[1].getContent()).toEqual([
          'ForbiddenNamespaceError: It looks you\'re trying to call the ',
          'StudentCode class or its methods, which is forbidden. Please ',
          'resubmit without using this class.'
        ].join(''));
        expect(paragraphs[1].isCodeParagraph()).toBe(true);
        expect(feedback.getFeedbackCategory()).toEqual(
          FEEDBACK_CATEGORIES.FAILS_FORBIDDEN_NAMESPACE_CHECK);
      }
    );

    it('should throw an error if using an unknown PrereqCheckFailureObject' +
      'type', function() {
      var prereqFailure = PrereqCheckFailureObjectFactory.create(
        'unknown', null, null);

      expect(function() {
        FeedbackGeneratorService.getPrereqFailureFeedback(prereqFailure);
      }).toThrow();
    });
  });

  describe('_getRandomInt', function() {
    it('should return a random number within the defined range',
      function() {
        var min = 0;
        var max = 4;
        var maxTries = 100;
        for (var i = 0; i < maxTries; i++) {
          var randomNumber = FeedbackGeneratorService._getRandomInt(min, max);
          expect(typeof randomNumber).toEqual('number');
          expect(randomNumber).not.toBeLessThan(0);
          expect(randomNumber).not.toBeGreaterThan(3);
        }
      }
    );
  });

  describe('_getCorrectnessFeedbackString', function() {
    it('should return a feedback string from CORRECTNESS_FEEDBACK_TEXT',
      function() {
        for (var correctnessFeedbackType in CORRECTNESS_FEEDBACK_TEXT) {
          var selectedFeedbackText =
            FeedbackGeneratorService._getCorrectnessFeedbackString(
            correctnessFeedbackType);
          expect(CORRECTNESS_FEEDBACK_TEXT[correctnessFeedbackType]).toContain(
            selectedFeedbackText);
        }
      }
    );
  });
});
