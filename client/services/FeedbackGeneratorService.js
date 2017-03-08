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
    var _jsToHumanReadable = function(jsVariable) {
      if (typeof jsVariable === 'string') {
        return '"' + jsVariable + '"';
      } else if (typeof jsVariable === 'number') {
        return String(jsVariable);
      } else if (typeof jsVariable === 'boolean') {
        return jsVariable ? 'True' : 'False';
      } else if (Array.isArray(jsVariable)) {
        return '[' + jsVariable + ']';
      } else {
        throw Error('Cannot parse JS variable: ' + jsVariable);
      }
    };

    return {
      getFeedback: function(prompt, codeEvalResult) {
        if (codeEvalResult.getErrorMessage()) {
          return FeedbackObjectFactory.create([
            'Your code threw an error: ' + codeEvalResult.getErrorMessage()
          ], false);
        } else {
          var buggyOutputTests = prompt.getBuggyOutputTests();
          var buggyOutputTestResults =
              codeEvalResult.getBuggyOutputTestResults();
          for (var i = 0; i < buggyOutputTests.length; i++) {
            if (buggyOutputTestResults[i]) {
              // TODO(sll): Interpolate the %s characters in these messages,
              // where needed.
              // TODO(sll): Use subsequent messages as well if multiple
              // messages are specified.
              return FeedbackObjectFactory.create(
                buggyOutputTests[i].getMessages()[0], false);
            }
          }

          var correctnessTests = prompt.getCorrectnessTests();
          var observedOutputs = codeEvalResult.getCorrectnessTestResults();
          for (var i = 0; i < correctnessTests.length; i++) {
            var expectedOutput = correctnessTests[i].getExpectedOutput();
            var observedOutput = observedOutputs[i];

            // TODO(eyurko): Add varied statements for when code is incorrect.
            if (expectedOutput !== observedOutput) {
              return FeedbackObjectFactory.create([
                'Your code gave the output ',
                _jsToHumanReadable(observedOutput),
                ' for the input ',
                _jsToHumanReadable(correctnessTests[i].getInput()),
                ' ... but this does not match the expected output ',
                _jsToHumanReadable(expectedOutput),
                '.'
              ].join(''), false);
            }
          }

          var performanceTests = prompt.getPerformanceTests();
          var performanceTestResults =
              codeEvalResult.getPerformanceTestResults();
          for (var i = 0; i < performanceTests.length; i++) {
            var expectedPerformance = performanceTests[i].getExpectedPerformance();
            var observedPerformance = performanceTestResults[i];

            if (expectedPerformance !== observedPerformance) {
              return FeedbackObjectFactory.create([
                'Your code is running more slowly than expected. Can you ',
                'reconfigure it such that it runs in ',
                expectedPerformance,
                ' time?'
              ].join(''), false);
            }
          }

          return FeedbackObjectFactory.create([
            'You\'ve completed all the tasks for this question! Click the ',
            '"Next" button to move on to the next question.',
          ].join(''), true);
        }
      },
      getSyntaxErrorFeedback: function(errorMessage) {
        return FeedbackObjectFactory.create(errorMessage, false);
      },
      _jsToHumanReadable: _jsToHumanReadable
    };
  }
]);
