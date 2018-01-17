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
  'PREREQ_CHECK_TYPE_GLOBAL_CODE', 'PREREQ_CHECK_TYPE_WRONG_LANG',
  'WRONG_LANGUAGE_ERRORS', 'PREREQ_CHECK_TYPE_INVALID_SYSTEM_CALL',
  'PREREQ_CHECK_TYPE_INVALID_AUXILIARYCODE_CALL',
  'PREREQ_CHECK_TYPE_INVALID_STUDENTCODE_CALL', 'CLASS_NAME_AUXILIARY_CODE',
  'CLASS_NAME_SYSTEM_CODE', 'CLASS_NAME_STUDENT_CODE',
  function(
      PrereqCheckFailureObjectFactory, PREREQ_CHECK_TYPE_BAD_IMPORT,
      PREREQ_CHECK_TYPE_MISSING_STARTER_CODE, SUPPORTED_PYTHON_LIBS,
      PREREQ_CHECK_TYPE_GLOBAL_CODE, PREREQ_CHECK_TYPE_WRONG_LANG,
      WRONG_LANGUAGE_ERRORS, PREREQ_CHECK_TYPE_INVALID_SYSTEM_CALL,
      PREREQ_CHECK_TYPE_INVALID_AUXILIARYCODE_CALL,
      PREREQ_CHECK_TYPE_INVALID_STUDENTCODE_CALL, CLASS_NAME_AUXILIARY_CODE,
      CLASS_NAME_SYSTEM_CODE, CLASS_NAME_STUDENT_CODE) {

    /**
     * Returns a list of lines in the code that do not contain strings, in
     * order to prevent spurious false positives in code-analysis checks.
     *
     * NOTE TO DEVELOPERS: This check assumes that the code does not contain
     * any multi-line strings ("""....""").
     * TODO(sll): Handle the case of multi-line strings.
     *
     * @param {string} language The language in which the code is written.
     * @param {string} code The code to analyze.
     * @returns {Array} A list of lines of the original code. Lines
     *   containing strings are omitted.
     */
    var getNonStringLines = function(code) {
      return code.split('\n').filter(function(codeLine) {
        return (codeLine.indexOf('"') === -1 && codeLine.indexOf("'") === -1);
      });
    };

    /**
     * Checks if the given code uses any syntax that isn't valid in Python
     * but is specific to languages like C/C++ and Java.
     *
     * @param {string} code
     * @returns {string | null} If there is wrong language syntax detected,
     *    will return the name of the error as referenced in
     *    WRONG_LANGUAGE_ERRORS.
     */
    var detectAndGetWrongLanguageType = function(code) {
      var codeLines = getNonStringLines(code);

      for (var i = 0; i < WRONG_LANGUAGE_ERRORS.python.length; i++) {
        var error = WRONG_LANGUAGE_ERRORS.python[i];
        var regexp = new RegExp(error.regExString);

        if (error.allowMultiline) {
          if (code.search(regexp) !== -1) {
            return error.errorName;
          }
        } else {
          for (var j = 0; j < codeLines.length; j++) {
            if (codeLines[j].search(regexp) !== -1) {
              return error.errorName;
            }
          }
        }
      }
      return null;
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
        if (line.search(VALID_LINE_PATTERN) === -1 && line !== '' &&
            !line.startsWith('#')) {
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

    /**
     * Returns whether the user tries to call the System class or its methods
     * in the given code.
     *
     * @param {string} code
     * @returns {boolean}
     */
    var hasInvalidSystemClassCalls = function(code) {
      var systemClassRegEx = new RegExp('\\b' + CLASS_NAME_SYSTEM_CODE + '\\b');

      return (systemClassRegEx.exec(code) !== null);
    };

    /**
     * Returns whether the user tries to call the AuxiliaryCode class or its
     * methods in the given code.
     *
     * @param {string} code
     * @returns {boolean}
     */
    var hasInvalidAuxiliaryClassCalls = function(code) {
      var auxiliaryClassRegEx = new RegExp('\\b' + CLASS_NAME_AUXILIARY_CODE +
        '\\b');

      return (auxiliaryClassRegEx.exec(code) !== null);
    };

    /**
     * Returns whether the user tries to call the StudentCode class or its
     * methods in the given code.
     *
     * @param {string} code
     * @returns {boolean}
     */
    var hasInvalidStudentClassCalls = function(code) {
      var studentClassRegEx = new RegExp('\\b' + CLASS_NAME_STUDENT_CODE +
        '\\b');

      return (studentClassRegEx.exec(code) !== null);
    };

    return {
      /**
       * Checks if the code does not meet any prerequisite conditions and, if
       * so, returns the appropriate PythonPrereqCheckFailure object. Otherwise,
       * returns null if there are no failures.
       *
       * @param {string} starterCode
       * @param {string} code
       * @returns {PrereqCheckFailure}
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

        if (hasInvalidSystemClassCalls(code)) {
          return PrereqCheckFailureObjectFactory.create(
            PREREQ_CHECK_TYPE_INVALID_SYSTEM_CALL, null, null);
        }

        if (hasInvalidAuxiliaryClassCalls(code)) {
          return PrereqCheckFailureObjectFactory.create(
            PREREQ_CHECK_TYPE_INVALID_AUXILIARYCODE_CALL, null, null);
        }

        if (hasInvalidStudentClassCalls(code)) {
          return PrereqCheckFailureObjectFactory.create(
            PREREQ_CHECK_TYPE_INVALID_STUDENTCODE_CALL, null, null);
        }

        // Verify no unsupported libraries are imported.
        var importedLibraries = getImportedLibraries(code);
        var unsupportedImports = getUnsupportedImports(importedLibraries);
        if (unsupportedImports.length > 0) {
          return PrereqCheckFailureObjectFactory.create(
            PREREQ_CHECK_TYPE_BAD_IMPORT, unsupportedImports, null);
        }

        var wrongLangErrorName = detectAndGetWrongLanguageType(code);
        if (wrongLangErrorName !== null) {
          return PrereqCheckFailureObjectFactory.create(
              PREREQ_CHECK_TYPE_WRONG_LANG, null, null, wrongLangErrorName);
        }

        // Otherwise, code passed all pre-requisite checks.
        return null;
      },
      checkStarterCodeFunctionsPresent: checkStarterCodeFunctionsPresent,
      checkGlobalCallsPresent: checkGlobalCallsPresent,
      detectAndGetWrongLanguageType: detectAndGetWrongLanguageType,
      doTopLevelFunctionLinesExist: doTopLevelFunctionLinesExist,
      extractTopLevelFunctionLines: extractTopLevelFunctionLines,
      getImportedLibraries: getImportedLibraries,
      getNonStringLines: getNonStringLines,
      getUnsupportedImports: getUnsupportedImports,
      hasInvalidAuxiliaryClassCalls: hasInvalidAuxiliaryClassCalls,
      hasInvalidStudentClassCalls: hasInvalidStudentClassCalls,
      hasInvalidSystemClassCalls: hasInvalidSystemClassCalls
    };
  }
]);
