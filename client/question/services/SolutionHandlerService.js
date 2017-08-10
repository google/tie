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
  'FeedbackGeneratorService', 'PrereqCheckDispatcherService',
  'TranscriptService', 'CodeSubmissionObjectFactory',
  function(
      $q, CodePreprocessorDispatcherService, CodeRunnerDispatcherService,
      FeedbackGeneratorService, PrereqCheckDispatcherService,
      TranscriptService, CodeSubmissionObjectFactory) {
    return {
      /**
       * Asynchronously returns a Promise with a Feedback object associated
       * with the code submission and the test results.
       *
       * @param {Array} tasks
       * @param {string} starterCode Code given at the beginning before user
       *    adds their own code.
       * @param {string} studentCode Code that the user submitted
       * @param {string} auxiliaryCode Code that the user does not write but
       *    is needed to pass the given tests.
       * @param {string} language Language that the code is written in.
       * @returns {*}
       */
      processSolutionAsync: function(
          tasks, starterCode, studentCode, auxiliaryCode, language) {
        // First, check pre-requisites for the submitted code.
        var potentialPrereqCheckFailure =
          PrereqCheckDispatcherService.checkCode(
            language, starterCode, studentCode);
        var feedback = null;

        if (potentialPrereqCheckFailure) {
          feedback = FeedbackGeneratorService.getPrereqFailureFeedback(
            potentialPrereqCheckFailure);
          TranscriptService.recordSnapshot(
            potentialPrereqCheckFailure, null, feedback);
          return Promise.resolve(feedback);
        } else {
          // Next, run the raw code to detect syntax errors. If any exist, we
          // return a promise with a Feedback object.
          return CodeRunnerDispatcherService.compileCodeAsync(
            language, studentCode
          ).then(function(codeEvalResult) {
            var potentialSyntaxErrorString = codeEvalResult.getErrorString();
            if (potentialSyntaxErrorString) {
              feedback = FeedbackGeneratorService.getSyntaxErrorFeedback(
                potentialSyntaxErrorString);
              TranscriptService.recordSnapshot(null, codeEvalResult, feedback);
              return feedback;
            }

            // If there are no syntax errors, generate a CodeSubmission object
            // that wraps the student's code into a class and appends some test
            // code, then run the whole thing.
            var codeSubmission = CodeSubmissionObjectFactory.create(
              studentCode.trim());
            CodePreprocessorDispatcherService.preprocess(
              language, codeSubmission, auxiliaryCode, tasks);

            return CodeRunnerDispatcherService.runCodeAsync(
              language, codeSubmission.getPreprocessedCode()
            ).then(function(preprocessedCodeEvalResult) {
              feedback = FeedbackGeneratorService.getFeedback(
                tasks, preprocessedCodeEvalResult,
                codeSubmission.getRawCodeLineIndexes());
              TranscriptService.recordSnapshot(
                null, preprocessedCodeEvalResult, feedback);
              return feedback;
            });
          });
        }
      }
    };
  }
]);
