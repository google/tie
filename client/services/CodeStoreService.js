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
tie.factory('CodeStoreService', ['DEFAULT_AUTO_SAVE_SECONDS',
  function(DEFAULT_AUTO_SAVE_SECONDS) {
    var codeStoreService = {};
    var SECONDS_TO_MILLISECONDS = 1000;
    var getObjFromLocalStorage = function(questionId) {
      try {
        return JSON.parse(localStorage.getItem(questionId));
      } catch (e) {
        return null;
      }
    };

    codeStoreService.saveCode = function(questionId, code, language) {
      var savedLanguageCodes = getObjFromLocalStorage(
        localStorage.getItem(questionId));
      if (savedLanguageCodes === null) {
        savedLanguageCodes = {};
      }
      savedLanguageCodes[language] = code;
      localStorage.setItem(questionId, JSON.stringify(savedLanguageCodes));
    };
    codeStoreService.autoSaveCodeWithGivenInterval = function(
      questionId, code, language, intervalInSeconds) {
      setInterval(function() {
        codeStoreService.saveCode(questionId, code);
      }, intervalInSeconds * SECONDS_TO_MILLISECONDS);
    };
    codeStoreService.autoSaveCodeWithDefaultInterval2S = function(
      questionId, code, language) {
      codeStoreService.autoSaveCodeWithGivenInterval(
        questionId, code, language, 
        DEFAULT_AUTO_SAVE_SECONDS * SECONDS_TO_MILLISECONDS);
    };
    codeStoreService.loadSavedCode = function(questionId, language) {
      var savedLanguageCodes = getObjFromLocalStorage(questionId);
      if (savedLanguageCodes === null) {
        return null;
      } else {
        return savedLanguageCodes[language];
      }
    };
    return codeStoreService;
  }
]);
