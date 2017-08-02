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
 * @fileoverview Unit tests for the PrereqCheckDispatcherServiceSpec.
 */
describe('PrereqCheckDispatcherService', function() {
  var PrereqCheckDispatcherService;
  var LANGUAGE_PYTHON = 'python';

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    PrereqCheckDispatcherService = $injector.get(
      'PrereqCheckDispatcherService');
  }));

  describe('checkCode', function() {
    it('correctly calls PythonPrereqCheckService when the language is python',
      function() {
        var code = [
          'def myFunction(arg):',
          '    return result',
          'def yourFunction(arg):',
          '    return result',
          ''
        ].join('\n');
        var prereqCheckResults = PrereqCheckDispatcherService.checkCode(
          LANGUAGE_PYTHON, code, code);
        expect(prereqCheckResults).toEqual(null);
      }
    );

    it('throws an error when an unsupported language is used', function() {
      expect(function() {
        PrereqCheckDispatcherService.checkCode('invalidLanguage', '', '');
      }).toThrow();
    });
  });
});
