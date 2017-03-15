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
  'FeedbackObjectFactory', 'CODE_EXECUTION_TIMEOUT_SECONDS', function(
    FeedbackObjectFactory, CODE_EXECUTION_TIMEOUT_SECONDS) {
    // TODO(sll): Update this function to take the programming language into
    // account when generating the human-readable representations. Currently,
    // it assumes that Python is being used.
    var _jsToHumanReadable = function(jsVariable) {
      if (jsVariable === null || jsVariable === undefined) {
        return 'None';
      } else if (typeof jsVariable === 'string') {
        return '"' + jsVariable + '"';
      } else if (typeof jsVariable === 'number') {
        return String(jsVariable);
      } else if (typeof jsVariable === 'boolean') {
        return jsVariable ? 'True' : 'False';
      } else if (Array.isArray(jsVariable)) {
        var humanReadableElements = jsVariable.map(function(arrayElement) {
          return _jsToHumanReadable(arrayElement);
        });
        return '[' + humanReadableElements.join(', ') + ']';
      } else if (typeof jsVariable === 'object') {
        var humanReadableKeyValuePairs = [];
        for (var key in jsVariable) {
          humanReadableKeyValuePairs.push(
            _jsToHumanReadable(key) + ': ' +
            _jsToHumanReadable(jsVariable[key]));
        }
        return '{' + humanReadableKeyValuePairs.join(', ') + '}';
      } else {
        console.error(
          'Could not make the following object human-readable: ', jsVariable);
        return '[UNKNOWN OBJECT]';
      }
    };

    return {
      getFeedback: function(prompt, codeEvalResult) {
        var errorMessage = codeEvalResult.getErrorMessage();
        // We want to catch and handle a timeout error uniquely, rather than
        // integrate it into the existing feedback pipeline.
        if (errorMessage !== null && 
            errorMessage.toString().startsWith('TimeLimitError')) {
          var feedback = FeedbackObjectFactory.create(false);
          feedback.appendTextParagraph(
            ["Your program's exceeded the time limit (",
            CODE_EXECUTION_TIMEOUT_SECONDS,
            " seconds) we've set. Can you try to make it run ",
            "more efficiently?"].join(''));
          return feedback;
        }
        if (errorMessage) {
          var errorInput = codeEvalResult.getErrorInput();
          var inputClause = (
            ' when evaluating the input ' + _jsToHumanReadable(errorInput));
          var feedback = FeedbackObjectFactory.create(false);
          feedback.appendTextParagraph(
            "Looks like your code had a runtime error" + inputClause +
            ". Here's the trace:")
          feedback.appendCodeParagraph(codeEvalResult.getErrorMessage());
          return feedback;
        } else {
          var buggyOutputTests = prompt.getBuggyOutputTests();
          var buggyOutputTestResults =
              codeEvalResult.getBuggyOutputTestResults();
          for (var i = 0; i < buggyOutputTests.length; i++) {
            if (buggyOutputTestResults[i]) {
              // TODO(sll): Use subsequent messages as well if multiple
              // messages are specified.
              var feedback = FeedbackObjectFactory.create(false);
              feedback.appendTextParagraph(
                buggyOutputTests[i].getMessages()[0]);
              return feedback;
            }
          }

          var correctnessTests = prompt.getCorrectnessTests();
          var observedOutputs = codeEvalResult.getCorrectnessTestResults();
          for (var i = 0; i < correctnessTests.length; i++) {
            var observedOutput = observedOutputs[i];

            // TODO(eyurko): Add varied statements for when code is incorrect.
            if (!correctnessTests[i].matchesOutput(observedOutput)) {
              var allowedOutputExample = (
                correctnessTests[i].getAnyAllowedOutput());
              var feedback = FeedbackObjectFactory.create(false);
              feedback.appendTextParagraph([
                'Your code gave the output ',
                _jsToHumanReadable(observedOutput),
                ' for the input ',
                _jsToHumanReadable(correctnessTests[i].getInput()),
                ' ... but this does not match the expected output ',
                _jsToHumanReadable(allowedOutputExample),
                '.'
              ].join(''));
              return feedback;
            }
          }

          var performanceTests = prompt.getPerformanceTests();
          var performanceTestResults =
              codeEvalResult.getPerformanceTestResults();
          for (var i = 0; i < performanceTests.length; i++) {
            var expectedPerformance = performanceTests[i].getExpectedPerformance();
            var observedPerformance = performanceTestResults[i];

            if (expectedPerformance !== observedPerformance) {
              var feedback = FeedbackObjectFactory.create(false);
              feedback.appendTextParagraph([
                'Your code is running more slowly than expected. Can you ',
                'reconfigure it such that it runs in ',
                expectedPerformance,
                ' time?'
              ].join(''));
              return feedback;
            }
          }

          var feedback = FeedbackObjectFactory.create(true);
          feedback.appendTextParagraph([
            'You\'ve completed all the tasks for this question! Click the ',
            '"Next" button to move on to the next question.',
          ].join(''));
          return feedback;
        }
      },
      getSyntaxErrorFeedback: function(errorMessage) {
        var feedback = FeedbackObjectFactory.create(false);
        feedback.appendTextParagraph(
          "Looks like your code did not compile. Here's the error trace: ");
        feedback.appendCodeParagraph(errorMessage);
        return feedback;
      },
      _jsToHumanReadable: _jsToHumanReadable
    };
  }
]);
