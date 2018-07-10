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
 * @fileoverview Factory for creating new frontend instances of Tip domain
 * objects.
 */

tieData.factory('TipObjectFactory', [
  'PrintTerminalService',
  function(PrintTerminalService) {
    /**
     * Constructor for Tip objects.
     *
     * @param {dict} tipDict
     * @constructor
     */
    var Tip = function(tipDict) {
      /**
       * Whether printing needs to be disabled in order for the tip to
       * be activated.
       * @type: {boolean}
       * @private
       */
      this._requirePrintToBeDisabled = tipDict.requirePrintToBeDisabled;

      /**
       * The regexp to test the student's code against.
       *
       * @type: {Regex}
       * @private
       */
      this._regexp = new RegExp(tipDict.regexString);

      /**
       * The message to show the learner when the tip is activated.
       *
       * @type: {string}
       * @private
       */
      this._message = tipDict.message;
    };

    // Instance methods.

    /**
     * A getter for the _requirePrintToBeDisabled property.
     *
     * @returns {boolean}
     */
    Tip.prototype.getRequirePrintToBeDisabled = function() {
      return this._requirePrintToBeDisabled;
    };

    /**
     * A getter for the _regexp property.
     *
     * @returns {Regex}
     */
    Tip.prototype.getRegexp = function() {
      return this._regexp;
    };

    /**
     * A getter for the _message property.
     *
     * @returns {string}
     */
    Tip.prototype.getMessage = function() {
      return this._message;
    };

    /**
     * Whether the given lines of code activate the tip.
     *
     * @param {Array<string>} codeLines The lines of code to examine.
     * @returns {boolean}
     */
    Tip.prototype.isActivatedBy = function(codeLines) {
      // If the specification requires print to be disabled and print is
      // actually supported, this should not activate a print tip.
      if (this._requirePrintToBeDisabled &&
        PrintTerminalService.isPrintingSupported()) {
        return false;
      }
      var that = this;
      return codeLines.some(function(line) {
        return line.search(that._regexp) !== -1;
      });
    };

    // Static class methods.
    /**
     * Returns a Tip object based on the dict passed in as a param.
     *
     * @param {dict} tipDict Should have all of the properties needed to make
     *    the Tip.
     * @returns {Tip}
     */
    Tip.create = function(tipDict) {
      return new Tip(tipDict);
    };

    return Tip;
  }
]);
