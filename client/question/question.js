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
 * @fileoverview Basic configuration for the TIE application.
 */

window.tie = angular.module('tie', [
  'ui.codemirror', 'tieConfig', 'tieData', 'ngCookies', 'ngAria', 'ngSanitize'
]);

/**
 * String used to label test suites that contain sample input and output
 * that are presented to the user.
 *
 * @type {string}
 */
tie.constant('TEST_SUITE_ID_SAMPLE_INPUT', 'SAMPLE_INPUT');

/**
 * Possible states for incorrect-output feedback, in order.
 *
 * @type {Array<string>}
 */
tie.constant('CORRECTNESS_STATES', [
  'INPUT_DISPLAYED',
  'EXPECTED_OUTPUT_DISPLAYED',
  'OBSERVED_OUTPUT_DISPLAYED',
  'NO_MORE_FEEDBACK'
]);

/**
 * Incorrect-output-feedback state that allows the user to view the input of
 * the failing test.
 *
 * @type {string}
 */
tie.constant('CORRECTNESS_STATE_INPUT_DISPLAYED', 'INPUT_DISPLAYED');

/**
 * Incorrect-output-feedback state that allows the user to view the expected
 * output of the failing test.
 *
 * @type {string}
 */
tie.constant(
  'CORRECTNESS_STATE_EXPECTED_OUTPUT_DISPLAYED', 'EXPECTED_OUTPUT_DISPLAYED');

/**
 * Incorrect-output-feedback state that allows the user to view the observed
 * output of the failing test.
 *
 * @type {string}
 */
tie.constant(
  'CORRECTNESS_STATE_OBSERVED_OUTPUT_DISPLAYED', 'OBSERVED_OUTPUT_DISPLAYED');

/**
 * Incorrect-output-feedback state that indicates that we have no more feedback.
 *
 * @type {string}
 */
tie.constant('CORRECTNESS_STATE_NO_MORE_FEEDBACK', 'NO_MORE_FEEDBACK');

/**
 * Number of milliseconds for TIE to wait before showing feedback.
 *
 * @type {number}
 * @constant
 */
// eslint-disable-next-line no-magic-numbers
tie.constant('DURATION_MSEC_WAIT_FOR_FEEDBACK', 1400);

/**
 * Number of milliseconds for TIE to wait before confirming that code was
 * submitted.
 *
 * @type {number}
 * @constant
 */
// eslint-disable-next-line no-magic-numbers
tie.constant('DURATION_MSEC_WAIT_FOR_SUBMISSION_CONFIRMATION', 1000);

/**
 * Object containing variations on feedback text for different scenarios.
 *
 * @type {Object.<string, Array.<string>>}
 */
tie.constant('CORRECTNESS_FEEDBACK_TEXT', {
  INPUT_DISPLAYED: [
    'Would your code work for the following input?',
    'How about the following input? Would your code still work?',
    'What would happen if you run your code with this input?',
    'Consider the input below. How would your code handle it?',
    'Have you considered input such as the following?'
  ],
  EXPECTED_OUTPUT_DISPLAYED: [
    ('Below is the output your code should produce for the given input. ' +
     'Can you find the bug?'),
    'Consider the input/output pair below. Can you find the bug?',
    'Here is the input/output pair. Where could the bug be?',
    ('Your code should produce the output shown below. Can you update ' +
     'your code to produce the same output?'),
    ('It looks like there is still a bug. Can you modify your code so ' +
     'that it produces the output shown below?')
  ],
  OBSERVED_OUTPUT_DISPLAYED: [
    ('If you are stuck, you can display the output of your code.'),
    ('If you need help, you can display the output of your code.'),
    ('If you can\'t seem to get unstuck, you can display the output of ' +
     'your code.'),
    ('If you feel stumped, you can display the output of your code.'),
    ('If you can\'t find the bug, you can display the output of your code.')
  ],
  NO_MORE_FEEDBACK: [
    ('Sorry, we have no more feedback. Try taking a look at the expected and ' +
     'observed output for the given test case, and see if you can figure out ' +
     'why your program returns different results than expected.')
  ]
});

/**
 * The maximum amount of time (in seconds) that the code can take to run.
 *
 * @type {number}
 */
tie.constant('CODE_EXECUTION_TIMEOUT_SECONDS', 3);

// Supported languages.
/**
 * Used to tell whenever the language the user's code is in Python.
 *
 * @type {string}
 * @constant
 */
tie.constant('LANGUAGE_PYTHON', 'python');

/**
 * Array of strings each representing identifiers for languages that are
 * supported in TIE.
 *
 * @type {[string]}
 * @constant
 */
tie.constant('ALL_SUPPORTED_LANGUAGES', ['python']);

/**
 * Object keyed by Supported Languages, providing English Label
 *
 * @type {string: string}
 * @constant
 */
tie.constant('SUPPORTED_LANGUAGE_LABELS', {
  python: 'Python 2.7'
});

/**
 * Array of strings representing the names of Python libraries that are
 * supported by the TIE system.
 *
 * @type {[string]}
 * @constant
 */
tie.constant('SUPPORTED_PYTHON_LIBS', [
  'collections', 'math', 'operator', 'random', 're', 'string', 'time']);

/**
 * Class name for wrapping student code. Answer submissions are then run
 * using CLASS_NAME_STUDENT_CODE.function_name().
 *
 * @type {string}
 * @constant
 */
tie.constant('CLASS_NAME_STUDENT_CODE', 'StudentCode');

/**
 * Name of button that will direct users to Python language primer.
 *
 * @type {string}
 * @constant
 */
tie.constant('PYTHON_PRIMER_BUTTON_NAME', 'New to Python?');

/**
 * Enum of possible feedback categories representing the types of feedback a
 * TIE user could potentially receive.
 *
 * @type (Object)
 * @constant
 */
tie.constant('FEEDBACK_CATEGORIES', {
  FAILS_STARTER_CODE_CHECK: 'FAILS_STARTER_CODE_CHECK',
  FAILS_BAD_IMPORT_CHECK: 'FAILS_BAD_IMPORT_CHECK',
  FAILS_GLOBAL_CODE_CHECK: 'FAILS_GLOBAL_CODE_CHECK',
  FAILS_LANGUAGE_DETECTION_CHECK: 'FAILS_LANGUAGE_DETECTION_CHECK',
  FAILS_FORBIDDEN_NAMESPACE_CHECK: 'FAILS_FORBIDDEN_NAMESPACE_CHECK',
  SYNTAX_ERROR: 'SYNTAX_ERROR',
  TIME_LIMIT_ERROR: 'TIME_LIMIT_ERROR',
  MEMORY_LIMIT_ERROR: 'MEMORY_LIMIT_ERROR',
  STACK_EXCEEDED_ERROR: 'STACK_EXCEEDED_ERROR',
  RUNTIME_ERROR: 'RUNTIME_ERROR',
  KNOWN_BUG_FAILURE: 'KNOWN_BUG_FAILURE',
  SUITE_LEVEL_FAILURE: 'SUITE_LEVEL_FAILURE',
  INCORRECT_OUTPUT_FAILURE: 'INCORRECT_OUTPUT_FAILURE',
  PERFORMANCE_TEST_FAILURE: 'PERFORMANCE_TEST_FAILURE',
  SERVER_ERROR: 'SERVER_ERROR',
  SUCCESSFUL: 'SUCCESSFUL'
});

/**
 * Imports and system-level functions that should be appended to all code.
 *
 * @type {{}}
 * @constant
 */
tie.constant('SYSTEM_CODE', {
  python: [
    'import collections',
    'import copy',
    'import math',
    'import operator',
    'import random',
    'import re',
    'import string',
    'import time',
    '',
    '# A copy of the most-recently processed input item. This is useful',
    '# for debugging exceptions.',
    'most_recent_input = None',
    '',
    'class System(object):',
    '    @classmethod',
    '    def runTest(cls, func, input):',
    '        global most_recent_input',
    '        most_recent_input = copy.deepcopy(input)',
    '        output = func(input)',
    '        return output',
    '',
    '    @classmethod',
    '    def extendString(cls, s, length):',
    '        return s * length',
    ''
  ].join('\n')
});

// Pre-requisite check error types
/**
 * Pre-requisite check error type for when starter code is missing or altered.
 *
 * @type {string}
 * @constant
 */
tie.constant('PREREQ_CHECK_TYPE_MISSING_STARTER_CODE', 'missingStarterCode');

/**
 * Pre-requisite check error type for when the user tries to import an
 * unsupported library in their code submission.
 *
 * @type {string}
 * @constant
 */
tie.constant('PREREQ_CHECK_TYPE_BAD_IMPORT', 'badImport');

/**
 * Pre-requisite check error type for when the user tries to declare or use
 * code in the global scope.
 *
 * @type {string}
 * @constant
 */
tie.constant('PREREQ_CHECK_TYPE_GLOBAL_CODE', 'globalCode');

/**
 * Pre-requisite check error type for when the user tries to utilize code with
 * syntax commonly used in another language that isn't valid in the current
 * language.
 *
 * @type {string}
 * @constant
 */
tie.constant('PREREQ_CHECK_TYPE_WRONG_LANG', 'wrongLang');

/**
 * Constant for the number of times that a user can make a mistake (i.e.
 * same error, syntax error, etc.) until we prompt them to look at the
 * primer.
 *
 * @type {number}
 * @constant
 */
tie.constant('LANGUAGE_UNFAMILIARITY_THRESHOLD', 5);

/**
 * Dictionary of wrong language detection errors and their related information
 *
 * @type {{}}
 */
tie.constant('WRONG_LANGUAGE_ERRORS', {
  python: [{
    // Used Increment Operator
    errorName: 'incrementOp',
    regExString: '\\+\\+',
    feedbackParagraphs: [
      {
        type: 'text',
        content: [
          "It looks like you're trying to use '++' to increment a number, but ",
          "this isn't valid in Python. Try using '+= 1' instead."
        ].join('')
      }
    ],
    allowMultiline: false
  }, {
    // Used Decrement Operator
    errorName: 'decrementOp',
    regExString: '\\-\\-',
    feedbackParagraphs: [
      {
        type: 'text',
        content: [
          "It looks like you're trying to use '--' to decrement a number, but ",
          "this isn't valid in Python. Try using '-= 1' instead."
        ].join('')
      }
    ],
    allowMultiline: false
  }, {
    // Used `push` instead of `append`
    errorName: 'push',
    regExString: '.push\\(',
    feedbackParagraphs: [
      {
        type: 'text',
        content: [
          "It looks like you're using a `push` method to add an element ",
          "to an array, which is valid in Java, but the Python equivalent ",
          "is called `append`."
        ].join('')
      }
    ],
    allowMultiline: false
  }, {
    // Used the catch statement
    errorName: 'catch',
    regExString: '\\bcatch\\b',
    feedbackParagraphs: [
      {
        type: 'text',
        content: [
          "Are you trying to use a `catch` statement to catch an exception? ",
          "In Python, we use `except` instead."
        ].join('')
      }
    ],
    allowMultiline: false
  }, {
    // Used the Java comment syntax
    errorName: 'javaComment',
    regExString: '\\/\\/(\\s|\\w)*\\n|\\/\\*(\\*)?(\\s|\\w)*\\*\\/',
    feedbackParagraphs: [
      {
        type: 'text',
        content: [
          "It looks like you're using the Java syntax to write ",
          "comments. Make sure you're using the '#' character on lines ",
          "you want to comment out."
        ].join('')
      }
    ],
    allowMultiline: true
  }, {
    // Used a do-while loop
    errorName: 'doWhile',
    regExString: 'do\\s*{(\\w|\\s|[;])*}\\s*while\\s*\\((\\w|\\s)*\\)|\\bdo' +
      '\\b',
    feedbackParagraphs: [
      {
        type: 'text',
        content: [
          "Unfortunately, Python doesn't support do-while statements. ",
          "Try using a flag or a different condition instead."
        ].join('')
      }
    ],
    allowMultiline: true
  }, {
    // Used else if instead of elif
    errorName: 'elseIf',
    regExString: '\\belse\\s*if\\b',
    feedbackParagraphs: [
      {
        type: 'text',
        content: [
          "Double-check that you're using `elif` instead of `else if` for ",
          "your if-else statements."
        ].join('')
      }
    ],
    allowMultiline: false
  }, {
    // Used the wrong casing for "True" or "False".
    errorName: 'booleans',
    regExString: '\\b(true|TRUE|false|FALSE)\\b',
    feedbackParagraphs: [
      {
        type: 'text',
        content: [
          "Python only allows True and False for boolean values. Double-check ",
          "to make sure 'True' or 'False' are written with the letters in the ",
          "correct case."
        ].join('')
      }
    ],
    allowMultiline: false
  }, {
    // Used a switch statement
    errorName: 'switch',
    regExString: '\\bswitch\\b\\s*\\((\\w|\\s)*\\)\\s*[{|:]?\\s*((\\bcase' +
      '\\b)|(\\bdefault\\b))',
    feedbackParagraphs: [
      {
        type: 'text',
        content: [
          "Python doesn't support switch statements. Use if-else statements ",
          "instead."
        ].join('')
      }
    ],
    allowMultiline: true
  }, {
    // Used the C-like import syntax
    errorName: 'cImport',
    regExString: '#include\\s+<\\w+>',
    feedbackParagraphs: [
      {
        type: 'text',
        content: [
          "It looks like you're using a C-like syntax to try and import ",
          "packages. In Python, your imports should be in the format: "
        ].join('')
      }, {
        type: 'code',
        content: 'import [insert package name here]'
      }
    ],
    allowMultiline: false
  }, {
    // Used the Java/C not operator
    errorName: 'notOp',
    regExString: '![^=]\\w*',
    feedbackParagraphs: [
      {
        type: 'text',
        content: [
          "Are you using the right NOT operator? In Python, it's just `not`."
        ].join('')
      }
    ],
    allowMultiline: false
  }, {
    // Used the Java/C and operator
    errorName: 'andOp',
    regExString: '&&',
    feedbackParagraphs: [
      {
        type: 'text',
        content: [
          "Double-check that you're using the right AND operator. For Python, ",
          "the AND operator is simply `and`."
        ].join('')
      }
    ],
    allowMultiline: false
  }, {
    // Used the Java/C or operator
    errorName: 'orOp',
    regExString: '\\|\\|',
    feedbackParagraphs: [
      {
        type: 'text',
        content: [
          "It looks like you're trying to use the OR operator syntax from ",
          "Java. Be sure you're using the Python-appropriate operator, `or`."
        ].join('')
      }
    ],
    allowMultiline: false
  }]
});

/**
 * Dictionary of system-generated tips.
 *
 * @type {{}}
 */
tie.constant('SYSTEM_GENERATED_TIPS', {
  python: [{
    // The system generated tip when stdout is disabled and code included
    // a print statement.
    type: 'print',
    requirePrintToBeDisabled: true,
    regexString: '\\bprint\\b',
    message: [
      'We noticed that you\'re using a print statement within your code. ',
      'Since you will not be able to use such statements in a technical ',
      'interview, TIE does not support this feature. We encourage you to ',
      'instead step through your code by hand.'
    ].join('')
  }]
});

/**
 * Pre-requisite check error type to see if the user tried to use any methods
 * from System in their code submission.
 *
 * @type {string}
 * @constant
 */
tie.constant('PREREQ_CHECK_TYPE_INVALID_SYSTEM_CALL', 'invalidSystem');

/**
 * Pre-requisite check error type to see if the user tried to use an
 * AuxiliaryCode method in their code submission.
 *
 * @type {string}
 * @constant
 */
tie.constant(
  'PREREQ_CHECK_TYPE_INVALID_AUXILIARYCODE_CALL', 'invalidAuxiliaryCode');

/**
 * Pre-requisite check error type to see if the user tried to use an
 * StudentCode method in their code submission.
 *
 * @type {string}
 * @constant
 */
tie.constant(
  'PREREQ_CHECK_TYPE_INVALID_STUDENTCODE_CALL', 'invalidStudentCode');

/**
 * Dictionary of the novice-friendly syntax error feedback messages
 *
 * `friendlyErrorCheck` function checks to see if the error matches with the
 * type of feedback message
 *
 * `getFriendlyErrorText` function returns the appropriate feedback message for
 * the given error
 *
 * @type {Object}
 */
tie.constant('FRIENDLY_SYNTAX_ERROR_TRANSLATIONS', {
  python: [
    {
      friendlyErrorCheck: function(errorString) {
        var re = new RegExp('SyntaxError: invalid syntax');
        return re.test(errorString);
      },
      getFriendlyErrorText: function() {
        return [
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
          'be caused by something else.'].join('');
      }
    }, {
      friendlyErrorCheck: function(errorString) {
        var re = new RegExp('SyntaxError: EOL while scanning string literal');
        return re.test(errorString);
      },
      getFriendlyErrorText: function() {
        return [
          'An "End of Line" error on a string usually means you are ',
          'missing a quotation mark somewhere.'].join('');
      }
    }, {
      friendlyErrorCheck: function(errorString) {
        var re = new RegExp('IndentationError: ');
        return re.test(errorString);
      },
      getFriendlyErrorText: function() {
        return [
          'It looks like your code has some inconsistencies with indentation. ',
          'Double-check that you indent after every statement that ends with ',
          'a ":" and un-indent when necessary.'].join('');
      }
    }
  ]
});

/**
 * Dictionary of the novice-friendly runtime error feedback messages
 *
 * `friendlyErrorCheck` function checks to see if the error matches with the
 * type of feedback message
 *
 * `getFriendlyErrorText` function returns the appropriate feedback message for
 * the given error
 *
 * @type {Object}
 **/
tie.constant('FRIENDLY_RUNTIME_ERROR_TRANSLATIONS', {
  python: [
    {
      // Type Error where user tries to assign an item directly in a string
      friendlyErrorCheck: function(errorString) {
        return errorString.startsWith(
          "TypeError: 'str' does not support item assignment");
      },
      getFriendlyErrorText: function() {
        return [
          'Unfortunately, Python doesn\'t support directly assigning ',
          'characters in a string. If you need to do so, try slicing the ',
          'string and adding new characters instead of assigning them. If ',
          'you need a refresher on slicing, check out the ',
          '[primer](primer-url#strings).'].join('');
      }
    }, {
      // Error where user tries to concatenate a string with a non-string
      friendlyErrorCheck: function(errorString) {
        return (errorString.startsWith('TypeError: cannot concatenate ') ||
            errorString.startsWith('TypeError: can only concatenate ') ||
            errorString.startsWith('TypeError: unsupported operand type(s) ' +
              'for ')
        );
      },
      getFriendlyErrorText: function() {
        return [
          'You may have tried to combine two incompatible types (you might ',
          'have tried to combine a string with an array, etc.).'].join('');
      }
    }, {
      // Error when user tries to use a variable name that is not defined
      friendlyErrorCheck: function(errorString) {
        var re = new RegExp(
            'NameError: (?:global )?name \'.+\' is not defined$');
        return re.test(errorString);
      },
      getFriendlyErrorText: function(errorString) {
        var re = new RegExp(
            'NameError: (?:global )?name \'(.*)\' is not defined');
        var varName = errorString.match(re)[1];
        return [
          '<code>', varName, '</code> appears to be a name that was not ',
          'previously declared or defined. E.g., if <code>', varName,
          '</code> is a variable to hold a string, <code>', varName,
          ' = \'\'</code> would declare <code>', varName, '</code> as a ',
          'string variable. Similarly, <code>', varName, ' = []</code> ',
          'declares <code>', varName, '</code> as an array variable. Another ',
          'possibility is that <code>', varName, '</code> was misspelled or ',
          'uses incorrect capitalization.'].join('');
      }
    }, {
      // Error when user tries to use a property/method that isn't defined
      friendlyErrorCheck: function(errorString) {
        return errorString.startsWith('AttributeError: ');
      },
      getFriendlyErrorText: function(errorString) {
        var attributeErrorRegex =
           /AttributeError:\s'(\w+)'\sobject\shas\sno\sattribute\s'((\w|\W)+)'/;
        var found = errorString.match(attributeErrorRegex);
        return [
          found[1], ' doesn\'t have a property or method named ', found[2],
          '. Double-check to make sure everything is spelled ',
          'correctly.'].join('');
      }
    }, {
      // Error when user tries to access an index that is out of range
      friendlyErrorCheck: function(errorString) {
        return errorString.startsWith("IndexError: list index out of range");
      },
      getFriendlyErrorText: function() {
        return [
          'It looks like you\'re trying to access an index that is outside ',
          'the boundaries of the list. Double-check that your loops and ',
          'assignments don\'t try to retrieve from indexes below 0 or above ',
          'the length of the string.'].join('');
      }
    }, {
      // Error when user tries to access a key that isn't defined in a dict
      friendlyErrorCheck: function(errorString) {
        return errorString.startsWith('KeyError: ');
      },
      getFriendlyErrorText: function(errorString) {
        var keyErrorRegex = /KeyError:\s(.*)/;
        var found = errorString.match(keyErrorRegex);
        return [
          'The key ' + found[1] + ' is not in the dictionary you\'re trying ',
          'to retrieve from. Double-check to make sure everything is spelled ',
          'correctly and that you have included all necessary key-value ',
          'pairs.'].join('');
      }
    }
  ]
});

/**
 * Name of the list in which correctness test results are stored.
 *
 * @type {string}
 * @constant
 */
tie.constant('VARNAME_OBSERVED_OUTPUTS', 'correctness_test_results');

/**
 * Name of the list in which buggy output test results of all tasks are stored.
 *
 * @type {string}
 * @constant
 */
tie.constant('VARNAME_BUGGY_OUTPUT_TEST_RESULTS', 'buggy_output_test_results');

/**
 *  Name of the list in which performance test results of all tasks are stored.
 *
 *  @type {string}
 *  @constant
 */
tie.constant('VARNAME_PERFORMANCE_TEST_RESULTS', 'performance_test_results');

/**
 * Name of the list in which buggy output test results of one single task are
 * stored.
 *
 * @type {string}
 * @constant
 */
tie.constant('VARNAME_TASK_BUGGY_OUTPUT_TEST_RESULTS',
    'task_buggy_output_test_results');
/**
 * Name of the list in which performance test results of one single task are
 * stored.
 *
 * @type {string}
 * @constant
 */
tie.constant('VARNAME_TASK_PERFORMANCE_TEST_RESULTS',
    'task_performance_test_results');
/**
 * Name of the variable in which a copy of the most recent input is stored.
 *
 * @type {string}
 * @constant
 */
tie.constant('VARNAME_MOST_RECENT_INPUT', 'most_recent_input');

/**
 * Conversion rate between seconds to milliseconds.
 *
 * @type {number}
 * @constant
 */
 // eslint-disable-next-line no-magic-numbers
tie.constant('SECONDS_TO_MILLISECONDS', 1000);

/**
 * Default auto save time in seconds.
 *
 * @type {number}
 * @constant
 */
tie.constant('CODE_CHANGE_DEBOUNCE_SECONDS', 5);

/**
* Default user stdout separator length. A string separator is utilized
* in splitting the total output into the corresponding outputs for each
* test case. The separator is in between the output of different test cases.
*
* @type {number}
* @constant
*/
// eslint-disable-next-line no-magic-numbers
tie.constant('SEPARATOR_LENGTH', 20);

/**
 * Default time in seconds between calls to SendEventBatch.
 *
 * @type {number}
 * @constant
 */
 // eslint-disable-next-line no-magic-numbers
tie.constant('DEFAULT_EVENT_BATCH_PERIOD_SECONDS', 30);

/**
 * Maximum number of CodeSubmitEvents allowed per EventBatch.
 *
 * @type {number}
 * @constant
 */
tie.constant('MAX_NUM_CODE_SUBMIT_EVENTS_PER_BATCH', 4);

/**
 * Number of seconds that "Saving code..." message will appear for before
 * disappearing.
 *
 * @type {number}
 * @constant
 */

tie.constant('DISPLAY_AUTOSAVE_TEXT_SECONDS', 1);

/**
 * Default cookie lifetime for the privacy policy in days.
 *
 * @type {number}
 * @constant
 */
var SIX_MONTHS_IN_DAYS = 180;
tie.constant('PRIVACY_COOKIE_LIFETIME_DAYS', SIX_MONTHS_IN_DAYS);

/**
* Key to use to store the privacy policy agreement.
*
* @type {string}
* @constant
*/
tie.constant('PRIVACY_COOKIE_NAME', 'PRIVACY_POLICY_ACCEPTED');

/**
 * Menu page url relative to the question page.
 *
 * @type {string}
 * @constant
 */
tie.constant('MENU_PAGE_URL_FROM_QUESTION_PAGE', '../menu/menu.html');

/**
 * The URL of the Github project's homepage.
 *
 * @type {string}
 * @constant
 */
tie.constant('GITHUB_HOMEPAGE_URL', 'http://google.github.io/tie');

/**
 * Height offset needed by modal to cover feedback buttons.
 *
 * @type {number}
 * @constant
 */
var FEEDBACK_MODAL_HEIGHT_OFFSET = 69;
tie.constant('FEEDBACK_MODAL_HEIGHT_OFFSET', FEEDBACK_MODAL_HEIGHT_OFFSET);

/**
 * Height offset needed by modal to completely hide from view when dismissed.
 *
 * @type {number}
 * @constant
 */
var FEEDBACK_MODAL_HIDE_HEIGHT_OFFSET = 34;
tie.constant('FEEDBACK_MODAL_HIDE_HEIGHT_OFFSET',
    FEEDBACK_MODAL_HIDE_HEIGHT_OFFSET);

/**
 * Timeout delay needed to allow animation to work properly on non-MacOS
 * systems. Used when a timeout of 0 is not sufficient.
 *
 * @type {number}
 * @constant
 */
var DELAY_STYLE_CHANGES = 20;
tie.constant('DELAY_STYLE_CHANGES', DELAY_STYLE_CHANGES);

/**
 * Message to show when resetting code would also reset the learner's task
 * progress.
 *
 * @type {string}
 * @constant
 */
tie.constant('CODE_RESET_CONFIRMATION_MESSAGE', [
  'Are you sure you want to reset your code? This will clear all of your ',
  'existing progress on the question.'
].join(''));

/**
 * Constant that denotes the compile-time execution context.
 *
 * @type {string}
 * @constant
 */
tie.constant('EXECUTION_CONTEXT_COMPILATION', 'COMPILATION');

/**
 * Constant that denotes the run-time execution context.
 *
 * @type {string}
 * @constant
 */
tie.constant('EXECUTION_CONTEXT_RUN_WITH_TESTS', 'RUN_WITH_TESTS');
