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
 * CodeSubmission domain objects.
 */

tie.factory('CodeSubmissionObjectFactory', [
  function() {
    /**
     * CodeSubmission objects are used to store all of the related information
     * with a student's code submission without testing or running the code
     * itself.
     */

    /**
     * Constructor for CodeSubmission object.
     *
     * @param {string} rawCode contains the unprocessed code being submitted.
     * @constructor
     */
    var CodeSubmission = function(rawCode) {
      /**
       * @type {string}
       * @private
       */
      this._rawCode = rawCode.trim();

      /**
       * @type {Array}
       * @private
       */
      this._preprocessedCodeLines = rawCode.trim().split('\n');

      /**
       * An array that contains an entry for each line of the preprocessed code
       * that stores which line of the raw code it is mapped to. Preprocessed
       * lines that do not map to raw code lines have the corresponding entry
       * being null. Note that all entries here are zero-indexed, so a
       * transformation is needed in order to map them to human-readable
       * 1-indexed line numbers.
       *
       * @type {Array}
       * @private
       * */
      this._rawCodeLineIndexes = [];
      for (var i = 0; i < this._preprocessedCodeLines.length; i++) {
        this._rawCodeLineIndexes.push(i);
      }
    };

    /**
     * @const IMPORT_PATTERN holds the RegEx used to determine if there is an
     * import statement
     *
     * @type {RegExp}
     */
    CodeSubmission.prototype.IMPORT_PATTERN = new RegExp(
      '^\\ {4}import\\ \\w+$');
    /**
     * @const TAB_Length holds the number of spaces that a tab will be converted
     * to
     *
     * @type {number}
     */
    CodeSubmission.prototype.TAB_LENGTH = 4;

    // Instance methods.
    /**
     * A getter for the _rawCode property.
     * The function should return a string with the raw (unprocessed) code that
     * the user submitted.
     *
     * @returns {string} rawCode
     */
    CodeSubmission.prototype.getRawCode = function() {
      return this._rawCode;
    };

    /**
     * Returns a string made of the combined list of preprocessedCodeLines.
     *
     * @returns {string}
     */
    CodeSubmission.prototype.getPreprocessedCode = function() {
      return this._preprocessedCodeLines.join('\n');
    };

    /**
     * A getter for the _rawCodeLineIndexes property.
     * This function should return an array of numbers detailing the indexes
     * for the raw code.
     *
     * @returns {Array}
     */
    CodeSubmission.prototype.getRawCodeLineIndexes = function() {
      return this._rawCodeLineIndexes;
    };

    /**
     * Replaces the entirety of the code in the _preprocessedCodeLines property
     * with those of the replacementCode param.
     *
     * @param replacementCode Should be an Array of strings that is the same
     *    length as that of the Array in _preprocessedCodeLines
     */
    CodeSubmission.prototype.replace = function(replacementCode) {
      var replacementCodeLines = replacementCode.split('\n');
      if (replacementCodeLines.length !== this._preprocessedCodeLines.length) {
        throw Error('Incorrect number of lines of code provided.');
      }
      this._preprocessedCodeLines = replacementCodeLines;
    };

    /**
     * Splits and appends the string in the codeToAppend param to the Array in
     * _preprocessedCodeLines property.
     *
     * @param codeToAppend Should be a string with the code to
     *    attach to the end of _preprocessedCodeLines
     */
    CodeSubmission.prototype.append = function(codeToAppend) {
      var codeToAppendLines = codeToAppend.split('\n');
      this._preprocessedCodeLines = this._preprocessedCodeLines.concat(
        codeToAppendLines);
      for (var i = 0; i < codeToAppendLines.length; i++) {
        this._rawCodeLineIndexes.push(null);
      }
    };

    /**
     * Splits and prepends the string in the codeToPrepend param to the Array in
     * _preprocessedCodeLines property.
     *
     * @param codeToPrepend Should be a string with the code to
     *    attach to the beginning of _preprocessedCodeLines
     */
    CodeSubmission.prototype.prepend = function(codeToPrepend) {
      var codeToPrependLines = codeToPrepend.split('\n');
      this._preprocessedCodeLines = codeToPrependLines.concat(
        this._preprocessedCodeLines);
      for (var i = 0; i < codeToPrependLines.length; i++) {
        this._rawCodeLineIndexes.unshift(null);
      }
    };

    // Static class methods.
    /**
     * Returns a CodeSubmission object built from the rawCode param
     *
     * @param rawCode Should be a string with the unprocessed student code
     * @returns {CodeSubmission}
     */
    CodeSubmission.create = function(rawCode) {
      return new CodeSubmission(rawCode);
    };

    return CodeSubmission;
  }
]);
