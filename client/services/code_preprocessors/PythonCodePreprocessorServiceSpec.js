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
 * @fileoverview Unit tests for the PythonCodePreprocessorService.
 */

describe('PythonCodePreprocessorService', function() {
  var PythonCodePreprocessorService;
  var BuggyOutputTestObjectFactory;
  var CorrectnessTestObjectFactory;
  var PerformanceTestObjectFactory;

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    PythonCodePreprocessorService = $injector.get(
      'PythonCodePreprocessorService');
    BuggyOutputTestObjectFactory = $injector.get(
      'BuggyOutputTestObjectFactory');
    CorrectnessTestObjectFactory = $injector.get(
      'CorrectnessTestObjectFactory');
    PerformanceTestObjectFactory = $injector.get(
      'PerformanceTestObjectFactory');
  }));

  describe('_jsonVariableToPython', function() {
    it('should correctly convert a json String to a Python string', function() {
      expect(
        PythonCodePreprocessorService._jsonVariableToPython('stringify')
      ).toEqual("'stringify'");
    });

    it(
      [
        'should correctly convert a json Array to a string version ',
        'of a Python array'
      ].join('') , function() {
      expect(
        PythonCodePreprocessorService._jsonVariableToPython(["cat", "2", "3"])
      ).toEqual("['cat', '2', '3']");
    });

    it('should correctly convert a nested json Array to a similar Python array'
      , function() {
      expect(
        PythonCodePreprocessorService._jsonVariableToPython(
          [["1", "2"], ["3", "4"], ["5", "6"]])
      ).toEqual("[['1', '2'], ['3', '4'], ['5', '6']]");
    });

    it(
      [
        'should correctly convert a json boolean Array to a string version ',
        'of a Python boolean array'
      ].join('') , function() {
      expect(
        PythonCodePreprocessorService._jsonVariableToPython(
          [[true, true], [false, false], [true, false]])
      ).toEqual("[[True, True], [False, False], [True, False]]");
    });
  });

  describe('_transformCodeToInstanceMethods', function() {
    it('should correctly wrap a function', function() {
      var rawCode = [
        'def myFunc():',
        '    a = 3'
      ].join('\n');

      // The Python interpreter ignores the trailing comma and space in the
      // function arguments.
      var expectedTransformedCode = [
        '    def myFunc(self, ):',
        '        a = 3'
      ].join('\n');

      expect(
        PythonCodePreprocessorService._transformCodeToInstanceMethods(
          rawCode, 'StudentAnswer')
      ).toEqual(expectedTransformedCode);
    });

    it('should correctly wrap inner functions', function() {
      var rawCode = [
        'def myFunc():',
        '    a = 3',
        '    def inner_func():',
        '        b = 6',
        '    inner_func()'
      ].join('\n');

      var expectedTransformedCode = [
        '    def myFunc(self, ):',
        '        a = 3',
        '        def inner_func():',
        '            b = 6',
        '        inner_func()'
      ].join('\n');

      expect(
        PythonCodePreprocessorService._transformCodeToInstanceMethods(
          rawCode, 'StudentAnswer')
      ).toEqual(expectedTransformedCode);
    });

    it('should preserve inner whitespace', function() {
      var rawCode = [
        'def       myFunc():',
        '    a = 3'
      ].join('\n');

      var expectedTransformedCode = [
        '    def       myFunc(self, ):',
        '        a = 3'
      ].join('\n');

      expect(
        PythonCodePreprocessorService._transformCodeToInstanceMethods(
          rawCode, 'StudentAnswer')
      ).toEqual(expectedTransformedCode);
    });

    it('should wrap functions with arguments', function() {
      var rawCode = [
        'def myFunc(c, b, x):',
        '    a = 3',
      ].join('\n');

      var expectedTransformedCode = [
        '    def myFunc(self, c, b, x):',
        '        a = 3',
      ].join('\n');

      expect(
        PythonCodePreprocessorService._transformCodeToInstanceMethods(
          rawCode, 'StudentAnswer')
      ).toEqual(expectedTransformedCode);
    });

    it('should correctly wrap multi-line functions', function() {
      var rawCode = [
        'def myFunc(',
        '    c, b, x):',
        '    a = 3',
      ].join('\n');

      var expectedTransformedCode = [
        '    def myFunc(self, ',
        '        c, b, x):',
        '        a = 3',
      ].join('\n');

      expect(
        PythonCodePreprocessorService._transformCodeToInstanceMethods(
          rawCode, 'StudentAnswer')
      ).toEqual(expectedTransformedCode);
    });

    it('should correctly wrap multiple functions', function() {
      var rawCode = [
        'def funcOne(a, b):',
        '    x = 3',
        '',
        'def funcTwo(c):',
        '    d = 4'
      ].join('\n');

      var expectedTransformedCode = [
        '    def funcOne(self, a, b):',
        '        x = 3',
        '    ',
        '    def funcTwo(self, c):',
        '        d = 4',
      ].join('\n');

      expect(
        PythonCodePreprocessorService._transformCodeToInstanceMethods(
          rawCode, 'StudentAnswer')
      ).toEqual(expectedTransformedCode);
    });

    it('should trim whitespace at the ends, but preserve it between functions',
      function() {
        var rawCode = [
          '',
          '',
          'def funcOne(a, b):',
          '    x = 3',
          '',
          '',
          '',
          'def funcTwo(c):',
          '    d = 4',
          '',
          '',
          ''
        ].join('\n');

        var expectedTransformedCode = [
          '    def funcOne(self, a, b):',
          '        x = 3',
          '    ',
          '    ',
          '    ',
          '    def funcTwo(self, c):',
          '        d = 4',
        ].join('\n');

        expect(
          PythonCodePreprocessorService._transformCodeToInstanceMethods(
            rawCode, 'StudentAnswer')
        ).toEqual(expectedTransformedCode);
      }
    );

    it('should throw an error if the code cannot be transformed',
      function() {
        var rawCode = [
          'def funcOne:',
          '    x = 3'
        ].join('\n');

        expect(function() {
          PythonCodePreprocessorService._transformCodeToInstanceMethods(
            rawCode, 'StudentAnswer')
        }).toThrow(new Error('Incomplete line: missing "(" in def statement.'));
      }
    );
  });

  describe('_addClassWrappingToHelperFunctions', function() {
    it('should correctly add our classname to their helper functions',
      function() {
        var rawCode = [
          'def myFunc(self, ):',
          '    a = 3',
          '    inner_func()',
          '',
          'def inner_func():',
          '    b = 6'
        ].join('\n');

        var expectedCode = [
          'def myFunc(self, ):',
          '    a = 3',
          '    StudentCode().inner_func()',
          '',
          'def inner_func():',
          '    b = 6'
        ].join('\n');

        expect(
          PythonCodePreprocessorService._addClassWrappingToHelperFunctions(
            rawCode, 'StudentCode', true)
        ).toEqual(expectedCode);
      }
    );

    it('should add classname regardless of leading or trailing spaces',
      function() {
        var rawCode = [
          'def myFunc(self, ):',
          '    a = 3',
          '    inner_func()',
          '',
          'def     inner_func          ():',
          '    b = 6'
        ].join('\n');

        var expectedCode = [
          'def myFunc(self, ):',
          '    a = 3',
          '    StudentCode().inner_func()',
          '',
          'def     inner_func          ():',
          '    b = 6'
        ].join('\n');

        expect(
          PythonCodePreprocessorService._addClassWrappingToHelperFunctions(
            rawCode, 'StudentCode', true)
        ).toEqual(expectedCode);
      }
    );

    it('should correctly add our classname to multiple functions',
      function() {
        var rawCode = [
          'def myFunc(self, ):',
          '    a = 3',
          '    inner_func()',
          '    outer_func()',
          '',
          'def inner_func():',
          '    b = 6',
          '',
          'def outer_func():',
          '    inner_func()',
          '    b = 6'
        ].join('\n');

        var expectedCode = [
          'def myFunc(self, ):',
          '    a = 3',
          '    StudentCode().inner_func()',
          '    StudentCode().outer_func()',
          '',
          'def inner_func():',
          '    b = 6',
          '',
          'def outer_func():',
          '    StudentCode().inner_func()',
          '    b = 6'
        ].join('\n');

        expect(
          PythonCodePreprocessorService._addClassWrappingToHelperFunctions(
            rawCode, 'StudentCode', true)
        ).toEqual(expectedCode);
      }
    );

    it('should correctly add our classname to multiple functions regardless ' +
      'of their position within the file',
      function() {
        var rawCode = [
          'def myFunc(self, ):',
          '    a = 3',
          '    _inner_func()',
          '    outer_func()',
          '    myFunc()',
          '',
          'def _inner_func():',
          '    b = 6',
          '',
          'def outer_func():',
          '    _inner_func()',
          '    b = 6'
        ].join('\n');

        var expectedCode = [
          'def myFunc(self, ):',
          '    a = 3',
          '    StudentCode()._inner_func()',
          '    StudentCode().outer_func()',
          '    StudentCode().myFunc()',
          '',
          'def _inner_func():',
          '    b = 6',
          '',
          'def outer_func():',
          '    StudentCode()._inner_func()',
          '    b = 6'
        ].join('\n');

        expect(
          PythonCodePreprocessorService._addClassWrappingToHelperFunctions(
            rawCode, 'StudentCode', true)
        ).toEqual(expectedCode);
      }
    );

    it('should not append () if passed false for the addInstanceWrapping arg',
      function() {
        var rawCode = [
          'def myFunc(self, ):',
          '    a = 3',
          '    _inner_func()',
          '    outer_func()',
          '    myFunc()',
          '',
          'def _inner_func():',
          '    b = 6',
          '',
          'def outer_func():',
          '    _inner_func()',
          '    b = 6'
        ].join('\n');

        var expectedCode = [
          'def myFunc(self, ):',
          '    a = 3',
          '    StudentCode._inner_func()',
          '    StudentCode.outer_func()',
          '    StudentCode.myFunc()',
          '',
          'def _inner_func():',
          '    b = 6',
          '',
          'def outer_func():',
          '    StudentCode._inner_func()',
          '    b = 6'
        ].join('\n');

        expect(
          PythonCodePreprocessorService._addClassWrappingToHelperFunctions(
            rawCode, 'StudentCode', false)
        ).toEqual(expectedCode);
      }
    );

    it('should ignore code with no functions defined',
      function() {
        var rawCode = [
          'a = 3',
          'b = 54',
          'a = math.sqrt(9)',
          'katamari = "damashi"'
        ].join('\n');

        var expectedCode = [
          'a = 3',
          'b = 54',
          'a = math.sqrt(9)',
          'katamari = "damashi"'
        ].join('\n');

        expect(
          PythonCodePreprocessorService._addClassWrappingToHelperFunctions(
            rawCode, 'StudentAnswer', true)
        ).toEqual(expectedCode);
      }
    );
  });

  describe('_generateCorrectnessTestCode', function() {
    it('should add correctness test code to skeleton code',
      function() {
        var correctnessTests = [[CorrectnessTestObjectFactory.create({
          input: 'cat',
          allowedOutputs: ['at', 'bc']
        })]];
        var expectedGeneratedCode = [
          'test_inputs = [[\'cat\']]',
          '',
          'correctness_test_results = []',
          'one_task_test_results = []',
          'one_task_test_results.append(outputFnName(' +
            'System.runTest(StudentCode().mainFnName, inputFnName(test_inputs[0][0]))))',
          'correctness_test_results.append(one_task_test_results)'
        ].join('\n');

        expect(
          PythonCodePreprocessorService._generateCorrectnessTestCode(
            correctnessTests, 'inputFnName', 'mainFnName', 'outputFnName')
        ).toEqual(expectedGeneratedCode);
      }
    );
  });

  describe('_generateBuggyOutputTestCode', function() {
    it('should add correct buggy output test code to skeleton code',
      function() {
        var buggyOutputTests = [[BuggyOutputTestObjectFactory.create({
          buggyFunctionName: 'buggyFunc',
          messages: ['a', 'b', 'c']
        }), BuggyOutputTestObjectFactory.create({
          buggyFunctionName: 'buggyFunc2',
          messages: ['d', 'e', 'f']
        })]];
        var expectedGeneratedCode = [
          'def matches_buggy_function(func):',
          '    buggy_results = []',
          '    for tests in test_inputs:',
          '        one_task_result = []',
          '        for test in tests:',
          '            one_task_result.append(System.runTest(func, test))',
          '        buggy_results.append(one_task_result)',
          '    return buggy_results == correctness_test_results',
          '',
          'buggy_output_test_results = []',
          'one_buggy_output_test_results = []',
          'one_buggy_output_test_results.append(matches_buggy_function(buggyFunc))',
          'one_buggy_output_test_results.append(matches_buggy_function(buggyFunc2))',
          'buggy_output_test_results.append(one_buggy_output_test_results)',
          ''
        ].join('\n');

        expect(
          PythonCodePreprocessorService._generateBuggyOutputTestCode(
            buggyOutputTests, null, null)
        ).toEqual(expectedGeneratedCode);
      }
    );

    it('should add correct buggy output test code with an output function name',
      function() {
        var buggyOutputTests = [[BuggyOutputTestObjectFactory.create({
          buggyFunctionName: 'buggyFunc',
          messages: ['a', 'b', 'c']
        })]];
        var expectedGeneratedCode = [
          'def matches_buggy_function(func):',
          '    buggy_results = []',
          '    for tests in test_inputs:',
          '        one_task_result = []',
          '        for test in tests:',
          '            one_task_result.append(outputFunctionName(' +
                'System.runTest(func, test)))',
          '        buggy_results.append(one_task_result)',
          '    return buggy_results == correctness_test_results',
          '',
          'buggy_output_test_results = []',
          'one_buggy_output_test_results = []',
          'one_buggy_output_test_results.append(matches_buggy_function(buggyFunc))',
          'buggy_output_test_results.append(one_buggy_output_test_results)',
          ''
        ].join('\n');

        expect(
          PythonCodePreprocessorService._generateBuggyOutputTestCode(
            buggyOutputTests, null, 'outputFunctionName')
        ).toEqual(expectedGeneratedCode);
      }
    );

    it('should add correct buggy output test code with an input function name',
      function() {
        var buggyOutputTests = [[BuggyOutputTestObjectFactory.create({
          buggyFunctionName: 'buggyFunc',
          messages: ['a', 'b', 'c']
        })]];
        var expectedGeneratedCode = [
          'def matches_buggy_function(func):',
          '    buggy_results = []',
          '    for tests in test_inputs:',
          '        one_task_result = []',
          '        for test in tests:',
          '            one_task_result.append(System.runTest(func, ' +
                'inputFunctionName(test)))',
          '        buggy_results.append(one_task_result)',
          '    return buggy_results == correctness_test_results',
          '',
          'buggy_output_test_results = []',
          'one_buggy_output_test_results = []',
          'one_buggy_output_test_results.append(matches_buggy_function(buggyFunc))',
          'buggy_output_test_results.append(one_buggy_output_test_results)',
          ''
        ].join('\n');

        expect(
          PythonCodePreprocessorService._generateBuggyOutputTestCode(
            buggyOutputTests, 'inputFunctionName', null)
        ).toEqual(expectedGeneratedCode);
      }
    );

    it('should add correct buggy output test code with both an input and output function name',
      function() {
        var buggyOutputTests = [[BuggyOutputTestObjectFactory.create({
          buggyFunctionName: 'buggyFunc',
          messages: ['a', 'b', 'c']
        })]];
        var expectedGeneratedCode = [
          'def matches_buggy_function(func):',
          '    buggy_results = []',
          '    for tests in test_inputs:',
          '        one_task_result = []',
          '        for test in tests:',
          '            one_task_result.append(outputFunctionName(System.runTest(func, ' +
                'inputFunctionName(test))))',
          '        buggy_results.append(one_task_result)',
          '    return buggy_results == correctness_test_results',
          '',
          'buggy_output_test_results = []',
          'one_buggy_output_test_results = []',
          'one_buggy_output_test_results.append(matches_buggy_function(buggyFunc))',
          'buggy_output_test_results.append(one_buggy_output_test_results)',
          ''
        ].join('\n');

        expect(
          PythonCodePreprocessorService._generateBuggyOutputTestCode(
            buggyOutputTests, 'inputFunctionName', 'outputFunctionName')
        ).toEqual(expectedGeneratedCode);
      }
    );
  });

  describe('_generatePerformanceTestCode', function() {
    it('should add correct performance test information to skeleton code',
      function() {
        var performanceTest = PerformanceTestObjectFactory.create({
          inputDataAtom: 'na ',
          transformationFunctionName: 'System.extendString',
          expectedPerformance: 'linear',
          evaluationFunctionName: 'katamariDamashi'
        });
        var performanceTests = [[performanceTest]];
        var expectedGeneratedCode = [
          'performance_test_results = []',
          'one_task_performance_test_results = []',
          '',
          'def get_test_input_from_System_extendString_0(atom, input_size):',
          '    return System.extendString(atom, input_size)',
          '',
          'def run_performance_test_from_System_extendString_0(test_input):',
          '    time_array = []',
          '    for input_size in [10, 100]:',
          '        start = time.time()',
          '        output = StudentCode().katamariDamashi(get_test_input_from_System_extendString_0(test_input, input_size))',
          '        finish = time.time() - start',
          '        time_array.append(finish)',
          '    if time_array[1] > 30 * time_array[0]:',
          '        return "not linear"',
          '    return "linear"',
          '',
          'one_task_performance_test_results.append(',
          '    run_performance_test_from_System_extendString_0(\'na \'))',
          'performance_test_results.append(one_task_performance_test_results)',
          ''
        ].join('\n');

        expect(
          PythonCodePreprocessorService._generatePerformanceTestCode(
              performanceTests)
        ).toEqual(expectedGeneratedCode);
      }
    );
  });
});
