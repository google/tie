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
 * @fileoverview Service for generating feedback based on the evaluation result
 * of the code submitted by the user, preprocessed and augmented with unit
 * tests. This assumes that the base code already passes "compile-time" checks.
 */

tie.factory('FeedbackGeneratorService', [
  'FeedbackObjectFactory', function(FeedbackObjectFactory) {
    // TODO(sll): Add escaping?
    var jsToHumanReadable = function(jsVariable) {
      if (typeof jsVariable === 'string') {
        return '"' + jsVariable + '"';
      }
    };

    return {
      getFeedback: function(prompt, codeEvalResult) {
        if (codeEvalResult.getErrorMessage()) {
          return FeedbackObjectFactory.create([
            'Your code threw an error: ' + codeEvalResult.getErrorMessage()
          ], false);
        } else {
          var correctnessTests = prompt.getCorrectnessTests();
          var observedOutputs = codeEvalResult.getTestResults();
          for (var i = 0; i < correctnessTests.length; i++) {
            var expectedOutput = correctnessTests[i].getExpectedOutput();
            var observedOutput = observedOutputs[i];

            //TODO(eyurko): Add varied statements for when code is incorrect.
            if (expectedOutput !== observedOutput) {
              return FeedbackObjectFactory.create([
                'Your code gave the output ',
                jsToHumanReadable(observedOutput),
                ' for the input ',
                jsToHumanReadable(correctnessTests[i].getInput()),
                ' ... but this does not match the expected output ',
                jsToHumanReadable(expectedOutput),
                '.'
              ].join(''), false);
            }
          }
          // TODO(eyurko): Potentially use regression to check runtime complexity, rather than just guessing.
          var performanceTests = prompt.getPerformanceTests();
          for (var i = 0; i < performanceTests.length; i++) {
            testIndex = i + correctnessTests.length;
            var expectedPerformance = performanceTests[i].getExpectedPerformance();
            var observedPerformance = observedOutputs[testIndex];

            if (expectedPerformance !== observedPerformance) {
              return FeedbackObjectFactory.create([
                'Your code is running pretty slowly. Can you reconfigure it ',
                'such that it runs in ',
                expectedPerformance,
                ' time?'
              ].join(''), false);
            }
          }
          return FeedbackObjectFactory.create([
            'Congratulations, you\'ve finished this question! Click the ',
            '"Next" button to move on to the next question.',
          ].join(''), true);
        }
      },
      getSyntaxErrorFeedback: function(errorMessage) {
        return FeedbackObjectFactory.create(errorMessage, false);
      }
    };
  }
]);
