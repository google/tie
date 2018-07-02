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
 * @fileoverview A service for handling the autosave flow.
 */

tie.factory('AutosaveService', [
  'CurrentQuestionService', 'LocalStorageService',
  'LocalStorageKeyManagerService',
  function(
      CurrentQuestionService, LocalStorageService,
      LocalStorageKeyManagerService) {
    return {
      /**
       * Retrieves the last-saved code from localStorage.
       *
       * @param {string} language The language that the code is written in.
       * @returns {string|null} The last saved code, or null if it does not
       *   exist.
       */
      getLastSavedCode: function(language) {
        if (!CurrentQuestionService.isInitialized()) {
          throw Error(
            'CurrentQuestionService must be initialized before ' +
            'AutosaveService.getLastSavedCode() is called.');
        }

        var questionId = CurrentQuestionService.getCurrentQuestionId();
        var localStorageKey = (
          LocalStorageKeyManagerService.getLastSavedCodeKey(
            questionId, language));
        return LocalStorageService.get(localStorageKey);
      },

      /**
       * Saves the current version of the code in localStorage.
       *
       * @param {string} language The language that the code is written in.
       * @param {string} code The code to be saved.
       * @returns {string|null} The last saved code, or null if it does not
       *   exist.
       */
      saveCode: function(language, code) {
        var questionId = CurrentQuestionService.getCurrentQuestionId();
        var localStorageKey = (
          LocalStorageKeyManagerService.getLastSavedCodeKey(
            questionId, language));
        LocalStorageService.put(localStorageKey, code);
      }
    };
  }
]);
