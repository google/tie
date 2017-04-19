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
 * @fileoverview Service for performing pre-requisite checks on Python code snippets.
 */

tie.factory('PythonPreRequisiteCheckService', [
  'PYTHON_STANDARD_LIBRARIES',
  'PreRequisiteCheckResultObjectFactory', 
  function(
      PYTHON_STANDARD_LIBRARIES,
      PreRequisiteCheckResultObjectFactory) {   

    var checkStarterCodePresent = function(starterCode, code) {
      var starterCodeLines = starterCode.split('\n');
      var codeLines = code.split('\n');
      for (var i = 0; i < codeLines.length; i++) { 
        codeLines[i] = codeLines[i].trim();
      }
      for (var i = 0; i < starterCodeLines.length; i++) {
        var starterCodeLine = starterCodeLines[i].trim();
        // var codePresent = codeLines.includes(starterCodeLine); 
        if (codeLines.indexOf(starterCodeLine) < 0) {
          return false; 
        }
      }
      return true;
    };

	var getCodeLibs = function(code){
		var codeLines = code.split('\n');
		var coddLibs = [];
		//var pattern = new RegExp('^\\ {4}import\\ \\w+$');
		var pattern = new RegExp('^import\\ \\w+$');
		for(i=0; i<codeLines.length; i++){
			if(pattern.test(codeLines[i])){
				var words = codeLines[i].split(' ');
				coddLibs.push(words[1]);
			}
		}	
		return coddLibs;
	};

    return {
      // Returns a promise.
      checkCode: function(starterCode, code) {
        
        // TODO: check that starter code has not been modified: 
        // if check fails:
        // return PreRequisiteCheckResultObjectFactory.create(
        //  code, errorMessage);
        if (!(checkStarterCodePresent(starterCode, code))) {
          var errorMessage = ['It looks like you deleted or modified ',
            'the starter code!  Our evaluation program requires the ',
            'function names given in the starter code.  Here\'s the '
            ,'starter code again:'].join(''); 
          return Promise.resolve(
            PreRequisiteCheckResultObjectFactory.create(
              code, errorMessage, starterCode));
        } 
        

        // TODO: check that there are no unsupported/disallowed imports (e.g., numpy)
        // if check fails:
        // return PreRequisiteCheckResultObjectFactory.create(
        //    code, errorMessage);

        var libErrorMessage = ['It looks like you use a external ',
                        'Library. You can only use standard libraries.',
                        'The external Libraries could be:'].join('');
        codeLibs = getCodeLibs(code);
        var extLibs = [];
        for(var i = 0; i<codeLibs.length; i++){
            var lib = codeLibs[i].trim();
            if(PYTHON_STANDARD_LIBRARIES.indexOf(lib)<0){
                extLibs.push(lib);
            }
        }
        if(extLibs.length!==0){
            var extLibsString = '';
            for(var i = 0; i<extLibs.length; i++){
                extLibsString = extLibsString.concat(extLibs[i]+'\n');
            }
            extLibsString = extLibsString.substring(0, extLibsString.length-1);
            return Promise.resolve(
                    PreRequisiteCheckResultObjectFactory.create(
                        code, libErrorMessage, extLibsString));
        }
        // Otherwise, code passed all pre-requisite checks
        return Promise.resolve(PreRequisiteCheckResultObjectFactory.create(code, null));
      },
      checkStarterCodePresent: checkStarterCodePresent
    };
  }
]);
