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
 * @fileoverview Unit tests for the AutosaveService.
 */

describe('AutosaveService', function() {
  var AutosaveService;
  var CurrentQuestionService;
  // In the Karma test environment, the deferred promise gets resolved only
  // when $rootScope.$digest() is called.
  var $rootScope;

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    AutosaveService = $injector.get('AutosaveService');
    CurrentQuestionService = $injector.get('CurrentQuestionService');
    $rootScope = $injector.get('$rootScope');
    localStorage.clear();
  }));

  describe('basic functionality', function() {
    it('should only activate after the question is loaded', function(done) {
      expect(function() {
        AutosaveService.getLastSavedCode('python');
      }).toThrow();
      CurrentQuestionService.init(function() {
        expect(AutosaveService.getLastSavedCode('python')).toEqual(null);
        done();
      });
      $rootScope.$digest();
    });

    it('should save and retrieve code', function(done) {
      CurrentQuestionService.init(function() {
        AutosaveService.saveCode('python', 'py_code');
        AutosaveService.saveCode('java', 'java_code');
        expect(AutosaveService.getLastSavedCode('python')).toEqual('py_code');
        expect(AutosaveService.getLastSavedCode('java')).toEqual('java_code');
        done();
      });
      $rootScope.$digest();
    });

    it('should return null if code is not found', function(done) {
      CurrentQuestionService.init(function() {
        expect(AutosaveService.getLastSavedCode('python')).toEqual(null);
        done();
      });
      $rootScope.$digest();
    });
  });
});
