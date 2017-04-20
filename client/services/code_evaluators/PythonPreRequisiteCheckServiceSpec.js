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
 * @fileoverview Unit tests for the PythonPreRequisiteCheckService.
 */

describe('PythonPreRequisiteCheckService', function() {
	var PythonPreRequisiteCheckService;

	beforeEach(module('tie'));
	beforeEach(inject(function($injector) {
		PythonPreRequisiteCheckService = $injector.get(
			'PythonPreRequisiteCheckService');
	}));

	describe('checkStarterCodePresent', function() {
		var starterCode = ['def myFunction(arg):\n',
			'\treturn result\n'].join('');

		it('returns true if starter code lines are found in code', function() {
			var starterCode = ['def myFunction(arg):\n',
			'\treturn result\n'].join();
			var code = ['def myFunction(arg):\n',
			'\tresult = arg.rstrip()\n',
			'\treturn result\n'].join('');
			var starterCodePresent =
				PythonPreRequisiteCheckService.checkStarterCodePresent(
					starterCode, code);
			expect(starterCodePresent).toEqual(true);
		});
		it('returns false if starter code line is not found (modified)',
			function() {
				var code = ['def yourFunction(arg):\n',
				'\tresult = arg.rstrip()\n',
				'\treturn result\n'].join('');
				var starterCodePresent =
					PythonPreRequisiteCheckService.checkStarterCodePresent(
						starterCode, code);
				expect(starterCodePresent).toEqual(false);
		});
		it('returns false if starter code line is not found (deleted)',
			function() {
				var code = ['\tresult = arg.rstrip()\n',
				'\treturn result\n'].join('');
				var starterCodePresent =
					PythonPreRequisiteCheckService.checkStarterCodePresent(
						starterCode, code);
				expect(starterCodePresent).toEqual(false);
		});
		it('returns true when only argument to \'return\' is modified)',
			function() {
				var code = ['def myFunction(arg):\n',
					'\tresult = arg.rstrip()\n',
					'\treturn myResult\n'].join('');
				var starterCodePresent =
					PythonPreRequisiteCheckService.checkStarterCodePresent(
						starterCode, code);
				expect(starterCodePresent).toEqual(true);
		});
		it('returns false when starter code lines are present, but out of order',
			function() {
				var code = ['\treturn result\n',
					'\tresult = arg.rstrip()\n',
					'def myFunction(arg):\n'].join('');
				var starterCodePresent =
					PythonPreRequisiteCheckService.checkStarterCodePresent(
						starterCode, code);
				expect(starterCodePresent).toEqual(false);
		});
	});
	describe('getCodeLibs', function() {
		it('correctly parses import statements', function() {
			var code = ['import numpy\n',
				'import pandas\n', '\n',
				'def myFunction(arg): \n',
				'\treturn arg'].join('');
			var codeLibs =
				PythonPreRequisiteCheckService.getCodeLibs(code);
			expect(codeLibs).toEqual(['numpy','pandas']);
		});
		it('does not capture strings with \'import\' in text', function() {
			var code = ['def myFunction(arg): \n',
				'\tresult = str(arg) + \'import this\'',
				'\treturn result'].join('');
			var codeLibs =
				PythonPreRequisiteCheckService.getCodeLibs(code);
			expect(codeLibs).toEqual([]);
		});
	});
});
