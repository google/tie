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
 * @fileoverview Service that maintains an anonymized record of the user's
 * session via a unique session ID.
 */

tie.factory('SessionIdService', [
  function() {
    var SESSION_ID_LENGTH = 100;

    /**
     * Global object to keep track of the session ID.
     * @type {string}
     */
    var sessionId = null;

    /**
     * Generates a pseudorandom sessionId.
     *
     * @returns {string}
     */
    var _createSessionId = function() {
      var idArray = [];
      var possible = ['ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
        '0123456789'].join('');

      for (var i = 0; i < SESSION_ID_LENGTH; i++) {
        idArray.push(
          possible.charAt(Math.floor(Math.random() * possible.length)));
      }
      return idArray.join('');
    };

    return {
      _createSessionId: _createSessionId,

      /**
       * A getter for the sessionId property. Will also create a sessionId
       * if the current sessionId is null.
       *
       * @returns {string}
       */
      getSessionId: function() {
        if (sessionId === null) {
          sessionId = _createSessionId();
        }
        return sessionId;
      },

      /**
       * A method that resets the sessionId property.
       */
      resetSessionId: function() {
        sessionId = _createSessionId();
      }
    };
  }
]);
