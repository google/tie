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
 * @fileoverview A service that saves student code to the browser's
 *    localStorage.
 */

tie.factory('CodeStorageService', [
  function() {
    // In some browsers, localStorage is not available and its
    // invocation throws an error.
    var localStorageIsAvailable = false;
    try {
      localStorageIsAvailable = Boolean(localStorage);
    } catch (e) {
      localStorageIsAvailable = false;
    }

    /**
     * Returns the local storage key for a given question.
     *
     * @param {string} questionId
     * @param {string} language
     * @returns {string}
     */
    var getLocalStorageKey = function(questionId, language) {
      return questionId + ":" + language;
    };

    return {
      /**
       * Checks if the local storage is available.
       *
       * @returns {boolean}
       */
      isAvailable: function() {
        return localStorageIsAvailable;
      },

      /**
       * Stores the code into local storage - so long as local storage is
       * available.
       *
       * @param {string} questionId
       * @param {string} code
       * @param {string} language
       */
      storeCode: function(questionId, code, language) {
        if (!localStorageIsAvailable) {
          return;
        }

        var localStorageKey = getLocalStorageKey(
          questionId, language);
        localStorage.setItem(localStorageKey, code);
      },

      /**
       * Loads the code from local storage if local storage is available.
       * If local storage is not available, then it returns null.
       *
       * @param {string} questionId
       * @param {string} language
       * @returns {string|null}
       */
      loadStoredCode: function(questionId, language) {
        if (!localStorageIsAvailable) {
          return null;
        }

        var localStorageKey = getLocalStorageKey(
          questionId, language);
        var storedCode = localStorage.getItem(localStorageKey);
        return storedCode;
      },

      /**
       * Clears the local storage such that there is no longer any code
       * stored there.
       *
       * @param {string} questionId
       * @param {string} language
       */
      clearLocalStorageCode: function(questionId, language) {
        if (!localStorageIsAvailable) {
          return;
        }

        var localStorageKey = getLocalStorageKey(
          questionId, language);
        localStorage.removeItem(localStorageKey);
      }
    };
  }
]);

