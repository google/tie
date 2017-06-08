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
  'PREREQ_CHECK_TYPE_GLOBAL_CODE',
  function(
      PrereqCheckFailureObjectFactory, PREREQ_CHECK_TYPE_BAD_IMPORT,
      PREREQ_CHECK_TYPE_MISSING_STARTER_CODE, SUPPORTED_PYTHON_LIBS,
      PREREQ_CHECK_TYPE_GLOBAL_CODE) {

    var rightTrim = function(str) {
      // Remove trailing white space at end of string.
      var RIGHT_TRIM_PATTERN = /\s+$/;
      return str.replace(RIGHT_TRIM_PATTERN, '');
    };

    var checkGlobalCallsPresent = function(code) {
      var codeLines = code.split('\n');
      for (var i = 0; i < codeLines.length; i++) {
        var line = rightTrim(codeLines[i]);
        var pattern = /(^\s\s+)|((^\s\s\s\s)+)|(^def)|(^import)/;
        if (line.search(pattern) === -1 && line !== '') {
          return true;
        }
      }
      return false;
    };

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

    var checkStarterCodeFunctionsPresent = function(starterCode, code) {
      var expectedTopLevelFunctionLines = extractTopLevelFunctionLines(
        starterCode);
      return doTopLevelFunctionLinesExist(code, expectedTopLevelFunctionLines);
    };

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

    var getUnsupportedImports = function(importedLibraries) {
      return importedLibraries.filter(function(library) {
        return SUPPORTED_PYTHON_LIBS.indexOf(library) === -1;
      });
    };

    return {
      // Returns a PrereqCheckFailure object (or null if there are no failures).
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

        // Otherwise, code passed all pre-requisite checks.
        return null;
      },
      checkStarterCodeFunctionsPresent: checkStarterCodeFunctionsPresent,
      checkGlobalCallsPresent: checkGlobalCallsPresent,
      doTopLevelFunctionLinesExist: doTopLevelFunctionLinesExist,
      extractTopLevelFunctionLines: extractTopLevelFunctionLines,
      getImportedLibraries: getImportedLibraries,
      getUnsupportedImports: getUnsupportedImports
    };
  }
]);
