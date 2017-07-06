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
  'PREREQ_CHECK_TYPE_GLOBAL_CODE', 'PREREQ_CHECK_TYPE_WRONG_LANG_INCREMENT_OP',
  'PREREQ_CHECK_TYPE_WRONG_LANG_DECREMENT_OP',
  'PREREQ_CHECK_TYPE_WRONG_LANG_PUSH',
  'PREREQ_CHECK_TYPE_WRONG_LANG_CATCH_STATE',
  'PREREQ_CHECK_TYPE_WRONG_LANG_JAVA_COMMENT',
  'PREREQ_CHECK_TYPE_WRONG_LANG_DO_WHILE',
  'PREREQ_CHECK_TYPE_WRONG_LANG_ELSE_IF','PREREQ_CHECK_TYPE_WRONG_LANG_SWITCH',
  'PREREQ_CHECK_TYPE_WRONG_LANG_C_IMPORT',
  'PREREQ_CHECK_TYPE_WRONG_LANG_NOT_OP', 'PREREQ_CHECK_TYPE_WRONG_LANG_AND_OP',
  'PREREQ_CHECK_TYPE_WRONG_LANG_OR_OP',
  function(
      PREREQ_CHECK_TYPE_BAD_IMPORT, PREREQ_CHECK_TYPE_MISSING_STARTER_CODE,
      PREREQ_CHECK_TYPE_GLOBAL_CODE, PREREQ_CHECK_TYPE_WRONG_LANG_INCREMENT_OP,
      PREREQ_CHECK_TYPE_WRONG_LANG_DECREMENT_OP,
      PREREQ_CHECK_TYPE_WRONG_LANG_PUSH,
      PREREQ_CHECK_TYPE_WRONG_LANG_CATCH_STATE,
      PREREQ_CHECK_TYPE_WRONG_LANG_JAVA_COMMENT,
      PREREQ_CHECK_TYPE_WRONG_LANG_DO_WHILE,
      PREREQ_CHECK_TYPE_WRONG_LANG_ELSE_IF, PREREQ_CHECK_TYPE_WRONG_LANG_SWITCH,
      PREREQ_CHECK_TYPE_WRONG_LANG_C_IMPORT,
      PREREQ_CHECK_TYPE_WRONG_LANG_NOT_OP, PREREQ_CHECK_TYPE_WRONG_LANG_AND_OP,
      PREREQ_CHECK_TYPE_WRONG_LANG_OR_OP) {
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
     * @constructor
     */
    var PrereqCheckFailure = function(type, badImports, starterCode) {
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
     * Checks to see if the error is due to the user utilizing the increment
     * operator from another language that isn't valid in the submission's
     * current language.
     *
     * @returns {boolean} Indicates if this failure is of type "wrong language -
     *    invalid increment operator"
     */
    PrereqCheckFailure.prototype.usesWrongLangIncrementOp = function() {
      return (this._type === PREREQ_CHECK_TYPE_WRONG_LANG_INCREMENT_OP);
    };

    /**
     * Checks to see if the error is due to the user utilizing the decrement
     * operator from another language that isn't valid in the submission's
     * current language.
     *
     * @returns {boolean} Indicates if this failure is of type "wrong language -
     *    invalid decrement operator"
     */
    PrereqCheckFailure.prototype.usesWrongLangDecrementOp = function() {
      return (this._type === PREREQ_CHECK_TYPE_WRONG_LANG_DECREMENT_OP);
    };

    /**
     * Checks to see if the error is due to the user utilizing the push()
     * method (which is valid in Java/C/C++) rather than the append() method
     * (which is valid in Python) to render code invalid in the submission's
     * current language.
     *
     * @returns {boolean} Indicates if this failure is of type "wrong language -
     *    push method"
     */
    PrereqCheckFailure.prototype.usesWrongLangPushMethod = function() {
      return (this._type === PREREQ_CHECK_TYPE_WRONG_LANG_PUSH);
    };

    /**
     * Checks to see if the error is due to the user utilizing a catch statement
     * (vs. an except statement) where it is not valid in the submission's
     * current language.
     *
     * @returns {boolean} Indicates if this failure is of type "wrong language -
     *    catch statement"
     */
    PrereqCheckFailure.prototype.usesWrongLangCatchStatement = function() {
      return (this._type === PREREQ_CHECK_TYPE_WRONG_LANG_CATCH_STATE);
    };

    /**
     * Checks to see if the error is due to the user utilizing the Java/C-like
     * comment syntax when it is not valid in the submission's current language
     * (i.e. in Python).
     *
     * @returns {boolean} Indicates if this failure is of type "wrong language -
     *    Java comment syntax"
     */
    PrereqCheckFailure.prototype.usesWrongLangJavaComment = function() {
      return (this._type === PREREQ_CHECK_TYPE_WRONG_LANG_JAVA_COMMENT);
    };

    /**
     * Checks to see if the error is due to the user utilizing a do-while loop
     * when it is not valid in the submission's current language.
     *
     * @returns {boolean} Indicates if this failure is of type "wrong language -
     *    do-while loop"
     */
    PrereqCheckFailure.prototype.usesWrongLangDoWhile = function() {
      return (this._type === PREREQ_CHECK_TYPE_WRONG_LANG_DO_WHILE);
    };

    /**
     * Checks to see if the error is due to the user utilizing an else-if
     * statement when it is not valid in the submission's current language
     * (i.e. Python).
     *
     * @returns {boolean} Indicates if this failure is of type "wrong language -
     *    else if"
     */
    PrereqCheckFailure.prototype.usesWrongLangElseIf = function() {
      return (this._type === PREREQ_CHECK_TYPE_WRONG_LANG_ELSE_IF);
    };

    /**
     * Checks to see if the error is due to the user utilizing a switch
     * statement when it is not valid in the submission's current language.
     *
     * @returns {boolean} Indicates if this failure is of type "wrong language -
     *    switch"
     */
    PrereqCheckFailure.prototype.usesWrongLangSwitch = function() {
      return (this._type === PREREQ_CHECK_TYPE_WRONG_LANG_SWITCH);
    };

    /**
     * Checks to see if the error is due to the user utilizing a C-like
     * import statement syntax when it's not valid in the submission's
     * current language.
     *
     * @returns {boolean} Indicates if this failure is of type "wrong language -
     *    C import"
     */
    PrereqCheckFailure.prototype.usesWrongLangCImport = function() {
      return (this._type === PREREQ_CHECK_TYPE_WRONG_LANG_C_IMPORT);
    };

    /**
     * Checks to see if the error is due to the user utilizing an invalid
     * NOT operator syntax for the submission's current language.
     *
     * @returns {boolean} Indicates if this failure is of type "wrong language -
     *    invalid not operator"
     */
    PrereqCheckFailure.prototype.usesWrongLangNotOp = function() {
      return (this._type === PREREQ_CHECK_TYPE_WRONG_LANG_NOT_OP);
    };

    /**
     * Checks to see if the error is due to the user utilizing an invalid
     * AND operator syntax for the submission's current language.
     *
     * @returns {boolean} Indicates if this failure is of type "wrong language -
     *    invalid and operator"
     */
    PrereqCheckFailure.prototype.usesWrongLangAndOp = function() {
      return (this._type === PREREQ_CHECK_TYPE_WRONG_LANG_AND_OP);
    };

    /**
     * Checks to see if the error is due to the user utilizing an invalid OR
     * operator syntax for the submission's current language.
     *
     * @returns {boolean} Indicates if this failure is of type "wrong language -
     *    invalid or operator"
     */
    PrereqCheckFailure.prototype.usesWrongLangOrOp = function() {
      return (this._type === PREREQ_CHECK_TYPE_WRONG_LANG_OR_OP);
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
     * @returns {PrereqCheckFailure}
     */
    PrereqCheckFailure.create = function(type, badImports, starterCode) {
      return new PrereqCheckFailure(type, badImports, starterCode);
    };

    return PrereqCheckFailure;
  }
]);
