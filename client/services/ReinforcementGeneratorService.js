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
      getReinforcement: function(runtimeFeedback, task, codeEvalResult) {
        /*var buggyOutputTests = task.getBuggyOutputTests();
        var buggyOutputTestResults =
            codeEvalResult.getBuggyOutputTestResults();
        for (var i = 0; i < buggyOutputTests.length; i++) {
          if (buggyOutputTestResults[i]) {
            return _getBuggyOutputTestFeedback(
              buggyOutputTests[i], codeEvalResult);
          }
        }

        var correctnessTests = task.getCorrectnessTests();
        var observedOutputs = codeEvalResult.getCorrectnessTestResults();
        for (i = 0; i < correctnessTests.length; i++) {
          var observedOutput = observedOutputs[i];

          // TODO(eyurko): Add varied statements for when code is incorrect.
          if (!correctnessTests[i].matchesOutput(observedOutput)) {
            return _getCorrectnessTestFeedback(
              correctnessTests[i], observedOutput);
          }
        }*/
        return runtimeFeedback;
      }
    };
  }
]);
