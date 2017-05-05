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

    var getTestsKeyedByTag = function(tests) {
      var splitTests = {};
      for (var i = 0; i < tests.length; ++i) {
        var test = tests[i];
        test.originalIndex = i;
        var testTag = test.getTag();
        if (splitTests.hasOwnProperty(testTag)) {
          splitTests[testTag].push(test);
        } else {
          splitTests[testTag] = [test];
        }
      }
      return splitTests;
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
          var previousReinforcementPassedTagsList =
            previousReinforcement.getPassedTagsList();
          for (var tag in previousReinforcementPassedTagsList) {
            reinforcement.addToPassedTagsList(tag,
              previousReinforcementPassedTagsList[tag]);
          }
          var previousReinforcementPastFailedList =
            previousReinforcement.getPastFailedCasesList();
          for (var pastCase in previousReinforcementPastFailedList) {
            reinforcement.addToPastFailedCasesList(pastCase,
              previousReinforcementPastFailedList[pastCase]);
          }
        }

        // Go through correctness tests to update reinforcement data.
        var correctnessTestsByTag = getTestsKeyedByTag(
          task.getCorrectnessTests());
        var observedOutputs = codeEvalResult.getCorrectnessTestResults();
        // Get results only for the last task.
        observedOutputs = observedOutputs[observedOutputs.length - 1];
        var failedCaseSeenOverall = false;
        for (var testTag in correctnessTestsByTag) {
          var failedCaseSeenInTag = false;
          for (var testIdx = 0; testIdx < correctnessTestsByTag[testTag].length;
              ++testIdx) {
            var test = correctnessTestsByTag[testTag][testIdx];
            var observedOutput = observedOutputs[test.originalIndex];
            if (test.matchesOutput(observedOutput)) {
              if (reinforcement.hasPastFailedCase(test.getInput())) {
                reinforcement.addToPastFailedCasesList(test.getInput(), true);
              }
            } else if (!failedCaseSeenInTag) {
              // We want to display only 1 new failed case among all tasks.
              if (!failedCaseSeenOverall) {
                reinforcement.addToPastFailedCasesList(test.getInput(), false);
                failedCaseSeenOverall = true;
              }
              failedCaseSeenInTag = true;
            }
          }
          if (failedCaseSeenInTag) {
            if (testTag in reinforcement.getPassedTagsList()) {
              reinforcement.addToPassedTagsList(testTag, false);
            }
          } else {
            // If all cases pass in this tag.
            reinforcement.addToPassedTagsList(testTag, true);
          }
        }

        return reinforcement;
      }
    };
  }
]);
