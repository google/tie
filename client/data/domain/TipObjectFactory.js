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
  function() {
    /**
     * Constructor for Tip objects.
     *
     * @param {dict} tipDict
     * @constructor
     */
    var Tip = function(tipDict) {
      /**
       * The regexp to test the student's code against.
       *
       * @type: {Regex}
       * @private
       */
      this._regexp = new RegExp(tipDict.regexString);

      /**
       * The message to show the learner when the tip is triggered.
       *
       * @type: {string}
       * @private
       */
      this._message = tipDict.message;
    };

    // Instance methods.

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
     * Whether the given lines of code trigger the tip.
     *
     * @param {Array<string>} codeLines The lines of code to examine.
     * @returns {boolean}
     */
    Tip.prototype.isTriggeredBy = function(codeLines) {
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
