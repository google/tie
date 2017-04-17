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

  describe('fromSkulptError', function() {
    it('should correctly create error track', function() {
      var errorTraceback = ErrorTracebackObjectFactory.create(
      'ZeroDivisionError: integer division or modulo by zero',
      [TracebackCoordinatesObjectFactory.create(5, 1)]);

      var skulptError = new Object();
      skulptError.msg = 'ZeroDivisionError: integer division or modulo by zero ';
      skulptError.traceback = [{lineno:5,colno:1}];

      skulptError.toString = function errorToString() {return this.msg;}

      expect(ErrorTracebackObjectFactory.fromSkulptError(
            skulptError).getErrorString()).toEqual(errorTraceback.getErrorString());
    });
  });
});
