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
 * @fileoverview Module for storing question and user data.
 */

window.globalData = {
  /**
   * Question data will be stored here, keyed by question ID.
   * Questions are instantiated in assets/questions, and they add themselves
   * to this dictionary when they're instantiated.
   *
   * @type {dict}
   */
  questions: {}
};

window.tieData = angular.module('tieData', []);

/**
 * The current schema version for questions in the client. All questions in
 * assets/questions and the checks in assets/tests should always be consistent
 * with this schema version.
 *
 * @type {number}
 * @constant
 */
tieData.constant('CURRENT_QUESTION_SCHEMA_VERSION_IN_CLIENT', 1);

/**
 * Class name for wrapping auxiliary code, primarily used for test evaluation.
 *
 * @type {string}
 * @constant
 */
tieData.constant('CLASS_NAME_AUXILIARY_CODE', 'AuxiliaryCode');

/**
 * Class name for wrapping system code.
 *
 * @type {string}
 * @constant
 */
tieData.constant('CLASS_NAME_SYSTEM_CODE', 'System');

/**
 * FeedbackParagraph type that will be rendered to look like a normal text
 * paragraph.
 *
 * @type {string}
 * @constant
 */
tieData.constant('PARAGRAPH_TYPE_TEXT', 'text');

/**
 * FeedbackParagraph type that will render text to look like code.
 *
 * @type {string}
 * @constant
 */
tieData.constant('PARAGRAPH_TYPE_CODE', 'code');

/**
 * FeedbackParagraph type that will render text to bring attention to an error.
 *
 * @type {string}
 * @constant
 */
tieData.constant('PARAGRAPH_TYPE_ERROR', 'error');

/**
 * FeedbackParagraph type for displaying user code output.
 *
 * @type {string}
 * @constant
 */
tieData.constant('PARAGRAPH_TYPE_OUTPUT', 'output');

/**
 * FeedbackParagraph type for displaying an image.
 *
 * @type {string}
 * @constant
 */
tieData.constant('PARAGRAPH_TYPE_IMAGE', 'image');
