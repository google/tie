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

window.globalData = {
  // Question data will be stored here, keyed by question ID.
  // Questions are instantiated in assets/questions, and they add themselves
  // to this dictionary when they're instantiated.
  questions: {},
  // Question set data will be stored here, keyed by question set ID.
  questionSets: {}
};

window.tie = angular.module('tie', ['ui.codemirror']);

// The maximum amount of time (in seconds) that the code can take to run.
tie.constant('CODE_EXECUTION_TIMEOUT_SECONDS', 3);

// Supported languages.
tie.constant('LANGUAGE_PYTHON', 'python');
tie.constant('ALL_SUPPORTED_LANGUAGES', ['python']);
tie.constant('SUPPORTED_PYTHON_LIBS', ['collections', 'image',
  'math', 'operator', 'random', 're', 'string', 'time']);

// Class name for wrapping student code. Answer submissions are then run
// using CLASS_NAME_STUDENT_CODE.function_name().
tie.constant('CLASS_NAME_STUDENT_CODE', 'StudentCode');
// Class name for wrapping auxiliary code, primarily used for test evaluation.
tie.constant('CLASS_NAME_AUXILIARY_CODE', 'AuxiliaryCode');
// Class name for wrapping system code.
tie.constant('CLASS_NAME_SYSTEM_CODE', 'AuxiliaryCode');

// Imports and system-level functions that should be appended to all code.
tie.constant('SYSTEM_CODE', {
  python: [
    'import copy',
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
tie.constant('PREREQ_CHECK_TYPE_MISSING_STARTER_CODE', 'missingStarterCode');
tie.constant('PREREQ_CHECK_TYPE_BAD_IMPORT', 'badImport');
tie.constant('PREREQ_CHECK_TYPE_GLOBAL_CODE', 'globalCode');
tie.constant('PREREQ_CHECK_TYPE_WRONG_LANG', 'wrongLang');

/**
 * Dictionary of wrong language detection errors and their related information
 *
 * @type {{}}
 */
tie.constant('WRONG_LANGUAGE_ERRORS', {
  python: [
    {
      // Used Increment Operator
      regExString: '\\+\\+',
      feedbackParagraphs: [
        [{
          _type: 'text',
          _content: [
              "Hmm... It looks like you're trying to use '++' to increment a ",
              "number, but unfortunately, this isn't valid in Python. Try ",
              "using '+= 1' instead."
            ].join('')
        }]
      ]
    },
    {
      // Used Decrement Operator
      regExString: '\\-\\-',
      feedbackParagraphs: [
        [{
          _type: 'text',
          _content: [
            "Hmm... It looks like you're trying to use '--' to decrement a ",
            "number, but unfortunately, this isn't valid in Python. Try ",
            "using '-= 1' instead."
          ].join('')
        }]
      ]
    },
    {
      // Used `push` instead of `append`
      regexString: '.push\\(',
      feedbackParagraphs: [
        [{
          _type: 'text',
          _content: [
            "It seems like you're using a `push` method to add an element ",
            "to an array, which is valid in Java, but the Python equivalent ",
            "called `append`."
          ].join('')
        }]
      ]
    },
    {
      // Used the catch statement
      regexString: '\\bcatch\\b',
      feedbackParagraphs: [
        [{
          _type: 'text',
          _content: [
            "Are you trying to use a `catch` statement to catch an ",
            "Exception? In Python, we use `except` instead."
          ].join('')
        }]
      ]
    },
    {
      // Used the Java comment syntax
      regexString: '\\/(\\s*|\\w*)*\\n|\\/\\*(\\*)?(\\s*|\\w*)*\\*\\/',
      feedbackParagraphs: [
        [{
          _type: 'text',
          _content: [
            "Hmmm... It seems like you're using the Java syntax to write ",
            "comments. Make sure you're using the '#' character on lines ",
            "you want to comment out."
          ].join('')
        }]
      ]
    },
    {
      // Used a do-while loop
      regexString: 'do\\s*{(\\w|\\s|[;])*}\\s*while\\s*\\((\\w|\\s)*\\)|\\bdo' +
        '\\b',
      feedbackParagraphs: [
        [{
          _type: 'text',
          _content: [
            "Unfortunately, Python doesn't support do-while statements. ",
            "Perhaps try using a flag or different condition instead?"
          ].join('')
        }]
      ]
    },
    {
      // Used else if instead of elif
      regexString: '\\belse\\s*if\\b',
      feedbackParagraphs: [
        [{
          _type: 'text',
          _content: [
            "Make sure to double check that you're using `elif` instead of ",
            "`else if` for your if-else statements."
          ].join('')
        }]
      ]
    },
    {
      // Used a switch statement
      regexString: '\\bswitch\\b\\s*\\((\\w|\\s)*\\)\\s*[{|:]?\\s*((\\bcase' +
        '\\b)|(\\bdefault\\b))',
      feedbackParagraphs: [
        [{
          _type: 'text',
          _content: [
            "Sad to say but Python doesn't support switch statements. We ",
            "just have to stick to good old if-else statements instead."
          ].join('')
        }]
      ]
    },
    {
      // Used the C-like import syntax
      regexString: '#include\\s+<\\w+>',
      feedbackParagraphs: [
        [{
          _type: 'text',
          _content: [
            "It looks like you're using a C-like syntax to try and import ",
            "packages. In Python, your imports should be in the format: "
          ].join('')
        }, {
          _type: 'code',
          _content: 'import [insert package name here]'
        }]
      ]
    },
    {
      // Used the Java/C not operator
      regexString: '[^=]\\w*',
      feedbackParagraphs: [
        [{
          _type: 'text',
          _content: [
            "Are you making sure to use the right NOT operator? In Python, ",
            "it's just `not`."
          ].join('')
        }]
      ]
    },
    {
      // Used the Java/C and operator
      regexString: '&&',
      feedbackParagraphs: [
        [{
          _type: 'text',
          _content: [
            "Triple check you're using the right AND operator. For Python, ",
            "the AND operator is simply `and`."
          ].join('')
        }]
      ]
    },
    {
      // Used the Java/C or operator
      regexString: '\\|\\|',
      feedbackParagraphs: [
        [{
          _type: 'text',
          _content: [
            "Hmmm... It seems like you're trying to use the OR operator ",
            "syntax from Java. Be sure you're using the Python appropriate ",
            "operator - `or`."
          ].join('')
        }]
      ]
    }
  ]
};


// Name of the list in which correctness test results are stored.
tie.constant('VARNAME_CORRECTNESS_TEST_RESULTS', 'correctness_test_results');
// Name of the list in which buggy output test results of all tasks are stored.
tie.constant('VARNAME_BUGGY_OUTPUT_TEST_RESULTS', 'buggy_output_test_results');
// Name of the list in which performance test results of all tasks are stored.
tie.constant('VARNAME_PERFORMANCE_TEST_RESULTS', 'performance_test_results');
// Name of the list in which
// correctness test results of one single task are stored.
tie.constant('VARNAME_TASK_CORRECTNESS_TEST_RESULTS',
    'task_correctness_test_results');
// Name of the list in which
// buggy output test results of one single task are stored.
tie.constant('VARNAME_TASK_BUGGY_OUTPUT_TEST_RESULTS',
    'task_buggy_output_test_results');
// Name of the list in which
// performance test results of one single task are stored.
tie.constant('VARNAME_TASK_PERFORMANCE_TEST_RESULTS',
    'task_performance_test_results');
// Name of the variable in which a copy of the most recent input is stored.
tie.constant('VARNAME_MOST_RECENT_INPUT', 'most_recent_input');
// Default auto save time in seconds.
var SECONDS_TO_MILLISECONDS = 1000;
tie.constant('DEFAULT_AUTOSAVE_SECONDS', 5);
tie.constant('SECONDS_TO_MILLISECONDS', SECONDS_TO_MILLISECONDS);
// "Saving code..." will last for 1 second and disappear.
tie.constant('DISPLAY_AUTOSAVE_TEXT_SECONDS', 1);

// The server URL to call for code execution. If null, the Skulpt library
// is used for frontend code execution.
tie.constant('SERVER_URL', null);
