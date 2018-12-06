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
 * @fileoverview Service for creating human-readable feedback messages based
 * on the evaluation result (typically in the form of a FeedbackDetails object)
 * of the code submitted by the user.
 */

tie.factory('FeedbackGeneratorService', [
  'FeedbackObjectFactory',
  'CODE_EXECUTION_TIMEOUT_SECONDS', 'SUPPORTED_PYTHON_LIBS',
  'FRIENDLY_SYNTAX_ERROR_TRANSLATIONS', 'FRIENDLY_RUNTIME_ERROR_TRANSLATIONS',
  'WRONG_LANGUAGE_ERRORS', 'LANGUAGE_PYTHON', 'CLASS_NAME_AUXILIARY_CODE',
  'CLASS_NAME_SYSTEM_CODE', 'CLASS_NAME_STUDENT_CODE', 'PARAGRAPH_TYPE_TEXT',
  'PARAGRAPH_TYPE_CODE', 'PARAGRAPH_TYPE_ERROR', 'PYTHON_PRIMER_BUTTON_NAME',
  'CORRECTNESS_FEEDBACK_TEXT', 'FEEDBACK_CATEGORIES',
  'TEST_SUITE_ID_SAMPLE_INPUT', 'CORRECTNESS_STATE_INPUT_DISPLAYED',
  'CORRECTNESS_STATE_EXPECTED_OUTPUT_DISPLAYED',
  'CORRECTNESS_STATE_OBSERVED_OUTPUT_DISPLAYED',
  'CORRECTNESS_STATE_NO_MORE_FEEDBACK',
  function(
    FeedbackObjectFactory,
    CODE_EXECUTION_TIMEOUT_SECONDS, SUPPORTED_PYTHON_LIBS,
    FRIENDLY_SYNTAX_ERROR_TRANSLATIONS, FRIENDLY_RUNTIME_ERROR_TRANSLATIONS,
    WRONG_LANGUAGE_ERRORS, LANGUAGE_PYTHON, CLASS_NAME_AUXILIARY_CODE,
    CLASS_NAME_SYSTEM_CODE, CLASS_NAME_STUDENT_CODE, PARAGRAPH_TYPE_TEXT,
    PARAGRAPH_TYPE_CODE, PARAGRAPH_TYPE_ERROR, PYTHON_PRIMER_BUTTON_NAME,
    CORRECTNESS_FEEDBACK_TEXT, FEEDBACK_CATEGORIES,
    TEST_SUITE_ID_SAMPLE_INPUT, CORRECTNESS_STATE_INPUT_DISPLAYED,
    CORRECTNESS_STATE_EXPECTED_OUTPUT_DISPLAYED,
    CORRECTNESS_STATE_OBSERVED_OUTPUT_DISPLAYED,
    CORRECTNESS_STATE_NO_MORE_FEEDBACK) {

    /**
     * Object to hold array indexes (values) of available correctness feedback
     * text as listed in CORRECTNESS_FEEDBACK_TEXT, per feedback type (keys).
     * Used in order to avoid presenting the same feedback text consecutively.
     * A given feedback text is not used again until all other available
     * alternative texts are used.
     *
     * @type {Object.<string, Array.<string>>}
     */
    var availableCorrectnessFeedbackIndexes = {};

    /**
     * Pseudo-randomly returns an int between min (inclusive) and max.
     *
     * @param {number} min Minimum number for range (inclusive).
     * @param {number} max Maximum number for range (exclusive).
     * @returns {number}
     * @private
     */
    var _getRandomInt = function(min, max) {
      var minimum = Math.ceil(min);
      var maximum = Math.floor(max);
      return Math.floor(Math.random() * (maximum - minimum)) + minimum;
    };

    /**
     * Randomly selects feedback string from an object containing variations
     * of a given feedback type.
     *
     * @param {string} feedbackType Correctness feedback type.
     * @returns {string}
     * @private
     */
    var _getCorrectnessFeedbackString = function(feedbackType) {
      if (!availableCorrectnessFeedbackIndexes.hasOwnProperty(feedbackType)) {
        availableCorrectnessFeedbackIndexes[feedbackType] = [];
      }
      // Resets availableCorrectnessFeedbackIndexes when length is 0.
      if (availableCorrectnessFeedbackIndexes[feedbackType].length === 0) {
        var feedbackMaxArrayLength =
          CORRECTNESS_FEEDBACK_TEXT[feedbackType].length;
        // Creates an array in which each value corresponds to its index.
        availableCorrectnessFeedbackIndexes[feedbackType] =
          Array.apply(null, {length: feedbackMaxArrayLength}).map(
          Number.call, Number);
      }
      var randomArrayIndex = _getRandomInt(
        0, availableCorrectnessFeedbackIndexes[feedbackType].length);
      var correctnessFeedbackIndex =
        availableCorrectnessFeedbackIndexes[feedbackType][randomArrayIndex];
      availableCorrectnessFeedbackIndexes[feedbackType].splice(
        randomArrayIndex, 1);
      return CORRECTNESS_FEEDBACK_TEXT[feedbackType][correctnessFeedbackIndex];
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
     * Based on passed in error string, will generate novice-friendly syntax
     * error messages.
     *
     * @param {string} errorString
     * @param {string} language
     * @returns {string | null} Text to be appended to feedback.
     */
    var _getFriendlySyntaxFeedback = function(errorString, language) {
      var result = null;
      FRIENDLY_SYNTAX_ERROR_TRANSLATIONS[language].forEach(function(check) {
        if (check.friendlyErrorCheck(errorString)) {
          result = check.getFriendlyErrorText(errorString);
        }
      });
      return result;
    };

    /**
     * Based on passed in error string, will generate the appropriate,
     * informative feedback to be appended to the overall submission feedback.
     *
     * @param {string} errorString
     * @param {string} language
     * @returns {string | null} Text to be appended to feedback.
     */
    var _getFriendlyRuntimeFeedback = function(errorString, language) {
      var result = null;
      FRIENDLY_RUNTIME_ERROR_TRANSLATIONS[language].forEach(function(check) {
        if (check.friendlyErrorCheck(errorString)) {
          result = check.getFriendlyErrorText(errorString);
        }
      });
      return result;
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
          "Seems like you're having some trouble with Python. Why ",
          "don't you take a look at the page linked through the '",
          PYTHON_PRIMER_BUTTON_NAME + "' button at the bottom of the screen?"
        ].join('');
      } else {
        return '';
      }
    };

    return {
      /**
       * Returns the Feedback object for the given syntax error details.
       *
       * @param {FeedbackDetails} feedbackDetails The feedback details
       *   characterizing the syntax error.
       * @returns {Feedback}
       */
      getSyntaxErrorFeedback: function(feedbackDetails) {
        var errorString = feedbackDetails.getErrorString();
        var errorLineNumber = feedbackDetails.getErrorLineNumber();
        var language = feedbackDetails.getLanguage();
        var languageUnfamiliarityFeedbackIsNeeded = (
            feedbackDetails.isLanguageUnfamiliarityFeedbackNeeded());
        var feedback = FeedbackObjectFactory.create(
            FEEDBACK_CATEGORIES.SYNTAX_ERROR);
        var friendlySyntaxFeedbackString = _getFriendlySyntaxFeedback(
            errorString, language);
        if (errorLineNumber) {
          feedback.appendTextParagraph('Error detected on or near line ' +
            errorLineNumber + ':');
        } else {
          feedback.appendTextParagraph('Error detected:');
        }
        feedback.appendTextParagraph('<code>' + errorString + '</code>');
        if (friendlySyntaxFeedbackString) {
          feedback.appendTextParagraph(friendlySyntaxFeedbackString);
        }
        if (languageUnfamiliarityFeedbackIsNeeded) {
          feedback.appendTextParagraph(
            _getUnfamiliarLanguageFeedback(language));
        }

        return feedback;
      },
      /**
       * Returns the appropriate Feedback object for the given Prerequisite
       * Check Failure.
       *
       * @param {PrereqCheckFailure} prereqCheckFailure
       * @param {bool} languageUnfamiliarityFeedbackIsNeeded
       * @param {string} language The language that the code is written in.
       * @returns {Feedback}
       */
      getPrereqFailureFeedback: function(
          prereqCheckFailure, languageUnfamiliarityFeedbackIsNeeded, language) {
        var feedback = null;
        if (prereqCheckFailure.isMissingStarterCode()) {
          feedback = FeedbackObjectFactory.create(
            FEEDBACK_CATEGORIES.FAILS_STARTER_CODE_CHECK);
          feedback.appendTextParagraph([
            'It looks like you deleted or modified the starter code!  Our ',
            'evaluation program requires the function names given in the ',
            'starter code.  You can press the \'Reset Code\' button to start ',
            'over.  Or, you can copy the starter code below:'
          ].join(''));
          feedback.appendCodeParagraph(prereqCheckFailure.getStarterCode());
        } else if (prereqCheckFailure.isBadImport()) {
          feedback = FeedbackObjectFactory.create(
            FEEDBACK_CATEGORIES.FAILS_BAD_IMPORT_CHECK);
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
          feedback = FeedbackObjectFactory.create(
            FEEDBACK_CATEGORIES.FAILS_GLOBAL_CODE_CHECK);
          feedback.appendTextParagraph([
            'Please keep your code within the existing predefined functions ',
            'or define your own helper functions if you need to ',
            '-- we cannot process code in the global scope.'
          ].join(''));
        } else if (prereqCheckFailure.hasWrongLanguage()) {
          feedback = FeedbackObjectFactory.create(
            FEEDBACK_CATEGORIES.FAILS_LANGUAGE_DETECTION_CHECK);
          WRONG_LANGUAGE_ERRORS.python.forEach(function(check) {
            if (check.errorName === prereqCheckFailure.getWrongLangKey()) {
              check.feedbackParagraphs.forEach(function(paragraph) {
                if (paragraph.type === PARAGRAPH_TYPE_TEXT) {
                  feedback.appendTextParagraph(paragraph.content);
                } else if (paragraph.type === PARAGRAPH_TYPE_CODE) {
                  feedback.appendCodeParagraph(paragraph.content);
                } else if (paragraph.type === PARAGRAPH_TYPE_ERROR) {
                  feedback.appendTextParagraph(
                    'It looks like your code has a syntax error. ' +
                    'Try to figure out what the error is.');
                  feedback.appendErrorParagraph(paragraph.content);
                }
              });

              var errorLineNumber = prereqCheckFailure.getErrorLineNumber();
              if (errorLineNumber) {
                feedback.setErrorLineNumber(errorLineNumber);
                feedback.appendTextParagraph('(See line ' + errorLineNumber +
                  ' of the code.)');
              }
            }
          });
        } else if (prereqCheckFailure.hasInvalidAuxiliaryCodeCall()) {
          feedback = FeedbackObjectFactory.create(
            FEEDBACK_CATEGORIES.FAILS_FORBIDDEN_NAMESPACE_CHECK);
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
          feedback = FeedbackObjectFactory.create(
            FEEDBACK_CATEGORIES.FAILS_FORBIDDEN_NAMESPACE_CHECK);
          feedback.appendTextParagraph([
            'Looks like your code had a runtime error. Here is the error ',
            'message: '
          ].join(''));
          feedback.appendCodeParagraph([
            'ForbiddenNamespaceError: It looks you\'re using the ' +
            CLASS_NAME_SYSTEM_CODE + ' class or its methods, which is ',
            'forbidden. Please resubmit without using this class.'
          ].join(''));
        } else if (prereqCheckFailure.hasInvalidStudentCodeCall()) {
          feedback = FeedbackObjectFactory.create(
            FEEDBACK_CATEGORIES.FAILS_FORBIDDEN_NAMESPACE_CHECK);
          feedback.appendTextParagraph([
            'Looks like your code had a runtime error. Here is the error ',
            'message: '
          ].join(''));
          feedback.appendCodeParagraph([
            'ForbiddenNamespaceError: It looks you\'re trying to call the ' +
            CLASS_NAME_STUDENT_CODE + ' class or its methods, which is ',
            'forbidden. Please resubmit without using this class.'
          ].join(''));
        } else {
          // Prereq check failure type not handled; throw an error.
          throw new Error(['Unrecognized prereq check failure type ',
            'in getPrereqFailureFeedback().'].join());
        }

        if (languageUnfamiliarityFeedbackIsNeeded) {
          feedback.appendTextParagraph(
            _getUnfamiliarLanguageFeedback(language));
        }

        return feedback;
      },
      /**
       * Returns the Feedback object associated with a timeout error.
       *
       * @returns {Feedback}
       */
      getTimeoutErrorFeedback: function() {
        var feedback = FeedbackObjectFactory.create(
            FEEDBACK_CATEGORIES.TIME_LIMIT_ERROR);
        feedback.appendTextParagraph([
          "Your program's exceeded the time limit (",
          CODE_EXECUTION_TIMEOUT_SECONDS,
          " seconds) we've set. Can you try to make it run ",
          "more efficiently?"
        ].join(''));
        return feedback;
      },
      /**
       * Returns the Feedback object associated with a memory limit error.
       *
       * @returns {Feedback}
       */
      getMemoryLimitErrorFeedback: function() {
        var feedback = FeedbackObjectFactory.create(
            FEEDBACK_CATEGORIES.MEMORY_LIMIT_ERROR);
        feedback.appendTextParagraph([
          "Your program used too much memory during execution. Check your ",
          "code and try to be more efficient with your space usage."
        ].join(''));
        return feedback;
      },
      /**
       * Returns the Feedback object associated with an "stack exceeded" error.
       *
       * @returns {Feedback}
       */
      getStackExceededFeedback: function() {
        var feedback = FeedbackObjectFactory.create(
            FEEDBACK_CATEGORIES.STACK_EXCEEDED_ERROR);
        feedback.appendTextParagraph([
          "Your code appears to be hitting an infinite recursive loop. ",
          "Check to make sure that your recursive calls terminate."
        ].join(''));
        return feedback;
      },
      /**
       * Returns the Feedback related to a server error.
       *
       * @returns {Feedback}
       */
      getServerErrorFeedback: function() {
        var feedback = FeedbackObjectFactory.create(
            FEEDBACK_CATEGORIES.SERVER_ERROR);
        feedback.appendTextParagraph([
          'A server error has occurred. We are looking into it ',
          'and will fix it as quickly as possible. We apologize ',
          'for the inconvenience.'
        ].join(''));
        return feedback;
      },
      /**
       * Returns the Feedback object associated with a runtime error when
       * running the user code.
       *
       * @param {FeedbackDetails} feedbackDetails The feedback details
       *   characterizing the runtime error.
       * @param {Array} rawCodeLineIndexes The code line numbers for the user's
       *    submission. Should be an array of numbers.
       * @returns {Feedback}
       */
      getRuntimeErrorFeedback: function(feedbackDetails, rawCodeLineIndexes) {
        var errorInput = feedbackDetails.getErrorInput();
        var errorLineNumber = feedbackDetails.getErrorLineNumber();
        var errorString = feedbackDetails.getErrorString();
        var language = feedbackDetails.getLanguage();
        var languageUnfamiliarityFeedbackIsNeeded = (
            feedbackDetails.isLanguageUnfamiliarityFeedbackNeeded());
        var feedback = FeedbackObjectFactory.create(
            FEEDBACK_CATEGORIES.RUNTIME_ERROR);

        if (errorLineNumber !== null) {
          var codeLineIndex = (Number(errorLineNumber) - 1);
          if (codeLineIndex < 0 || codeLineIndex >= rawCodeLineIndexes.length) {
            throw Error(
                'Line number index out of range: ' +
                codeLineIndex);
          }
        }

        // Catch cases where the error arises in the preprocessed code.
        errorString = errorString.replace(
            new RegExp('line ([0-9]+)$'), function(_,
                preprocessedErrorLineNumber) {
              var preprocessedCodeLineIndex =
                  (Number(preprocessedErrorLineNumber) - 1);
              if (rawCodeLineIndexes[preprocessedCodeLineIndex] === null) {
                console.error(
                    'Runtime error on line ' + preprocessedCodeLineIndex +
                    ' in the preprocessed code');
                return 'a line in the test code';
              } else {
                return 'line ' +
                    (rawCodeLineIndexes[preprocessedCodeLineIndex] + 1);
              }
            });

        var friendlyRuntimeFeedbackString = _getFriendlyRuntimeFeedback(
            errorString, language);
        if (friendlyRuntimeFeedbackString) {
          feedback.appendTextParagraph(friendlyRuntimeFeedbackString);
        } else {
          feedback.appendTextParagraph(
            'Looks like your code had a runtime error when evaluating the ' +
            'input ' + _jsToHumanReadable(errorInput) + '.');
          feedback.appendErrorParagraph(errorString);
        }
        if (languageUnfamiliarityFeedbackIsNeeded) {
          feedback.appendTextParagraph(
            _getUnfamiliarLanguageFeedback(language));
        }
        return feedback;
      },
      /**
       * Returns the feedback created as a result of a failing buggy output
       * test.
       *
       * @param {FeedbackDetails} feedbackDetails
       *
       * @returns {Feedback}
       */
      getBuggyOutputFeedback: function(feedbackDetails) {
        var feedback = FeedbackObjectFactory.create(
            FEEDBACK_CATEGORIES.KNOWN_BUG_FAILURE);
        feedback.appendTextParagraph(feedbackDetails.getSpecificTestMessage());
        return feedback;
      },
      /**
       * Returns the feedback created as a result of a failing suite-level test,
       * or null if all hints for that test have been exhausted.
       *
       * @param {FeedbackDetails} feedbackDetails
       *
       * @returns {Feedback}
       */
      getSuiteLevelFeedback: function(feedbackDetails) {
        var feedback = FeedbackObjectFactory.create(
            FEEDBACK_CATEGORIES.SUITE_LEVEL_FAILURE);
        feedback.appendTextParagraph(feedbackDetails.getSpecificTestMessage());
        return feedback;
      },
      /**
       * Returns the Feedback object created as a result of an incorrect output
       * in one of the correctness tests.
       *
       * @param {FeedbackDetails} feedbackDetails
       *
       * @returns {Feedback}
       */
      getIncorrectOutputFeedback: function(feedbackDetails) {
        var testCase = feedbackDetails.getTestCase();
        var observedOutput = feedbackDetails.getObservedOutput();
        var correctnessState = feedbackDetails.getCorrectnessState();
        var feedback = FeedbackObjectFactory.create(
            FEEDBACK_CATEGORIES.INCORRECT_OUTPUT_FAILURE);
        var allowedOutputExample = testCase.getAnyAllowedOutput();
        if (correctnessState === CORRECTNESS_STATE_INPUT_DISPLAYED) {
          // Allow the user to view the input of the failing test.
          feedback.appendTextParagraph(
            _getCorrectnessFeedbackString(correctnessState));
          feedback.appendCodeParagraph(
              'Input: ' + _jsToHumanReadable(testCase.getInput()));
        } else if (
          correctnessState === CORRECTNESS_STATE_EXPECTED_OUTPUT_DISPLAYED) {
          // Allow the user to view the expected output of the failing test.
          feedback.appendTextParagraph(
            _getCorrectnessFeedbackString(correctnessState));
          feedback.appendCodeParagraph(
              'Input: ' + _jsToHumanReadable(testCase.getInput()) + '\n' +
              'Expected Output: ' + _jsToHumanReadable(allowedOutputExample));
        } else if (
          correctnessState === CORRECTNESS_STATE_OBSERVED_OUTPUT_DISPLAYED) {
          // Allow the user to view the output produced by their code for the
          // failing test.
          feedback.appendTextParagraph(
            _getCorrectnessFeedbackString(correctnessState));
          feedback.appendOutputParagraph(
              'Input: ' + _jsToHumanReadable(testCase.getInput()) +
              '\nExpected Output: ' + _jsToHumanReadable(allowedOutputExample) +
              '\nActual Output: ' + _jsToHumanReadable(observedOutput));
        } else if (
          correctnessState === CORRECTNESS_STATE_NO_MORE_FEEDBACK) {
          feedback.appendTextParagraph(
            _getCorrectnessFeedbackString(correctnessState));
          feedback.appendOutputParagraph(
              'Input: ' + _jsToHumanReadable(testCase.getInput()) +
              '\nExpected Output: ' + _jsToHumanReadable(allowedOutputExample) +
              '\nActual Output: ' + _jsToHumanReadable(observedOutput));
        } else {
          throw Error('Invalid correctness state: ' + correctnessState);
        }
        return feedback;
      },
      /**
       * Returns the Feedback related to a failing performance test.
       *
       * @param {FeedbackDetails} feedbackDetails
       *
       * @returns {Feedback}
       */
      getPerformanceTestFeedback: function(feedbackDetails) {
        var feedback = FeedbackObjectFactory.create(
            FEEDBACK_CATEGORIES.PERFORMANCE_TEST_FAILURE);
        feedback.appendTextParagraph([
          'Your code is running more slowly than expected. Can you ',
          'reconfigure it such that it runs in ',
          feedbackDetails.getExpectedPerformance(),
          ' time?'].join(''));
        return feedback;
      },
      getSuccessFeedback: function() {
        var feedback = FeedbackObjectFactory.create(
            FEEDBACK_CATEGORIES.SUCCESSFUL);
        feedback.appendTextParagraph([
          'You\'ve completed all the tasks for this question! Click the ',
          '"Next" button to move on to the next question.'].join(''));
        return feedback;
      },
      _getCorrectnessFeedbackString: _getCorrectnessFeedbackString,
      _getUnfamiliarLanguageFeedback: _getUnfamiliarLanguageFeedback,
      _getRandomInt: _getRandomInt,
      _getFriendlySyntaxFeedback: _getFriendlySyntaxFeedback,
      _getFriendlyRuntimeFeedback: _getFriendlyRuntimeFeedback,
      _jsToHumanReadable: _jsToHumanReadable
    };
  }
]);
