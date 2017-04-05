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

/*
 * @fileoverview Service that store code to localStorage
 */

tie.factory('CodeStoreService', [
  function(codeSnapShot) {
    var codeStoreService = this;

     var getSavedObjFromLocalStorage = function(questionId){
      try{
        return JSON.parse(localStorage.getItem(questionId));
      }catch(e){
        console.log(e);
        return null;
      }
    }

    codeStoreService.saveCode = function(questionId, code, language){
      var savedLanguageCodes = getSavedObjFromLocalStorage(localStorage.getItem(questionId));
      if(savedLanguageCodes == null){
        savedLanguageCodes = {};
      }
      savedLanguageCodes[language] = code;
      localStorage.setItem(questionId, JSON.stringify(savedLanguageCodes));
      console.log("Code: [" + savedLanguageCodes[language] + "] saved for question id: " + questionId + ", and language: " + language);
    };
    codeStoreService.autoSaveCodeWithGivenInterval = function(questionId, code, language, intervalInMS){
      setInterval(function(){
          codeStoreService.saveCode(questionId, code);
        }, intervalInMS);
    };
    codeStoreService.autoSaveCodeWithDefaultInterval2S = function(questionId, code, language){
       codeStoreService.autoSaveCodeWithGivenInterval(questionId, code, 2000);
    }
    codeStoreService.loadSavedCode = function(questionId, language){
      console.log("questionId: " + questionId + ", language: " + language);
      var savedLanguageCodes = getSavedObjFromLocalStorage(questionId);
      if(savedLanguageCodes == null){
        console.log("savedLanguageCodes is null");
        return null;
      }else{
        return savedLanguageCodes[language];
      }
    }
    return codeStoreService;
  }
]);
