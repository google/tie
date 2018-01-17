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
 * @fileoverview Factory for creating new frontend instances of prereqFailure
 * domain objects.
 */

tie.factory('PrereqCheckFailureObjectFactory', [
  'PREREQ_CHECK_TYPE_BAD_IMPORT', 'PREREQ_CHECK_TYPE_MISSING_STARTER_CODE',
  'PREREQ_CHECK_TYPE_GLOBAL_CODE', 'PREREQ_CHECK_TYPE_WRONG_LANG',
  'PREREQ_CHECK_TYPE_INVALID_SYSTEM_CALL',
  'PREREQ_CHECK_TYPE_INVALID_AUXILIARYCODE_CALL',
  'PREREQ_CHECK_TYPE_INVALID_STUDENTCODE_CALL',
  function(
      PREREQ_CHECK_TYPE_BAD_IMPORT, PREREQ_CHECK_TYPE_MISSING_STARTER_CODE,
      PREREQ_CHECK_TYPE_GLOBAL_CODE, PREREQ_CHECK_TYPE_WRONG_LANG,
      PREREQ_CHECK_TYPE_INVALID_SYSTEM_CALL,
      PREREQ_CHECK_TYPE_INVALID_AUXILIARYCODE_CALL,
      PREREQ_CHECK_TYPE_INVALID_STUDENTCODE_CALL) {
    /**
     * PrereqCheckFailure encapsulates all of the data necessary to represent
     * one prerequisite check failure that a student's code submission can
     * cause.
     */

    /**
     * Constructor for PrereqCheckFailure.
     *
     * @param {string} type Indicates what type of Prereq Check Failure this
     *    object is.
     * @param {Array} badImports Should be an Array of strings indicating the
     *    unsupported libraries that the user tried to import.
     * @param {string} starterCode String of the starter code the user is given.
     *    Only necessary for prereq check failures where the code is missing or
     *    has altered the original function headers.
     * @param {string | null} wrongLangKey Indicates the key from the
     *    WRONG_LANGUAGE_ERRORS that correlates to the error that triggered this
     *    prereq failure
     * @constructor
     */
    var PrereqCheckFailure = function(
        type, badImports, starterCode, wrongLangKey) {
      /**
       * Indicates what type of failure occurred.
       *
       * @type {string}
       * @private
       */
      this._type = type;

      /**
       * List of unsupported libraries that the user tried to import.
       *
       * @type {Array}
       * @private
       */
      this._badImports = badImports;

      /**
       * String of code with the original function signatures that the user
       * should not have altered.
       *
       * @type {string}
       * @private
       */
      this._starterCode = starterCode;

      /**
       * String standing for key in WRONG_LANGUAGE_ERRORS that correlates to
       * error that triggered.
       * Should be null if error type is not 'wrong language.'
       *
       * @type {string | null}
       * @private
       */
      this._wrongLangKey = wrongLangKey;
    };

    // Instance methods.
    /**
     * A getter for the _type property.
     * Should return a string indicating the type of the error this object
     * is representing.
     *
     * @returns {string}
     */
    PrereqCheckFailure.prototype.getType = function() {
      return this._type;
    };

    /**
     * A setter for the _type property.
     *
     * @param {string} type
     */
    PrereqCheckFailure.prototype.setType = function(type) {
      this._type = type;
    };
    /**
     * Checks to see if the error is due to the user trying to utilize the
     * System class/method in their submission.
     *
     * @returns {boolean} Indicates if this failure is of type "invalid system
     * call"
     */
    PrereqCheckFailure.prototype.hasInvalidSystemCall = function() {
      return (this._type === PREREQ_CHECK_TYPE_INVALID_SYSTEM_CALL);
    };

    /**
     * Checks to see if the error is due to the user trying to utilize the
     * AuxiliaryCode class/method in their submission.
     *
     * @returns {boolean} Indicates if this failure is of type "invalid
     * auxiliarycode call"
     */
    PrereqCheckFailure.prototype.hasInvalidAuxiliaryCodeCall = function() {
      return (this._type === PREREQ_CHECK_TYPE_INVALID_AUXILIARYCODE_CALL);
    };

    /**
     * Checks to see if the error is due to the user trying to utilize the
     * StudentCode class/method in their submission.
     *
     * @returns {boolean} Indicates if this failure is of type "invalid
     * studentcode call"
     */
    PrereqCheckFailure.prototype.hasInvalidStudentCodeCall = function() {
      return (this._type === PREREQ_CHECK_TYPE_INVALID_STUDENTCODE_CALL);
    };

    /**
     * Checks to see if the error is due to the user trying to make a bad
     * (unsupported) import.
     *
     * @returns {boolean} Indicates if this failure is of the type "bad import"
     */
    PrereqCheckFailure.prototype.isBadImport = function() {
      return (this._type === PREREQ_CHECK_TYPE_BAD_IMPORT);
    };

    /**
     * Checks to see if the error is due to a change in the original starter
     * code's function signatures.
     *
     * @returns {boolean} Indicates if this failure is of the type "missing
     *    starter code"
     */
    PrereqCheckFailure.prototype.isMissingStarterCode = function() {
      return (this._type === PREREQ_CHECK_TYPE_MISSING_STARTER_CODE);
    };

    /**
     * Checks to see if the error is due to code being declared in the global
     * scope - which is unsupported in this application.
     *
     * @returns {boolean} Indicates if this failure is of the type "global code"
     */
    PrereqCheckFailure.prototype.hasGlobalCode = function() {
      return (this._type === PREREQ_CHECK_TYPE_GLOBAL_CODE);
    };

    /**
     * Checks to see if error is due to wrong language syntax being detected in
     * code.
     *
     * @returns {boolean} Indicates if failure is of type "wrong lang"
     */
    PrereqCheckFailure.prototype.hasWrongLanguage = function() {
      return (this._type === PREREQ_CHECK_TYPE_WRONG_LANG);
    };

    /**
     * A getter for the _badImports property.
     * Should be an Array of strings indicating the unsupported libraries
     * the user tried to import.
     *
     * @returns {Array}
     */

    PrereqCheckFailure.prototype.getBadImports = function() {
      return this._badImports;
    };

    /**
     * A setter for the _badImports property.
     *
     * @param {Array} badImports Should be an Array of strings consisting of the
     * libraries the user tried to import that aren't supported.
     */
    PrereqCheckFailure.prototype.setBadImports = function(badImports) {
      this._badImports = badImports;
    };

    /**
     * A getter for the _starterCode property.
     * Should return a string consisting of the original starter code and
     * function headers the user is given before beginning the task.
     *
     * @returns {string}
     */
    PrereqCheckFailure.prototype.getStarterCode = function() {
      return this._starterCode;
    };

    /**
     * A setter for the _starterCode property.
     *
     * @param {string} starterCode Should be a string with the original starter
     *    code the user is given before they begin the task.
     */
    PrereqCheckFailure.prototype.setStarterCode = function(starterCode) {
      this._starterCode = starterCode;
    };

    /**
     * A getter for the _wrongLangKey property.
     *
     * @returns {string}
     */
    PrereqCheckFailure.prototype.getWrongLangKey = function() {
      return this._wrongLangKey;
    };

    /**
     * A setter for the _wrongLangKey property.
     *
     * @param {string} newKey The key to set the _wrongLangKey property to.
     */
    PrereqCheckFailure.prototype.setWrongLangKey = function(newKey) {
      this._wrongLangKey = newKey;
    };

    // Static class methods.
    /**
     * Returns a PrereqCheckFailure object with the properties given in the
     * parameters.
     *
     * @param {string} type Should indicate what type of error this object
     *    represents
     * @param {Array} badImports Should consist of strings with the names of the
     *    unsupported libraries the user tried to import
     * @param {string} starterCode Should have the original code and function
     *    headers the user is given before they begin adding their own code.
     * @param {string} wrongLangErrorName Name of the error that corresponds to
     *    the error information in WRONG_LANGUAGE_ERRORS
     * @returns {PrereqCheckFailure}
     */
    PrereqCheckFailure.create = function(
        type, badImports, starterCode, wrongLangErrorName) {
      var errorName = wrongLangErrorName || null;
      return new PrereqCheckFailure(type, badImports, starterCode, errorName);
    };

    return PrereqCheckFailure;
  }
]);
