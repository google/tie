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
 * PreprocessedCode domain objects.
 */

tie.factory('PreprocessedCodeObjectFactory', [
  function() {
    /**
     * PreprocessedCode stores the entire preprocessed code, raw input code,
     * and the string separator generated during print output. This string
     * separator is utilized in splitting the total output into the
     * corresponding outputs for each test case.
     */

    /**
     * Constructor for PreprocessedCode
     *
     * @param {string} preprocessedCodeString Preprocessed student code
     * @param {string} rawCode Student's input code
     * @param {string} separator Output separator
     */
    var PreprocessedCode = function(preprocessedCodeString, rawCode,
      separator) {
      /**
       * @type {string}
       * @private
       */
      this._preprocessedCodeString = preprocessedCodeString;

      /**
       * @type {string}
       * @private
       */
      this._rawCode = rawCode;

      /**
       * @type {string}
       * @private
       */
      this._separator = separator;
    };

    // Instance methods.

    /**
     * A getter for the _preprocessedCodeString property.
     * It should return a string with code that has already been
     * preprocessed.
     *
     * @returns {string}
     */
    PreprocessedCode.prototype.getPreprocessedCodeString = function() {
      return this._preprocessedCodeString;
    };

    /**
     * A getter for the _rawCode property.
     * It should return a string with the raw input code that the
     * student submitted.
     *
     * @returns {string}
     */
    PreprocessedCode.prototype.getRawCode = function() {
      return this._rawCode;
    };

    /**
     * A getter for the _separator property.
     * It should return a string with the randomly generated separator
     * value.
     *
     * @returns {string}
     */
    PreprocessedCode.prototype.getSeparator = function() {
      return this._separator;
    };

    // Static class methods.
    /**
     * This method creates and returns a PreprocessedCode object from
     * the params specified.
     *
     * @param {string} preprocessedCodeString Preprocessed student code
     * @param {string} rawCode Raw student input code
     * @param {string} separator Output separator
     * @returns {PreprocessedCode}
     */
    PreprocessedCode.create = function(preprocessedCodeString, rawCode,
      separator) {
      return new PreprocessedCode(preprocessedCodeString, rawCode, separator);
    };

    return PreprocessedCode;
  }
]);
