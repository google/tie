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
 * @fileoverview A service for storing the current learner state in a TIE
 * question session.
 */

tie.factory('LearnerStateService', [
  'LANGUAGE_UNFAMILIARITY_THRESHOLD',
  function(LANGUAGE_UNFAMILIARITY_THRESHOLD) {
    /**
     * Counter to keep track of language unfamiliarity errors (which includes
     * syntax errors and wrong language errors).
     *
     * @type {number}
     */
    var numConsecutiveLanguageUnfamiliarityErrors = 0;

    /**
     * Counter to keep track of consecutive same runtime errors.
     *
     * @type {number}
     */
    var numConsecutiveSameRuntimeErrors = 0;

    /**
     * The runtime error string immediately before the current error. Used to
     * see if the user is receiving the same exact error consecutively, a
     * possible indication of language unfamiliarity.
     *
     * @type {string|null}
     */
    var previousRuntimeErrorString = null;

    return {
      recordRuntimeError: function(runtimeErrorString) {
        if (runtimeErrorString) {
          if (runtimeErrorString === previousRuntimeErrorString) {
            numConsecutiveSameRuntimeErrors++;
          } else {
            numConsecutiveSameRuntimeErrors = 1;
          }
        } else {
          numConsecutiveSameRuntimeErrors = 0;
        }

        numConsecutiveLanguageUnfamiliarityErrors = 0;
        previousRuntimeErrorString = runtimeErrorString;
      },
      recordSyntaxError: function() {
        numConsecutiveLanguageUnfamiliarityErrors++;
        numConsecutiveSameRuntimeErrors = 0;
        previousRuntimeErrorString = null;
      },
      recordPrereqWrongLanguageError: function() {
        numConsecutiveLanguageUnfamiliarityErrors++;
        numConsecutiveSameRuntimeErrors = 0;
        previousRuntimeErrorString = null;
      },
      doesUserNeedLanguageUnfamiliarityPrompt: function() {
        var maxConsecutiveErrorCount = Math.max(
          numConsecutiveLanguageUnfamiliarityErrors,
          numConsecutiveSameRuntimeErrors);
        return maxConsecutiveErrorCount >= LANGUAGE_UNFAMILIARITY_THRESHOLD;
      },
      resetLanguageUnfamiliarityCounters: function() {
        numConsecutiveLanguageUnfamiliarityErrors = 0;
        numConsecutiveSameRuntimeErrors = 0;
      }
    };
  }
]);
