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
 * @fileoverview Factory for creating new frontend instances of Feedback
 * domain objects.
 */

tie.factory('FeedbackObjectFactory', [
  'FeedbackParagraphObjectFactory', function(FeedbackParagraphObjectFactory) {
    var Feedback = function(answerIsCorrect) {
      this._paragraphs = [];
      this._answerIsCorrect = answerIsCorrect;
      // This records what message was displayed with this feedback.
      // If no message was displayed, this will remain null.
      this._hintIndex = null;
      this._syntaxErrorIndex = null;
    };

    // Instance methods.
    Feedback.prototype.getParagraphs = function() {
      return this._paragraphs;
    };

    Feedback.prototype.isAnswerCorrect = function() {
      return this._answerIsCorrect;
    };

    Feedback.prototype.appendTextParagraph = function(text) {
      this._paragraphs.push(
        FeedbackParagraphObjectFactory.createTextParagraph(text));
    };

    Feedback.prototype.appendCodeParagraph = function(code) {
      if (this._paragraphs.length === 0) {
        throw Error('The first feedback paragraph should be a text paragraph.');
      }
      this._paragraphs.push(
        FeedbackParagraphObjectFactory.createCodeParagraph(code));
    };

    Feedback.prototype.clear = function() {
      this._paragraphs.length = 0;
    };

    Feedback.prototype.getHintIndex = function() {
      return this._hintIndex;
    };

    Feedback.prototype.setHintIndex = function(index) {
      this._hintIndex = index;
    };

    Feedback.prototype.getSyntaxErrorIndex = function() {
      return this._syntaxErrorIndex;
    };

    Feedback.prototype.setSyntaxErrorIndex = function(index) {
      this._syntaxErrorIndex = index;
    };

    // Static class methods.
    Feedback.create = function(answerIsCorrect) {
      return new Feedback(answerIsCorrect);
    };

    return Feedback;
  }
]);
