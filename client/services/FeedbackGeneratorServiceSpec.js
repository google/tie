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
  var CorrectnessTestObjectFactory;
  var ErrorTracebackObjectFactory;
  var FeedbackGeneratorService;
  var SnapshotObjectFactory;
  var TracebackCoordinatesObjectFactory;
  var TranscriptService;
  var sampleErrorTraceback;
  var timeLimitErrorTraceback;

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    BuggyOutputTestObjectFactory = $injector.get(
      'BuggyOutputTestObjectFactory');
    CodeEvalResultObjectFactory = $injector.get('CodeEvalResultObjectFactory');
    CorrectnessTestObjectFactory = $injector.get('CorrectnessTestObjectFactory');
    ErrorTracebackObjectFactory = $injector.get('ErrorTracebackObjectFactory');
    FeedbackGeneratorService = $injector.get('FeedbackGeneratorService');
    SnapshotObjectFactory = $injector.get('SnapshotObjectFactory');
    TracebackCoordinatesObjectFactory = $injector
      .get('TracebackCoordinatesObjectFactory');
    TranscriptService = $injector.get('TranscriptService');

    sampleErrorTraceback = ErrorTracebackObjectFactory.create(
      'ZeroDivisionError: integer division or modulo by zero',
      [TracebackCoordinatesObjectFactory.create(5, 1)]);
    timeLimitErrorTraceback = ErrorTracebackObjectFactory.create(
      'TimeLimitError: Program exceeded run time limit.',
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
    it('should return [UNKNOWN OBJECT] if provided input cannot be converted',
      function() {
        // Define and call blankFunction to pass lint test add 100% coverage
        var blankFunction = function() {
          return null;
        };
        blankFunction();
        expect(
          FeedbackGeneratorService._jsToHumanReadable(blankFunction)
        ).toEqual('[UNKNOWN OBJECT]');
      }
    );
  });

  describe('_getCorrectnessTestFeedback', function() {
    it([
      'should return feedback on a user function that ',
      'doesn\'t pass all correctness tests'
    ].join(''), function() {
      var correctnessTest = CorrectnessTestObjectFactory.create({
        input: 'cat',
        allowedOutputs: ['a']
      });

      var paragraphs = FeedbackGeneratorService
        ._getCorrectnessTestFeedback(correctnessTest, "output").getParagraphs();
      expect(paragraphs.length).toEqual(5);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe(
        "Your code produced the following result:");
      expect(paragraphs[1].isCodeParagraph()).toBe(true);
      expect(paragraphs[1].getContent()).toBe(
        "Input: \"cat\"\nOutput: \"output\"");
      expect(paragraphs[2].isTextParagraph()).toBe(true);
      expect(paragraphs[2].getContent()).toBe(
        "However, the expected output is:");
      expect(paragraphs[3].isCodeParagraph()).toBe(true);
      expect(paragraphs[3].getContent()).toBe("\"a\"");
      expect(paragraphs[4].isTextParagraph()).toBe(true);
      expect(paragraphs[4].getContent()).toBe(
        "Could you fix this?");
    });
  });

  describe('_getPerformanceTestFeedback', function() {
    it([
      'should return feedback if user\'s function is running ',
      'significantly more slowly than expected'
    ].join(''), function() {
      var performanceParagraphs = FeedbackGeneratorService
        ._getPerformanceTestFeedback("linear").getParagraphs();

      expect(performanceParagraphs.length).toEqual(1);
      expect(performanceParagraphs[0].isTextParagraph()).toBe(true);
      expect(performanceParagraphs[0].getContent()).toBe(
      [
        'Your code is running more slowly than expected. Can you ',
        'reconfigure it such that it runs in linear time?'
      ].join(''));

    });
  });

  describe('_getRuntimeErrorFeedback', function() {
    it('should return an error if a runtime error occurred', function() {
      var codeEvalResult = CodeEvalResultObjectFactory.create(
        'some code', 'some output', [], [], [], sampleErrorTraceback,
        'testInput');

      var paragraphs = FeedbackGeneratorService._getRuntimeErrorFeedback(
        codeEvalResult, [0, 1, 2, 3, 4]).getParagraphs();

      expect(paragraphs.length).toEqual(2);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe([
        'Looks like your code had a runtime error when evaluating the input ' +
        '"testInput". Here\'s the trace:'
      ].join(''));
      expect(paragraphs[1].isCodeParagraph()).toBe(true);
      expect(paragraphs[1].getContent()).toBe(
        'ZeroDivisionError: integer division or modulo by zero on line 5');
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
        '"testInput". Here\'s the trace:'
      ].join(''));
      expect(paragraphs[1].isCodeParagraph()).toBe(true);
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
        '"testInput". Here\'s the trace:'
      ].join(''));
      expect(paragraphs[1].isCodeParagraph()).toBe(true);
      expect(paragraphs[1].getContent()).toBe(
        'ZeroDivisionError: integer division or modulo by zero on a line ' +
        'in the test code');
    });
  });

  describe('_getSyntaxErrorFeedback', function() {
    it([
      'should return feedback if a syntax / compiler error is ',
      'found in the user\'s code'
    ].join(''), function() {
      var paragraphs = FeedbackGeneratorService
        .getSyntaxErrorFeedback('some error').getParagraphs();

      expect(paragraphs.length).toEqual(2);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe(
        "Looks like your code did not compile. Here's the error trace: ");
      expect(paragraphs[1].isCodeParagraph()).toBe(true);
      expect(paragraphs[1].getContent()).toBe('some error');
    });
  });

  describe('_getTimeoutErrorFeedback', function() {
    it('should return a specific error for TimeLimitErrors', function() {
      var questionMock = {};
      var codeEvalResult = CodeEvalResultObjectFactory.create(
        'some code', 'some output', [], [], [], timeLimitErrorTraceback,
        'testInput');

      var paragraphs = FeedbackGeneratorService.getFeedback(
        questionMock, codeEvalResult, []).getParagraphs();

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
        'some code', 'same output', [], [true], [], null,
        null);
      var codeEvalResultWithSameBug = CodeEvalResultObjectFactory.create(
        'new code', 'same output', [], [true], [], null,
        null);

      var feedback = FeedbackGeneratorService._getBuggyOutputTestFeedback(
        buggyOutputTest, codeEvalResult);
      var paragraphs = feedback.getParagraphs();
      TranscriptService.recordSnapshot(SnapshotObjectFactory.create(
        codeEvalResult, null, feedback));

      expect(paragraphs.length).toEqual(1);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe(buggyOutputTestDict.messages[0]);

      paragraphs = FeedbackGeneratorService._getBuggyOutputTestFeedback(
        buggyOutputTest, codeEvalResultWithSameBug).getParagraphs();

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
        'some code', 'same output', [], [true], [], null,
        null);
      var codeEvalResultWithSameBug = CodeEvalResultObjectFactory.create(
        'some code', 'same output', [], [true], [], null,
        null);

      var feedback = FeedbackGeneratorService._getBuggyOutputTestFeedback(
        buggyOutputTest, codeEvalResult);
      var paragraphs = feedback.getParagraphs();
      TranscriptService.recordSnapshot(SnapshotObjectFactory.create(
        codeEvalResult, null, feedback));

      expect(paragraphs.length).toEqual(1);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe(buggyOutputTestDict.messages[0]);

      feedback = FeedbackGeneratorService._getBuggyOutputTestFeedback(
        buggyOutputTest, codeEvalResultWithSameBug).getParagraphs();

      expect(paragraphs.length).toEqual(1);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe(buggyOutputTestDict.messages[0]);
    });

    it([
      'should return the same hint if a student reaches the end of the ',
      'available hints.'
    ].join(''), function() {
      var buggyOutputTest = BuggyOutputTestObjectFactory.create(
        buggyOutputTestDict);
      var codeEvalResult = CodeEvalResultObjectFactory.create(
        'some code', 'same output', [], [true], [], null,
        null);
      var codeEvalResultWithSameBug = CodeEvalResultObjectFactory.create(
        'new code', 'same output', [], [true], [], null,
        null);
      var codeEvalResultWithStillSameBug = CodeEvalResultObjectFactory.create(
        'newer code', 'same output', [], [true], [], null,
        null);
      var codeEvalResultWithFourthSameBug = CodeEvalResultObjectFactory.create(
        'newest code', 'same output', [], [true], [], null,
        null);

      var feedback = FeedbackGeneratorService._getBuggyOutputTestFeedback(
        buggyOutputTest, codeEvalResult);
      var paragraphs = feedback.getParagraphs();
      TranscriptService.recordSnapshot(SnapshotObjectFactory.create(
        codeEvalResult, null, feedback));

      expect(paragraphs.length).toEqual(1);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe(buggyOutputTestDict.messages[0]);

      feedback = FeedbackGeneratorService._getBuggyOutputTestFeedback(
        buggyOutputTest, codeEvalResultWithSameBug);
      paragraphs = feedback.getParagraphs();
      TranscriptService.recordSnapshot(SnapshotObjectFactory.create(
        codeEvalResultWithSameBug, null, feedback));

      expect(paragraphs.length).toEqual(1);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe(buggyOutputTestDict.messages[1]);

      feedback = FeedbackGeneratorService._getBuggyOutputTestFeedback(
        buggyOutputTest, codeEvalResultWithStillSameBug);
      paragraphs = feedback.getParagraphs();
      TranscriptService.recordSnapshot(SnapshotObjectFactory.create(
        codeEvalResultWithStillSameBug, null, feedback));

      expect(paragraphs.length).toEqual(1);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe(buggyOutputTestDict.messages[2]);

      feedback = FeedbackGeneratorService._getBuggyOutputTestFeedback(
        buggyOutputTest, codeEvalResultWithFourthSameBug).getParagraphs();

      expect(paragraphs.length).toEqual(1);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe(buggyOutputTestDict.messages[2]);
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
      var codeEvalResultWithSameBug = CodeEvalResultObjectFactory.create(
        'new code', 'same output', [], [true], [], null,
        null);

      var feedback = FeedbackGeneratorService._getBuggyOutputTestFeedback(
        buggyOutputTest, codeEvalResult);
      var paragraphs = feedback.getParagraphs();
      TranscriptService.recordSnapshot(SnapshotObjectFactory.create(
        codeEvalResult, null, feedback));

      expect(paragraphs.length).toEqual(1);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe(buggyOutputTestDict.messages[0]);

      var unusedRuntimeErrorFeedback = (
        FeedbackGeneratorService._getBuggyOutputTestFeedback(
          buggyOutputTest, codeEvalResultWithNewError));
      TranscriptService.recordSnapshot(SnapshotObjectFactory.create(
        codeEvalResultWithNewError, null, unusedRuntimeErrorFeedback));

      feedback = FeedbackGeneratorService._getBuggyOutputTestFeedback(
        buggyOutputTest, codeEvalResultWithSameBug).getParagraphs();

      expect(paragraphs.length).toEqual(1);
      expect(paragraphs[0].isTextParagraph()).toBe(true);
      expect(paragraphs[0].getContent()).toBe(buggyOutputTestDict.messages[0]);
    });
  });
});

