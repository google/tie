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
 * @fileoverview Unit tests for ErrorTraceback domain objects.
 */

describe('ErrorTracebackObjectFactory', function() {
  var ErrorTracebackObjectFactory;
  var TracebackCoordinatesObjectFactory;

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    ErrorTracebackObjectFactory = $injector.get(
      'ErrorTracebackObjectFactory');
    TracebackCoordinatesObjectFactory = $injector.get(
      'TracebackCoordinatesObjectFactory');
  }));

  describe('getErrorLineNumber', function() {
    it('should return correct error line number', function() {
      var errorTraceback = ErrorTracebackObjectFactory.create(
        'ZeroDivisionError: integer division or modulo by zero',
        [TracebackCoordinatesObjectFactory.create(5, 1)]);
      var expectedLineNumber = 5;
      expect(errorTraceback.getErrorLineNumber()).toEqual(expectedLineNumber);
    });

    it('should return null if no TracebackCoordinates', function() {
      var errorTraceback = ErrorTracebackObjectFactory.create(
        'ZeroDivisionError: integer division or modulo by zero', null);
      expect(errorTraceback.getErrorLineNumber()).toEqual(null);
    });
  });

  describe('getErrorString', function() {
    it('should return correct error string', function() {
      var errorTraceback = ErrorTracebackObjectFactory.create(
        'ZeroDivisionError: integer division or modulo by zero',
        [TracebackCoordinatesObjectFactory.create(5, 1)]);
      var errorString = (
        'ZeroDivisionError: integer division or modulo by zero');

      expect(errorTraceback.getErrorString()).toEqual(errorString);
    });

    it('should return correct error string for TimeLimitErrors', function() {
      var errorTraceback = ErrorTracebackObjectFactory.create(
        'TimeLimitError: Your code takes, like, forever to run',
        [TracebackCoordinatesObjectFactory.create(5, 1)]);

      var skulptErrorMock = {
        msg: 'TimeLimitError: Your code takes, like, forever to run ',
        traceback: [{
          lineno: 5,
          colno: 1
        }],
        toString: function() {
          return this.msg;
        }
      };

      expect(
        ErrorTracebackObjectFactory.fromSkulptError(skulptErrorMock)
          .getErrorString()
      ).toEqual(errorTraceback.getErrorString());
    });

    it('should return correct error string if no TracebackCoordinates',
      function() {
        var errorString = (
          'ZeroDivisionError: integer division or modulo by zero');
        var errorTraceback = ErrorTracebackObjectFactory.create(
          errorString, null);

        expect(errorTraceback.getErrorString()).toEqual(errorString);
      });
  });

  describe('fromSkulptError', function() {
    it('should return correct traceback for Skulpt errors', function() {
      var errorTraceback = ErrorTracebackObjectFactory.create(
      'ZeroDivisionError: integer division or modulo by zero',
      [TracebackCoordinatesObjectFactory.create(5, 1)]);

      var skulptErrorMock = {
        msg: 'ZeroDivisionError: integer division or modulo by zero ',
        traceback: [{
          lineno: 5,
          colno: 1
        }],
        toString: function() {
          return this.msg;
        }
      };

      expect(
        ErrorTracebackObjectFactory.fromSkulptError(skulptErrorMock)
          .getErrorString()
      ).toEqual(errorTraceback.getErrorString());
    });
  });

  describe('fromServerError', function() {
    it('should return the correct message for a server error', function() {
      var errorTraceback = ErrorTracebackObjectFactory.fromServerError();
      expect(errorTraceback.getErrorString()
        ).toEqual('A server error occurred. Please refresh the page.');
    });
  });

  describe('fromPythonError', function() {
    it('should return correct traceback for Python runtime errors', function() {
      var expectedLineNumber = 28;
      var expectedColumnNumber = null;
      var errorTraceback = ErrorTracebackObjectFactory.create(
      "NameError: global name 'potato' is not defined",
        [TracebackCoordinatesObjectFactory.create(
          expectedLineNumber, expectedColumnNumber)]);

      var pythonError = `Traceback (most recent call last):
  File "main.py", line 54, in <module>
    StudentCode().findMostCommonCharacter, all_tasks_test_inputs[0][0]))
  File "main.py", line 19, in runTest
    output = func(input)
  File "main.py", line 28, in findMostCommonCharacter
    return potato
NameError: global name 'potato' is not defined`;

      expect(
        ErrorTracebackObjectFactory.fromPythonError(pythonError)
          .getErrorString()
      ).toEqual(errorTraceback.getErrorString());
    });

    it('should return correct traceback for Python timeout errors', function() {
      var errorTraceback = ErrorTracebackObjectFactory.create(
        'TimeLimitError: Your code ran real slow, my dude.', null);

      var pythonError = `TimeLimitError: Your code ran real slow, my dude.`;

      expect(
        ErrorTracebackObjectFactory.fromPythonError(pythonError)
          .getErrorString()
      ).toEqual(errorTraceback.getErrorString());
    });

    it('should return correct traceback for Python syntax errors', function() {
      var expectedLineNumber = 8;
      var expectedColumnNumber = 17;
      var errorTraceback = ErrorTracebackObjectFactory.create(
      'SyntaxError: EOL while scanning string literal',
        [TracebackCoordinatesObjectFactory.create(
          expectedLineNumber, expectedColumnNumber)]);

      var pythonError = `  File "main.py", line 8
    return "TEST
               ^
SyntaxError: EOL while scanning string literal`;

      expect(
        ErrorTracebackObjectFactory.fromPythonError(pythonError)
          .getErrorString()
      ).toEqual(errorTraceback.getErrorString());
    });
  });
});
