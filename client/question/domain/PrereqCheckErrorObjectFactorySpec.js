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
 * @fileoverview Unit tests for PrereqCheckErrorObjectFactory domain objects.
 */

describe('PrereqCheckErrorObjectFactory', function() {
  var PrereqCheckErrorObjectFactory;

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    PrereqCheckErrorObjectFactory = $injector.get(
      'PrereqCheckErrorObjectFactory');
  }));
  var errorName = 'notOp';
  var errorLineNumber = 2;

  describe('create', function() {
    it('should generate an object with name and line number', function() {
      var TestObject = {
        _errorName: 'notOp',
        _errorLineNumber: 2
      };
      var PrereqCheckError = PrereqCheckErrorObjectFactory.create(
        errorName, errorLineNumber);

      expect(PrereqCheckError).toEqual(jasmine.objectContaining(TestObject));
    });
  });

  describe('getErrorName', function() {
    it('should return string from error object', function() {
      var PrereqCheckError = PrereqCheckErrorObjectFactory.create(
        errorName, errorLineNumber);
      expect(PrereqCheckError.getErrorName()).toEqual('notOp');
    });
  });

  describe('nullMultilineReturn', function() {
    var negativeErrorLineNumber = -5;
    it('should return null if error is a multiline notOp', function() {
      var PrereqCheckMultilineError = PrereqCheckErrorObjectFactory.create(
      errorName, negativeErrorLineNumber);

      expect(PrereqCheckMultilineError).toBeNull();
    });

    it('return name and null line number for non-notOp errors', function() {
      errorName = 'andOp';
      var PrereqCheckMultilineError = PrereqCheckErrorObjectFactory.create(
      errorName, negativeErrorLineNumber);

      expect(PrereqCheckMultilineError.getErrorName()).toEqual(errorName);
      expect(PrereqCheckMultilineError.getErrorLineNumber()).toBeNull();
    });
  });
});
