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
  'PARAGRAPH_TYPE_TEXT', 'PARAGRAPH_TYPE_CODE', 'PARAGRAPH_TYPE_SYNTAX_ERROR',
  function(PARAGRAPH_TYPE_TEXT, PARAGRAPH_TYPE_CODE,
    PARAGRAPH_TYPE_SYNTAX_ERROR) {
    /**
     * FeedbackParagraph objects have all of the information necessary
     * to represent one paragraph of feedback (code-, text-, or error-based) in
     * the UI.
     */

    /**
     * Constructor for FeedbackParagraph
     *
     * @param {string} type Indicates what type of Feedback Paragraph this
     *    object is
     * @param {string} content Is the content to be included in the Feedback
     *    Paragraph
     * @constructor
     */
    var FeedbackParagraph = function(type, content) {
      /**
       * Property indicates what type of FeedbackParagraph this object is.
       *
       * @type {string}
       * @private
       */
      this._type = type;

      /**
       * Property holds the text/code/Syntax Error description for this object.
       *
       * @type {string}
       * @private
       */
      this._content = content;
    };

    // Instance methods.
    /**
     * Checks if the Paragraph is a text-based paragraph
     *
     * @returns {boolean}
     */
    FeedbackParagraph.prototype.isTextParagraph = function() {
      return this._type === PARAGRAPH_TYPE_TEXT;
    };

    /**
     * Checks if the Paragraph is a paragraph consisting of code
     *
     * @returns {boolean}
     */
    FeedbackParagraph.prototype.isCodeParagraph = function() {
      return this._type === PARAGRAPH_TYPE_CODE;
    };

    /**
     * Checks if the Paragraph is a paragraph with a syntax error in it.
     * @returns {boolean}
     */
    FeedbackParagraph.prototype.isSyntaxErrorParagraph = function() {
      return this._type === PARAGRAPH_TYPE_SYNTAX_ERROR;
    };

    /**
     * A getter for the _content property.
     *
     * @returns {string}
     */
    FeedbackParagraph.prototype.getContent = function() {
      return this._content;
    };

    // Static class methods.
    /**
     * Returns a text-based FeedbackParagraph with the given text inside it.
     *
     * @param {string} text
     * @returns {FeedbackParagraph}
     */
    FeedbackParagraph.createTextParagraph = function(text) {
      return new FeedbackParagraph(PARAGRAPH_TYPE_TEXT, text);
    };

    /**
     * Returns a FeedbackParagraph made up of code given in the parameter.
     *
     * @param {string} code Code to be in the paragraph
     * @returns {FeedbackParagraph}
     */
    FeedbackParagraph.createCodeParagraph = function(code) {
      return new FeedbackParagraph(PARAGRAPH_TYPE_CODE, code);
    };

    /**
     * Returns a FeedbackParagraph with a Syntax Error's description in it.
     *
     * @param {string} error Error description to be in the paragraph.
     * @returns {FeedbackParagraph}
     */
    FeedbackParagraph.createSyntaxErrorParagraph = function(error) {
      return new FeedbackParagraph(PARAGRAPH_TYPE_SYNTAX_ERROR, error);
    };

    /**
     * Returns a FeedbackParagraph created from an object.
     *
     * @param {Object} dict Object parsed from json
     * @returns {FeedbackParagraph}
     */
    FeedbackParagraph.fromDict = function(dict) {
      if (dict._type === PARAGRAPH_TYPE_TEXT) {
        return (this.createTextParagraph(dict._content));
      } else if (dict._type === PARAGRAPH_TYPE_CODE) {
        return (this.createCodeParagraph(dict._content));
      } else if (dict._type === PARAGRAPH_TYPE_SYNTAX_ERROR) {
        return (this.createSyntaxErrorParagraph(dict._content));
      }
      return null;
    };

    return FeedbackParagraph;
  }
]);
