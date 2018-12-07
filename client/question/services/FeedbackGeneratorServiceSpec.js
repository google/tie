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
  var ErrorTracebackObjectFactory;
  var FeedbackDetailsObjectFactory;
  var FeedbackGeneratorService;
  var PrereqCheckFailureObjectFactory;
  var TestCaseObjectFactory;
  var TracebackCoordinatesObjectFactory;
  var sampleErrorTraceback;
  var PREREQ_CHECK_TYPE_MISSING_STARTER_CODE;
  var PREREQ_CHECK_TYPE_BAD_IMPORT;
  var PREREQ_CHECK_TYPE_GLOBAL_CODE;
  var PREREQ_CHECK_TYPE_WRONG_LANG;
  var PREREQ_CHECK_TYPE_INVALID_SYSTEM_CALL;
  var PREREQ_CHECK_TYPE_INVALID_AUXILIARYCODE_CALL;
  var PREREQ_CHECK_TYPE_INVALID_STUDENTCODE_CALL;
  var LANGUAGE_PYTHON;
  var FEEDBACK_CATEGORIES;
  var CORRECTNESS_FEEDBACK_TEXT;
  var CORRECTNESS_STATE_INPUT_DISPLAYED;
  var CORRECTNESS_STATE_EXPECTED_OUTPUT_DISPLAYED;
  var CORRECTNESS_STATE_OBSERVED_OUTPUT_DISPLAYED;
  var CORRECTNESS_STATE_NO_MORE_FEEDBACK;

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    ErrorTracebackObjectFactory = $injector.get('ErrorTracebackObjectFactory');
    FeedbackDetailsObjectFactory = $injector.get(
      'FeedbackDetailsObjectFactory');
    FeedbackGeneratorService = $injector.get('FeedbackGeneratorService');
    PrereqCheckFailureObjectFactory = $injector.get(
      'PrereqCheckFailureObjectFactory');
    TestCaseObjectFactory = $injector.get('TestCaseObjectFactory');
    TracebackCoordinatesObjectFactory = $injector
      .get('TracebackCoordinatesObjectFactory');
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
    CORRECTNESS_FEEDBACK_TEXT = $injector.get('CORRECTNESS_FEEDBACK_TEXT');
    CORRECTNESS_STATE_INPUT_DISPLAYED = $injector.get(
      'CORRECTNESS_STATE_INPUT_DISPLAYED');
    CORRECTNESS_STATE_EXPECTED_OUTPUT_DISPLAYED = $injector.get(
      'CORRECTNESS_STATE_EXPECTED_OUTPUT_DISPLAYED');
    CORRECTNESS_STATE_OBSERVED_OUTPUT_DISPLAYED = $injector.get(
      'CORRECTNESS_STATE_OBSERVED_OUTPUT_DISPLAYED');
    CORRECTNESS_STATE_NO_MORE_FEEDBACK = $injector.get(
      'CORRECTNESS_STATE_NO_MORE_FEEDBACK');

    sampleErrorTraceback = ErrorTracebackObjectFactory.create(
      'ZeroDivisionError: integer division or modulo by zero',
      [TracebackCoordinatesObjectFactory.create(5, 1)]);
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

  describe('getIncorrectOutputFeedback', function() {
    var generalTestSuite = {
      id: 'GENERAL_CASE',
      testCase: {
        input: 'Hi, world',
        allowedOutputs: ['iH, dlrow']
      }
    };
    var generalInputTestCase;

    beforeEach(function() {
      generalInputTestCase = TestCaseObjectFactory.create(
        generalTestSuite.testCase);
    });

    it('should correctly display "test input" feedback', function() {
      var feedbackDetails = (
        FeedbackDetailsObjectFactory.createIncorrectOutputFeedbackDetails(
          0, generalTestSuite.id, 0, generalInputTestCase, 'yeH, uoyerawoh',
          CORRECTNESS_STATE_INPUT_DISPLAYED, null, null));
      var correctnessFeedback = (
        FeedbackGeneratorService.getIncorrectOutputFeedback(feedbackDetails));
      var correctnessFeedbackParagraphs = correctnessFeedback.getParagraphs();

      expect(correctnessFeedbackParagraphs.length).toEqual(2);
      expect(correctnessFeedbackParagraphs[0].isTextParagraph()).toEqual(true);
      expect(
        CORRECTNESS_FEEDBACK_TEXT[CORRECTNESS_STATE_INPUT_DISPLAYED]
      ).toContain(correctnessFeedbackParagraphs[0].getContent());
      expect(correctnessFeedbackParagraphs[1].isCodeParagraph()).toEqual(true);
      var expectedInputCodeParagraph = 'Input: "Hi, world"';
      expect(correctnessFeedbackParagraphs[1].getContent()).toEqual(
        expectedInputCodeParagraph);
    });

    it('should correctly display "expected output" feedback', function() {
      var feedbackDetails = (
        FeedbackDetailsObjectFactory.createIncorrectOutputFeedbackDetails(
          0, generalTestSuite.id, 0, generalInputTestCase, 'yeH, uoyerawoh',
          CORRECTNESS_STATE_EXPECTED_OUTPUT_DISPLAYED, null, null));
      var correctnessFeedback = (
        FeedbackGeneratorService.getIncorrectOutputFeedback(feedbackDetails));
      var correctnessFeedbackParagraphs = correctnessFeedback.getParagraphs();

      expect(correctnessFeedbackParagraphs.length).toEqual(2);
      expect(correctnessFeedbackParagraphs[0].isTextParagraph()).toEqual(true);
      expect(
        CORRECTNESS_FEEDBACK_TEXT[CORRECTNESS_STATE_EXPECTED_OUTPUT_DISPLAYED]
      ).toContain(correctnessFeedbackParagraphs[0].getContent());
      expect(correctnessFeedbackParagraphs[1].isCodeParagraph()).toEqual(true);
      var expectedExpectedOutputParagraph =
        'Input: "Hi, world"\n' +
        'Expected Output: "iH, dlrow"';
      expect(correctnessFeedbackParagraphs[1].getContent()).toEqual(
        expectedExpectedOutputParagraph);
    });

    it('should correctly display "observed output" feedback', function() {
      var feedbackDetails = (
        FeedbackDetailsObjectFactory.createIncorrectOutputFeedbackDetails(
          0, generalTestSuite.id, 0, generalInputTestCase, 'yeH, uoyerawoh',
          CORRECTNESS_STATE_OBSERVED_OUTPUT_DISPLAYED, null, null));
      var correctnessFeedback = (
        FeedbackGeneratorService.getIncorrectOutputFeedback(feedbackDetails));
      var correctnessFeedbackParagraphs = correctnessFeedback.getParagraphs();

      expect(correctnessFeedbackParagraphs.length).toEqual(2);
      expect(correctnessFeedbackParagraphs[0].isTextParagraph()).toEqual(true);
      expect(
        CORRECTNESS_FEEDBACK_TEXT[CORRECTNESS_STATE_OBSERVED_OUTPUT_DISPLAYED]
      ).toContain(correctnessFeedbackParagraphs[0].getContent());
      expect(correctnessFeedbackParagraphs[1].isOutputParagraph()).toEqual(
        true);
      var expectedOutputParagraph =
        'Input: "Hi, world"\n' +
        'Expected Output: "iH, dlrow"\n' +
        'Actual Output: "yeH, uoyerawoh"';
      expect(correctnessFeedbackParagraphs[1].getContent()).toEqual(
        expectedOutputParagraph);
    });

    it('should correctly display "no more feedback" feedback', function() {
      var feedbackDetails = (
        FeedbackDetailsObjectFactory.createIncorrectOutputFeedbackDetails(
          0, generalTestSuite.id, 0, generalInputTestCase, 'yeH, uoyerawoh',
          CORRECTNESS_STATE_NO_MORE_FEEDBACK, null, null));

      var correctnessFeedback = (
        FeedbackGeneratorService.getIncorrectOutputFeedback(feedbackDetails));
      var correctnessFeedbackParagraphs = correctnessFeedback.getParagraphs();

      expect(correctnessFeedbackParagraphs.length).toEqual(2);
      expect(correctnessFeedbackParagraphs[0].isTextParagraph()).toEqual(true);
      expect(
        CORRECTNESS_FEEDBACK_TEXT[CORRECTNESS_STATE_NO_MORE_FEEDBACK]
      ).toContain(correctnessFeedbackParagraphs[0].getContent());
      expect(correctnessFeedbackParagraphs[1].isOutputParagraph()).toEqual(
        true);
      var expectedOutputParagraph =
        'Input: "Hi, world"\n' +
        'Expected Output: "iH, dlrow"\n' +
        'Actual Output: "yeH, uoyerawoh"';
      expect(correctnessFeedbackParagraphs[1].getContent()).toEqual(
        expectedOutputParagraph);
    });

    it('should throw an error is invalid correctness state is passed',
      function() {
        expect(function() {
          FeedbackDetailsObjectFactory.createIncorrectOutputFeedbackDetails(
              0, generalTestSuite.id, 0, generalInputTestCase, 'yeH, uoyerawoh',
              'BLAH_BLAH_BLAH', null, null);
        }).toThrow(new Error("Invalid correctness state: BLAH_BLAH_BLAH"));
      }
    );
  });

  describe('getPerformanceTestFeedback', function() {
    it([
      'should return feedback if user\'s function is running ',
      'significantly more slowly than expected'
    ].join(''), function() {
      var feedbackDetails = (
        FeedbackDetailsObjectFactory.createPerformanceFeedbackDetails(
          'linear'));

      var feedback = FeedbackGeneratorService.getPerformanceTestFeedback(
        feedbackDetails);
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

  describe('getStackExceededFeedback', function() {
    it('should return an error if infinite recursion is detected', function() {
      var feedback = FeedbackGeneratorService.getStackExceededFeedback();
      var paragraphs = feedback.getParagraphs();

      expect(feedback.getFeedbackCategory()).toEqual(
        FEEDBACK_CATEGORIES.STACK_EXCEEDED_ERROR);
      expect(paragraphs.length).toEqual(1);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe([
        "Your code appears to be hitting an infinite recursive loop. ",
        "Check to make sure that your recursive calls terminate."
      ].join(''));
    });
  });

  describe('getServerErrorFeedback', function() {
    it('should return an error if the server returns an error', function() {
      var feedback = FeedbackGeneratorService.getServerErrorFeedback();
      var paragraphs = feedback.getParagraphs();

      expect(feedback.getFeedbackCategory()).toEqual(
        FEEDBACK_CATEGORIES.SERVER_ERROR);
      expect(paragraphs.length).toEqual(1);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe([
        'A server error has occurred. We are looking into it ',
        'and will fix it as quickly as possible. We apologize ',
        'for the inconvenience.'
      ].join(''));
    });
  });

  describe('getRuntimeErrorFeedback', function() {
    it('should return an error if a runtime error occurred', function() {
      var feedbackDetails = (
        FeedbackDetailsObjectFactory.createRuntimeErrorFeedbackDetails(
          sampleErrorTraceback.getErrorLineNumber(),
          sampleErrorTraceback.getErrorString(), LANGUAGE_PYTHON, 'testInput',
          false));

      var feedback = FeedbackGeneratorService.getRuntimeErrorFeedback(
        feedbackDetails, [0, 1, 2, 3, 4]);
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
        'ZeroDivisionError: integer division or modulo by zero');
    });

    it('should throw an error if the line number index is less than 0',
      function() {
        var buggyErrorTraceback = ErrorTracebackObjectFactory.create(
            'ZeroDivisionError: integer division or modulo by zero',
            [TracebackCoordinatesObjectFactory.create(0, 1)]);
        var feedbackDetails = (
          FeedbackDetailsObjectFactory.createRuntimeErrorFeedbackDetails(
            buggyErrorTraceback.getErrorLineNumber(),
            buggyErrorTraceback.getErrorString(),
            LANGUAGE_PYTHON, 'testInput', false));

        expect(function() {
          FeedbackGeneratorService.getRuntimeErrorFeedback(
            feedbackDetails, [0, 1, 2, 3, 4]
          );
        }).toThrow(new Error("Line number index out of range: -1"));
      }
    );

    it('should throw an error if the line number index is greater than the ' +
        'length of rawCodeLineIndexes', function() {
      var feedbackDetails = (
        FeedbackDetailsObjectFactory.createRuntimeErrorFeedbackDetails(
          sampleErrorTraceback.getErrorLineNumber(),
          sampleErrorTraceback.getErrorString(), LANGUAGE_PYTHON, 'testInput',
          false));

      expect(function() {
        FeedbackGeneratorService.getRuntimeErrorFeedback(feedbackDetails, [0]);
      }).toThrow();
    });

    it('should throw an error if the line number index is equal to the ' +
        'length of rawCodeLineIndexes', function() {
      var feedbackDetails = (
        FeedbackDetailsObjectFactory.createRuntimeErrorFeedbackDetails(
          sampleErrorTraceback.getErrorLineNumber(),
          sampleErrorTraceback.getErrorString(), LANGUAGE_PYTHON, 'testInput',
          false));
      expect(function() {
        FeedbackGeneratorService.getRuntimeErrorFeedback(
          feedbackDetails, [0, 1, 2, 3]);
      }).toThrow();
    });

    it('should adjust the line numbers correctly', function() {
      var feedbackDetails = (
        FeedbackDetailsObjectFactory.createRuntimeErrorFeedbackDetails(
          sampleErrorTraceback.getErrorLineNumber(),
          sampleErrorTraceback.getErrorString(), LANGUAGE_PYTHON, 'testInput',
          false));

      // This maps line 4 (0-indexed) of the preprocessed code to line 1
      // (0-indexed) of the raw code, which becomes line 2 (when 1-indexed).
      var paragraphs = FeedbackGeneratorService.getRuntimeErrorFeedback(
        feedbackDetails, [0, null, null, null, 1]).getParagraphs();

      expect(paragraphs.length).toEqual(2);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe([
        'Looks like your code had a runtime error when evaluating the input ' +
        '"testInput".'
      ].join(''));
      expect(paragraphs[1].isErrorParagraph()).toBe(true);
      expect(paragraphs[1].getContent()).toBe(
        'ZeroDivisionError: integer division or modulo by zero');
    });

    it('should correctly handle errors due to the test code', function() {
      var feedbackDetails = (
        FeedbackDetailsObjectFactory.createRuntimeErrorFeedbackDetails(
          sampleErrorTraceback.getErrorLineNumber(),
          sampleErrorTraceback.getErrorString(), LANGUAGE_PYTHON, 'testInput',
          false));

      // This maps line 5 (1-indexed) to null, which means that there is no
      // corresponding line in the raw code.
      var paragraphs = FeedbackGeneratorService.getRuntimeErrorFeedback(
        feedbackDetails, [0, null, null, null, null]).getParagraphs();

      expect(paragraphs.length).toEqual(2);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe([
        'Looks like your code had a runtime error when evaluating the input ' +
        '"testInput".'
      ].join(''));
      expect(paragraphs[1].isErrorParagraph()).toBe(true);
      expect(paragraphs[1].getContent()).toBe(
        'ZeroDivisionError: integer division or modulo by zero');
    });
  });

  describe('_getSyntaxRuntimeFeedback', function() {
    it(['should return the correct feedback string if ',
      'a general syntax error is generated'].join(''), function() {
      var errorString = "SyntaxError: invalid syntax";
      var feedbackString =
          FeedbackGeneratorService._getFriendlySyntaxFeedback(
            errorString, LANGUAGE_PYTHON);
      expect(feedbackString).toEqual([
        'This is the default, generic syntax error message in Python. Here ',
        'are some common mistakes that can result in this error:',
        '<ul>',
        '<li>Mismatching (missing or too many) braces, brackets, ',
        'parentheses, or quotation marks</li>',
        '<li>Missing colons when defining a function (e.g., ',
        '<code>def my_function</code> should be ',
        '<code>def my_function:</code>)</li>',
        '<li>Misspelled Python keywords (e.g., misspelling ',
        '<code>for</code> in a for loop)</li>',
        '</ul>',
        'Note that since this is the default, generic error, it could also ',
        'be caused by something else.'].join(''));
    });

    it(['should return the correct feedback string if ',
      'an EOL error is generated'].join(''), function() {
      var errorString = "SyntaxError: EOL while scanning string literal";
      var feedbackString =
          FeedbackGeneratorService._getFriendlySyntaxFeedback(
            errorString, LANGUAGE_PYTHON);
      expect(feedbackString).toEqual([
        'An "End of Line" error on a string usually means you are ',
        'missing a quotation mark somewhere.'].join(''));
    });

    it(['should return the correct feedback string if the code throws an ',
      'IndentationError'
    ].join(''), function() {
      var errorString = "IndentationError: ...";
      var feedbackString =
          FeedbackGeneratorService._getFriendlySyntaxFeedback(
            errorString, LANGUAGE_PYTHON);
      expect(feedbackString).toEqual(
          ['It looks like your code has some inconsistencies with ',
            'indentation. Double-check that you indent after every statement ',
            'that ends with a ":" and un-indent when necessary.'].join('')
      );
    });
  });

  describe('_getFriendlyRuntimeFeedback', function() {
    it(['should return the correct feedback string if the code throws a ',
      'TypeError where the user tries to assign items in a string without ',
      'splice'].join(''),
      function() {
        var errorString = "TypeError: 'str' does not support item " +
            "assignment";
        var feedbackString =
            FeedbackGeneratorService._getFriendlyRuntimeFeedback(
              errorString, LANGUAGE_PYTHON);
        expect(feedbackString).toEqual(
          [
            "Unfortunately, Python doesn't support directly assigning ",
            "characters in a string. If you need to do so, try slicing the ",
            "string and adding new characters instead of assigning them. ",
            "If you need a refresher on slicing, check out the ",
            "[primer](primer-url#strings)."
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
            FeedbackGeneratorService._getFriendlyRuntimeFeedback(
              errorString, LANGUAGE_PYTHON);
        expect(feedbackString).toEqual(
          ['You may have tried to combine two incompatible types (you might ',
            'have tried to combine a string with an array, etc.).'].join("")
        );
      }
    );

    it(['should return the correct feedback string if ',
      'an undeclared name is used'].join(''), function() {
      var errorString = "NameError: global name 'foo' is not defined";
      var feedbackString =
          FeedbackGeneratorService._getFriendlyRuntimeFeedback(
            errorString, LANGUAGE_PYTHON);
      expect(feedbackString).toEqual([
        '<code>foo</code> appears to be a name that was not previously ',
        'declared or defined. E.g., if <code>foo</code> is a variable to ',
        'hold a string, <code>foo = \'\'</code> would declare ',
        '<code>foo</code> as a string variable. Similarly, ',
        '<code>foo = []</code> declares <code>foo</code> as an array ',
        'variable. Another possibility is that <code>foo</code> was ',
        'misspelled or uses incorrect capitalization.'].join(''));
    });

    it(['should return the correct feedback string if the code throws an ',
      'AttributeError'].join(''), function() {
      var errorString = "AttributeError: 'str' object has no attribute " +
          "'lowerr'";
      var feedbackString =
          FeedbackGeneratorService._getFriendlyRuntimeFeedback(
            errorString, LANGUAGE_PYTHON);
      expect(feedbackString).toEqual(
          ["str doesn't have a property or method named ",
            "lowerr. Double-check to make sure everything is spelled ",
            "correctly."].join("")
      );
    });

    it(['should return the correct feedback string if the code throws an ',
      'IndexError where index is out of list bounds'].join(''), function() {
      var errorString = "IndexError: list index out of range";
      var feedbackString =
          FeedbackGeneratorService._getFriendlyRuntimeFeedback(
            errorString, LANGUAGE_PYTHON);
      expect(feedbackString).toEqual(
            ["It looks like you're trying to access an index that is outside ",
              "the boundaries of the list. Double-check that your loops and ",
              "assignments don't try to retrieve from indexes below 0 or above",
              " the length of the string."].join('')
      );
    });

    it(['should return the correct feedback string if the code throws a ',
      'KeyError'].join(''), function() {
      var errorString = "KeyError: key";
      var feedbackString =
          FeedbackGeneratorService._getFriendlyRuntimeFeedback(
            errorString, LANGUAGE_PYTHON);
      expect(feedbackString).toEqual(
              ["The key key is not in the dictionary you're trying to ",
                "retrieve from. Double-check to make sure everything is ",
                "spelled correctly and that you have included all necessary ",
                "key-value pairs."].join('')
      );
    });

    it(['should return a null if it doesn\'t recognize the given ',
      'error'].join(''), function() {
      var errorString = "not known error";
      var feedbackString =
          FeedbackGeneratorService._getFriendlyRuntimeFeedback(
            errorString, LANGUAGE_PYTHON);
      expect(feedbackString).toBeNull();
    });
  });

  describe('getSyntaxErrorFeedback', function() {
    it([
      'should return feedback if a syntax / compiler error is ',
      'found in the user\'s code'
    ].join(''), function() {
      var feedbackDetails = (
        FeedbackDetailsObjectFactory.createSyntaxErrorFeedbackDetails(
          sampleErrorTraceback.getErrorLineNumber(),
          sampleErrorTraceback.getErrorString(), LANGUAGE_PYTHON, false));

      var feedback = FeedbackGeneratorService.getSyntaxErrorFeedback(
        feedbackDetails);
      var paragraphs = feedback.getParagraphs();

      expect(feedback.getFeedbackCategory()).toEqual(
        FEEDBACK_CATEGORIES.SYNTAX_ERROR);
      expect(paragraphs.length).toEqual(2);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[1].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe(
          'Error detected on or near line 5:');
      expect(paragraphs[1].getContent()).toBe(
        '<code>ZeroDivisionError: integer division or modulo by zero</code>');
    });

    it('should correctly append language unfamiliarity feedback if ' +
       'consecutiveUnfamiliarityLanguageCounter is needed', function() {
      var feedbackDetails = (
        FeedbackDetailsObjectFactory.createSyntaxErrorFeedbackDetails(
          sampleErrorTraceback.getErrorLineNumber(),
          sampleErrorTraceback.getErrorString(), LANGUAGE_PYTHON, true));

      var feedback = FeedbackGeneratorService.getSyntaxErrorFeedback(
        feedbackDetails);
      var paragraphs = feedback.getParagraphs();

      expect(paragraphs.length).toEqual(3);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe(
          'Error detected on or near line 5:');
      expect(paragraphs[1].isTextParagraph()).toBe(true);
      expect(paragraphs[1].getContent()).toEqual(
        '<code>ZeroDivisionError: integer division or modulo by zero</code>');
      expect(paragraphs[2].isTextParagraph()).toBe(true);
      expect(paragraphs[2].getContent()).toEqual(
        FeedbackGeneratorService._getUnfamiliarLanguageFeedback(
          LANGUAGE_PYTHON));
    });

    it("should not display an error line number when there isn't one",
        function() {
          var feedbackDetails = (
              FeedbackDetailsObjectFactory.createSyntaxErrorFeedbackDetails(
              null, sampleErrorTraceback.getErrorString(), LANGUAGE_PYTHON,
              true));
          var feedback = FeedbackGeneratorService.getSyntaxErrorFeedback(
              feedbackDetails);
          var paragraphs = feedback.getParagraphs();
          expect(paragraphs[0].isTextParagraph()).toBe(true);
          expect(paragraphs[0].getContent()).toBe('Error detected:');
        }
    );
  });

  describe('getTimeoutErrorFeedback', function() {
    it('should return a specific error for TimeLimitErrors', function() {
      var feedback = FeedbackGeneratorService.getTimeoutErrorFeedback();
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

  describe('getMemoryLimitErrorFeedback', function() {
    it('should return a specific error for MemoryLimitErrors', function() {
      var feedback = FeedbackGeneratorService.getMemoryLimitErrorFeedback();
      expect(feedback.getFeedbackCategory()).toEqual(
        FEEDBACK_CATEGORIES.MEMORY_LIMIT_ERROR);

      var paragraphs = feedback.getParagraphs();
      expect(paragraphs.length).toEqual(1);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe([
        "Your program used too much memory during execution. Check your ",
        "code and try to be more efficient with your space usage."
      ].join(''));
    });
  });

  describe('getBuggyOutputFeedback', function() {
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

    it('should return the correct feedback for buggy output tests', function() {
      var feedbackDetails = (
        FeedbackDetailsObjectFactory.createBuggyOutputFeedbackDetails(
          0, 'unusedSuite1', 3, 0, buggyOutputTestDict.messages, 0));
      var feedback = FeedbackGeneratorService.getBuggyOutputFeedback(
        feedbackDetails);

      var paragraphs = feedback.getParagraphs();
      expect(feedback.getFeedbackCategory()).toEqual(
        FEEDBACK_CATEGORIES.KNOWN_BUG_FAILURE);
      expect(paragraphs.length).toEqual(1);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe(buggyOutputTestDict.messages[0]);
    });
  });

  describe('getSuiteLevelFeedback', function() {
    var suiteLevelTestDict = {
      testSuiteIdsThatMustPass: ['SUITE_P1', 'SUITE_P2', 'SUITE_P3'],
      testSuiteIdsThatMustFail: ['SUITE_F1'],
      messages: ['message1', 'message2', 'message3']
    };

    it('should return the correct feedback for suite-level tests', function() {
      var feedbackDetails = (
        FeedbackDetailsObjectFactory.createSuiteLevelFeedbackDetails(
          0, 'unusedSuite1', 3, 0, suiteLevelTestDict.messages, 0));
      var feedback = FeedbackGeneratorService.getSuiteLevelFeedback(
        feedbackDetails);
      expect(feedback.getFeedbackCategory()).toEqual(
        FEEDBACK_CATEGORIES.SUITE_LEVEL_FAILURE);

      var paragraphs = feedback.getParagraphs();
      expect(paragraphs.length).toEqual(1);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe(suiteLevelTestDict.messages[0]);
    });
  });

  describe('language unfamiliarity feedback', function() {
    it('should correctly append language unfamiliarity feedback for ' +
        'prereq "language unfamiliarity" checks as needed', function() {
      var starterCode = [
        'def myFunction(arg):',
        '    return arg',
        ''
      ].join('\n');

      var prereqFailure = PrereqCheckFailureObjectFactory.create(
        PREREQ_CHECK_TYPE_WRONG_LANG, null, starterCode, 'push');

      var feedback = FeedbackGeneratorService.getPrereqFailureFeedback(
        prereqFailure, true, LANGUAGE_PYTHON);
      var paragraphs = feedback.getParagraphs();

      expect(paragraphs.length).toEqual(2);
      expect(paragraphs[0].getContent()).toEqual([
        "It looks like you're using a `push` method to add an element ",
        "to an array, which is valid in Java, but the Python equivalent ",
        "is called `append`."
      ].join(''));
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[1].getContent()).toEqual(
        "Seems like you're having some trouble with Python. Why don't you " +
        "take a look at the page linked through the 'New to Python?' button " +
        "at the bottom of the screen?");
      expect(paragraphs[1].isTextParagraph()).toBe(true);
    });

    it('should correctly append language unfamiliarity feedback for runtime ' +
       'errors if needed', function() {
      var feedbackDetails = (
        FeedbackDetailsObjectFactory.createRuntimeErrorFeedbackDetails(
          sampleErrorTraceback.getErrorLineNumber(),
          sampleErrorTraceback.getErrorString(), LANGUAGE_PYTHON, 'testInput',
          true));

      var feedback = FeedbackGeneratorService.getRuntimeErrorFeedback(
        feedbackDetails, [0, 1, 2, 3, 4, 5]);

      var paragraphs = feedback.getParagraphs();
      expect(paragraphs.length).toEqual(3);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe([
        'Looks like your code had a runtime error when evaluating the input ' +
        '"testInput".'
      ].join(''));
      expect(paragraphs[1].isErrorParagraph()).toBe(true);
      expect(paragraphs[1].getContent()).toBe(
        'ZeroDivisionError: integer division or modulo by zero');
      expect(paragraphs[2].isTextParagraph()).toBe(true);
      expect(paragraphs[2].getContent()).toBe(
        FeedbackGeneratorService._getUnfamiliarLanguageFeedback(
          LANGUAGE_PYTHON));
      // Make sure an unknown language does not return any language
      // unfamiliarity feedback.
      expect(FeedbackGeneratorService._getUnfamiliarLanguageFeedback(
          'Super fake language')).toBe('');
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
        ].join(''));
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
        "It looks like you're trying to use '++' to increment a ",
        "number, but this isn't valid in Python. Try using '+= 1' instead."
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
        "It looks like you're trying to use '--' to decrement a ",
        "number, but this isn't valid in Python. Try using '-= 1' instead."
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
          "It looks like you're using a `push` method to add an element ",
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
        "exception? In Python, we use `except` instead."
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
        "It looks like you're using the Java syntax to write ",
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
        "Try using a flag or a different condition instead."
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
        "Double-check that you're using `elif` instead of ",
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
        "Python doesn't support switch statements. Use if-else statements ",
        "instead."
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
        "It looks like you're trying to use the OR operator syntax from Java. ",
        "Be sure you're using the Python-appropriate operator, `or`."
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
        "Double-check that you're using the right AND operator. For Python, ",
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

  describe('prereqCheck errorLineNumber', function() {
    it('should return null when there are no errors', function() {
      var starterCode = [
        'def myFunction(arg):',
        '    return arg',
        ''
      ].join('\n');

      var prereqFailure = PrereqCheckFailureObjectFactory.create(
        PREREQ_CHECK_TYPE_WRONG_LANG, null, starterCode, 'notOp');
      var feedback = FeedbackGeneratorService.getPrereqFailureFeedback(
        prereqFailure);

      expect(feedback.getErrorLineNumber()).toBeNull();
    });

    it('should generate a errorLine message as the 2nd paragraph', function() {
      var incrementErrorCode = [
        'def myFunction(arg):',
        '    arg++',
        '    return arg',
        ''
      ].join('\n');

      var prereqFailure = PrereqCheckFailureObjectFactory.create(
        PREREQ_CHECK_TYPE_WRONG_LANG, null, incrementErrorCode, 'incrementOp',
        2, 4);
      var feedback = FeedbackGeneratorService.getPrereqFailureFeedback(
        prereqFailure);
      var paragraphs = feedback.getParagraphs();

      expect(feedback.getErrorLineNumber()).toBe(2);
      expect(paragraphs[1].getContent()).toBe('(See line 2 of the code.)');
    });
  });
});
