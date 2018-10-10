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
 * @fileoverview This file contains deployment specific constants.
 */

tieConfig.constant('SERVER_URL', null);

tieConfig.constant('PRIMER_DIRECTORY_URL', 'docs/');

tieConfig.constant('ALLOW_PRINTING', false);

/**
 * Default question ID to use if no qid parameter is specified in the URL.
 *
 * @type {string}
 * @constant
 */
tieConfig.constant('DEFAULT_QUESTION_ID', 'reverseWords');

/**
 * For the definition of an origin, please see
 * https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy.
 */
tieConfig.constant('EXPECTED_PARENT_PAGE_ORIGIN', null);

/*
 * Shows the privacy modal on-click if a URL to a separate privacy page does
 * not exist.
 */
tieConfig.constant('PRIVACY_URL', null);

/*
 * If a URL is specified, then a Terms button will appear in the UI.
 */
tieConfig.constant('TERMS_OF_USE_URL', null);

tieConfig.constant('ABOUT_TIE_LABEL', 'About TIE');

tieConfig.constant('ABOUT_TIE_URL', 'https://google.github.io/tie/');
