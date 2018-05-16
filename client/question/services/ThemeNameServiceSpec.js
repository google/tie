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
 * @fileoverview Unit tests for the ThemeNameService.
 */

describe('ThemeNameService', function() {
  var ThemeNameService;
  var PRIMER_DIRECTORY_URL;
  var THEME_NAME_LIGHT;
  var THEME_NAME_DARK;

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    ThemeNameService = $injector.get('ThemeNameService');
    PRIMER_DIRECTORY_URL = $injector.get('PRIMER_DIRECTORY_URL');
    THEME_NAME_LIGHT = $injector.get('THEME_NAME_LIGHT');
    THEME_NAME_DARK = $injector.get('THEME_NAME_DARK');
  }));

  describe('setThemeName', function() {
    it('should correctly set and retrieve the theme name', function() {
      ThemeNameService.setThemeName(THEME_NAME_LIGHT);
      expect(ThemeNameService.getCurrentThemeName()).toEqual(THEME_NAME_LIGHT);

      ThemeNameService.setThemeName(THEME_NAME_DARK);
      expect(ThemeNameService.getCurrentThemeName()).toEqual(THEME_NAME_DARK);
    });
  });

  describe('isInDarkMode', function() {
    it('should correctly identify whether the theme is dark mode', function() {
      ThemeNameService.setThemeName(THEME_NAME_LIGHT);
      expect(ThemeNameService.isDarkModeEnabled()).toBe(false);

      ThemeNameService.setThemeName(THEME_NAME_DARK);
      expect(ThemeNameService.isDarkModeEnabled()).toBe(true);
    });
  });

  describe('getPythonPrimerUrl', function() {
    it('should correctly get the appropriate Python primer URL', function() {
      ThemeNameService.setThemeName(THEME_NAME_LIGHT);
      expect(ThemeNameService.getPythonPrimerUrl()).toBe(
        PRIMER_DIRECTORY_URL + 'py-primer-light.html');

      ThemeNameService.setThemeName(THEME_NAME_DARK);
      expect(ThemeNameService.getPythonPrimerUrl()).toBe(
        PRIMER_DIRECTORY_URL + 'py-primer-dark.html');
    });
  });
});
