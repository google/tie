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
tie.constant('CLASS_NAME_SYSTEM_CODE', 'System');


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
  Dictionary of the customized runtime error feedback messages
  - `checker` function checks to see if the error matches with the type of
    feedback message
  - `generateMessage` function returns the appropriate feedback message for the
    given error
 **/
tie.constant('RUNTIME_ERROR_FEEDBACK_MESSAGES', {
  python: [{
    // Error when user indents lines incorrectly
    checker: function(errorString) {
      return errorString.startsWith("IndentationError: ");
    },
    generateMessage: function() {
      return ['It looks like your code has some inconsistencies with ',
        'indentation. Double check that you indent after every statement ',
        'that ends with a ":" and un-indent when necessary.'].join('');
    }
  }, {
    // Type Error where user tries to assign an item directly in a string
    checker: function(errorString) {
      return errorString.startsWith("TypeError: 'str' does not support" +
          " item assignment");
    },
    generateMessage: function() {
      return ["Unfortunately Python doesn't support directly assigning ",
        "characters in a string. If you need to do so, try splicing the ",
        "string and reassigning the characters that way. If you need a ",
        "refresher on splicing, check out the primer."].join('');
    }
  }, {
    // Error where user tries to concatenate a string with a non-string
    checker: function(errorString) {
      return (errorString.startsWith('TypeError: ') &&
      errorString.includes("cannot concatenate 'str' and") &&
      errorString.includes("objects"));
    },
    generateMessage: function() {
      return ["Did you remember to explicitly convert all objects to strings ",
        "when necessary (like when you're concatenating a string)? Make ",
        "sure everything that isn't a string gets converted using the str() ",
        "method or by using a formatted string."].join("");
    }
  }, {
    // Error when user tries to use a variable name that is not defined
    checker: function(errorString) {
      return errorString.startsWith('NameError: ');
    },
    generateMessage: function(errorString) {
      var nameErrorRegEx = /NameError:\sname\s'(\w+)'\sis\snot\sdefined/;
      var found = errorString.match(nameErrorRegEx);
      return ["It looks like " + found[1] + " isn't a declared variable. ",
        "Did you make sure to spell it correctly? And is it correctly ",
        "initialized?"].join('');
    }
  }, {
    // Error when user tries to use a property/method that isn't defined
    checker: function(errorString) {
      return errorString.startsWith('AttributeError: ');
    },
    generateMessage: function(errorString) {
      var attributeErrorRegEx =
          /AttributeError:\s'(\w+)'\sobject\shas\sno\sattribute\s'(\w+)'/;
      var found = errorString.match(attributeErrorRegEx);
      return [found[1] + " doesn't have a property or method named ",
        found[2] + ". Double check to make sure everything is spelled ",
        "correctly."].join("");
    }
  }, {
    // Error when user tries to access an index that is out of range
    checker: function(errorString) {
      return errorString.startsWith(
          "IndexError: list index out of range");
    },
    generateMessage: function() {
      return ["It looks like you're trying to access an index that is out ",
        "of the bounds for the list. Double check that your loops and ",
        "assignments don't try to retrieve from indexes below 0 or above ",
        "the length of the string."].join('');
    }
  }, {
    // Error when user tries to access a key that isn't defined in a dict
    checker: function(errorString) {
      return errorString.startsWith('KeyError: ');
    },
    generateMessage: function(errorString) {
      var keyErrorRegEx = /KeyError:\s(\w+)\s/;
      var found = errorString.match(keyErrorRegEx);
      return ["The key " + found[1] + " is not in the dictionary you're ",
        "trying to retrieve from. Double check to make sure everything is ",
        "spelled correctly and that you haven't forgotten to add any ",
        "key-value pairs."].join('');
    }
  }]
});

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
