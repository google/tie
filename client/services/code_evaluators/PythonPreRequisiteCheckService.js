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
  'PreRequisiteCheckResultObjectFactory', 
  function(
      PreRequisiteCheckResultObjectFactory) {   

    var checkStarterCodePresent = function(starterCode, code) {
      var starterCodeLines = starterCode.split('\n');
      var codeLines = code.split('\n')
      for (var i = 0; i < codeLines.length; i++) { 
        codeLines[i] = codeLines[i].trim();
      }
      for (var i = 0; i < starterCodeLines.length; i++) { 
        if (!(codeLines.includes(starterCodeLines[i].trim()))) {
          return false; 
        }
      }
      return true;
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
        
        
        // Otherwise, code passed all pre-requisite checks
        return Promise.resolve(PreRequisiteCheckResultObjectFactory.create(code, null));
      },
      checkStarterCodePresent: checkStarterCodePresent
    };
  }
]);
