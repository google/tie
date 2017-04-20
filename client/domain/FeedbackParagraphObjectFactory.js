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
 * @fileoverview Factory for creating new frontend instances of
 * FeedbackParagraph domain objects.
 */

tie.factory('FeedbackParagraphObjectFactory', [
  function() {
    var PARAGRAPH_TYPE_TEXT = 'text';
    var PARAGRAPH_TYPE_CODE = 'code';

    var FeedbackParagraph = function(type, content) {
      this._type = type;
      this._content = content;
    };

    // Instance methods.
    FeedbackParagraph.prototype.isTextParagraph = function() {
      return this._type === PARAGRAPH_TYPE_TEXT;
    };

    FeedbackParagraph.prototype.isCodeParagraph = function() {
      return this._type === PARAGRAPH_TYPE_CODE;
    };

    FeedbackParagraph.prototype.getContent = function() {
      return this._content;
    };

    // Static class methods.
    FeedbackParagraph.createTextParagraph = function(text) {
      return new FeedbackParagraph(PARAGRAPH_TYPE_TEXT, text);
    };

    FeedbackParagraph.createCodeParagraph = function(code) {
      return new FeedbackParagraph(PARAGRAPH_TYPE_CODE, code);
    };

    return FeedbackParagraph;
  }
]);
