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
  var CodeSubmissionObjectFactory;
  var PythonCodePreprocessorService;
  var BuggyOutputTestObjectFactory;
  var TestSuiteObjectFactory;
  var PerformanceTestObjectFactory;

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    CodeSubmissionObjectFactory = $injector.get('CodeSubmissionObjectFactory');
    PythonCodePreprocessorService = $injector.get(
      'PythonCodePreprocessorService');
    BuggyOutputTestObjectFactory = $injector.get(
      'BuggyOutputTestObjectFactory');
    TestSuiteObjectFactory = $injector.get('TestSuiteObjectFactory');
    PerformanceTestObjectFactory = $injector.get(
      'PerformanceTestObjectFactory');
  }));

  describe('_prepareCodeSubmissionForServerExecution', function() {

    it('appends / prepends the correct code to the supplied code', function() {
      var studentCode = [
        'def myFunction(arg):',
        '    result = arg.rstrip()',
        '    return result'
      ].join('\n');
      var preprocessedCode = [
        'response_dict = {}',
        'most_recent_input = None',
        'performance_test_results = None',
        'correctness_test_results = None',
        'buggy_output_test_results = None',
        '',
        'def myFunction(arg):',
        '    result = arg.rstrip()',
        '    return result',
        "response_dict['most_recent_input'] = most_recent_input",
        "response_dict['performance_test_results'] = performance_test_results",
        "response_dict['correctness_test_results'] = correctness_test_results",
        [
          "response_dict['buggy_output_test_results']",
          " = buggy_output_test_results"
        ].join(''),
        ''
      ].join('\n');
      var codeSubmission = CodeSubmissionObjectFactory.create(studentCode);
      PythonCodePreprocessorService._prepareCodeSubmissionForServerExecution(
          codeSubmission);
      expect(codeSubmission.getPreprocessedCode()).toEqual(preprocessedCode);
      expect(codeSubmission.getPreprocessedCode()).toContain(studentCode);
    });
  });

  describe('_jsonVariableToPython', function() {
    it('should correctly convert a JSON string to a Python string', function() {
      expect(
        PythonCodePreprocessorService._jsonVariableToPython('stringify')
      ).toEqual("'stringify'");
    });

    it('should convert a JSON string with escaped characters', function() {
      expect(
        PythonCodePreprocessorService._jsonVariableToPython('strin\\gify')
      ).toEqual("'strin\\\\gify'");
    });

    it('should convert a JSON integer to a Python integer', function() {
      expect(
        PythonCodePreprocessorService._jsonVariableToPython(2)
      ).toEqual(2);
    });

    it('should convert a JSON array to a Python array string', function() {
      expect(
        PythonCodePreprocessorService._jsonVariableToPython(["cat", "2", "3"])
      ).toEqual("['cat', '2', '3']");
    });

    it('should correctly convert a nested JSON array', function() {
      expect(
        PythonCodePreprocessorService._jsonVariableToPython(
          [["1", "2"], ["3", "4"], ["5", "6"]])
      ).toEqual("[['1', '2'], ['3', '4'], ['5', '6']]");
    });

    it('should correctly convert a JSON boolean array', function() {
      expect(
        PythonCodePreprocessorService._jsonVariableToPython(
          [[true, true], [false, false], [true, false]])
      ).toEqual("[[True, True], [False, False], [True, False]]");
    });

    it('should throw an error if the input type is unsupported', function() {
      var errorMsg = "Only string, array, and boolean inputs are supported.";
      expect(function() {
        PythonCodePreprocessorService._jsonVariableToPython({
          foo: "val"
        });
      }).toThrow(new Error(errorMsg));
    });
  });

  describe('_naivelyStripComments', function() {
    it('should correctly remove comments that start mid-line', function() {
      var rawCode = [
        'def myFunc():  # this is my function',
        '    a = 3'
      ].join('\n');

      var expectedOutput = [
        'def myFunc():',
        '    a = 3'
      ].join('\n');

      expect(
        PythonCodePreprocessorService._naivelyStripComments(rawCode)
      ).toEqual(expectedOutput);
    });

    it('should remove comments that start at the first column', function() {
      var rawCode = [
        '# This is a function  ',
        '###  And another comment line # # # ',
        'def myFunc():',
        '    a = 3'
      ].join('\n');

      var expectedOutput = [
        '',
        '',
        'def myFunc():',
        '    a = 3'
      ].join('\n');

      expect(
        PythonCodePreprocessorService._naivelyStripComments(rawCode)
      ).toEqual(expectedOutput);
    });

    it('preserves comments in lines with strings', function() {
      var rawCode = [
        'def myFunc():',
        '    a = "hello"  # This line has a quotation mark',
        '    b = 5  # This line does not'
      ].join('\n');

      var expectedOutput = [
        'def myFunc():',
        '    a = "hello"  # This line has a quotation mark',
        '    b = 5'
      ].join('\n');

      expect(
        PythonCodePreprocessorService._naivelyStripComments(rawCode)
      ).toEqual(expectedOutput);
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
        '    a = 3'
      ].join('\n');

      var expectedTransformedCode = [
        '    def myFunc(self, c, b, x):',
        '        a = 3'
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
        '    a = 3'
      ].join('\n');

      var expectedTransformedCode = [
        '    def myFunc(self, ',
        '        c, b, x):',
        '        a = 3'
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
        '        d = 4'
      ].join('\n');

      expect(
        PythonCodePreprocessorService._transformCodeToInstanceMethods(
          rawCode, 'StudentAnswer')
      ).toEqual(expectedTransformedCode);
    });

    it('should preserve whitespace',
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
          '    ',
          '    ',
          '    def funcOne(self, a, b):',
          '        x = 3',
          '    ',
          '    ',
          '    ',
          '    def funcTwo(self, c):',
          '        d = 4',
          '    ',
          '    ',
          '    '
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
            rawCode, 'StudentAnswer');
        }).toThrow(new Error('Incomplete line: missing "(" in def statement.'));
      }
    );
  });

  describe('_addClassWrappingToHelperFunctions', function() {
    it('should correctly add classname to their helper functions', function() {
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
    });

    it('should add classname regardless of adjoining spaces', function() {
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
    });

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

    it('should add classname to similarly-named functions', function() {
      var rawCode = [
        'def myFunc(self, ):',
        '    a = 3',
        '    inner_func()',
        '    inner_funct()',
        '',
        'def inner_func():',
        '    b = 6',
        '',
        'def inner_funct():',
        '    inner_func()',
        '    b = 6'
      ].join('\n');

      var expectedCode = [
        'def myFunc(self, ):',
        '    a = 3',
        '    StudentCode().inner_func()',
        '    StudentCode().inner_funct()',
        '',
        'def inner_func():',
        '    b = 6',
        '',
        'def inner_funct():',
        '    StudentCode().inner_func()',
        '    b = 6'
      ].join('\n');

      expect(
        PythonCodePreprocessorService._addClassWrappingToHelperFunctions(
          rawCode, 'StudentCode', true)
      ).toEqual(expectedCode);
    });

    it('should add classname to inner and outer functions', function() {
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
    });

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

  describe('_checkMatchedFunctionForWhitespace', function() {
    it("should check there's only whitespace after given location", function() {
      var code = 'encoded  ()';
      var whitespaceCheckLocation = 'encode'.length;
      expect(
        PythonCodePreprocessorService._checkMatchedFunctionForWhitespace(
            code, whitespaceCheckLocation)
      ).toBe(false);

      code = 'encode  ()';
      whitespaceCheckLocation = 'encode'.length;
      expect(
        PythonCodePreprocessorService._checkMatchedFunctionForWhitespace(
            code, whitespaceCheckLocation)
      ).toBe(true);
    });
  });

  describe('_generateCorrectnessTestCode', function() {
    it('should add correctness test code to skeleton code', function() {
      var testSuites = [TestSuiteObjectFactory.create({
        id: 'SAMPLE',
        humanReadableName: 'sample tests',
        testCases: [{
          input: 'cat',
          allowedOutputs: ['at', 'bc']
        }]
      })];
      var expectedGeneratedCode = [
        /* eslint-disable max-len */
        'all_tasks_test_inputs = [',
        '    [{',
        '        "id": "SAMPLE",',
        '        "inputs": [\'cat\'],',
        '    }]',
        ']',
        '',
        'correctness_test_results = []',
        '',
        'task_test_inputs = all_tasks_test_inputs[0]',
        'task_results = []',
        'for suite_dicts in task_test_inputs:',
        '    suite_results = [',
        '        outputFnName(System.runTest(StudentCode().mainFnName, inputFnName(test_input)))',
        '        for test_input in suite_dicts["inputs"]]',
        '    task_results.append(suite_results)',
        'correctness_test_results.append(task_results)'
        /* eslint-enable max-len */
      ].join('\n');

      expect(
        PythonCodePreprocessorService._generateCorrectnessTestCode(
          [testSuites], ['inputFnName'], ['mainFnName'], ['outputFnName'])
      ).toEqual(expectedGeneratedCode);
    });
  });

  describe('_generateBuggyOutputTestCode', function() {
    it('should add buggy output test code to skeleton code', function() {
      var buggyOutputTests = [[
        BuggyOutputTestObjectFactory.create({
          buggyFunctionName: 'buggyFunc',
          ignoredTestSuiteIds: [],
          messages: ['a', 'b', 'c']
        }),
        BuggyOutputTestObjectFactory.create({
          buggyFunctionName: 'buggyFunc2',
          ignoredTestSuiteIds: [],
          messages: ['d', 'e', 'f']
        })
      ]];
      var expectedGeneratedCode = [
        /* eslint-disable max-len */
        'def matches_buggy_function(func, ignoredSuiteIds, inputFunctionName, outputFunctionName):',
        '    for task_index, task_inputs in enumerate(all_tasks_test_inputs):',
        '        for suite_index, suite_dict in enumerate(task_inputs):',
        '            num_tests = len(suite_dict["inputs"])',
        '            if suite_dict["id"] in ignoredSuiteIds:',
        '                continue',
        '',
        '            buggy_results = []',
        '            suite_inputs = suite_dict["inputs"]',
        '            for test_input in suite_inputs:',
        '                if inputFunctionName is None and outputFunctionName is None:',
        '                    buggy_results.append(System.runTest(func, test_input))',
        '                elif inputFunctionName is None:',
        '                    buggy_results.append(outputFunctionName(',
        '                        System.runTest(func, test_input)))',
        '                elif outputFunctionName is None:',
        '                    buggy_results.append(',
        '                        System.runTest(func, inputFunctionName(test_input)))',
        '                else:',
        '                    buggy_results.append(outputFunctionName(',
        '                        System.runTest(func, inputFunctionName(test_input))))',
        '            if buggy_results != correctness_test_results[task_index][suite_index]:',
        '                return False',
        '    return True',
        '',
        'buggy_output_test_results = []',
        'task_buggy_output_test_results = []',
        'task_buggy_output_test_results.append(',
        '    matches_buggy_function(buggyFunc, [], None, None))',
        'task_buggy_output_test_results.append(',
        '    matches_buggy_function(buggyFunc2, [], None, None))',
        'buggy_output_test_results.append(task_buggy_output_test_results)',
        ''
        /* eslint-enable max-len */
      ].join('\n');

      expect(
        PythonCodePreprocessorService._generateBuggyOutputTestCode(
          buggyOutputTests, [null], [null])
      ).toEqual(expectedGeneratedCode);
    });

    it('should add correct buggy output test code with an output function name',
      function() {
        var buggyOutputTests = [[BuggyOutputTestObjectFactory.create({
          buggyFunctionName: 'buggyFunc',
          ignoredTestSuiteIds: [],
          messages: ['a', 'b', 'c']
        })]];
        var expectedGeneratedCode = [
          /* eslint-disable max-len */
          'def matches_buggy_function(func, ignoredSuiteIds, inputFunctionName, outputFunctionName):',
          '    for task_index, task_inputs in enumerate(all_tasks_test_inputs):',
          '        for suite_index, suite_dict in enumerate(task_inputs):',
          '            num_tests = len(suite_dict["inputs"])',
          '            if suite_dict["id"] in ignoredSuiteIds:',
          '                continue',
          '',
          '            buggy_results = []',
          '            suite_inputs = suite_dict["inputs"]',
          '            for test_input in suite_inputs:',
          '                if inputFunctionName is None and outputFunctionName is None:',
          '                    buggy_results.append(System.runTest(func, test_input))',
          '                elif inputFunctionName is None:',
          '                    buggy_results.append(outputFunctionName(',
          '                        System.runTest(func, test_input)))',
          '                elif outputFunctionName is None:',
          '                    buggy_results.append(',
          '                        System.runTest(func, inputFunctionName(test_input)))',
          '                else:',
          '                    buggy_results.append(outputFunctionName(',
          '                        System.runTest(func, inputFunctionName(test_input))))',
          '            if buggy_results != correctness_test_results[task_index][suite_index]:',
          '                return False',
          '    return True',
          '',
          'buggy_output_test_results = []',
          'task_buggy_output_test_results = []',
          'task_buggy_output_test_results.append(',
          '    matches_buggy_function(buggyFunc, [], None, outputFunctionName))',
          'buggy_output_test_results.append(task_buggy_output_test_results)',
          ''
          /* eslint-enable max-len */
        ].join('\n');

        expect(
          PythonCodePreprocessorService._generateBuggyOutputTestCode(
            buggyOutputTests, [null], ['outputFunctionName'])
        ).toEqual(expectedGeneratedCode);
      }
    );

    it('should add correct buggy output test code with an input function name',
      function() {
        var buggyOutputTests = [[BuggyOutputTestObjectFactory.create({
          buggyFunctionName: 'buggyFunc',
          ignoredTestSuiteIds: [],
          messages: ['a', 'b', 'c']
        })]];
        var expectedGeneratedCode = [
          /* eslint-disable max-len */
          'def matches_buggy_function(func, ignoredSuiteIds, inputFunctionName, outputFunctionName):',
          '    for task_index, task_inputs in enumerate(all_tasks_test_inputs):',
          '        for suite_index, suite_dict in enumerate(task_inputs):',
          '            num_tests = len(suite_dict["inputs"])',
          '            if suite_dict["id"] in ignoredSuiteIds:',
          '                continue',
          '',
          '            buggy_results = []',
          '            suite_inputs = suite_dict["inputs"]',
          '            for test_input in suite_inputs:',
          '                if inputFunctionName is None and outputFunctionName is None:',
          '                    buggy_results.append(System.runTest(func, test_input))',
          '                elif inputFunctionName is None:',
          '                    buggy_results.append(outputFunctionName(',
          '                        System.runTest(func, test_input)))',
          '                elif outputFunctionName is None:',
          '                    buggy_results.append(',
          '                        System.runTest(func, inputFunctionName(test_input)))',
          '                else:',
          '                    buggy_results.append(outputFunctionName(',
          '                        System.runTest(func, inputFunctionName(test_input))))',
          '            if buggy_results != correctness_test_results[task_index][suite_index]:',
          '                return False',
          '    return True',
          '',
          'buggy_output_test_results = []',
          'task_buggy_output_test_results = []',
          'task_buggy_output_test_results.append(',
          '    matches_buggy_function(buggyFunc, [], inputFunctionName, None))',
          'buggy_output_test_results.append(task_buggy_output_test_results)',
          ''
          /* eslint-enable max-len */
        ].join('\n');

        expect(
          PythonCodePreprocessorService._generateBuggyOutputTestCode(
            buggyOutputTests, ['inputFunctionName'], [null])
        ).toEqual(expectedGeneratedCode);
      }
    );

    it('adds buggy output test code with input/output functions', function() {
      var buggyOutputTests = [[BuggyOutputTestObjectFactory.create({
        buggyFunctionName: 'buggyFunc',
        ignoredTestSuiteIds: [],
        messages: ['a', 'b', 'c']
      })]];
      var expectedGeneratedCode = [
        /* eslint-disable max-len */
        'def matches_buggy_function(func, ignoredSuiteIds, inputFunctionName, outputFunctionName):',
        '    for task_index, task_inputs in enumerate(all_tasks_test_inputs):',
        '        for suite_index, suite_dict in enumerate(task_inputs):',
        '            num_tests = len(suite_dict["inputs"])',
        '            if suite_dict["id"] in ignoredSuiteIds:',
        '                continue',
        '',
        '            buggy_results = []',
        '            suite_inputs = suite_dict["inputs"]',
        '            for test_input in suite_inputs:',
        '                if inputFunctionName is None and outputFunctionName is None:',
        '                    buggy_results.append(System.runTest(func, test_input))',
        '                elif inputFunctionName is None:',
        '                    buggy_results.append(outputFunctionName(',
        '                        System.runTest(func, test_input)))',
        '                elif outputFunctionName is None:',
        '                    buggy_results.append(',
        '                        System.runTest(func, inputFunctionName(test_input)))',
        '                else:',
        '                    buggy_results.append(outputFunctionName(',
        '                        System.runTest(func, inputFunctionName(test_input))))',
        '            if buggy_results != correctness_test_results[task_index][suite_index]:',
        '                return False',
        '    return True',
        '',
        'buggy_output_test_results = []',
        'task_buggy_output_test_results = []',
        'task_buggy_output_test_results.append(',
        '    matches_buggy_function(buggyFunc, [], inputFunctionName, outputFunctionName))',
        'buggy_output_test_results.append(task_buggy_output_test_results)',
        ''
        /* eslint-enable max-len */
      ].join('\n');

      expect(
        PythonCodePreprocessorService._generateBuggyOutputTestCode(
          buggyOutputTests, ['inputFunctionName'], ['outputFunctionName'])
      ).toEqual(expectedGeneratedCode);
    });
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
          /* eslint-disable max-len */
          'performance_test_results = []',
          '',
          'def get_test_input(atom, input_size, qualifiedTransformationFunctionName):',
          '    return qualifiedTransformationFunctionName(atom, input_size)',
          '',
          'def run_performance_test(',
          '        test_input, qualifiedTransformationFunctionName,',
          '        qualifiedEvaluationFunctionName):',
          '    time_array = []',
          '    for input_size in [10, 100]:',
          '        start = time.clock()',
          '        output = qualifiedEvaluationFunctionName(get_test_input(',
          '            test_input, input_size, qualifiedTransformationFunctionName))',
          '        finish = time.clock() - start',
          '        time_array.append(finish)',
          '    if time_array[1] > 30 * time_array[0]:',
          '        return "not linear"',
          '    return "linear"',
          '',
          'task_performance_test_results = []',
          'task_performance_test_results.append(',
          '    run_performance_test(\'na \', System.extendString, StudentCode().katamariDamashi))',
          'performance_test_results.append(task_performance_test_results)',
          ''
          /* eslint-enable max-len */
        ].join('\n');

        expect(
          PythonCodePreprocessorService._generatePerformanceTestCode(
              performanceTests)
        ).toEqual(expectedGeneratedCode);
      }
    );
  });
});
