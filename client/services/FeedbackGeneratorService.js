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
 * @fileoverview Service for generating feedback based on the evaluation result
 * of the code submitted by the user, preprocessed and augmented with unit
 * tests. This assumes that the base code already passes "compile-time" checks.
 */

tie.factory('FeedbackGeneratorService', [
  'FeedbackObjectFactory', 'TranscriptService', 'ReinforcementGeneratorService',
  'CODE_EXECUTION_TIMEOUT_SECONDS', 'SUPPORTED_PYTHON_LIBS',
  'RUNTIME_ERROR_FEEDBACK_MESSAGES', 'WRONG_LANGUAGE_ERRORS', 'LANGUAGE_PYTHON',
  'CLASS_NAME_AUXILIARY_CODE', 'CLASS_NAME_SYSTEM_CODE', 'PARAGRAPH_TYPE_TEXT',
  'PARAGRAPH_TYPE_CODE', 'PARAGRAPH_TYPE_SYNTAX_ERROR',
  'PYTHON_PRIMER_BUTTON_NAME', 'EXCLUDE_CONSECUTIVE_SYNTAX_ERROR',
  'EXCLUDE_CONSECUTIVE_SAME_RUNTIME_ERROR',
  'EXCLUDE_CONSECUTIVE_WRONG_LANGUAGE_ERROR',
  function(
    FeedbackObjectFactory, TranscriptService, ReinforcementGeneratorService,
    CODE_EXECUTION_TIMEOUT_SECONDS, SUPPORTED_PYTHON_LIBS,
    RUNTIME_ERROR_FEEDBACK_MESSAGES, WRONG_LANGUAGE_ERRORS, LANGUAGE_PYTHON,
    CLASS_NAME_AUXILIARY_CODE, CLASS_NAME_SYSTEM_CODE, PARAGRAPH_TYPE_TEXT,
    PARAGRAPH_TYPE_CODE, PARAGRAPH_TYPE_SYNTAX_ERROR,
    PYTHON_PRIMER_BUTTON_NAME, EXCLUDE_CONSECUTIVE_SYNTAX_ERROR,
    EXCLUDE_CONSECUTIVE_SAME_RUNTIME_ERROR,
    EXCLUDE_CONSECUTIVE_WRONG_LANGUAGE_ERROR) {

    /**
     * Constant for the number of times that a user can make a mistake (i.e.
     * same error, syntax error, etc.) until we prompt them to look at the
     * primer.
     *
     * @type {number}
     */
    var UNFAMILIARITY_THRESHOLD = 5;

    /**
     * Counter to keep track of consecutive syntax errors.
     *
     * @type {number}
     */
    var consecutiveSyntaxErrorCounter = 0;

    /**
     * Counter to keep track of consecutive same errors.
     *
     * @type {number}
     */
    var consecutiveSameRuntimeErrorCounter = 0;

    /**
     * Counter to keep track of consecutive uses of the wrong language.
     *
     * @type {number}
     */
    var consecutiveWrongLanguageErrorCounter = 0;

    /**
     * Variable to store the error string immediately before the current error.
     * Will be used to see if the user is receiving the same exact error
     * consecutively, a possible indication of language unfamiliarity.
     *
     * @type {string}
     */
    var previousErrorString = '';

    /**
     * Resets all but one specific counter or all counters, depending on
     * the parameter.
     *
     * @param {string} currentCounter
     * @private
     */
    var _resetCounters = function(currentCounter) {
      // If the parameter is null, reset all counters.
      var counterNotToReset = currentCounter || '';
      if (counterNotToReset !== EXCLUDE_CONSECUTIVE_SYNTAX_ERROR) {
        consecutiveSyntaxErrorCounter = 0;
      }
      if (counterNotToReset !== EXCLUDE_CONSECUTIVE_SAME_RUNTIME_ERROR) {
        consecutiveSameRuntimeErrorCounter = 0;
        previousErrorString = '';
      }
      if (counterNotToReset !== EXCLUDE_CONSECUTIVE_WRONG_LANGUAGE_ERROR) {
        consecutiveWrongLanguageErrorCounter = 0;
      }
    };

    // TODO(sll): Update this function to take the programming language into
    // account when generating the human-readable representations. Currently,
    // it assumes that Python is being used.
    /**
     * Converts a Javascript variable to a human-readable element.
     * If the variable is a string, then it returns a string without the
     * formatting symbols.
     * If the variable is a number or boolean, then it returns a string
     * version of the variable.
     * If the variable is an Array, then it returns an Array with human readable
     * versions of each element.
     * If the variable is an object, then it returns a dictionary with human
     * readable versions of each key and their respective value.
     *
     * @param {*} jsVariable
     * @returns {*}
     * @private
     */
    var _jsToHumanReadable = function(jsVariable) {
      if (jsVariable === null || jsVariable === undefined) {
        return 'None';
      } else if (typeof jsVariable === 'string') {
        // Replace tab and newline characters with a literal backslash followed
        // by the character 't' or 'n', respectively.
        return (
          '"' + jsVariable.replace(/\t/g, '\\t').replace(/\n/g, '\\n') + '"');
      } else if (typeof jsVariable === 'number') {
        return String(jsVariable);
      } else if (typeof jsVariable === 'boolean') {
        return jsVariable ? 'True' : 'False';
      } else if (Array.isArray(jsVariable)) {
        var humanReadableElements = jsVariable.map(function(arrayElement) {
          return _jsToHumanReadable(arrayElement);
        });
        return '[' + humanReadableElements.join(', ') + ']';
      } else if (typeof jsVariable === 'object') {
        var humanReadableKeyValuePairs = [];
        for (var key in jsVariable) {
          humanReadableKeyValuePairs.push(
            _jsToHumanReadable(key) + ': ' +
            _jsToHumanReadable(jsVariable[key]));
        }
        return '{' + humanReadableKeyValuePairs.join(', ') + '}';
      } else {
        throw Error(
          'Could not make the following object human-readable: ', jsVariable);
      }
    };

    /**
     * Returns the feedback created as a result of a failing buggy output test.
     *
     * @param {BuggyOutputTest} failingTest
     * @param {CodeEvalResult} codeEvalResult
     * @returns {Feedback}
     * @private
     */
    var _getBuggyOutputTestFeedback = function(failingTest, codeEvalResult) {
      var hintIndex = 0;
      var buggyMessages = failingTest.getMessages();
      var lastSnapshot = (
        TranscriptService.getTranscript().getMostRecentSnapshot());
      if (lastSnapshot !== null && lastSnapshot.getCodeEvalResult() !== null) {
        // This section makes sure to provide a new hint
        // if the student gets stuck on the same bug by checking
        // that they've submitted new code with the same error.
        var previousFeedback = lastSnapshot.getFeedback();
        var previousHintIndex = previousFeedback.getHintIndex();
        if (previousHintIndex !== null) {
          var previousMessages = previousFeedback.getParagraphs();
          // This could cause a problem if two different buggy outputs
          // have the exact same hint, but that shouldn't be allowed.
          if (previousMessages[0].getContent() ===
              buggyMessages[previousHintIndex]) {
            var previousCode = (
              lastSnapshot.getCodeEvalResult().getPreprocessedCode());
            if (previousCode === codeEvalResult.getPreprocessedCode() ||
                previousHintIndex === buggyMessages.length - 1) {
              hintIndex = previousHintIndex;
            } else {
              hintIndex = previousHintIndex + 1;
            }
          }
        }
      }
      var feedback = FeedbackObjectFactory.create(false);
      feedback.appendTextParagraph(buggyMessages[hintIndex]);
      feedback.setHintIndex(hintIndex);
      return feedback;
    };

    /**
     * Returns the Feedback object created as a result of a specified
     * correctness test.
     *
     * @param {string|null} outputFunctionName If needed, is string of the
     *    name for the function needed to process/format the user's output.
     * @param {CorrectnessTest} correctnessTest
     * @param {*} observedOutput Actual output for running user's code.
     * @returns {Feedback}
     * @private
     */
    var _getCorrectnessTestFeedback = function(
      outputFunctionName, correctnessTest, observedOutput) {
      var allowedOutputExample = correctnessTest.getAnyAllowedOutput();
      var feedback = FeedbackObjectFactory.create(false);
      // TODO(eyurko): Add varied statements for when code is incorrect.
      feedback.appendTextParagraph('Your code produced the following result:');
      if (outputFunctionName) {
        feedback.appendCodeParagraph(
          'Input: ' + _jsToHumanReadable(correctnessTest.getInput()) + '\n' +
          ('Output (after running ' + outputFunctionName + '): ' +
            _jsToHumanReadable(observedOutput)));
        feedback.appendTextParagraph(
          'However, the expected output of ' + outputFunctionName + ' is:');
      } else {
        feedback.appendCodeParagraph(
          'Input: ' + _jsToHumanReadable(correctnessTest.getInput()) + '\n' +
          'Output: ' + _jsToHumanReadable(observedOutput));
        feedback.appendTextParagraph('However, the expected output is:');
      }
      feedback.appendCodeParagraph(
        _jsToHumanReadable(allowedOutputExample));
      feedback.appendTextParagraph('Could you fix this?');
      return feedback;
    };

    /**
     * Returns the Feedback related to a failing performance test.
     *
     * @param {string} expectedPerformance
     * @returns {Feedback}
     * @private
     */
    var _getPerformanceTestFeedback = function(expectedPerformance) {
      var feedback = FeedbackObjectFactory.create(false);
      feedback.appendTextParagraph([
        'Your code is running more slowly than expected. Can you ',
        'reconfigure it such that it runs in ',
        expectedPerformance,
        ' time?'
      ].join(''));
      return feedback;
    };

    /**
     * Returns the Feedback object associated with a runtime error when running
     * the user code.
     *
     * @param {CodeEvalResult} codeEvalResult Results of running tests on
     *    user's submission.
     * @param {Array} rawCodeLineIndexes Should be an array of numbers
     *    corresponding to the line numbers for the user's submission.
     * @returns {Feedback}
     * @private
     */
    var _getRuntimeErrorFeedback = function(
        codeEvalResult, rawCodeLineIndexes) {
      var errorInput = codeEvalResult.getErrorInput();
      var inputClause = (
        ' when evaluating the input ' + _jsToHumanReadable(errorInput));
      var feedback = FeedbackObjectFactory.create(false);

      var fixedErrorString = codeEvalResult.getErrorString().replace(
        new RegExp('line ([0-9]+)$'), function(_, humanReadableLineNumber) {
          var preprocessedCodeLineIndex = (
            Number(humanReadableLineNumber) - 1);
          if (preprocessedCodeLineIndex < 0 ||
              preprocessedCodeLineIndex >= rawCodeLineIndexes.length) {
            throw Error(
              'Line number index out of range: ' + preprocessedCodeLineIndex);
          }

          if (rawCodeLineIndexes[preprocessedCodeLineIndex] === null) {
            console.error(
              'Runtime error on line ' + preprocessedCodeLineIndex +
              ' in the preprocessed code');
            return 'a line in the test code';
          } else {
            return 'line ' + (
              rawCodeLineIndexes[preprocessedCodeLineIndex] + 1);
          }
        }
      );

      // TODO(dianakc): Will need to adjust according to programming language
      var feedbackString = _getHumanReadableRuntimeFeedback(
          fixedErrorString, LANGUAGE_PYTHON);
      if (feedbackString === null) {
        feedback.appendTextParagraph(
            "Looks like your code had a runtime error" + inputClause +
            ". Here's the trace:");
        feedback.appendCodeParagraph(fixedErrorString);
      } else {
        feedback.appendTextParagraph(feedbackString);
      }
      return feedback;
    };

    /**
     * Based on passed in error string, will generate the appropriate,
     * informative feedback to be appended to the overall submission feedback.
     *
     * @param {string} errorString
     * @param {string} language
     * @returns {string | null} Text to be appended to feedback.
     */
    var _getHumanReadableRuntimeFeedback = function(errorString, language) {
      var result = null;
      RUNTIME_ERROR_FEEDBACK_MESSAGES[language].forEach(function(check) {
        if (check.checker(errorString)) {
          result = check.generateMessage(errorString);
        }
      });
      return result;
    };

    /**
     * Returns the Feedback object associated with a timeout error.
     *
     * @returns {Feedback}
     * @private
     */
    var _getTimeoutErrorFeedback = function() {
      var feedback = FeedbackObjectFactory.create(false);
      feedback.appendTextParagraph([
        "Your program's exceeded the time limit (",
        CODE_EXECUTION_TIMEOUT_SECONDS,
        " seconds) we've set. Can you try to make it run ",
        "more efficiently?"
      ].join(''));
      return feedback;
    };

    /**
     * Returns the Feedback object associated with an Infinite Loop error.
     *
     * @returns {Feedback}
     * @private
     */
    var _getInfiniteLoopFeedback = function() {
      var feedback = FeedbackObjectFactory.create(false);
      feedback.appendTextParagraph([
        "Looks like your code is hitting an infinite recursive loop.",
        "Check to see that your recursive calls terminate."
      ].join(' '));
      return feedback;
    };

    /**
     * Returns a string of the feedback to be returned when it is detected that
     * the user is unfamiliar with the given programming language.
     *
     * @param {string} language
     * @returns {String}
     * @private
     */
    var _getUnfamiliarLanguageFeedback = function(language) {
      if (language === LANGUAGE_PYTHON) {
        return [
          "Seems like you're having some trouble with this language. Why ",
          "don't you take a look at the page linked through the '",
          PYTHON_PRIMER_BUTTON_NAME + "' button at the bottom of the screen?"
        ].join('');
      } else {
        return '';
      }
    };

    /**
     * Returns the Feedback object associated with a given user submission
     * not including the reinforcement.
     *
     * @param {Array} tasks Tasks associated with the problem that include
     *    the tests the user's code must pass.
     * @param {CodeEvalResult} codeEvalResult Test results for this submission
     * @param {Array} rawCodeLineIndexes The code line numbers for the user's
     *    submission. Should be an array of numbers.
     * @returns {Feedback}
     * @private
     */
    var _getFeedbackWithoutReinforcement = function(
        tasks, codeEvalResult, rawCodeLineIndexes) {
      var errorString = codeEvalResult.getErrorString();
      if (errorString) {
        // We want to catch and handle a timeout error uniquely, rather than
        // integrate it into the existing feedback pipeline.
        if (errorString.startsWith('TimeLimitError')) {
          return _getTimeoutErrorFeedback();
        } else if (errorString.startsWith(
          'ExternalError: RangeError')) {
          return _getInfiniteLoopFeedback();
        } else {
          return _getRuntimeErrorFeedback(codeEvalResult, rawCodeLineIndexes);
        }
      } else {
        // Get all the tests from first task to current that need to be
        // executed.
        var buggyOutputTests = [];
        var correctnessTests = [];
        var performanceTests = [];
        for (var i = 0; i < tasks.length; i++) {
          buggyOutputTests.push(tasks[i].getBuggyOutputTests());
          correctnessTests.push(tasks[i].getCorrectnessTests());
          performanceTests.push(tasks[i].getPerformanceTests());
        }
        var buggyOutputTestResults =
            codeEvalResult.getBuggyOutputTestResults();
        var observedOutputs = codeEvalResult.getCorrectnessTestResults();
        var performanceTestResults =
            codeEvalResult.getPerformanceTestResults();

        for (i = 0; i < tasks.length; i++) {
          for (var j = 0; j < buggyOutputTests[i].length; j++) {
            if (buggyOutputTestResults[i][j]) {
              return _getBuggyOutputTestFeedback(
                buggyOutputTests[i][j], codeEvalResult);
            }
          }

          for (j = 0; j < correctnessTests[i].length; j++) {
            var observedOutput = observedOutputs[i][j];

            if (!correctnessTests[i][j].matchesOutput(observedOutput)) {
              return _getCorrectnessTestFeedback(
                tasks[i].getOutputFunctionNameWithoutClass(),
                correctnessTests[i][j], observedOutput);
            }
          }

          for (j = 0; j < performanceTests[i].length; j++) {
            var expectedPerformance = (
              performanceTests[i][j].getExpectedPerformance());
            var observedPerformance = performanceTestResults[i][j];

            if (expectedPerformance !== observedPerformance) {
              return _getPerformanceTestFeedback(expectedPerformance);
            }
          }
        }

        var feedback = FeedbackObjectFactory.create(true);
        feedback.appendTextParagraph([
          'You\'ve completed all the tasks for this question! Click the ',
          '"Next" button to move on to the next question.'
        ].join(''));
        return feedback;
      }
    };

    return {
      /**
       * Returns the Feedback and Reinforcement associated with a user's
       * code submission and their test results.
       *
       * @param {Array} tasks Tasks associated with the problem that include
       *    the tests the user's code must pass.
       * @param {CodeEvalResult} codeEvalResult Test results for this submission
       * @param {Array} rawCodeLineIndexes The code line numbers for the user's
       *    submission. Should be an array of numbers.
       * @returns {Feedback}
       */
      getFeedback: function(tasks, codeEvalResult, rawCodeLineIndexes) {
        // Reset all counters but consecutiveSameRuntimeErrorCounter.
        _resetCounters(EXCLUDE_CONSECUTIVE_SAME_RUNTIME_ERROR);

        // If the user receives the same error message increment the same error
        // counter.
        if (!previousErrorString &&
            previousErrorString === codeEvalResult.getErrorString()) {
          consecutiveSameRuntimeErrorCounter++;
        }

        var feedback = _getFeedbackWithoutReinforcement(
          tasks, codeEvalResult, rawCodeLineIndexes);
        if (tasks.length > 0 && !codeEvalResult.getErrorString()) {
          feedback.setReinforcement(
            ReinforcementGeneratorService.getReinforcement(
              tasks[tasks.length - 1], codeEvalResult));
        }

        // If the same error counter reaches the threshold, prompt the user to
        // look at the primer.
        if (consecutiveSameRuntimeErrorCounter === UNFAMILIARITY_THRESHOLD) {
          // TODO(dianakc, eledavi): Will have to adjust according to language
          feedback.appendTextParagraph(_getUnfamiliarLanguageFeedback(
            LANGUAGE_PYTHON));
          // Once the user has been prompted, we reset the counter so
          // that we make sure not to continue to prompt and, thereby,
          // annoy them.
          consecutiveSameRuntimeErrorCounter = 0;
        }
        previousErrorString = codeEvalResult.getErrorString();
        return feedback;
      },
      /**
       * Returns the Feedback object for the given syntax error string.
       *
       * @param {string} errorString
       * @returns {Feedback}
       */
      getSyntaxErrorFeedback: function(errorString) {
        // Reset all counters but consecutiveSyntaxErrorCounter.
        _resetCounters(EXCLUDE_CONSECUTIVE_SYNTAX_ERROR);

        // If the user receives another syntax error, increment the syntax
        // error counter.
        consecutiveSyntaxErrorCounter++;
        var feedback = FeedbackObjectFactory.create(false);
        feedback.appendSyntaxErrorParagraph(errorString);

        // If the syntax error reaches the threshold, prompt the user to
        // look at the primer.
        if (consecutiveSyntaxErrorCounter === UNFAMILIARITY_THRESHOLD) {
          // TODO(dianakc, eledavi): Will have to adjust according to language
          feedback.appendTextParagraph(_getUnfamiliarLanguageFeedback(
            LANGUAGE_PYTHON));
          // Once the user has been prompted, we reset the counter so
          // that we make sure we don't continue to prompt and, thereby,
          // annoy them.
          consecutiveSyntaxErrorCounter = 0;
        }
        return feedback;
      },
      /**
       * Returns the appropriate Feedback object for the given Prerequisite
       * Check Failure.
       *
       * @param {PrereqCheckFailure} prereqCheckFailure
       * @returns {Feedback}
       */
      getPrereqFailureFeedback: function(prereqCheckFailure) {
        _resetCounters(EXCLUDE_CONSECUTIVE_WRONG_LANGUAGE_ERROR);

        if (prereqCheckFailure.hasWrongLanguage()) {
          consecutiveWrongLanguageErrorCounter++;
        } else {
          consecutiveWrongLanguageErrorCounter = 0;
        }
        if (!prereqCheckFailure) {
          throw new Error('getPrereqFailureFeedback() called with 0 failures.');
        }

        var feedback = FeedbackObjectFactory.create(false);

        if (prereqCheckFailure.isMissingStarterCode()) {
          feedback.appendTextParagraph([
            'It looks like you deleted or modified the starter code!  Our ',
            'evaluation program requires the function names given in the ',
            'starter code.  You can press the \'Reset Code\' button to start ',
            'over.  Or, you can copy the starter code below:'
          ].join(''));
          feedback.appendCodeParagraph(prereqCheckFailure.getStarterCode());
        } else if (prereqCheckFailure.isBadImport()) {
          feedback.appendTextParagraph([
            "It looks like you're importing an external library. However, the ",
            'following libraries are not supported:\n'
          ].join(''));
          feedback.appendCodeParagraph(
            prereqCheckFailure.getBadImports().join('\n'));
          feedback.appendTextParagraph(
            'Here is a list of libraries we currently support:\n');
          feedback.appendCodeParagraph(SUPPORTED_PYTHON_LIBS.join(', '));
        } else if (prereqCheckFailure.hasGlobalCode()) {
          feedback.appendTextParagraph([
            'Please keep your code within the existing predefined functions',
            '-- we cannot process code in the global scope.'
          ].join(' '));
        } else if (prereqCheckFailure.hasWrongLanguage()) {
          WRONG_LANGUAGE_ERRORS.python.forEach(function(error) {
            if (error.errorName === prereqCheckFailure.getWrongLangKey()) {
              error.feedbackParagraphs.forEach(function(paragraph) {
                if (paragraph.type === PARAGRAPH_TYPE_TEXT) {
                  feedback.appendTextParagraph(paragraph.content);
                } else if (paragraph.type === PARAGRAPH_TYPE_CODE) {
                  feedback.appendCodeParagraph(paragraph.content);
                } else if (paragraph.type === PARAGRAPH_TYPE_SYNTAX_ERROR) {
                  feedback.appendSyntaxErrorParagraph(paragraph.content);
                }
              });
            }
          });
        } else if (prereqCheckFailure.hasInvalidAuxiliaryCodeCall()) {
          feedback.appendTextParagraph([
            'Looks like your code had a runtime error. Here is the error ',
            'message: '
          ].join(''));
          feedback.appendCodeParagraph([
            'ForbiddenNamespaceError: It looks like you\'re trying to call ',
            'the ' + CLASS_NAME_AUXILIARY_CODE + ' class or its methods, ',
            'which is forbidden. Please resubmit without using this class.'
          ].join(''));
        } else if (prereqCheckFailure.hasInvalidSystemCall()) {
          feedback.appendTextParagraph([
            'Looks like your code had a runtime error. Here is the error ',
            'message: '
          ].join(''));
          feedback.appendCodeParagraph([
            'ForbiddenNamespaceError: It looks you\'re using the ' +
            CLASS_NAME_SYSTEM_CODE + ' class or its methods, which is ',
            'forbidden. Please resubmit without using this class.'
          ].join(''));
        } else {
          // Prereq check failure type not handled; throw an error
          throw new Error(['Unrecognized prereq check failure type ',
            'in getPrereqFailureFeedback().'].join());
        }

        // If the wrong language counter reaches the threshold, prompt the user
        // to look at the primer.
        if (consecutiveWrongLanguageErrorCounter === UNFAMILIARITY_THRESHOLD) {
          // TODO(dianakc, eledavi): Will have to adjust according to language
          feedback.appendTextParagraph(_getUnfamiliarLanguageFeedback(
            LANGUAGE_PYTHON));
          // Once the user has been prompted, we reset the counter so
          // that we make sure we don't continue to prompt and, thereby,
          // annoy them.
          consecutiveWrongLanguageErrorCounter = 0;
        }

        return feedback;
      },
      _getBuggyOutputTestFeedback: _getBuggyOutputTestFeedback,
      _getCorrectnessTestFeedback: _getCorrectnessTestFeedback,
      _getPerformanceTestFeedback: _getPerformanceTestFeedback,
      _getInfiniteLoopFeedback: _getInfiniteLoopFeedback,
      _getUnfamiliarLanguageFeedback: _getUnfamiliarLanguageFeedback,
      _getRuntimeErrorFeedback: _getRuntimeErrorFeedback,
      _getHumanReadableRuntimeFeedback: _getHumanReadableRuntimeFeedback,
      _getTimeoutErrorFeedback: _getTimeoutErrorFeedback,
      _jsToHumanReadable: _jsToHumanReadable,
      _resetCounters: _resetCounters
    };
  }
]);
