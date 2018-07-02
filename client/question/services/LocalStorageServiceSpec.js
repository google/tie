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
 * @fileoverview Unit tests for the LocalStorageService.
 * Please be aware, the hash key format is {{questionId}}:{{language}}
 */

describe('LocalStorageService', function() {
  var LocalStorageService;

  beforeEach(module('tie'));
  afterEach(function() {
    localStorage.clear();
  });

  describe('LocalStorageService', function() {
    describe('with a server', function() {
      beforeEach(module(function($provide) {
        $provide.value('ServerHandlerService', {
          doesServerExist: function() {
            return true;
          }
        });
      }));

      beforeEach(inject(function($injector) {
        LocalStorageService = $injector.get('LocalStorageService');
        localStorage.clear();
      }));

      it('should be unavailable', function() {
        expect(LocalStorageService.isAvailable()).toBe(false);
      });

      it('should not save or retrieve anything', function() {
        LocalStorageService.put('abc', 'def');
        expect(localStorage.getItem('abc')).toBe(null);
        expect(LocalStorageService.get('abc')).toBe(null);
      });
    });

    describe('with no server', function() {
      beforeEach(module(function($provide) {
        $provide.value('ServerHandlerService', {
          doesServerExist: function() {
            return false;
          }
        });
      }));

      beforeEach(inject(function($injector) {
        LocalStorageService = $injector.get('LocalStorageService');
        localStorage.clear();
      }));

      it('should be available', function() {
        expect(LocalStorageService.isAvailable()).toBe(true);
      });

      it('should save and retrieve correctly', function() {
        LocalStorageService.put('abc', 'value');
        expect(LocalStorageService.get('abc')).toBe('value');
        LocalStorageService.put('abc', 'newValue');
        expect(LocalStorageService.get('abc')).toBe('newValue');
      });

      it('should delete values correctly', function() {
        LocalStorageService.put('abc', 'value');
        expect(LocalStorageService.get('abc')).toBe('value');
        LocalStorageService.delete('abc');
        expect(LocalStorageService.get('abc')).toBe(null);
      });
    });
  });
});
