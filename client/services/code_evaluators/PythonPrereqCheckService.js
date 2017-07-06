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
 * @fileoverview Service for performing pre-requisite checks on Python code
 * snippets.
 */

tie.factory('PythonPrereqCheckService', [
  'PrereqCheckFailureObjectFactory', 'PREREQ_CHECK_TYPE_BAD_IMPORT',
  'PREREQ_CHECK_TYPE_MISSING_STARTER_CODE', 'SUPPORTED_PYTHON_LIBS',
  'PREREQ_CHECK_TYPE_GLOBAL_CODE', 'PREREQ_CHECK_TYPE_WRONG_LANG_INCREMENT_OP',
  'PREREQ_CHECK_TYPE_WRONG_LANG_DECREMENT_OP',
  'PREREQ_CHECK_TYPE_WRONG_LANG_PUSH',
  'PREREQ_CHECK_TYPE_WRONG_LANG_CATCH_STATE',
  'PREREQ_CHECK_TYPE_WRONG_LANG_JAVA_COMMENT',
  'PREREQ_CHECK_TYPE_WRONG_LANG_DO_WHILE',
  'PREREQ_CHECK_TYPE_WRONG_LANG_ELSE_IF', 'PREREQ_CHECK_TYPE_WRONG_LANG_SWITCH',
  'PREREQ_CHECK_TYPE_WRONG_LANG_C_IMPORT',
  'PREREQ_CHECK_TYPE_WRONG_LANG_NOT_OP', 'PREREQ_CHECK_TYPE_WRONG_LANG_AND_OP',
  'PREREQ_CHECK_TYPE_WRONG_LANG_OR_OP',
  function(
      PrereqCheckFailureObjectFactory, PREREQ_CHECK_TYPE_BAD_IMPORT,
      PREREQ_CHECK_TYPE_MISSING_STARTER_CODE, SUPPORTED_PYTHON_LIBS,
      PREREQ_CHECK_TYPE_GLOBAL_CODE, PREREQ_CHECK_TYPE_WRONG_LANG_INCREMENT_OP,
      PREREQ_CHECK_TYPE_WRONG_LANG_DECREMENT_OP,
      PREREQ_CHECK_TYPE_WRONG_LANG_PUSH,
      PREREQ_CHECK_TYPE_WRONG_LANG_CATCH_STATE,
      PREREQ_CHECK_TYPE_WRONG_LANG_JAVA_COMMENT,
      PREREQ_CHECK_TYPE_WRONG_LANG_DO_WHILE,
      PREREQ_CHECK_TYPE_WRONG_LANG_ELSE_IF, PREREQ_CHECK_TYPE_WRONG_LANG_SWITCH,
      PREREQ_CHECK_TYPE_WRONG_LANG_C_IMPORT,
      PREREQ_CHECK_TYPE_WRONG_LANG_NOT_OP, PREREQ_CHECK_TYPE_WRONG_LANG_AND_OP,
      PREREQ_CHECK_TYPE_WRONG_LANG_OR_OP) {

    /**
     * Checks if the given code uses any syntax that isn't valid in Python
     * but is specific to languages like C/C++ and Java.
     *
     * @param {string}
     * @returns {string}
     */
    var getWrongLanguageType = function(code) {
      /**
       * Used to recognize when the user tries to use a '++' operator to
       * increment a number - which is not valid in Python.
       *
       * @type {RegExp}
       * @constant
       */
      var JAVA_INCREMENT_OPERATOR_REGEX = new RegExp('\\+\\+');

      /**
       * Used to recognize when the user tries to use a '--' operator to
       * decrement a number - which is not valid in Python.
       *
       * @type {RegExp}
       * @constant
       */
      var JAVA_DECREMENT_OPERATOR_REGEX = new RegExp('\\-\\-');

      /**
       * Used to recognize when the user tries to use the `push` method to
       * append an element to an array (which isn't valid in Python) rather than
       * the `append` method.
       *
       * @type {RegExp}
       * @constant
       */
      var PUSH_METHOD_REGEX = new RegExp('.push\\(');

      /**
       * Used to recognize when the user tries to use the catch statement -
       * which isn't valid in Python - instead of the except statement.
       *
       * @type {RegExp}
       * @constant
       */
      var CATCH_STATEMENT_REGEX = new RegExp('\\bcatch\\b');

      /**
       * Used to recognize if someone is trying to use the Java/C/C++ comment
       * syntax instead of the Python comment syntax.
       *
       * @type {RegExp}
       * @constant
       */
      var JAVA_COMMENT_SYNTAX_REGEX = new RegExp(
          '\\/(\\s*|\\w*)*\\n|\\/\\*(\\*)?(\\s*|\\w*)*\\*\\/');

      /**
       * Used to recognize if the user is trying to use a do-while loop - which
       * is not supported in Python.
       *
       * @type {RegExp}
       * @constant
       */
      var DO_WHILE_LOOP_REGEX = new RegExp(
          'do\\s*{(\\w|\\s|[;])*}\\s*while\\s*\\((\\w|\\s)*\\)|\\bdo\\b');

      /**
       * Used to recognize if the user is trying to use an else if statement -
       * which is not supported in Python - rather than an `elif` statement.
       *
       * @type {RegExp}
       * @constant
       */
      var ELSE_IF_STATEMENT_REGEX = new RegExp('\\belse\\s*if\\b');

      /**
       * Used to recognize if the user is trying to use a switch statement -
       * which is not supported in Python.
       *
       * @type {RegExp}
       * @constant
       */
      var SWITCH_STATEMENT_REGEX = new RegExp(
          '\\bswitch\\b\\s*\\((\\w|\\s)*\\)\\s*[{|:]?\\s*((\\bcase\\b)|(\\b' +
          'default\\b))');

      /**
       * Used to recognize if user is trying to import a package using the C/C++
       * syntax.
       *
       * @type {RegExp}
       * @constant
       */
      var C_IMPORT_SYNTAX_REGEX = new RegExp('#include\\s+<\\w+>');

      /**
       * Used to recognize if the user is trying to use '!' as a NOT operator -
       * which, with the exception of the `!=` operator, is invalid in Python.
       *
       * @type {RegExp}
       * @constant
       */
      var INVALID_NOT_OPERATOR_REGEX = new RegExp('![^=]\\w*');

      /**
       * Used to recognize if the user is trying to use '||' as an OR operator -
       * which is not valid in Python.
       *
       * @type {RegExp}
       * @constant
       */
      var INVALID_OR_OPERATOR_REGEX = new RegExp('\\|\\|');

      /**
       * Used to recognize if the user is trying to use '&&' as an AND operator
       * - which is not valid in Python.
       *
       * @type {RegExp}
       * @constant
       */
      var INVALID_AND_OPERATOR_REGEX = new RegExp('&&');

      if (code !== '') {
        if (code.search(JAVA_INCREMENT_OPERATOR_REGEX) !== -1) {
          return PREREQ_CHECK_TYPE_WRONG_LANG_INCREMENT_OP;
        }

        if (code.search(JAVA_DECREMENT_OPERATOR_REGEX) !== -1) {
          return PREREQ_CHECK_TYPE_WRONG_LANG_DECREMENT_OP;
        }

        if (code.search(JAVA_COMMENT_SYNTAX_REGEX) !== -1) {
          return PREREQ_CHECK_TYPE_WRONG_LANG_JAVA_COMMENT;
        }

        if (code.search(SWITCH_STATEMENT_REGEX) !== -1) {
          return PREREQ_CHECK_TYPE_WRONG_LANG_SWITCH;
        }

        if (code.search(ELSE_IF_STATEMENT_REGEX) !== -1) {
          return PREREQ_CHECK_TYPE_WRONG_LANG_ELSE_IF;
        }

        if (code.search(PUSH_METHOD_REGEX) !== -1) {
          return PREREQ_CHECK_TYPE_WRONG_LANG_PUSH;
        }

        if (code.search(CATCH_STATEMENT_REGEX) !== -1) {
          return PREREQ_CHECK_TYPE_WRONG_LANG_CATCH_STATE;
        }

        if (code.search(DO_WHILE_LOOP_REGEX) !== -1) {
          return PREREQ_CHECK_TYPE_WRONG_LANG_DO_WHILE;
        }

        if (code.search(C_IMPORT_SYNTAX_REGEX) !== -1) {
          return PREREQ_CHECK_TYPE_WRONG_LANG_C_IMPORT;
        }

        if (code.search(INVALID_AND_OPERATOR_REGEX) !== -1) {
          return PREREQ_CHECK_TYPE_WRONG_LANG_AND_OP;
        }

        if (code.search(INVALID_NOT_OPERATOR_REGEX) !== -1) {
          return PREREQ_CHECK_TYPE_WRONG_LANG_NOT_OP;
        }

        if (code.search(INVALID_OR_OPERATOR_REGEX) !== -1) {
          return PREREQ_CHECK_TYPE_WRONG_LANG_OR_OP;
        }
      }
      return '';
    };

    /**
     * Removes trailing white space that may be at the end of a string.
     *
     * @param {string} str
     * @returns {string}
     */
    var rightTrim = function(str) {
      var RIGHT_TRIM_PATTERN = /\s+$/;
      return str.replace(RIGHT_TRIM_PATTERN, '');
    };

    /**
     * Checks the code submission to ensure that there is no code declared in
     * the global scope outside of the given functions.
     *
     * @param {string} code
     * @returns {boolean}
     */
    var checkGlobalCallsPresent = function(code) {
      var codeLines = code.split('\n');
      for (var i = 0; i < codeLines.length; i++) {
        var line = rightTrim(codeLines[i]);
        var VALID_LINE_PATTERN = /(^\s+)|(^def)|(^import)/;
        if (line.search(VALID_LINE_PATTERN) === -1 && line !== '') {
          return true;
        }
      }
      return false;
    };

    /**
     * Returns an array with the signatures of the functions that are declared
     * on the global scope.
     *
     * @param {string} starterCode
     * @returns {Array}
     */
    var extractTopLevelFunctionLines = function(starterCode) {
      var starterCodeLines = starterCode.split('\n');
      var topLevelFunctionLines = [];
      for (var i = 0; i < starterCodeLines.length; i++) {
        var line = rightTrim(starterCodeLines[i]);
        if (line.startsWith('def ')) {
          topLevelFunctionLines.push(line);
        }
      }
      return topLevelFunctionLines;
    };

    /**
     * Checks if the code submission has any function signatures that are
     * different or missing from the expected function signatures.
     *
     * @param {string} code
     * @param {string} expectedTopLevelFunctionLines
     * @returns {boolean}
     */
    var doTopLevelFunctionLinesExist = function(
        code, expectedTopLevelFunctionLines) {
      var codeLines = code.split('\n');
      for (var i = 0; i < codeLines.length; i++) {
        codeLines[i] = rightTrim(codeLines[i]);
      }

      return expectedTopLevelFunctionLines.every(function(expectedLine) {
        return codeLines.indexOf(expectedLine) !== -1;
      });
    };

    /**
     * Checks if the code given at the beginning - before the user began making
     * changes - is still present and unaltered.
     *
     * @param {string} starterCode
     * @param {string} code
     * @returns {boolean}
     */
    var checkStarterCodeFunctionsPresent = function(starterCode, code) {
      var expectedTopLevelFunctionLines = extractTopLevelFunctionLines(
        starterCode);
      return doTopLevelFunctionLinesExist(code, expectedTopLevelFunctionLines);
    };

    /**
     * Returns an array of strings each containing the name of a library the
     * user tried to import in their code submission.
     *
     * @param {string} code
     * @returns {Array}
     */
    var getImportedLibraries = function(code) {
      var codeLines = code.split('\n');
      var importedLibraries = [];
      var importPattern = new RegExp('^import\\ (\\w+)$');
      for (var i = 0; i < codeLines.length; i++) {
        var match = importPattern.exec(codeLines[i]);
        if (match) {
          importedLibraries.push(match[1]);
        }
      }
      return importedLibraries;
    };

    /**
     * Returns an array of strings each containing the name of a library the
     * user tried to import in their submission but is not supported in the TIE
     * system.
     *
     * @param {Array} importedLibraries
     * @returns {Array}
     */
    var getUnsupportedImports = function(importedLibraries) {
      return importedLibraries.filter(function(library) {
        return SUPPORTED_PYTHON_LIBS.indexOf(library) === -1;
      });
    };

    return {
      /**
       * Checks if the code does not meet any prerequisite conditions and, if
       * so, returns the appropriate PythonPrereqCheckFailure object. Otherwise,
       * returns null if there are no failures.
       *
       * @param {string} starterCode
       * @param {string} code
       * @returns {PythonPrereqCheckFailure}
       */
      checkCode: function(starterCode, code) {
        // Check that starter code is present.
        if (!(checkStarterCodeFunctionsPresent(starterCode, code))) {
          return PrereqCheckFailureObjectFactory.create(
            PREREQ_CHECK_TYPE_MISSING_STARTER_CODE, null, starterCode);
        }

        if (checkGlobalCallsPresent(code)) {
          return PrereqCheckFailureObjectFactory.create(
            PREREQ_CHECK_TYPE_GLOBAL_CODE, null, starterCode);
        }

        // Verify no unsupported libraries are imported.
        var importedLibraries = getImportedLibraries(code);
        var unsupportedImports = getUnsupportedImports(importedLibraries);
        if (unsupportedImports.length > 0) {
          return PrereqCheckFailureObjectFactory.create(
            PREREQ_CHECK_TYPE_BAD_IMPORT, unsupportedImports, null);
        }

        var wrongLangType = getWrongLanguageType(code);
        if (wrongLangType !== '') {
          return PrereqCheckFailureObjectFactory.create(
              wrongLangType, null, null);
        }

        // Otherwise, code passed all pre-requisite checks.
        return null;
      },
      checkStarterCodeFunctionsPresent: checkStarterCodeFunctionsPresent,
      checkGlobalCallsPresent: checkGlobalCallsPresent,
      doTopLevelFunctionLinesExist: doTopLevelFunctionLinesExist,
      extractTopLevelFunctionLines: extractTopLevelFunctionLines,
      getImportedLibraries: getImportedLibraries,
      getUnsupportedImports: getUnsupportedImports,
      getWrongLanguageType: getWrongLanguageType
    };
  }
]);
