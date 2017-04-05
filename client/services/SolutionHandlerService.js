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
  'CodeSubmissionObjectFactory',
  function(
      $q, CodePreprocessorDispatcherService, CodeRunnerDispatcherService,
      FeedbackGeneratorService, SnapshotObjectFactory, TranscriptService,
      CodeSubmissionObjectFactory) {
    return {
      // Returns a promise with a Feedback object.
      processSolutionAsync: function(
          task, studentCode, auxiliaryCode, language) {
        // Do an initial run of the code to check for syntax errors.
        return CodeRunnerDispatcherService.runCodeAsync(
          language, studentCode
        ).then(function(rawCodeEvalResult) {
          var potentialSyntaxErrorString = rawCodeEvalResult.getErrorString();
          if (potentialSyntaxErrorString) {
            var feedback = FeedbackGeneratorService.getSyntaxErrorFeedback(
              potentialSyntaxErrorString);
            TranscriptService.recordSnapshot(
              SnapshotObjectFactory.create(rawCodeEvalResult, feedback));
            return $q.resolve(feedback);
          }

          // Otherwise, the code doesn't have any obvious syntax errors.
          // Generate a CodeSubmission object that wraps the student's code
          // into a class and appends some test code, then run the whole thing.
          var codeSubmission = CodeSubmissionObjectFactory.create(
            studentCode.trim());
          CodePreprocessorDispatcherService.preprocess(
            language, codeSubmission, auxiliaryCode,
            task.getInputFunctionName(), task.getMainFunctionName(), 
            task.getOutputFunctionName(), task.getCorrectnessTests(), 
            task.getBuggyOutputTests(),
            task.getPerformanceTests());

          return CodeRunnerDispatcherService.runCodeAsync(
            language, codeSubmission.getPreprocessedCode()
          ).then(function(codeEvalResult) {
            var runtimeFeedback = FeedbackGeneratorService.getFeedback(
              task, codeEvalResult, codeSubmission.getRawCodeLineIndexes());
            TranscriptService.recordSnapshot(
              SnapshotObjectFactory.create(codeEvalResult, runtimeFeedback));
            return runtimeFeedback;
          });
        }).then(function(feedback) {
          return feedback;
        });
      }
    };
  }
]);
