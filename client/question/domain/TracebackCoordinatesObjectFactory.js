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
 * TracebackCoordinates domain objects.
 */

tie.factory('TracebackCoordinatesObjectFactory', [
  function() {
    /**
     * TracebackCoordinates objects represent the coordinates (line number,
     * column number) for a singular traceback for an error. Multiple of
     * these may be present for an ErrorTraceback object.
     */

    /**
     * Constructor for TracebackCoordinates
     *
     * @param {number} lineNumber
     * @param {number} columnNumber
     * @constructor
     */
    var TracebackCoordinates = function(lineNumber, columnNumber) {
      /**
       * A number that corresponds with the line number for this traceback's
       * coordinates.
       * Note: This is 1-indexed.
       *
       * @type {number}
       * @private
       */
      this._lineNumber = lineNumber;

      /**
       * A number that corresponds with the column number for this traceback's
       * coordinates.
       * Note: This is 1=indexed.
       *
       * @type {number}
       * @private
       */
      this._columnNumber = columnNumber;
    };

    // Instance methods.
    /**
     * A getter for the _lineNumber property.
     *
     * @returns {number}
     */
    TracebackCoordinates.prototype.getLineNumber = function() {
      return this._lineNumber;
    };

    // Static class methods.
    /**
     * Returns a TracebackCoordinates object based on the lineNumber and
     * columnNumber passed in as params.
     *
     * @param {number} lineNumber
     * @param {number} columnNumber
     * @returns {TracebackCoordinates}
     */
    TracebackCoordinates.create = function(lineNumber, columnNumber) {
      return new TracebackCoordinates(lineNumber, columnNumber);
    };

    return TracebackCoordinates;
  }
]);
