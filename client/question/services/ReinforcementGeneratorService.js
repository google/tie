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
 * @fileoverview Service for generating positive reinforcement when a user
 * submits code based on the tasks that the code passes/fails on.
 */

tie.factory('ReinforcementGeneratorService', [
  'ReinforcementObjectFactory', 'TranscriptService',
  function(ReinforcementObjectFactory, TranscriptService) {
    return {
      /**
       * Returns a Reinforcement object that's associated with the code
       * submission's results.
       *
       * @param {Task} task
       * @param {CodeEvalResult} codeEvalResult
       * @returns {Reinforcement}
       */
      getReinforcement: function(task, codeEvalResult) {
        var previousSnapshot = TranscriptService.getMostRecentSnapshot();
        var previousReinforcement = null;
        if (previousSnapshot) {
          previousReinforcement = (
            previousSnapshot.getFeedback().getReinforcement());
        }

        var reinforcement = ReinforcementObjectFactory.create(task);

        // Copy the previous reinforcement object if we are on the same task.
        if (previousReinforcement && task === previousReinforcement.getTask()) {
          var previousReinforcementPassedTags =
            previousReinforcement.getPassedTags();
          for (var tag in previousReinforcementPassedTags) {
            reinforcement.addPassedTag(
              tag, previousReinforcementPassedTags[tag]);
          }
          var previousReinforcementPastFailedCases =
            previousReinforcement.getPastFailedCases();
          for (var pastCase in previousReinforcementPastFailedCases) {
            reinforcement.addPastFailedCase(
              pastCase, previousReinforcementPastFailedCases[pastCase]);
          }
        }

        // Go through correctness tests to update reinforcement data.
        var testSuites = task.getTestSuites();
        var observedOutputs = codeEvalResult.getLastTaskObservedOutputs();
        var failedCaseSeenOverall = false;

        testSuites.forEach(function(suite, suiteIndex) {
          var testCases = suite.getTestCases();
          var failedCaseSeenInSuite = false;
          var testTag = suite.getHumanReadableName();

          for (var testIdx = 0; testIdx < testCases.length; ++testIdx) {
            var test = testCases[testIdx];
            var observedOutput = observedOutputs[suiteIndex][testIdx];
            var stringifiedInput = test.getStringifiedInput();
            var hasPastFailedCase = reinforcement.hasPastFailedCase(
              test.getStringifiedInput());
            if (test.matchesOutput(observedOutput)) {
              if (hasPastFailedCase) {
                reinforcement.updatePastFailedCase(stringifiedInput, true);
              }
            } else if (!failedCaseSeenInSuite) {
              // We want to display only 1 new failed case among all tasks.
              if (!failedCaseSeenOverall) {
                reinforcement.addPastFailedCase(stringifiedInput, false);
                failedCaseSeenOverall = true;
              }
              failedCaseSeenInSuite = true;
            } else if (hasPastFailedCase) {
              reinforcement.updatePastFailedCase(stringifiedInput, false);
            }
          }

          if (failedCaseSeenInSuite) {
            if (reinforcement.getPassedTags().hasOwnProperty(testTag)) {
              reinforcement.updatePassedTag(testTag, false);
            }
          } else {
            // All cases pass in this tag.
            reinforcement.addPassedTag(testTag, true);
          }
        });

        return reinforcement;
      }
    };
  }
]);
