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
  var error = {
    errorName: 'notOp',
    errorLineNumber: 2,
    errorColumnNumber: 20
  };
  var PrereqCheckError;

  describe('create', function() {
    it('should generate an object with name, line & column number', function() {
      PrereqCheckError = PrereqCheckErrorObjectFactory.create(
        error.errorName, error.errorLineNumber, error.errorColumnNumber);

      expect(PrereqCheckError.getErrorName()).toEqual(error.errorName);
      expect(PrereqCheckError.getErrorLineNumber()).toEqual(
        error.errorLineNumber);
      expect(PrereqCheckError.getErrorColumnNumber()).toEqual(
        error.errorColumnNumber);
    });

    it('should result in a fixed errorType', function() {
      expect(PrereqCheckError._errorType).toEqual('wrongLang');
    });
  });

  describe('errorName', function() {
    it('getErrorName should return string from error object', function() {
      expect(PrereqCheckError.getErrorName()).toEqual('notOp');
    });

    it('setErrorName should update error object', function() {
      var newErrorName = 'andOp';

      PrereqCheckError.setErrorName(newErrorName);
      expect(PrereqCheckError.getErrorName()).toEqual(newErrorName);
    });
  });

  describe('errorLine', function() {
    it('getErrorLine should return integer from error object', function() {
      expect(PrereqCheckError.getErrorLineNumber()).toEqual(
        error.errorLineNumber);
    });

    it('setErrorLine should update error object', function() {
      var newErrorLineNumber = 35;

      PrereqCheckError.setErrorLineNumber(newErrorLineNumber);
      expect(PrereqCheckError.getErrorLineNumber()).toEqual(newErrorLineNumber);
    });
  });

  describe('errorColumn', function() {
    it('getErrorLine should return integer from error object', function() {
      expect(PrereqCheckError.getErrorColumnNumber()).toEqual(
        error.errorColumnNumber);
    });

    it('setErrorColumn should update error object', function() {
      var newErrorColumnNumber = 12;

      PrereqCheckError.setErrorColumnNumber(newErrorColumnNumber);
      expect(PrereqCheckError.getErrorColumnNumber()).toEqual(
        newErrorColumnNumber);
    });
  });
});
