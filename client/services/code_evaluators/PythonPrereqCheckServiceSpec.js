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

  var PREREQ_CHECK_TYPE_WRONG_LANG_INCREMENT_OP;
  var PREREQ_CHECK_TYPE_WRONG_LANG_DECREMENT_OP;
  var PREREQ_CHECK_TYPE_WRONG_LANG_PUSH;
  var PREREQ_CHECK_TYPE_WRONG_LANG_CATCH_STATE;
  var PREREQ_CHECK_TYPE_WRONG_LANG_JAVA_COMMENT;
  var PREREQ_CHECK_TYPE_WRONG_LANG_DO_WHILE;
  var PREREQ_CHECK_TYPE_WRONG_LANG_ELSE_IF;
  var PREREQ_CHECK_TYPE_WRONG_LANG_SWITCH;
  var PREREQ_CHECK_TYPE_WRONG_LANG_C_IMPORT;
  var PREREQ_CHECK_TYPE_WRONG_LANG_NOT_OP;
  var PREREQ_CHECK_TYPE_WRONG_LANG_AND_OP;
  var PREREQ_CHECK_TYPE_WRONG_LANG_OR_OP;

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    PythonPrereqCheckService = $injector.get(
      'PythonPrereqCheckService');

    PREREQ_CHECK_TYPE_WRONG_LANG_INCREMENT_OP = $injector.get(
      'PREREQ_CHECK_TYPE_WRONG_LANG_INCREMENT_OP');
    PREREQ_CHECK_TYPE_WRONG_LANG_DECREMENT_OP = $injector.get(
      'PREREQ_CHECK_TYPE_WRONG_LANG_DECREMENT_OP');
    PREREQ_CHECK_TYPE_WRONG_LANG_PUSH = $injector.get(
      'PREREQ_CHECK_TYPE_WRONG_LANG_PUSH');
    PREREQ_CHECK_TYPE_WRONG_LANG_CATCH_STATE = $injector.get(
      'PREREQ_CHECK_TYPE_WRONG_LANG_CATCH_STATE');
    PREREQ_CHECK_TYPE_WRONG_LANG_JAVA_COMMENT = $injector.get(
      'PREREQ_CHECK_TYPE_WRONG_LANG_JAVA_COMMENT');
    PREREQ_CHECK_TYPE_WRONG_LANG_DO_WHILE = $injector.get(
      'PREREQ_CHECK_TYPE_WRONG_LANG_DO_WHILE');
    PREREQ_CHECK_TYPE_WRONG_LANG_ELSE_IF = $injector.get(
      'PREREQ_CHECK_TYPE_WRONG_LANG_ELSE_IF');
    PREREQ_CHECK_TYPE_WRONG_LANG_SWITCH = $injector.get(
      'PREREQ_CHECK_TYPE_WRONG_LANG_SWITCH');
    PREREQ_CHECK_TYPE_WRONG_LANG_C_IMPORT = $injector.get(
      'PREREQ_CHECK_TYPE_WRONG_LANG_C_IMPORT');
    PREREQ_CHECK_TYPE_WRONG_LANG_NOT_OP = $injector.get(
      'PREREQ_CHECK_TYPE_WRONG_LANG_NOT_OP');
    PREREQ_CHECK_TYPE_WRONG_LANG_OR_OP = $injector.get(
      'PREREQ_CHECK_TYPE_WRONG_LANG_OR_OP');
    PREREQ_CHECK_TYPE_WRONG_LANG_AND_OP = $injector.get(
      'PREREQ_CHECK_TYPE_WRONG_LANG_AND_OP');
  }));

  describe('checkStarterCodeFunctionsPresent', function() {
    var starterCode = [
      'def myFunction(arg):',
      '    return result',
      ''
    ].join('\n');

    it('detects that starter code top-level function lines exist', function() {
      var code = [
        'def myFunction(arg):',
        '    result = arg.rstrip()',
        '    return result',
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
        '    result = arg.rstrip()',
        '    return result',
        ''
      ].join('\n');
      var starterCodePresent =
        PythonPrereqCheckService.checkStarterCodeFunctionsPresent(
          starterCode, code);
      expect(starterCodePresent).toEqual(false);
    });

    it('detects deletion of starter code top-level function', function() {
      var code = [
        '    result = arg.rstrip()',
        '    return result',
        ''
      ].join('\n');
      var starterCodePresent =
        PythonPrereqCheckService.checkStarterCodeFunctionsPresent(
          starterCode, code);
      expect(starterCodePresent).toEqual(false);
    });
  });

  describe('checkGlobalCallsPresent', function() {
    it('correctly returns true if there is code in the global scope',
      function() {
        var code = [
          'def myFunction(arg):',
          '    return arg',
          'myFunction("arg")',
          ''
        ].join('\n');
        expect(PythonPrereqCheckService.checkGlobalCallsPresent(code))
          .toBe(true);
      }
     );
  });

  describe('extractTopLevelFunctionLines', function() {
    it('correctly returns lines with top level functions', function() {
      var starterCode = [
        'def myFunction(arg):',
        '    return result',
        'def yourFunction(arg):',
        '    return result',
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
        '    return result',
        'def yourFunction(arg):',
        '    return result',
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
        '    return result\n',
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
        '    return result',
        'def myFunction(arg):',
        '    return result',
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
        '    return arg',
        ''
      ].join('\n');
      var codeLibs = PythonPrereqCheckService.getImportedLibraries(code);
      expect(codeLibs).toEqual(['numpy', 'pandas']);
    });

    it('does not capture strings with \'import\' in text', function() {
      var code = [
        'def myFunction(arg):',
        '    result = str(arg) + \'import this\'',
        '    return result',
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
        '    return arg',
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
        '    return arg',
        ''
      ].join('\n');
      var codeLibs = PythonPrereqCheckService.getImportedLibraries(code);
      expect(PythonPrereqCheckService.getUnsupportedImports(codeLibs))
        .toEqual([]);
    }
  );

  describe('getWrongLanguageType', function() {
    it('correctly returns an empty string if there are no wrong language '
        + 'errors', function() {
      var code = [
        'def myFunction(arg):',
        '    return arg',
        ''
      ].join('\n');
      var prereqFailureType = PythonPrereqCheckService.getWrongLanguageType(
        code);
      expect(prereqFailureType).toEqual('');
    });

    it('correctly returns PREREQ_CHECK_TYPE_WRONG_LANG_INCREMENT_OP when '
        + 'the submission has `++` in it', function() {
      var code = [
        'def myFunction(arg):',
        '    return arg++',
        ''
      ].join('\n');
      var prereqFailureType = PythonPrereqCheckService.getWrongLanguageType(
        code);
      expect(prereqFailureType).toEqual(
        PREREQ_CHECK_TYPE_WRONG_LANG_INCREMENT_OP);
    });

    it('correctly returns PREREQ_CHECK_TYPE_WRONG_LANG_DECREMENT_OP when '
        + 'the submission has `--` in it', function() {
      var code = [
        'def myFunction(arg):',
        '    return arg--',
        ''
      ].join('\n');
      var prereqFailureType = PythonPrereqCheckService.getWrongLanguageType(
        code);
      expect(prereqFailureType).toEqual(
        PREREQ_CHECK_TYPE_WRONG_LANG_DECREMENT_OP);
    });

    it('correctly returns PREREQ_CHECK_TYPE_WRONG_LANG_JAVA_COMMENT when '
        + 'the submission uses Java\'s single line comment syntax', function() {
      var code = [
        'def myFunction(arg):',
        '    // Java comment',
        ''
      ].join('\n');
      var prereqFailureType = PythonPrereqCheckService.getWrongLanguageType(
        code);
      expect(prereqFailureType).toEqual(
        PREREQ_CHECK_TYPE_WRONG_LANG_JAVA_COMMENT);
    });

    it('correctly returns PREREQ_CHECK_TYPE_WRONG_LANG_JAVA_COMMENT when '
        + 'the submission uses Java\'s multi-line comment syntax', function() {
      var code = [
        'def myFunction(arg):',
        '    /*',
        '    Multiline comment',
        '    */',
        ''
      ].join('\n');
      var prereqFailureType = PythonPrereqCheckService.getWrongLanguageType(
        code);
      expect(prereqFailureType).toEqual(
        PREREQ_CHECK_TYPE_WRONG_LANG_JAVA_COMMENT);
    });

    it('correctly returns PREREQ_CHECK_TYPE_WRONG_LANG_SWITCH when the '
        + 'submission includes a switch statement', function() {
      var code = [
        'def myFunction(arg):',
        '    switch (arg):',
        '        case 2:',
        '            return arg',
        '    return arg',
        ''
      ].join('\n');
      var prereqFailureType = PythonPrereqCheckService.getWrongLanguageType(
        code);
      expect(prereqFailureType).toEqual(PREREQ_CHECK_TYPE_WRONG_LANG_SWITCH);
    });

    it('correctly returns PREREQ_CHECK_TYPE_WRONG_LANG_ELSE_IF when the '
        + 'submission includes an else if statement', function() {
      var code = [
        'def myFunction(arg):',
        '    if arg > 0',
        '        return arg',
        '    else if arg < 0:',
        '        return arg',
        ''
      ].join('\n');
      var prereqFailureType = PythonPrereqCheckService.getWrongLanguageType(
        code);
      expect(prereqFailureType).toEqual(PREREQ_CHECK_TYPE_WRONG_LANG_ELSE_IF);
    });

    it('correctly returns PREREQ_CHECK_TYPE_WRONG_LANG_PUSH when the '
        + 'submission includes using the push method', function() {
      var code = [
        'def myFunction(arg):',
        '    arg.push(10)',
        '    return arg',
        ''
      ].join('\n');
      var prereqFailureType = PythonPrereqCheckService.getWrongLanguageType(
        code);
      expect(prereqFailureType).toEqual(PREREQ_CHECK_TYPE_WRONG_LANG_PUSH);
    });

    it('correctly returns PREREQ_CHECK_TYPE_WRONG_LANG_CATCH_STATE when the '
        + 'submission includes a catch statement', function() {
      var code = [
        'def myFunction(arg):',
        '    try:',
        '        print(arg)',
        '    catch:',
        '        throw Error()',
        ''
      ].join('\n');
      var prereqFailureType = PythonPrereqCheckService.getWrongLanguageType(
        code);
      expect(prereqFailureType).toEqual(
        PREREQ_CHECK_TYPE_WRONG_LANG_CATCH_STATE);
    });

    it('correctly returns PREREQ_CHECK_TYPE_WRONG_LANG_DO_WHILE when the '
        + 'submission has a do-while loop', function() {
      var code = [
        'def myFunction(arg):',
        '    do:',
        '        print(arg)',
        '    while(true)',
        ''
      ].join('\n');
      var prereqFailureType = PythonPrereqCheckService.getWrongLanguageType(
        code);
      expect(prereqFailureType).toEqual(PREREQ_CHECK_TYPE_WRONG_LANG_DO_WHILE);
    });

    it('correctly returns PREREQ_CHECK_TYPE_WRONG_LANG_C_IMPORT when the '
        + 'submission uses a C-style import syntax', function() {
      var code = [
        '#include <pandas>',
        '',
        'def myFunction(arg):',
        '    return arg',
        ''
      ].join('\n');
      var prereqFailureType = PythonPrereqCheckService.getWrongLanguageType(
        code);
      expect(prereqFailureType).toEqual(PREREQ_CHECK_TYPE_WRONG_LANG_C_IMPORT);
    });

    it('correctly returns PREREQ_CHECK_TYPE_WRONG_LANG_AND_OP when the '
        + 'submission uses an invalid AND operator', function() {
      var code = [
        'def myFunction(arg):',
        '    if arg > 20 && arg < 25:',
        '        return arg',
        '    return arg',
        ''
      ].join('\n');
      var prereqFailureType = PythonPrereqCheckService.getWrongLanguageType(
        code);
      expect(prereqFailureType).toEqual(PREREQ_CHECK_TYPE_WRONG_LANG_AND_OP);
    });

    it('correctly returns PREREQ_CHECK_TYPE_WRONG_LANG_OR_OP when the '
        + 'submission uses an invalid OR operator', function() {
      var code = [
        'def myFunction(arg):',
        '    if arg > 20 || arg > 25:',
        '        return arg',
        '    return arg + 1',
        ''
      ].join('\n');
      var prereqFailureType = PythonPrereqCheckService.getWrongLanguageType(
        code);
      expect(prereqFailureType).toEqual(PREREQ_CHECK_TYPE_WRONG_LANG_OR_OP);
    });

    it('correctly returns PREREQ_CHECK_TYPE_WRONG_LANG_NOT_OP when the '
        + 'submission uses an invalid NOT operator', function() {
      var code = [
        'def myFunction(arg):',
        '    if !arg:',
        '        return arg',
        ''
      ].join('\n');
      var prereqFailureType = PythonPrereqCheckService.getWrongLanguageType(
        code);
      expect(prereqFailureType).toEqual(PREREQ_CHECK_TYPE_WRONG_LANG_NOT_OP);
    });
  });

  describe('checkCode', function() {
    it(['returns the correct PrereqCheckFailureObject when starter code is ',
      'missing'].join(''), function() {
      var starterCode = [
        'def myFunction(arg):',
        '    return arg',
        ''
      ].join('\n');
      var prereqCheckFailure = PythonPrereqCheckService.checkCode(
        starterCode, '');
      expect(prereqCheckFailure.isMissingStarterCode()).toEqual(true);
    });

    it(['returns the correct PrereqCheckFailureObject when there is code in ' +
      'the global scope'].join(''), function() {
      var starterCode = [
        'def myFunction(arg):',
        '    return arg',
        ''
      ].join('\n');
      var code = [
        'def myFunction(arg):',
        '    return arg',
        'myFunction("arg")',
        ''
      ].join('\n');

      var prereqCheckFailure = PythonPrereqCheckService.checkCode(
        starterCode, code);
      expect(prereqCheckFailure.hasGlobalCode()).toEqual(true);
    });

    it(['does not return a PrereqCheckFailure Object if the user ' +
      'uses two-space tabs instead of 4'].join(''), function() {
      var starterCode = [
        'def myFunction(arg):',
        '    return arg',
        ''
      ].join('\n');
      var code = [
        'def myFunction(arg):',
        '  return arg',
        ''
      ].join('\n');

      var prereqCheckFailure = PythonPrereqCheckService.checkCode(
        starterCode, code);
      expect(prereqCheckFailure).toBe(null);
    });

    it(['returns the correct PrereqCheckFailureObject when starter code method',
      ' name is incorrect but the arguments are correct'].join(''),
        function() {
          var starterCode = [
            'def myFunction(arg):',
            '    return arg',
            ''
          ].join('\n');
          var code = [
            'def myFx(arg):',
            '    return arg',
            ''
          ].join('\n');

          var prereqCheckFailure = PythonPrereqCheckService.checkCode(
            starterCode, code);
          expect(prereqCheckFailure.isMissingStarterCode()).toEqual(true);
        }
    );

    it(['returns the correct PrereqCheckFailureObject when there is a ',
      'wrong language error'].join(''), function() {
      var starterCode = [
        'def myFunction(arg):',
        '    return arg',
        ''
      ].join('\n');
      var code = [
        'def myFunction(arg):',
        '    return arg ++',
        ''
      ].join('\n');

      var prereqCheckFailure = PythonPrereqCheckService.checkCode(
        starterCode, code);
      expect(prereqCheckFailure.usesWrongLangIncrementOp()).toEqual(true);
    });
    
    it(['returns the correct PrereqCheckFailureObject when starter code method',
      ' name is correct but arguments are incorrect'].join(''),
        function() {
          var starterCode = [
            'def myFunction(arg):',
            '    return arg',
            ''
          ].join('\n');

          var code = [
            'def myFunction(arg, wrong_arg):',
            '    return arg',
            ''
          ].join('\n');

          var prereqCheckFailure = PythonPrereqCheckService.checkCode(
            starterCode, code);
          expect(prereqCheckFailure.isMissingStarterCode()).toEqual(true);
        }
    );

    it(['returns the correct PrereqCheckFailureObject when unsupported',
      ' libraries are imported'].join(''), function() {
      var userCode = [
        'import math',
        'import random',
        'import pandas',
        '',
        'def myFunction(arg):',
        '    return arg',
        ''
      ].join('\n');

      var starterCode = [
        'def myFunction(arg):',
        '    return arg',
        ''
      ].join('\n');

      var prereqCheckFailure = PythonPrereqCheckService.checkCode(
        starterCode, userCode);

      expect(prereqCheckFailure.isBadImport()).toEqual(true);
      expect(prereqCheckFailure.getType()).toEqual('badImport');
      expect(prereqCheckFailure.getBadImports()).toEqual(['pandas']);
      expect(prereqCheckFailure.getStarterCode()).toEqual(null);
    });
  });
});
