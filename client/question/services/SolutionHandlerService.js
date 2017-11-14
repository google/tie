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
  'TranscriptService', 'CodeSubmissionObjectFactory', 'TipsGeneratorService',
  function(
      $q, CodePreprocessorDispatcherService, CodeRunnerDispatcherService,
      FeedbackGeneratorService, PrereqCheckDispatcherService,
      TranscriptService, CodeSubmissionObjectFactory, TipsGeneratorService) {
    // Caches the index of the first failed task in the most recent submission
    // that passes syntax checks. This is initialized to zero because, at the
    // outset (before the user even submits any code), none of the tasks are
    // passing.
    var indexOfFirstFailedTask = 0;

    /**
     * Returns the list of tips for the given index, or an empty array if the
     * given index is null.
     *
     * @param {Array<Task>} tasks The list of tasks
     * @param {string} language The language the user's code is written in
     * @param {number|null} taskIndexOrNull The index of a task, or null.
     * @returns {Array<Tip>} tips The corresponding array of Tip objects.
     */
    var getTips = function(tasks, language, taskIndexOrNull) {
      return (
        (taskIndexOrNull === null) ? [] :
        tasks[taskIndexOrNull].getTips(language));
    };

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
              var previousTipParagraphs = TipsGeneratorService.getTipParagraphs(
                language, studentCode,
                getTips(tasks, language, indexOfFirstFailedTask));
              feedback = FeedbackGeneratorService.getSyntaxErrorFeedback(
                previousTipParagraphs, potentialSyntaxErrorString);
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
              indexOfFirstFailedTask = (
                preprocessedCodeEvalResult.getIndexOfFirstFailedTask(tasks));
              var tipParagraphs = TipsGeneratorService.getTipParagraphs(
                language, studentCode,
                getTips(tasks, language, indexOfFirstFailedTask));
              feedback = FeedbackGeneratorService.getFeedback(
                tipParagraphs, tasks, preprocessedCodeEvalResult,
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
