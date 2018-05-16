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
 * @fileoverview A service that stores the user's light/dark mode preference.
 */

tie.constant('THEME_NAME_LIGHT', 'Light Theme');
tie.constant('THEME_NAME_DARK', 'Dark Theme');

tie.factory('ThemeNameService', [
  'PRIMER_DIRECTORY_URL', 'THEME_NAME_LIGHT', 'THEME_NAME_DARK',
  function(PRIMER_DIRECTORY_URL, THEME_NAME_LIGHT, THEME_NAME_DARK) {
    var currentThemeName = THEME_NAME_LIGHT;

    return {
      setThemeName: function(newThemeName) {
        currentThemeName = newThemeName;
      },
      getCurrentThemeName: function() {
        return currentThemeName;
      },
      isDarkModeEnabled: function() {
        return currentThemeName === THEME_NAME_DARK;
      },
      /**
       * Provides the URL to the appropriately themed python primer file.
       */
      getPythonPrimerUrl: function() {
        var primerTheme = this.isDarkModeEnabled() ? 'dark' : 'light';
        return (
          PRIMER_DIRECTORY_URL + 'py-primer-' + primerTheme + '.html');
      }
    };
  }
]);
