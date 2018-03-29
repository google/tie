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
 * @fileoverview Factory for creating a PrereqCheckError of a student's TIE
 * session.
 */

tie.factory('PrereqCheckErrorObjectFactory', [
  'PREREQ_CHECK_TYPE_WRONG_LANG',
  function(PREREQ_CHECK_TYPE_WRONG_LANG) {
    /**
     * PrereqCheckError objects are used to store information related to Prereq
     errors.
     */

    /**
     * Constructor for PrereqCheckError.
     *
     * @constructor
     */
    var PrereqCheckError = function(
      errorName, errorLineNumber, errorColumnNumber) {
      /**
       * String standing for key in WRONG_LANGUAGE_ERRORS that correlates to
       * error that triggered.
       * Should be null if error type is not 'wrong language.'
       *
       * @type {string | null}
       * @private
       */
      this._errorName = errorName;

      /**
       * Line number that correlates to error that triggered.
       *
       * @type {integer}
       * @private
       */
      this._errorLineNumber = errorLineNumber;

      /**
       * Column number that correlates to error that triggered.
       *
       * @type {integer}
       * @private
       */
      this._errorColumnNumber = errorColumnNumber;

      /**
       * Indicates what type of failure occurred. Defaults to the only errorType
       * currently tracked.
       *
       * @type {string}
       * @private
       */
      this._errorType = PREREQ_CHECK_TYPE_WRONG_LANG;
    };

    /**
     * A getter for the _errorName property.
     *
     * @returns {string}
     */
    PrereqCheckError.prototype.getErrorName = function() {
      return this._errorName;
    };

    /**
     * A setter for the _errorName property.
     *
     * @param {string} newName The key to set the _errorName property to.
     */
    PrereqCheckError.prototype.setErrorName = function(newName) {
      this._errorName = newName;
    };

    /**
     * A getter for the _errorLineNumber property.
     *
     * @returns {string}
     */
    PrereqCheckError.prototype.getErrorLineNumber = function() {
      return this._errorLineNumber;
    };

    /**
     * A setter for the _errorLineNumber property.
     *
     * @param {integer} errorLine to set the _errorLineNumber property to.
     */
    PrereqCheckError.prototype.setErrorLineNumber = function(newLineNumber) {
      this._errorLineNumber = newLineNumber;
    };

    /**
     * A getter for the _errorColumnNumber property.
     *
     * @returns {string}
     */
    PrereqCheckError.prototype.getErrorColumnNumber = function() {
      return this._errorColumnNumber;
    };

    /**
     * A setter for the _errorColumnNumber property.
     *
     * @param {integer} errorLine to set the _errorColumnNumber property to.
     */
    PrereqCheckError.prototype.setErrorColumnNumber = function(
      newColumnNumber) {
      this._errorColumnNumber = newColumnNumber;
    };

    // Static class methods.
    /**
     * Returns a new PrereqCheckError object.
     *
     * @returns {PrereqCheckError}
     */
    PrereqCheckError.create = function(
        errorName, errorLineNumber, errorColumnNumber) {
      return new PrereqCheckError(
        errorName, errorLineNumber, errorColumnNumber);
    };

    return PrereqCheckError;
  }
]);
