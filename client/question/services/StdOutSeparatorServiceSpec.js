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
 * @fileoverview Unit tests for StdOutSeparatorService.
 */

describe('StdOutSeparatorService', function() {
  var StdOutSeparatorService;

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    StdOutSeparatorService = $injector.get(
      'StdOutSeparatorService');
  }));

  describe('getSeparator', function() {
    it('should be empty string if nothing set', function() {
      expect(StdOutSeparatorService.getSeparator()).toEqual('');
    });
  });

  describe('setSeparator', function() {
    it('should set and retrieve generated separator', function() {
      StdOutSeparatorService.setSeparator('testSeparator');
      expect(StdOutSeparatorService.getSeparator()).toEqual('testSeparator');
    });

    it('should work if empty string passed in', function() {
      StdOutSeparatorService.setSeparator('');
      expect(StdOutSeparatorService.getSeparator()).toEqual('');
    });
  });

  describe('getTestCaseOutputInClient', function() {
    var stdOut = ['1', '\n', '2', '\n', 'Hi', '\n', 'sep', '\n',
      '1', '\n', '2', '\n', 'Hey', '\n', 'sep', '\n',
      '1', '\n', '2', '\n', 'Hello', '\n', 'sep', '\n'];

    it('should work for only one test', function() {
      StdOutSeparatorService.setSeparator('sep');
      expect(StdOutSeparatorService.getTestCaseOutputInClient(
        ['1', '\n', '2', '\n', 'Hi', '\n', 'sep', '\n'], 0)).toEqual(
          ['1', '\n', '2', '\n', 'Hi', '\n']);
    });

    it('should work for first test case', function() {
      StdOutSeparatorService.setSeparator('sep');
      expect(
        StdOutSeparatorService.getTestCaseOutputInClient(stdOut, 0)).toEqual(
          ['1', '\n', '2', '\n', 'Hi', '\n']);
    });

    it('should work for seond test case', function() {
      StdOutSeparatorService.setSeparator('sep');
      expect(
        StdOutSeparatorService.getTestCaseOutputInClient(stdOut, 1)).toEqual(
          ['1', '\n', '2', '\n', 'Hey', '\n']);
    });

    it('should work for last test case', function() {
      StdOutSeparatorService.setSeparator('sep');
      expect(
        StdOutSeparatorService.getTestCaseOutputInClient(stdOut, 2)).toEqual(
          ['1', '\n', '2', '\n', 'Hello', '\n']);
    });

    it('should work for no stdout', function() {
      StdOutSeparatorService.setSeparator('sep');
      expect(StdOutSeparatorService.getTestCaseOutputInClient(
        ['sep', 'sep', 'sep'], 1)).toEqual([]);
    });

    it('should work for empty stdout array', function() {
      StdOutSeparatorService.setSeparator('sep');
      expect(StdOutSeparatorService.getTestCaseOutputInClient([], 1)).toEqual(
        []);
    });

    it('should handle out of bounds testNum', function() {
      StdOutSeparatorService.setSeparator('sep');
      expect(StdOutSeparatorService.getTestCaseOutputInClient(
        ['1', '\n', '2', '\n', 'Hi', '\n', 'sep', '\n'], 1)).toEqual(
          []);
    });
  });

  describe('getTestCaseOutput', function() {
    var stdOut = '1\n2\nHi\nsep\n1\n2\nHey\nsep\n1\n2\nHello\nsep\n';

    it('should work for only one test', function() {
      StdOutSeparatorService.setSeparator('sep');
      expect(
        StdOutSeparatorService.getTestCaseOutput('1\n2\nsep\n', 0)).toEqual(
          '1\n2\n');
    });

    it('should work for first test case', function() {
      StdOutSeparatorService.setSeparator('sep');
      expect(
        StdOutSeparatorService.getTestCaseOutput(stdOut, 0)).toEqual(
          '1\n2\nHi\n');
    });

    it('should work for seond test case', function() {
      StdOutSeparatorService.setSeparator('sep');
      expect(
        StdOutSeparatorService.getTestCaseOutput(stdOut, 1)).toEqual(
          '1\n2\nHey\n');
    });

    it('should work for last test case', function() {
      StdOutSeparatorService.setSeparator('sep');
      expect(
        StdOutSeparatorService.getTestCaseOutput(stdOut, 2)).toEqual(
          '1\n2\nHello\n');
    });

    it('should work for no stdout', function() {
      StdOutSeparatorService.setSeparator('sep');
      expect(StdOutSeparatorService.getTestCaseOutput(
        'sep\nsep\nsep\n', 1)).toEqual('');
    });

    it('should work for empty stdout array', function() {
      StdOutSeparatorService.setSeparator('sep');
      expect(StdOutSeparatorService.getTestCaseOutput('', 1)).toEqual(
        '');
    });

    it('should handle out of bounds testNum', function() {
      StdOutSeparatorService.setSeparator('sep');
      expect(
        StdOutSeparatorService.getTestCaseOutput('1\n2\nsep\n', 1)).toEqual(
          '');
    });
  });
});
