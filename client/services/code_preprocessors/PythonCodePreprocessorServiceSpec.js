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

    it('should correctly convert a json Array to a Python array (or a string version)'
      , function() {
      expect(
        PythonCodePreprocessorService._jsonVariableToPython(["cat", "2", "3"])
      ).toEqual("['cat', '2', '3']");
    });

    it('should correctly convert a nested json Array to a similar Python array)'
      , function() {
      expect(
        PythonCodePreprocessorService._jsonVariableToPython([["1", "2"], ["3", "4"], ["5", "6"]])
      ).toEqual("[['1', '2'], ['3', '4'], ['5', '6']]");
    });
  });

  describe('_wrapCodeIntoClass', function() {
    it('should correctly wrap a function', function() {
      var rawCode = [
        'def myFunc():',
        '    a = 3'
      ].join('\n');

      // The Python interpreter ignores the trailing comma and space in the
      // function arguments.
      var expectedWrappedCode = [
        'class StudentAnswer(object):',
        '    def myFunc(self, ):',
        '        a = 3'
      ].join('\n');

      expect(
        PythonCodePreprocessorService._wrapCodeIntoClass(
          rawCode, 'StudentAnswer')
      ).toEqual(expectedWrappedCode);
    });

    it('should correctly wrap inner functions', function() {
      var rawCode = [
        'def myFunc():',
        '    a = 3',
        '    def inner_func():',
        '        b = 6',
        '    inner_func()'
      ].join('\n');

      var expectedWrappedCode = [
        'class StudentAnswer(object):',
        '    def myFunc(self, ):',
        '        a = 3',
        '        def inner_func():',
        '            b = 6',
        '        inner_func()'
      ].join('\n');

      expect(
        PythonCodePreprocessorService._wrapCodeIntoClass(
          rawCode, 'StudentAnswer')
      ).toEqual(expectedWrappedCode);
    });

    it('should preserve inner whitespace', function() {
      var rawCode = [
        'def       myFunc():',
        '    a = 3'
      ].join('\n');

      var expectedWrappedCode = [
        'class StudentAnswer(object):',
        '    def       myFunc(self, ):',
        '        a = 3'
      ].join('\n');

      expect(
        PythonCodePreprocessorService._wrapCodeIntoClass(
          rawCode, 'StudentAnswer')
      ).toEqual(expectedWrappedCode);
    });

    it('should wrap functions with arguments', function() {
      var rawCode = [
        'def myFunc(c, b, x):',
        '    a = 3',
      ].join('\n');

      var expectedWrappedCode = [
        'class StudentAnswer(object):',
        '    def myFunc(self, c, b, x):',
        '        a = 3',
      ].join('\n');

      expect(
        PythonCodePreprocessorService._wrapCodeIntoClass(
          rawCode, 'StudentAnswer')
      ).toEqual(expectedWrappedCode);
    });

    it('should correctly wrap multi-line functions', function() {
      var rawCode = [
        'def myFunc(',
        '    c, b, x):',
        '    a = 3',
      ].join('\n');

      var expectedWrappedCode = [
        'class StudentAnswer(object):',
        '    def myFunc(self, ',
        '        c, b, x):',
        '        a = 3',
      ].join('\n');

      expect(
        PythonCodePreprocessorService._wrapCodeIntoClass(
          rawCode, 'StudentAnswer')
      ).toEqual(expectedWrappedCode);
    });

    it('should correctly wrap multiple functions', function() {
      var rawCode = [
        'def funcOne(a, b):',
        '    x = 3',
        '',
        'def funcTwo(c):',
        '    d = 4'
      ].join('\n');

      var expectedWrappedCode = [
        'class StudentAnswer(object):',
        '    def funcOne(self, a, b):',
        '        x = 3',
        '    ',
        '    def funcTwo(self, c):',
        '        d = 4',
      ].join('\n');

      expect(
        PythonCodePreprocessorService._wrapCodeIntoClass(
          rawCode, 'StudentAnswer')
      ).toEqual(expectedWrappedCode);
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

        var expectedWrappedCode = [
          'class StudentAnswer(object):',
          '    def funcOne(self, a, b):',
          '        x = 3',
          '    ',
          '    ',
          '    ',
          '    def funcTwo(self, c):',
          '        d = 4',
        ].join('\n');

        expect(
          PythonCodePreprocessorService._wrapCodeIntoClass(
            rawCode, 'StudentAnswer')
        ).toEqual(expectedWrappedCode);
      }
    );

    it('should throw an error if the code cannot be transformed',
      function() {
        var rawCode = [
          'def funcOne:',
          '    x = 3'
        ].join('\n');

        expect(function() {
          PythonCodePreprocessorService._wrapCodeIntoClass(
            rawCode, 'StudentAnswer')
        }).toThrow(new Error('Incomplete line: missing "(" in def statement.'));
      }
    );
  });

  describe('_generateBuggyOutputTestCode', function() {
    it('should add correct buggy output test code to skeleton code',
      function() {
        var buggyOutputTests = [BuggyOutputTestObjectFactory.create({
          buggyFunction: 'buggyFunc',
          messages: ['a', 'b', 'c']
        })];
        var correctnessTests = [CorrectnessTestObjectFactory.create({
          input: 'cat',
          expectedOutput: 'at'
        })];
        var expectedGeneratedCode = [
          'def matches_buggy_function(func):',
          '    buggy_results = []',
          '    for test_input in test_inputs:',
          '        buggy_results.append(System.runTest(func, test_input))',
          '    return buggy_results == correctness_test_results',
          '',
          'buggy_output_test_results = []',
          'buggy_output_test_results.append(matches_buggy_function(buggyFunc))'
        ].join('\n');

        expect(
          PythonCodePreprocessorService._generateBuggyOutputTestCode(
            correctnessTests, buggyOutputTests)
        ).toEqual(expectedGeneratedCode);
      }
    );
  });

  describe('_generatePerformanceTestCode', function() {
    it('should add correct performance test information to skeleton code',
      function() {
        var performanceTest = PerformanceTestObjectFactory.create({
          inputDataAtom: 'na ',
          transformationFunction: 'System.extendString',
          expectedPerformance: 'linear',
          evaluationFunction: 'katamariDamashi'
        });
        var performanceTests = [performanceTest];
        var expectedGeneratedCode = [
          '',
          'def get_test_input(atom, input_size):',
          '    return System.extendString(atom, input_size)',
          '',
          'def run_performance_test(test_input):',
          '    time_array = []',
          '    for input_size in [10, 100]:',
          '        start = time.time()',
          '        output = StudentCode().katamariDamashi(get_test_input(test_input, input_size))',
          '        finish = time.time() - start',
          '        time_array.append(finish)',
          '    if time_array[1] > 30 * time_array[0]:',
          '        return "not linear"',
          '    return "linear"',
          '',
          'performance_test_results = []',
          'performance_test_results.append(',
          '    run_performance_test(\'na \'))'
        ].join('\n');

        expect(
          PythonCodePreprocessorService._generatePerformanceTestCode(
              performanceTests)
        ).toEqual(expectedGeneratedCode);
      }
    );
  });
});
