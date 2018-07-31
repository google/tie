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
  '$window', 'EXPECTED_PARENT_PAGE_ORIGIN',
  function($window, EXPECTED_PARENT_PAGE_ORIGIN) {
    /**
     * Used to define the raw code message type.
     * @type {string}
     * @constant
     */
    var MESSAGE_TYPE_RAW_CODE = 'raw_code';

    /**
     * Sends the message to the parent page, if it exists and matches what is
     * expected, via postMessage.
     *
     * @param {string} messageType Type of message that is being sent.
     * @param {string} messageData Data to be sent to parent page.
     */
    var sendMessage = function(messageType, messageData) {
      if (EXPECTED_PARENT_PAGE_ORIGIN !== null &&
        isSameOriginForParentPageAndFrame()) {
        $window.parent.postMessage(
          JSON.stringify(messageData), EXPECTED_PARENT_PAGE_ORIGIN);
      }
    };

    /**
     * Checks whether the parent window has the same origin as
     * specified in config.
     *
     * @returns {boolean}
     */
    var isSameOriginForParentPageAndFrame = function() {
      /**
       * 0-indexed element in the array refers to the most immediate parent
       * frame origin.
       */
      var parentFrameOrigin = $window.location.ancestorOrigins[0];
      return parentFrameOrigin === EXPECTED_PARENT_PAGE_ORIGIN;
    };

    return {
      /**
       * Sends the raw user code to the parent page, if it exists and matches
       * the expected parent origin.
       *
       * @param {string} rawCode User code to send to parent page.
       */
      sendRawCode: function(rawCode) {
        sendMessage(MESSAGE_TYPE_RAW_CODE, rawCode);
      },

      /**
       * Returns whether TIE is being iframed by a page that has the same
       * origin as specified in config.
       *
       * @returns {boolean}
       */
      isIframed: function() {
        return EXPECTED_PARENT_PAGE_ORIGIN !== null &&
          isSameOriginForParentPageAndFrame();
      }
    };
  }
]);
