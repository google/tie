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
 * @fileoverview Unit tests for the PythonPrereqCheckService.
 */

describe('PythonPrereqCheckService', function() {
  var PythonPrereqCheckService;

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    PythonPrereqCheckService = $injector.get(
      'PythonPrereqCheckService');
  }));

  describe('checkStarterCodeFunctionsPresent', function() {
    var starterCode = [
      'def myFunction(arg):',
      '\treturn result',
      ''
    ].join('\n');

    it('detects that starter code top-level function lines exist', function() {
      var code = [
        'def myFunction(arg):',
        '\tresult = arg.rstrip()',
        '\treturn result',
        ''
      ].join('\n');
      var starterCodePresent =
        PythonPrereqCheckService.checkStarterCodeFunctionsPresent(
          starterCode, code);
      expect(starterCodePresent).toEqual(true);
    });

    it('detects modification of starter code top-level function', function() {
      var code = [
        'def yourFunction(arg):',
        '\tresult = arg.rstrip()',
        '\treturn result',
        ''
      ].join('\n');
      var starterCodePresent =
        PythonPrereqCheckService.checkStarterCodeFunctionsPresent(
          starterCode, code);
      expect(starterCodePresent).toEqual(false);
    });

    it('detects deletion of starter code top-level function', function() {
      var code = [
        '\tresult = arg.rstrip()',
        '\treturn result',
        ''
      ].join('\n');
      var starterCodePresent =
        PythonPrereqCheckService.checkStarterCodeFunctionsPresent(
          starterCode, code);
      expect(starterCodePresent).toEqual(false);
    });
  });

  describe('extractTopLevelFunctionLines', function() {
    it('correctly returns lines with top level functions', function() {
      var starterCode = [
        'def myFunction(arg):',
        '\treturn result',
        'def yourFunction(arg):',
        '\treturn result',
        ''
      ].join('\n');
      var extractedTopLevelFunctionLines =
        PythonPrereqCheckService.extractTopLevelFunctionLines(starterCode);
      expect(extractedTopLevelFunctionLines).toEqual(
        ['def myFunction(arg):', 'def yourFunction(arg):']);
    });
  });

  describe('doTopLevelFunctionLinesExist', function() {
    it('returns true when top level function lines exist', function() {
      var code = [
        'def myFunction(arg):',
        '\treturn result',
        'def yourFunction(arg):',
        '\treturn result',
        ''
      ].join('\n');
      var functions = ['def myFunction(arg):', 'def yourFunction(arg):'];
      var topLevelFunctionLinesExist =
        PythonPrereqCheckService.doTopLevelFunctionLinesExist(
          code, functions);
      expect(topLevelFunctionLinesExist).toEqual(true);
    });

    it('returns false when a top level function line is absent', function() {
      var code = [
        'def myFunction(arg):\n',
        '\treturn result\n',
        ''
      ].join('\n');
      var functions = ['def myFunction(arg):', 'def yourFunction(arg):'];
      var topLevelFunctionLinesExist =
        PythonPrereqCheckService.doTopLevelFunctionLinesExist(
          code, functions);
      expect(topLevelFunctionLinesExist).toEqual(false);
    });

    it('returns true if top level function lines are out of order', function() {
      var code = [
        'def yourFunction(arg):',
        '\treturn result',
        'def myFunction(arg):',
        '\treturn result',
        ''
      ].join('\n');
      var functions = ['def myFunction(arg):', 'def yourFunction(arg):'];
      var topLevelFunctionLinesExist =
      PythonPrereqCheckService.doTopLevelFunctionLinesExist(code, functions);
      expect(topLevelFunctionLinesExist).toEqual(true);
    });
  });

  describe('getImportedLibraries', function() {
    it('correctly parses import statements', function() {
      var code = [
        'import numpy',
        'import pandas',
        '',
        'def myFunction(arg):',
        '\treturn arg',
        ''
      ].join('\n');
      var codeLibs = PythonPrereqCheckService.getImportedLibraries(code);
      expect(codeLibs).toEqual(['numpy', 'pandas']);
    });

    it('does not capture strings with \'import\' in text', function() {
      var code = [
        'def myFunction(arg):',
        '\tresult = str(arg) + \'import this\'',
        '\treturn result',
        ''
      ].join('\n');
      var codeLibs = PythonPrereqCheckService.getImportedLibraries(code);
      expect(codeLibs).toEqual([]);
    });
  });

  describe('getUnsupportedImports', function() {
    it('correctly returns a list of the unsupported imports', function() {
      var code = [
        'import numpy',
        'import pandas',
        'import math',
        '',
        'def myFunction(arg):',
        '\treturn arg',
        ''
      ].join('\n');
      var codeLibs = PythonPrereqCheckService.getImportedLibraries(code);
      expect(PythonPrereqCheckService.getUnsupportedImports(codeLibs)).toEqual([
        'numpy', 'pandas']);
    });
  });

  it('correctly returns an empty list if all imports are supported',
    function() {
      var code = [
        'import math',
        'import random',
        'import operator',
        '',
        'def myFunction(arg):',
        '\treturn arg',
        ''
      ].join('\n');
      var codeLibs = PythonPrereqCheckService.getImportedLibraries(code);
      expect(PythonPrereqCheckService.getUnsupportedImports(codeLibs))
        .toEqual([]);
    }
  );
});
