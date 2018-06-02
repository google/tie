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
 * @fileoverview A service for managing the keys used in localStorage. All
 * localStorage key management should be done here in order to reduce the
 * likelihood of collisions.
 */

tie.factory('LocalStorageKeyManagerService', [
  function() {
    // TIE uses local storage with the following key structure:
    //
    // - tie:1:lastSavedCode:{{questionId}}:{{language}} -- the last saved
    //     code (a string)
    // - tie:1:sessionHistory:{{questionId}} -- the session history
    //     (a list of speech balloon dicts)
    //
    // The second number in each key is for version control. If this schema
    // changes, that number should be updated to prevent collision.

    return {
      /**
       * Returns the local storage key for the last saved code for a given
       * question.
       *
       * @param {string} questionId
       * @param {string} language
       * @returns {string}
       */
      getLastSavedCodeKey: function(questionId, language) {
        return 'tie:1:lastSavedCode:' + questionId + ':' + language;
      },

      /**
       * Returns the local storage key for the session history.
       *
       * @param {string} questionId
       * @returns {string}
       */
      getSessionHistoryKey: function(questionId) {
        return 'tie:1:sessionHistory:' + questionId;
      }
    };
  }
]);
