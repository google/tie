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
 * @fileoverview Service that orchestrates the processing of a user's code
 * submission.
 */

tie.factory('SolutionHandlerService', [
  '$q', 'CodePreprocessorDispatcherService', 'CodeRunnerDispatcherService',
  'FeedbackGeneratorService', 'SnapshotObjectFactory', 'TranscriptService',
  function(
      $q, CodePreprocessorDispatcherService, CodeRunnerDispatcherService,
      FeedbackGeneratorService, SnapshotObjectFactory, TranscriptService) {
    return {
      // Returns a promise with a Feedback object.
      processSolutionAsync: function(
          prompt, studentCode, auxiliaryCode, language) {
        TranscriptService.recordSolution(studentCode);
        // Do an initial run of the code to check for syntax errors.
        return CodeRunnerDispatcherService.runCodeAsync(
          language, studentCode
        ).then(function(rawCodeEvalResult) {
          var potentialSyntaxErrorMessage = rawCodeEvalResult.getErrorMessage();
          if (potentialSyntaxErrorMessage) {
            var feedback = FeedbackGeneratorService.getSyntaxErrorFeedback(
              potentialSyntaxErrorMessage);
            TranscriptService.recordSnapshot(
              SnapshotObjectFactory.create(rawCodeEvalResult, feedback))
            return $q.resolve(feedback);
          }

          // Otherwise, the code doesn't have any obvious syntax errors.
          // Preprocess the student's code into a class, append the test code,
          // and run the whole thing.
          var preprocessedCode =
            CodePreprocessorDispatcherService.preprocessCode(
              language, studentCode, auxiliaryCode,
              prompt.getMainFunctionName(), prompt.getOutputFunctionName(),
              prompt.getCorrectnessTests(), prompt.getBuggyOutputTests(),
              prompt.getPerformanceTests());

          return CodeRunnerDispatcherService.runCodeAsync(
            language, preprocessedCode
          ).then(function(codeEvalResult) {
            return FeedbackGeneratorService.getFeedback(prompt, codeEvalResult);
          });
        }).then(function(feedback) {
          TranscriptService.recordFeedback(feedback);
          return feedback;
        });
      }
    };
  }
]);
