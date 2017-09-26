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
  beforeEach(module('ngCookies'));
  beforeEach(inject(function($injector, _$cookies_) {
    CookieStorageService = $injector.get('CookieStorageService');

    PRIVACY_COOKIE_NAME = $injector.get('PRIVACY_COOKIE_NAME');
    $cookies = _$cookies_;
  }));

  describe('PrivacyCookie', function() {
    describe('setPrivacyCookie', function() {
      it('should set cookie to value', function() {
        CookieStorageService.setPrivacyCookieToBeTrue();
        expect($cookies.get(PRIVACY_COOKIE_NAME)).toBe('true');
        CookieStorageService.setPrivacyCookieToBeFalse();
        expect($cookies.get(PRIVACY_COOKIE_NAME)).toBe('false');
      });
    });
    describe('getPrivacyCookie', function() {
      it('should get the value of a cookie', function() {
        $cookies.put(PRIVACY_COOKIE_NAME, 'true');
        expect(CookieStorageService.getPrivacyCookie(PRIVACY_COOKIE_NAME))
          .toBe(true);
        $cookies.put(PRIVACY_COOKIE_NAME, 'false');
        expect(CookieStorageService.getPrivacyCookie(PRIVACY_COOKIE_NAME))
          .toBe(false);
      });
    });
  });
});
