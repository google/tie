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
 * @fileoverview A service that stores cookies.
 */

tie.factory('CookieStorageService', ['$cookies', 'PRIVACY_COOKIE_LIFETIME',
  'PRIVACY_COOKIE_NAME',
  function($cookies, PRIVACY_COOKIE_LIFETIME, PRIVACY_COOKIE_NAME) {

    return {
      /**
       * Sets the privacy policy cookie with a 6 month expiration date and with
       * a true value.
       */
      setPrivacyCookieWithExpiryDate: function() {
        var expiryDate = new Date();
        expiryDate.setDate(
          expiryDate.getDate() + PRIVACY_COOKIE_LIFETIME);
        $cookies.put(PRIVACY_COOKIE_NAME, 'true', {expires: expiryDate});
      },
      /**
       * Sets the privacy policy cookie to be true. Default
       * expiration ends when the browser session ends.
       */
      setPrivacyCookieToBeTrue: function() {
        $cookies.put(PRIVACY_COOKIE_NAME, 'true');
      },
      /**
       * Sets the privacy policy cookie to be false. Default
       * expiration ends when the browser session ends.
       */
      setPrivacyCookieToBeFalse: function() {
        $cookies.put(PRIVACY_COOKIE_NAME, 'false');
      },
      /**
       * Retrieves the privacy policy cookie value.
       */
      getPrivacyCookie: function() {
        return ($cookies.get(PRIVACY_COOKIE_NAME) === 'true');
      }
    };
  }
]);
