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
  'PARAGRAPH_TYPE_TEXT', 'PARAGRAPH_TYPE_CODE',
  'PARAGRAPH_TYPE_ERROR', 'PARAGRAPH_TYPE_OUTPUT',
  'PARAGRAPH_TYPE_IMAGE',
  function(PARAGRAPH_TYPE_TEXT, PARAGRAPH_TYPE_CODE,
    PARAGRAPH_TYPE_ERROR, PARAGRAPH_TYPE_OUTPUT,
    PARAGRAPH_TYPE_IMAGE) {
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
       * Property holds the text/code/output/error description for
       * this object.
       *
       * @type {string}
       * @private
       */
      this._content = content;
    };

    // Instance methods.
    /**
     * Checks if the Paragraph is a text-based paragraph.
     *
     * @returns {boolean}
     */
    FeedbackParagraph.prototype.isTextParagraph = function() {
      return this._type === PARAGRAPH_TYPE_TEXT;
    };

    /**
     * Checks if the Paragraph is a paragraph consisting of code.
     *
     * @returns {boolean}
     */
    FeedbackParagraph.prototype.isCodeParagraph = function() {
      return this._type === PARAGRAPH_TYPE_CODE;
    };

    /**
     * Checks if the Paragraph is a paragraph with an error in it.
     * @returns {boolean}
     */
    FeedbackParagraph.prototype.isErrorParagraph = function() {
      return this._type === PARAGRAPH_TYPE_ERROR;
    };

    /**
     * Checks if the Paragraph is a paragraph consisting of code output.
     *
     * @returns {boolean}
     */
    FeedbackParagraph.prototype.isOutputParagraph = function() {
      return this._type === PARAGRAPH_TYPE_OUTPUT;
    };

    /**
     * Checks if the Paragraph is a paragraph with an image.
     *
     * @returns {boolean}
     */
    FeedbackParagraph.prototype.isImageParagraph = function() {
      return this._type === PARAGRAPH_TYPE_IMAGE;
    };
    /**
     * A getter for the _content property.
     *
     * @returns {string}
     */
    FeedbackParagraph.prototype.getContent = function() {
      return this._content;
    };

    /**
     * A getter for the line number where the error occurs.
     *
     * @returns {number}
     */
    FeedbackParagraph.prototype.getErrorLineNumber = function() {
      if (this.isErrorParagraph()) {
        var errorContentArray = this.getContent().split(' ');
        return parseInt(errorContentArray[errorContentArray.length - 1], 10);
      } else {
        throw new Error('Incorrect feedback paragraph type.');
      }
    };

    /**
     * Returns a dict created from a FeedbackParagraphObject.
     *
     * @param {FeedbackParagraph}
     * @returns {Object} dict that should have a type, and the content
     *    of a FeedbackParagraphObject.
     */
    FeedbackParagraph.prototype.toDict = function() {
      var feedbackParagraphDict = {};
      if (this.isTextParagraph()) {
        feedbackParagraphDict.type = PARAGRAPH_TYPE_TEXT;
      } else if (this.isCodeParagraph()) {
        feedbackParagraphDict.type = PARAGRAPH_TYPE_CODE;
      } else if (this.isErrorParagraph()) {
        feedbackParagraphDict.type = PARAGRAPH_TYPE_ERROR;
      } else if (this.isOutputParagraph()) {
        feedbackParagraphDict.type = PARAGRAPH_TYPE_OUTPUT;
      } else if (this.isImageParagraph()) {
        feedbackParagraphDict.type = PARAGRAPH_TYPE_IMAGE;
      } else {
        // If undefined type, return null.
        return null;
      }

      feedbackParagraphDict.content = this.getContent();
      return feedbackParagraphDict;
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
     * @param {string} code Code to be in the paragraph.
     * @returns {FeedbackParagraph}
     */
    FeedbackParagraph.createCodeParagraph = function(code) {
      return new FeedbackParagraph(PARAGRAPH_TYPE_CODE, code);
    };

    /**
     * Returns a FeedbackParagraph with an error description in it.
     *
     * @param {string} error Error description to be in the paragraph.
     * @returns {FeedbackParagraph}
     */
    FeedbackParagraph.createErrorParagraph = function(error) {
      return new FeedbackParagraph(PARAGRAPH_TYPE_ERROR, error);
    };

    /**
     * Returns a FeedbackParagraph comprising of output from user code.
     *
     * @param {string} output Output to be in the paragraph.
     * @returns {FeedbackParagraph}
     */
    FeedbackParagraph.createOutputParagraph = function(output) {
      return new FeedbackParagraph(PARAGRAPH_TYPE_OUTPUT, output);
    };

    /**
     * Returns a FeedbackParagraph comprising of an image file name.
     *
     * @param {string} image Name of the image.
     * @returns {FeedbackParagraph}
     */
    FeedbackParagraph.createImageParagraph = function(image) {
      return new FeedbackParagraph(PARAGRAPH_TYPE_IMAGE, image);
    };

    /**
     * Returns a FeedbackParagraph created from a dict.
     *
     * @param {Object} dict that should have a type, and the content
     *    of a FeedbackParagraphObject.
     * @returns {FeedbackParagraph}
     */
    FeedbackParagraph.fromDict = function(dict) {
      if (dict.type === PARAGRAPH_TYPE_TEXT) {
        return (this.createTextParagraph(dict.content));
      } else if (dict.type === PARAGRAPH_TYPE_CODE) {
        return (this.createCodeParagraph(dict.content));
      } else if (dict.type === PARAGRAPH_TYPE_ERROR) {
        return (this.createErrorParagraph(dict.content));
      } else if (dict.type === PARAGRAPH_TYPE_OUTPUT) {
        return (this.createOutputParagraph(dict.content));
      } else if (dict.type === PARAGRAPH_TYPE_IMAGE) {
        return (this.createImageParagraph(dict.content));
      }
      return null;
    };

    return FeedbackParagraph;
  }
]);
