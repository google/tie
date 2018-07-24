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
 * @fileoverview Service that handles all TIE interactions with its parent
 * page.
 */
tie.factory('ParentPageService', [
  '$window', 'PARENT_PAGE_ORIGIN', function($window, PARENT_PAGE_ORIGIN) {
    return {
      /**
       * Sends the message to the parent page, if it exists, via postMessage.
       *
       * @param {String} messageType Type of message that is being sent.
       * @param {String} messageData Data to be sent to parent page.
       */
      sendMessage: function(messageType, messageData) {
        if (PARENT_PAGE_ORIGIN) {
          $window.parent.postMessage(
            JSON.stringify(messageData), PARENT_PAGE_ORIGIN);
        }
      },
      /**
       * Returns the origin of the parent page, if it exists. Otherwise,
       * returns null.
       * @return {String|null}
       */
      getParentPageOrigin: function() {
        return PARENT_PAGE_ORIGIN;
      }
    };
  }
]);
