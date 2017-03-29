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
    var TracebackCoordinates = function(lineNumber, columnNumber) {
      // These are both 1-indexed.
      this._lineNumber = lineNumber;
      this._columnNumber = columnNumber;
    };

    // Instance methods.
    TracebackCoordinates.prototype.getLineNumber = function() {
      return this._lineNumber;
    };

    // Static class methods.
    TracebackCoordinates.create = function(lineNumber, columnNumber) {
      return new TracebackCoordinates(lineNumber, columnNumber);
    };

    return TracebackCoordinates;
  }
]);
