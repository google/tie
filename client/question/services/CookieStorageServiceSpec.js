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
 * @fileoverview Unit tests for the CookieStorageService.
 */

describe('CookieStorageService', function() {
  var $cookies;
  var CookieStorageService;
  var PRIVACY_COOKIE_NAME;

  beforeEach(module('tie'));
  beforeEach(inject(function($injector, _$cookies_) {
    CookieStorageService = $injector.get('CookieStorageService');
    PRIVACY_COOKIE_NAME = $injector.get('PRIVACY_COOKIE_NAME');
    $cookies = _$cookies_;
  }));

  describe('PrivacyCookie', function() {
    describe('setTransientPrivacyCookie', function() {
      it('should set cookie to true', function() {
        spyOn($cookies, 'put');
        CookieStorageService.setTransientPrivacyCookie();
        expect($cookies.put).toHaveBeenCalledWith(
          PRIVACY_COOKIE_NAME, 'true',
          {
            secure: true
          });
      });
    });
    // Because a secure connection cannot be tested via a local version
    // We can only test that the cookie was set to true or not set.
    describe('getPrivacyCookie', function() {
      it('should get the value of a cookie set to true', function() {
        $cookies.put(PRIVACY_COOKIE_NAME, 'true');
        expect(CookieStorageService.hasPrivacyCookie(PRIVACY_COOKIE_NAME))
          .toBe(true);
      });
      it('should return false if cookie not set', function() {
        $cookies.remove(PRIVACY_COOKIE_NAME);
        expect(CookieStorageService.hasPrivacyCookie(PRIVACY_COOKIE_NAME))
          .toBe(false);
      });
    });
  });
});
