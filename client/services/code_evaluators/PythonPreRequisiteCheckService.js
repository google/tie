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
  '$http','$q',
  'PreRequisiteCheckResultObjectFactory', 
  function(
      $http, $q,
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

        var d = $q.defer();
        var libErrorMessage = ['It looks like you use a external',
                        'Library. The external library could be:'].join('');
        console.log($http.get('libs_json.json'));
        return $http.get('libs_json.json').then(function(success){
                    var standardLibs = success.data.Standard_Libs;
                    var codeLibs = getCodeLibs(code);
                    for(i = 0; i<codeLibs.length; i++){
                        if(!standardLibs.includes(codeLibs[i])){
                            //console.log('here');
                            //return Promise.resolve(
                                    //PreRequisiteCheckResultObjectFactory.create(
                                        //codeLibs[i], libErrorMessage));
                        //d.resolve(Promise.resolve(PreRequisiteCheckResultObjectFactory.create(code, null, null)));
                        //console.log(PreRequisiteCheckResultObjectFactory.create(code, null, null));
                        return PreRequisiteCheckResultObjectFactory.create(code, null, null);
                        //return PreRequisiteCheckResultObjectFactory.create(code, null);
                        }
                    }
                    //return Promise.resolve(PreRequisiteCheckResultObjectFactory.create(code, null));
                }
                //}, function(error){
                        //console.log(error);
                    //}
                );
            //return ret;
           //console.log(d.promise);
          //return d.promise;
           //console.log(Promise.resolve(ret)); 
           //console.log(Promise.resolve(d.promise));
           //return d.promise.then(function(data){
              ////console.log(Promise.resolve(data));  
              //return Promise.resolve(data);
           //});
        
        
        // Otherwise, code passed all pre-requisite checks
        return Promise.resolve(PreRequisiteCheckResultObjectFactory.create(code, null));
      },
      checkStarterCodePresent: checkStarterCodePresent
    };
  }
]);
