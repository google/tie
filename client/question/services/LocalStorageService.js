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
 * @fileoverview A service that wraps the browser's localStorage object. Note
 * that localStorage namespacing should be handled by
 * LocalStorageKeyManagerService instead.
 *
 * All values that TIE stores in localStorage are encoded as JSON strings.
 */

tie.factory('LocalStorageService', [
  'ServerHandlerService', function(ServerHandlerService) {
    var localStorageIsAvailable = false;
    // We only use localStorage in the standalone version of the application.
    if (!ServerHandlerService.doesServerExist()) {
      // In some browsers, localStorage is not available and its invocation
      // throws an error.
      try {
        localStorageIsAvailable = Boolean(localStorage);
      } catch (e) {
        localStorageIsAvailable = false;
      }
    }

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
       * Deletes an item in local storage.
       *
       * @param {string} localStorageKey
       *
       * @returns {*} The data corresponding to the key, or null if the item
       *   does not exist in local storage.
       */
      get: function(localStorageKey) {
        if (!localStorageIsAvailable) {
          return null;
        }

        return angular.fromJson(localStorage.getItem(localStorageKey));
      },

      /**
       * Saves an item to local storage.
       *
       * @param {string} localStorageKey
       * @param {*} value The value to associate with the key. This value can
       *   be any standard JavaScript construct that is losslessly
       *   JSON-serializable.
       */
      put: function(localStorageKey, value) {
        if (!localStorageIsAvailable) {
          return;
        }

        localStorage.setItem(localStorageKey, angular.toJson(value));
      },

      /**
       * Deletes an item in local storage.
       *
       * @param {string} localStorageKey
       */
      delete: function(localStorageKey) {
        if (!localStorageIsAvailable) {
          return;
        }

        localStorage.removeItem(localStorageKey);
      }
    };
  }
]);
