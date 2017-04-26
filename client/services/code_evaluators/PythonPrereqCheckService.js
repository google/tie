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
  'CodePrereqCheckResultObjectFactory',
  'PREREQ_CHECK_TYPE_BAD_IMPORT', 'PREREQ_CHECK_TYPE_MISSING_STARTER_CODE',
  'PYTHON_STANDARD_LIBRARIES',
  function(
      CodePrereqCheckResultObjectFactory,
      PREREQ_CHECK_TYPE_BAD_IMPORT, PREREQ_CHECK_TYPE_MISSING_STARTER_CODE,
      PYTHON_STANDARD_LIBRARIES) {

    var extractTopLevelFunctions = function(starterCode) {
      var starterCodeLines = starterCode.split('\n');
      var topLevelFunctions = [];
      for (var i = 0; i < starterCodeLines.length; i++) {
        var line = starterCodeLines[i].trim();
        if (line.startsWith("def ")) {
          topLevelFunctions.push(line);
        }
      }
      return topLevelFunctions;
    };

    var verifyTopLevelFunctionsExist = function(
      code, expectedTopLevelFunctions) {
      var codeLines = code.split('\n');
      for (var i = 0; i < codeLines.length; i++) {
        codeLines[i] = codeLines[i].trim();
      }
      for (var i = 0; i < expectedTopLevelFunctions.length; i++) {;
        if (codeLines.indexOf(expectedTopLevelFunctions[i]) === -1) {
          return false;
        }
      }
      return true;
    };

    var checkStarterCodePresent = function(starterCode, code) {
      var expectedTopLevelFunctions = extractTopLevelFunctions(starterCode);
      return verifyTopLevelFunctionsExist(code, expectedTopLevelFunctions);
    };

    var getImportedLibraries = function(code) {
      var codeLines = code.split('\n');
      var importedLibraries = [];
      var importPattern = new RegExp('(^import\\ )(\\w+)($)');
      for (var i = 0; i < codeLines.length; i++) {
        var match =  importPattern.exec(codeLines[i]);
        if (match) {
          importedLibraries.push(match[2]);
        }
      }
      return importedLibraries;
    };

    var getUnsupportedImports = function(importedLibraries) {
      var unsupportedImports = importedLibraries.filter(function(
        importedLibrary) {
        return PYTHON_STANDARD_LIBRARIES.indexOf(importedLibrary) === -1;
        }
      );
      return unsupportedImports;
    };

    return {
      // Returns a promise.
      checkCode: function(starterCode, code) {
        // check that starter code is present
        if (!(checkStarterCodePresent(starterCode, code))) {
          var prereqCheckFailures = [{'type':
            PREREQ_CHECK_TYPE_MISSING_STARTER_CODE,
            'starterCode': starterCode}];
          return Promise.resolve(
            CodePrereqCheckResultObjectFactory.create(
              prereqCheckFailures));
        }

        // verify no unsupported libraries are imported
        var importedLibraries = getImportedLibraries(code);
        var unsupportedImports = getUnsupportedImports(importedLibraries);
        if (unsupportedImports.length > 0) {
          var prereqCheckFailures = [{'type':
            PREREQ_CHECK_TYPE_BAD_IMPORT,
            'badImports': unsupportedImports}];
            return Promise.resolve(
              CodePrereqCheckResultObjectFactory.create(
                prereqCheckFailures));
        }

        // Otherwise, code passed all pre-requisite checks
        return Promise.resolve(
          CodePrereqCheckResultObjectFactory.create(
          []));
      },
      checkStarterCodePresent: checkStarterCodePresent,
      extractTopLevelFunctions: extractTopLevelFunctions,
      getImportedLibraries: getImportedLibraries,
      getUnsupportedImports: getUnsupportedImports,
      verifyTopLevelFunctionsExist: verifyTopLevelFunctionsExist
    };
  }
]);
