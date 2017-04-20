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
  function() {

    return {
      getReinforcement: function(questionId, task, codeEvalResult,
        runtimeFeedback) {

        // Getting the question user is working on
        var question = globalData.questions[questionId];

        // Initializing question reinforcement data if not done already
        question.passedList = [];
        if (!question.pastFailsList) {
          question.pastFailsList = {};
        }

        var splitTestsByTag = function(tests) {
          var splitTests = {};
          for (var i = 0; i < tests.length; ++i) {
            var test = tests[i];
            test.index = i;
            var testTag = test.getTag();
            if (testTag in splitTests) {
              splitTests[testTag].push(test);
            } else {
              splitTests[testTag] = [test];
            }
          }
          return splitTests;
        };

        // Go through correctness tests to update reinforcement data
        var correctnessTests = splitTestsByTag(task.getCorrectnessTests());
        var observedOutputs = codeEvalResult.getCorrectnessTestResults();
        for (var testTag in correctnessTests) {
          var failedCaseSeen = false;
          for (var testIdx = 0; testIdx < correctnessTests[testTag].length;
           ++testIdx) {
            var test = correctnessTests[testTag][testIdx];
            var observedOutput = observedOutputs[test.index];
            if (test.matchesOutput(observedOutput)) {
              if (test.getInput() in question.pastFailsList) {
                question.pastFailsList[test.getInput()] = true;
              }
            } else if (!failedCaseSeen) {
              question.pastFailsList[test.getInput()] = false;
              failedCaseSeen = true;
            }
          }
          if (!failedCaseSeen) {
            question.passedList.push(testTag);
          }
        }

        runtimeFeedback.passedList = question.passedList.slice();
        runtimeFeedback.pastFailsList = {};

        for (var testCase in question.pastFailsList) {
          if (question.pastFailsList[testCase]) {
            runtimeFeedback.pastFailsList[testCase] = true;
          } else {
            runtimeFeedback.pastFailsList[testCase] = false;
          }
        }

        return runtimeFeedback;
      }
    };
  }
]);
