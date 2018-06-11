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
  * @fileoverview Service for displaying printed output.
  */

tie.factory('StdOutSeparatorService', [
  function() {
    /**
     * The separator used in between test cases' stdOut.
     *
     * @type {string}
     **/
    var separator = "";

    return {
      /**
      * Setter method for the separator.
      *
      * @param {string} generated Separator generated during preprocessing.
      */
      setSeparator: function(generated) {
        separator = generated;
      },

      /**
      * Getter method for the separator.
      *
      * @returns {string}
      */
      getSeparator: function() {
        return separator;
      },

      /**
      * Returns the corresponding stdOut for the given test case number for
      * client version.
      *
      * @param {Array} stdOut Array of entire stdOut for all test cases.
      * @param {number} testNum Test case number of desired stdOut.
      * @returns {string}
      */
      getTestCaseOutputInClient: function(stdOut, testNum) {
        if (stdOut.length < 1 || stdOut[0] === separator) {
          return [];
        }
        var startIndex = 0;
        var endIndex = 0;
        var separatorNum = 0;

        for (var i = 0; i < stdOut.length; i += 2) {
          if (stdOut[startIndex] === separator || testNum === 0) {
            separatorNum += 1;
            if (testNum === 0 || testNum === separatorNum) {
              for (var j = i + 1;
                j < stdOut.length && stdOut[j] !== separator; j++) {
                endIndex = j;
              }
              endIndex += 1;
              if (testNum !== 0) {
                // Have startIndex skip over the separator and the new line
                // that follows.
                startIndex += 2;
              }
              if (startIndex >= endIndex) {
                return [];
              }
              return stdOut.slice(startIndex, endIndex);
            }
          }
          startIndex += 2;
        }

        return [];
      },

      /**
       * Returns the corresponding stdOut for given test case number for
       * server version.
       *
       * @param {Array} stdOut Array of entire stdOut for all test cases.
       * @param {number} testNum Test case number of desired stdOut.
       * @returns {string}
       */
      getTestCaseOutput: function(stdOut, testNum) {
        var allStdOut = stdOut.split(separator + '\n');

        // No user stdOut.
        if (allStdOut.length < 1 || stdOut.indexOf(separator) === 0) {
          return "";
        }
        if (testNum >= 0 && testNum < allStdOut.length) {
          return allStdOut[testNum];
        }

        return "";
      }
    };
  }
]);
