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
 * @fileoverview Factory for creating new frontend instances of ErrorTraceback
 * domain objects.
 */

tie.factory('ErrorTracebackObjectFactory', [
  'TracebackCoordinatesObjectFactory',
  function(TracebackCoordinatesObjectFactory) {
    /**
     * ErrorTraceback objects encapsulate the error message and traceback
     * coordinates for a given Error in a student's submission.
     */

    var LINE_DELIMITER_PYTHON = ', line ';

    /**
     * Constructor for ErrorTraceback
     *
     * @param {string} errorMessage string describing the error
     * @param {Array} tracebackCoordinates Array of ErrorTracebackCoordinates
     *    objects describing the sources of each error
     * @constructor
     */
    var ErrorTraceback = function(errorMessage, tracebackCoordinates) {
      /**
       * The error message as a string, e.g. "ZeroDivisionError: integer
       * division or modulo by zero".
       *
       * @type {string}
       * @private
       * */
      this._errorMessage = errorMessage;

      /**
       * A list of ErrorTracebackCoordinates objects. Each object contains a
       * lineNumber and columnNumber (both 1-indexed), representing the
       * locations described in the error trace.
       *
       * @type {Array}
       * @private
       */
      this._tracebackCoordinates = tracebackCoordinates;
    };

    // Instance methods.
    /**
     * Returns the line number in the first error traceback coordinates. This
     * generally means the line in the student code where the error is coming
     * from.
     *
     * @returns {ErrorTraceback}
     * @private
     */
    ErrorTraceback.prototype._getFirstTracebackLine = function() {
      return this._tracebackCoordinates[0].getLineNumber();
    };

    /**
     * Returns the error string from the error message.
     *
     * @returns {string}
     */
    ErrorTraceback.prototype.getErrorString = function() {
      if (this._errorMessage.indexOf('TimeLimitError') === 0) {
        return this._errorMessage;
      }
      return this._errorMessage + ' on line ' + this._getFirstTracebackLine();
    };

    // Static class methods.
    /**
     * Returns an ErrorTraceback object built from the specified params.
     *
     * @param {string} errorMessage string describing error
     * @param {Array} tracebackCoordinates list of ErrorTracebackCoordinates
     *    objects
     * @returns {ErrorTraceback}
     */
    ErrorTraceback.create = function(errorMessage, tracebackCoordinates) {
      return new ErrorTraceback(errorMessage, tracebackCoordinates);
    };

    /**
     * Returns an ErrorTraceback object from a SkulptError
     *
     * @param {SkulptError} skulptError
     * @returns {ErrorTraceback}
     */
    ErrorTraceback.fromSkulptError = function(skulptError) {
      var errorMessage = String(skulptError).slice(
        0, String(skulptError).indexOf(' on line'));
      var tracebackCoordinates = skulptError.traceback.map(function(traceLine) {
        return TracebackCoordinatesObjectFactory.create(
          traceLine.lineno, traceLine.colno);
      });

      return ErrorTraceback.create(errorMessage, tracebackCoordinates);
    };

    /**
     * Returns an ErrorTraceback object from a standard Python error
     *
     * @param {string} pythonError
     * @returns {ErrorTraceback}
     */
    ErrorTraceback.fromPythonError = function(pythonError) {
      // Split the error string by newlines for easier processing.
      var splitErrorMessage = pythonError.trim().split(/\r?\n/);
      var errorMessage = splitErrorMessage[splitErrorMessage.length - 1];
      var lineNumber = null;
      // Python error tracebacks use the last two lines to show the line of code
      // and the error (and sometimes a ^ indicating where the error occurred.
      // Therefore, we need to start at the second from the last line and work
      // backwards to find the most relevant line number.
      for (var i = splitErrorMessage.length - 3; i >= 0; i--) {
        if (splitErrorMessage[i].indexOf(LINE_DELIMITER_PYTHON) !== -1) {
          lineNumber = parseInt(splitErrorMessage[i].slice(
              splitErrorMessage[i].indexOf(LINE_DELIMITER_PYTHON) +
              LINE_DELIMITER_PYTHON.length), 10);
          break;
        }
      }
      var colNumber = null;
      // This is used to grab the column number of an error, if one is present.
      // Python will use a '    ^' to indicate where on the line an error
      // occurred, allowing us to isolate that and use it as the column number.
      if (splitErrorMessage[splitErrorMessage.length - 2].indexOf('^') !== -1) {
        colNumber = splitErrorMessage[splitErrorMessage.length - 2].length;
      }
      var tracebackCoordinates = [TracebackCoordinatesObjectFactory.create(
          lineNumber, colNumber)];

      return ErrorTraceback.create(errorMessage, tracebackCoordinates);
    };

    return ErrorTraceback;
  }
]);
