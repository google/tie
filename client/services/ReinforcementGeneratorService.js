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
  function(ReinforcementObjectFactory) {

    return {
      getReinforcement: function(questionId, task, codeEvalResult,
        runtimeFeedback) {
        
        // Getting the question user is working on
        question = globalData.questions[questionId];
        
        // Initializing question reinforcement data if not done already 
        if (!question.passedList) question.passedList = ['test'];
        if (!question.pastFailingList) question.pastFailingList = {};
        
        // Go through correctness tests to update reinforcement data
        var correctnessTests = task.getCorrectnessTests();
        var observedOutputs = codeEvalResult.getCorrectnessTestResults();
        var failedCaseSeen = false;
        for (i = 0; i < correctnessTests.length; i++) {
          var observedOutput = observedOutputs[i];
          if (!correctnessTests[i].matchesOutput(observedOutput)) {
            if (!failedCaseSeen) {
              question.pastFailingList[correctnessTests[i].getInput()] = false;
              failedCaseSeen = true;
            }
          } else {
            if (correctnessTests[i].getInput() in question.pastFailingList) {
              question.pastFailingList[correctnessTests[i].getInput()] = true;
            }
          }
        }
        
        // TODO(shaman-rajan) Generate text to return from reinforcement data
        runtimeFeedback['passedList'] = question.passedList.slice();
        runtimeFeedback['pastFailingList'] = {};
        
        for (testCase in question.pastFailingList) {
          if (question.pastFailingList[testCase]) {
            runtimeFeedback.pastFailingList[testCase] = true;
          } else {
            runtimeFeedback.pastFailingList[testCase] = false;
          }
        }

        return runtimeFeedback;
      }
    };
  }
]);
  