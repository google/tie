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

    var getTestsKeyedByTagAndIndexes = function(tests) {
      var splitTests = {};
      var inputToOriginalIndex = {};
      for (var i = 0; i < tests.length; ++i) {
        var test = tests[i];
        inputToOriginalIndex[test.getStringifiedInput()] = i;
        var testTag = test.getTag();
        if (splitTests.hasOwnProperty(testTag)) {
          splitTests[testTag].push(test);
        } else {
          splitTests[testTag] = [test];
        }
      }
      return {
        splitTests: splitTests,
        testIndexes: inputToOriginalIndex
      };
    };

    return {
      getReinforcement: function(task, codeEvalResult) {

        var previousSnapshot = TranscriptService.getMostRecentSnapshot();
        var previousReinforcement = null;
        if (previousSnapshot !== null) {
          previousReinforcement = previousSnapshot.getReinforcement();
        }

        var reinforcement = ReinforcementObjectFactory.create(task);

        // Copy the previous reinforcement object if we are on the same task.
        if (previousReinforcement !== null &&
            task === previousReinforcement.getTask()) {
          var previousReinforcementPassedTags =
            previousReinforcement.getPassedTags();
          for (var tag in previousReinforcementPassedTags) {
            reinforcement.addToPassedTags(tag,
              previousReinforcementPassedTags[tag]);
          }
          var previousReinforcementPastFailedCases =
            previousReinforcement.getPastFailedCases();
          for (var pastCase in previousReinforcementPastFailedCases) {
            reinforcement.addToPastFailedCases(pastCase,
              previousReinforcementPastFailedCases[pastCase]);
          }
        }

        // Go through correctness tests to update reinforcement data.
        var correctnessTestsByTagAndIndexes = getTestsKeyedByTagAndIndexes(
          task.getCorrectnessTests());
        var correctnessTestsByTag = correctnessTestsByTagAndIndexes.splitTests;
        var testIndexes = correctnessTestsByTagAndIndexes.testIndexes;
        var observedOutputs = codeEvalResult.getCorrectnessTestResults();
        // Get results only for the last task.
        observedOutputs = observedOutputs[observedOutputs.length - 1];
        var failedCaseSeenOverall = false;
        for (var testTag in correctnessTestsByTag) {
          var failedCaseSeenInTag = false;
          for (var testIdx = 0; testIdx < correctnessTestsByTag[testTag].length;
              ++testIdx) {
            var test = correctnessTestsByTag[testTag][testIdx];
            var observedOutput =
              observedOutputs[testIndexes[test.getStringifiedInput()]];
            if (test.matchesOutput(observedOutput)) {
              if (reinforcement.hasPastFailedCase(test.getStringifiedInput())) {
                reinforcement.updatePastFailedCases(
                  test.getStringifiedInput(), true);
              }
            } else if (!failedCaseSeenInTag) {
              // We want to display only 1 new failed case among all tasks.
              if (!failedCaseSeenOverall) {
                reinforcement.addToPastFailedCases(
                  test.getStringifiedInput(), false);
                failedCaseSeenOverall = true;
              }
              failedCaseSeenInTag = true;
            } else if (reinforcement.hasPastFailedCase(
                test.getStringifiedInput())) {
              reinforcement.updatePastFailedCases(
                test.getStringifiedInput(), false);
            }
          }
          if (failedCaseSeenInTag) {
            if (testTag in reinforcement.getPassedTags()) {
              reinforcement.updatePassedTags(testTag, false);
            }
          } else {
            // If all cases pass in this tag.
            reinforcement.addToPassedTags(testTag, true);
          }
        }

        return reinforcement;
      }
    };
  }
]);
