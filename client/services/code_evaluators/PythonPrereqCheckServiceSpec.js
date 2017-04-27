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
    var starterCode = ['def myFunction(arg):\n',
      '\treturn result\n'].join('');

    it('returns true if starter code top level function lines are present',
      function() {
        var starterCode = ['def myFunction(arg):\n',
        '\treturn result\n'].join('');
        var code = ['def myFunction(arg):\n',
        '\tresult = arg.rstrip()\n',
        '\treturn result\n'].join('');
        var starterCodePresent =
          PythonPrereqCheckService.checkStarterCodeFunctionsPresent(
            starterCode, code);
        expect(starterCodePresent).toEqual(true);
    });
    it(['returns false if starter code top level function line ',
      'is not found (modified)'].join(),
        function() {
          var code = ['def yourFunction(arg):\n',
          '\tresult = arg.rstrip()\n',
          '\treturn result\n'].join('');
          var starterCodePresent =
            PythonPrereqCheckService.checkStarterCodeFunctionsPresent(
              starterCode, code);
          expect(starterCodePresent).toEqual(false);
    });
    it(['returns false if starter code top level function line ',
      'is not found (deleted)'].join(),
        function() {
          var code = ['\tresult = arg.rstrip()\n',
          '\treturn result\n'].join('');
          var starterCodePresent =
            PythonPrereqCheckService.checkStarterCodeFunctionsPresent(
              starterCode, code);
          expect(starterCodePresent).toEqual(false);
    });
  });
  describe('extractTopLevelFunctionLines', function() {
    it('correctly returns lines with top level functions',
      function() {
        var starterCode = ['def myFunction(arg):\n',
        '\treturn result\n',
        'def yourFunction(arg):\n',
        '\treturn result\n'].join('');
        var extractedTopLevelFunctionLines =
          PythonPrereqCheckService.extractTopLevelFunctionLines(starterCode);
        expect(extractedTopLevelFunctionLines).toEqual(
          ['def myFunction(arg):', 'def yourFunction(arg):']);
    });
  });
  describe('doTopLevelFunctionLinesExist', function() {
    it('returns true when top level function lines exist',
      function() {
        var code = ['def myFunction(arg):\n',
        '\treturn result\n',
        'def yourFunction(arg):\n',
        '\treturn result\n'].join('');
        var functions = ['def myFunction(arg):', 'def yourFunction(arg):'];
        var topLevelFunctionLinesExist =
          PythonPrereqCheckService.doTopLevelFunctionLinesExist(
            code, functions);
        expect(topLevelFunctionLinesExist).toEqual(true);
    });
    it('returns false when a top level function line does not exist',
      function() {
        var code = ['def myFunction(arg):\n',
        '\treturn result\n'].join('');
        var functions = ['def myFunction(arg):', 'def yourFunction(arg):'];
        var topLevelFunctionLinesExist =
          PythonPrereqCheckService.doTopLevelFunctionLinesExist(
            code, functions);
        expect(topLevelFunctionLinesExist).toEqual(false);
    });
    it(['returns true when top level function lines exist and are',
      'out of order'].join(),
        function() {
          var code = ['def yourFunction(arg):\n',
          '\treturn result\n',
          'def myFunction(arg):\n',
          '\treturn result\n'].join('');
          var functions = ['def myFunction(arg):', 'def yourFunction(arg):'];
          var topLevelFunctionLinesExist =
          PythonPrereqCheckService.doTopLevelFunctionLinesExist(
            code, functions);
          expect(topLevelFunctionLinesExist).toEqual(true);
    });
  });
  describe('getImportedLibraries', function() {
    it('correctly parses import statements', function() {
      var code = ['import numpy\n',
        'import pandas\n', '\n',
        'def myFunction(arg): \n',
        '\treturn arg'].join('');
      var codeLibs =
        PythonPrereqCheckService.getImportedLibraries(code);
      expect(codeLibs).toEqual(['numpy','pandas']);
    });
    it('does not capture strings with \'import\' in text', function() {
      var code = ['def myFunction(arg): \n',
        '\tresult = str(arg) + \'import this\'',
        '\treturn result'].join('');
      var codeLibs =
        PythonPrereqCheckService.getImportedLibraries(code);
      expect(codeLibs).toEqual([]);
    });
  });
});
