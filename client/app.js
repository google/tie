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
  /**
   * Question data will be stored here, keyed by question ID.
   * Questions are instantiated in assets/questions, and they add themselves
   * to this dictionary when they're instantiated.
   *
   * @type {dict}
   */
  questions: {},

  /**
   * Question set data will be stored here, keyed by question set ID.
   *
   * @type {dict}
   */
  questionSets: {}
};

window.tie = angular.module('tie', ['ui.codemirror']);

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
 * Array of strings representing the names of Python libraries that are
 * supported by the TIE system.
 *
 * @type {[string]}
 * @constant
 */
tie.constant('SUPPORTED_PYTHON_LIBS', ['collections', 'image',
  'math', 'operator', 'random', 're', 'string', 'time']);

/**
 * Class name for wrapping student code. Answer submissions are then run
 * using CLASS_NAME_STUDENT_CODE.function_name().
 *
 * @type {string}
 * @constant
 */
tie.constant('CLASS_NAME_STUDENT_CODE', 'StudentCode');
/**
 * Class name for wrapping auxiliary code, primarily used for test evaluation.
 *
 * @type {string}
 * @constant
 */
tie.constant('CLASS_NAME_AUXILIARY_CODE', 'AuxiliaryCode');
/**
 * Class name for wrapping system code.
 *
 * @type {string}
 * @constant
 */
tie.constant('CLASS_NAME_SYSTEM_CODE', 'AuxiliaryCode');

/**
 * Imports and system-level functions that should be appended to all code.
 *
 * @type {{}}
 * @constant
 */
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
 * Name of the list in which correctness test results are stored.
 *
 * @type {string}
 * @constant
 */
tie.constant('VARNAME_CORRECTNESS_TEST_RESULTS', 'correctness_test_results');
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
 * Name of the list in which correctness test results of one single task are
 * stored.
 *
 * @type {string}
 * @constant
 */
tie.constant('VARNAME_TASK_CORRECTNESS_TEST_RESULTS',
    'task_correctness_test_results');
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
var SECONDS_TO_MILLISECONDS = 1000;
tie.constant('SECONDS_TO_MILLISECONDS', SECONDS_TO_MILLISECONDS);

/**
 * Default auto save time in seconds.
 *
 * @type {number}
 * @constant
 */
tie.constant('DEFAULT_AUTOSAVE_SECONDS', 5);
/**
 * Number of seconds that "Saving code..." message will appear for before
 * disappearing.
 *
 * @type {number}
 * @constant
 */
tie.constant('DISPLAY_AUTOSAVE_TEXT_SECONDS', 1);
