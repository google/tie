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
       * The regex string to test the student's code against.
       *
       * @type: {string}
       * @private
       */
      this._regexString = tipDict.regexString;

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
     * A getter for the _regexString property.
     *
     * @returns {string}
     */
    Tip.prototype.getRegexString = function() {
      return this._regexString;
    };

    /**
     * A getter for the _message property.
     *
     * @returns {string}
     */
    Tip.prototype.getMessage = function() {
      return this._message;
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
