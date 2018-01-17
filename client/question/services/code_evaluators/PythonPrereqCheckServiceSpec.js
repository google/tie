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
    it('correctly returns false if there is a comment in the global scope',
      function() {
        var code = [
          'def myFunction(arg):',
          '    return arg',
          '# still need to call myFunction("arg")',
          ''
        ].join('\n');
        expect(PythonPrereqCheckService.checkGlobalCallsPresent(code))
          .toBe(false);
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

  describe('getNonStringLines', function() {
    it('omits lines with string constants', function() {
      var code = [
        'def myFunction(arg):',
        '    b = "hello"',
        '    c = \'hi\'',
        '    return arg',
        ''
      ].join('\n');
      var codeLines = PythonPrereqCheckService.getNonStringLines(code);
      expect(codeLines).toEqual(['def myFunction(arg):', '    return arg', '']);
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

  describe('detectAndGetWrongLangType', function() {
    it('correctly returns null if there are no wrong language errors',
      function() {
        var code = [
          'def myFunction(arg):',
          '    return arg',
          ''
        ].join('\n');
        var prereqFailureType =
          PythonPrereqCheckService.detectAndGetWrongLanguageType(code);
        expect(prereqFailureType).toBeNull();
      }
    );

    it('correctly returns "incrementOp" when the submission has `++` ' +
      'in it', function() {
      var code = [
        'def myFunction(arg):',
        '    return arg++',
        ''
      ].join('\n');
      var prereqFailureType =
        PythonPrereqCheckService.detectAndGetWrongLanguageType(code);
      expect(prereqFailureType).toEqual(
        "incrementOp");
    });

    it('correctly returns "decrementOp" when ' +
      'the submission has `--` in it', function() {
      var code = [
        'def myFunction(arg):',
        '    return arg--',
        ''
      ].join('\n');
      var prereqFailureType =
        PythonPrereqCheckService.detectAndGetWrongLanguageType(code);
      expect(prereqFailureType).toEqual(
        "decrementOp");
    });

    it('correctly returns "javaComment" when ' +
        'the submission uses Java\'s single line comment syntax', function() {
      var code = [
        'def myFunction(arg):',
        '    // Java comment',
        ''
      ].join('\n');
      var prereqFailureType =
        PythonPrereqCheckService.detectAndGetWrongLanguageType(code);
      expect(prereqFailureType).toEqual('javaComment');
    });

    it('correctly returns "javaComment" when ' +
        'the submission uses Java\'s multi-line comment syntax', function() {
      var code = [
        'def myFunction(arg):',
        '    /*',
        '    Multiline comment',
        '    */',
        ''
      ].join('\n');
      var prereqFailureType =
        PythonPrereqCheckService.detectAndGetWrongLanguageType(code);
      expect(prereqFailureType).toEqual('javaComment');
    });

    it('correctly returns "switch" when the ' +
        'submission includes a switch statement', function() {
      var code = [
        'def myFunction(arg):',
        '    switch (arg):',
        '        case 2:',
        '            return arg',
        '    return arg',
        ''
      ].join('\n');
      var prereqFailureType =
        PythonPrereqCheckService.detectAndGetWrongLanguageType(code);
      expect(prereqFailureType).toEqual('switch');
    });

    it('correctly returns "elseIf" when the ' +
      'submission includes an else if statement', function() {
      var code = [
        'def myFunction(arg):',
        '    if arg > 0',
        '        return arg',
        '    else if arg < 0:',
        '        return arg',
        ''
      ].join('\n');
      var prereqFailureType =
        PythonPrereqCheckService.detectAndGetWrongLanguageType(code);
      expect(prereqFailureType).toEqual('elseIf');
    });

    it('correctly returns "booleans" when the ' +
      'submission includes a wrongly-cased true/false value', function() {
      var code = [
        'def myFunction(arg):',
        '    if arg > 0',
        '        return true',
        ''
      ].join('\n');
      expect(
        PythonPrereqCheckService.detectAndGetWrongLanguageType(code)
      ).toEqual('booleans');

      code = [
        'def myFunction(arg):',
        '    if arg > 0',
        '        return TRUE',
        ''
      ].join('\n');
      expect(
        PythonPrereqCheckService.detectAndGetWrongLanguageType(code)
      ).toEqual('booleans');

      code = [
        'def myFunction(arg):',
        '    if arg > 0',
        '        return false',
        ''
      ].join('\n');
      expect(
        PythonPrereqCheckService.detectAndGetWrongLanguageType(code)
      ).toEqual('booleans');

      code = [
        'def myFunction(arg):',
        '    if arg > 0',
        '        return FALSE',
        ''
      ].join('\n');
      expect(
        PythonPrereqCheckService.detectAndGetWrongLanguageType(code)
      ).toEqual('booleans');

      code = [
        'def myFunction(arg):',
        '    if arg > 0',
        '        return True and False',
        ''
      ].join('\n');
      expect(
        PythonPrereqCheckService.detectAndGetWrongLanguageType(code)
      ).toEqual(null);
    });

    it('correctly returns "push" when the ' +
        'submission includes using the push method', function() {
      var code = [
        'def myFunction(arg):',
        '    arg.push(10)',
        '    return arg',
        ''
      ].join('\n');
      var prereqFailureType =
        PythonPrereqCheckService.detectAndGetWrongLanguageType(code);
      expect(prereqFailureType).toEqual('push');
    });

    it('correctly returns "catch" when the ' +
        'submission includes a catch statement', function() {
      var code = [
        'def myFunction(arg):',
        '    try:',
        '        print(arg)',
        '    catch:',
        '        throw Error()',
        ''
      ].join('\n');
      var prereqFailureType =
        PythonPrereqCheckService.detectAndGetWrongLanguageType(code);
      expect(prereqFailureType).toEqual('catch');
    });

    it('correctly returns "doWhile" when the ' +
        'submission has a do-while loop', function() {
      var code = [
        'def myFunction(arg):',
        '    do:',
        '        print(arg)',
        '    while(true)',
        ''
      ].join('\n');
      var prereqFailureType =
        PythonPrereqCheckService.detectAndGetWrongLanguageType(code);
      expect(prereqFailureType).toEqual('doWhile');
    });

    it('correctly returns "cImport" when the ' +
        'submission uses a C-style import syntax', function() {
      var code = [
        '#include <pandas>',
        '',
        'def myFunction(arg):',
        '    return arg',
        ''
      ].join('\n');
      var prereqFailureType =
        PythonPrereqCheckService.detectAndGetWrongLanguageType(code);
      expect(prereqFailureType).toEqual('cImport');
    });

    it('correctly returns "andOp" when the ' +
        'submission uses an invalid AND operator', function() {
      var code = [
        'def myFunction(arg):',
        '    if arg > 20 && arg < 25:',
        '        return arg',
        '    return arg',
        ''
      ].join('\n');
      var prereqFailureType =
        PythonPrereqCheckService.detectAndGetWrongLanguageType(code);
      expect(prereqFailureType).toEqual('andOp');
    });

    it('correctly returns "orOp" when the ' +
        'submission uses an invalid OR operator', function() {
      var code = [
        'def myFunction(arg):',
        '    if arg > 20 || arg > 25:',
        '        return arg',
        '    return arg + 1',
        ''
      ].join('\n');
      var prereqFailureType =
        PythonPrereqCheckService.detectAndGetWrongLanguageType(code);
      expect(prereqFailureType).toEqual('orOp');
    });

    it('correctly returns "notOp" when the ' +
        'submission uses an invalid NOT operator', function() {
      var code = [
        'def myFunction(arg):',
        '    if !arg:',
        '        return arg',
        ''
      ].join('\n');
      var prereqFailureType =
        PythonPrereqCheckService.detectAndGetWrongLanguageType(code);
      expect(prereqFailureType).toEqual('notOp');
    });

    it('ignores lines with strings for non-multiline checks', function() {
      // This tests one "if" clause that does not have an error, and another
      // "if" clause that does have a legitimate error. In both cases, these
      // are left as-is.
      var code = [
        'def myFunction(arg):',
        '    if "!arg":',
        '        return arg',
        '',
        '    if (!arg + "abc"):',
        '        return arg',
        ''
      ].join('\n');
      var prereqFailureType =
        PythonPrereqCheckService.detectAndGetWrongLanguageType(code);
      expect(prereqFailureType).toEqual(null);
    });
  });

  describe('hasInvalidSystemClassCalls', function() {
    it('returns true when the user tries to use the System class\'s methods',
      function() {
        var code = [
          'def myFunction(arg):',
          '    return System.runTest(StudentCode, myFunction, 0)'
        ].join('\n');
        expect(PythonPrereqCheckService.hasInvalidSystemClassCalls(code))
            .toBe(true);
      }
    );

    it('returns false when the user doesn\'t use a System class or method,',
      function() {
        var code = [
          'def myFunction(arg)',
          '    return arg'
        ].join('\n');
        expect(PythonPrereqCheckService.hasInvalidSystemClassCalls(code))
            .toBe(false);
      }
    );
  });

  describe('hasInvalidAuxiliaryClassCalls', function() {
    it('returns true when the user tries to use AuxiliaryCode class or methods',
      function() {
        var code = [
          'def myFunction(arg):',
          '    return AuxiliaryCode.matchParentheses(arg)'
        ].join('\n');
        expect(PythonPrereqCheckService.hasInvalidAuxiliaryClassCalls(code))
          .toBe(true);
      }
    );

    it('returns false when there are no AuxiliaryCode calls',
      function() {
        var code = [
          'def myFunction(arg)',
          '    return arg'
        ].join('\n');
        expect(PythonPrereqCheckService.hasInvalidAuxiliaryClassCalls(code))
          .toBe(false);
      }
    );
  });

  describe('hasInvalidStudentClassCalls', function() {
    it('returns true when the user tries to use StudentCode class or methods',
      function() {
        var code = [
          'def myFunction(arg):',
          '    return StudentCode.matchParentheses(arg)'
        ].join('\n');
        expect(PythonPrereqCheckService.hasInvalidStudentClassCalls(code))
          .toBe(true);
      }
    );

    it('returns false when there are no StudentCode calls',
      function() {
        var code = [
          'def myFunction(arg)',
          '    return arg'
        ].join('\n');
        expect(PythonPrereqCheckService.hasInvalidStudentClassCalls(code))
          .toBe(false);
      }
    );
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
      expect(prereqCheckFailure.hasWrongLanguage()).toEqual(true);
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

    it(['returns the correct PrereqCheckFailureObject when there is invalid',
      ' System call'].join(''), function() {
      var starterCode = [
        'def myFunction(arg):',
        '    return arg'
      ].join('\n');
      var code = [
        'def myFunction(arg):',
        '    return System.runTest(StudentCode, myFunction, 0)'
      ].join('\n');

      var prereqCheckFailure = PythonPrereqCheckService.checkCode(
        starterCode, code);
      expect(prereqCheckFailure.hasInvalidSystemCall()).toEqual(true);
    });

    it(['returns the correct PrereqCheckFailureObject when there is an invalid',
      ' AuxiliaryCode call'].join(''), function() {
      var starterCode = [
        'def myFunction(arg):',
        '    return arg'
      ].join('\n');

      var code = [
        'def myFunction(arg):',
        '    return AuxiliaryCode.matchParentheses(arg)'
      ].join('\n');

      var prereqCheckFailure = PythonPrereqCheckService.checkCode(
        starterCode, code);
      expect(prereqCheckFailure.hasInvalidAuxiliaryCodeCall()).toEqual(true);
    });

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
