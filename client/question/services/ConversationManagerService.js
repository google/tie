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
 * @fileoverview Service that orchestrates TIE's conversation with the learner.
 */

tie.factory('ConversationManagerService', [
  '$q', 'CodePreprocessorDispatcherService', 'CodeRunnerDispatcherService',
  'FeedbackGeneratorService', 'PrereqCheckDispatcherService',
  'TranscriptService', 'CodeSubmissionObjectFactory',
  'LearnerViewSubmissionResultObjectFactory', 'FEEDBACK_CATEGORIES',
  'FeedbackDetailsObjectFactory', 'EXECUTION_CONTEXT_COMPILATION',
  'EXECUTION_CONTEXT_RUN_WITH_TESTS', 'LearnerStateService',
  function(
      $q, CodePreprocessorDispatcherService, CodeRunnerDispatcherService,
      FeedbackGeneratorService, PrereqCheckDispatcherService,
      TranscriptService, CodeSubmissionObjectFactory,
      LearnerViewSubmissionResultObjectFactory, FEEDBACK_CATEGORIES,
      FeedbackDetailsObjectFactory, EXECUTION_CONTEXT_COMPILATION,
      EXECUTION_CONTEXT_RUN_WITH_TESTS, LearnerStateService) {

    /**
     * Determines the feedback details that fully characterize the feedback
     * that the learner should receive.
     *
     * @param {CodeEvalResult} codeEvalResult The evaluation result for the
     *   learner's code.
     * @param {string} executionContext The execution context under which the
     *   learner's code is run (either "compilation" or "run with tests").
     * @param {string} language The language the code is written in.
     *
     * @returns {FeedbackDetails}
     */
    var computeFeedbackDetails = function(
        codeEvalResult, executionContext, language) {
      var errorString = codeEvalResult.getErrorString();

      if (codeEvalResult.hasTimeLimitError()) {
        return FeedbackDetailsObjectFactory.createTimeLimitErrorFeedback();
      } else if (codeEvalResult.hasStackExceededError()) {
        return FeedbackDetailsObjectFactory.createStackExceededFeedback();
      } else if (codeEvalResult.hasServerError()) {
        return FeedbackDetailsObjectFactory.createServerErrorFeedback();
      } else if (errorString) {
        if (executionContext === EXECUTION_CONTEXT_RUN_WITH_TESTS) {
          LearnerStateService.recordRuntimeError(errorString);
        } else if (executionContext === EXECUTION_CONTEXT_COMPILATION) {
          LearnerStateService.recordSyntaxError();
        } else {
          throw Error('Invalid execution context: ' + executionContext);
        }

        var languageUnfamiliarityFeedbackIsNeeded = (
          LearnerStateService.doesUserNeedLanguageUnfamiliarityPrompt());
        if (languageUnfamiliarityFeedbackIsNeeded) {
          // Once the user has been prompted, we reset the counter so
          // that we don't continually prompt and, thereby, annoy them.
          LearnerStateService.resetLanguageUnfamiliarityCounters();
        }

        if (executionContext === EXECUTION_CONTEXT_RUN_WITH_TESTS) {
          return FeedbackDetailsObjectFactory.createRuntimeErrorFeedback(
            errorString, language, codeEvalResult.getErrorInput(),
            languageUnfamiliarityFeedbackIsNeeded);
        } else {
          return FeedbackDetailsObjectFactory.createSyntaxErrorFeedback(
            errorString, language, languageUnfamiliarityFeedbackIsNeeded);
        }
      }

      return null;
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
          if (potentialPrereqCheckFailure.hasWrongLanguage()) {
            LearnerStateService.recordPrereqWrongLanguageError();
          } else {
            LearnerStateService.resetLanguageUnfamiliarityCounters();
          }

          var languageUnfamiliarityFeedbackIsNeeded = (
            LearnerStateService.doesUserNeedLanguageUnfamiliarityPrompt());
          if (languageUnfamiliarityFeedbackIsNeeded) {
            // Once the user has been prompted, we reset the counter so
            // that we don't continually prompt and, thereby, annoy them.
            LearnerStateService.resetLanguageUnfamiliarityCounters();
          }

          feedback = FeedbackGeneratorService.getPrereqFailureFeedback(
            potentialPrereqCheckFailure, languageUnfamiliarityFeedbackIsNeeded,
            language);
          TranscriptService.recordSnapshot(
            potentialPrereqCheckFailure, null, feedback);
          return Promise.resolve(
            LearnerViewSubmissionResultObjectFactory.create(feedback, null));
        } else {
          // Next, run the raw code to detect syntax errors. If any exist, we
          // return a promise with a Feedback object.
          return CodeRunnerDispatcherService.compileCodeAsync(
            language, studentCode
          ).then(function(codeEvalResult) {
            var potentialFeedbackDetails = computeFeedbackDetails(
              codeEvalResult, EXECUTION_CONTEXT_COMPILATION, language);

            if (potentialFeedbackDetails) {
              feedback = null;

              switch (potentialFeedbackDetails.getFeedbackCategory()) {
                case FEEDBACK_CATEGORIES.TIME_LIMIT_ERROR:
                  feedback = (
                    FeedbackGeneratorService.getTimeoutErrorFeedback());
                  break;
                case FEEDBACK_CATEGORIES.STACK_EXCEEDED_ERROR:
                  feedback = (
                    FeedbackGeneratorService.getStackExceededFeedback());
                  break;
                case FEEDBACK_CATEGORIES.SERVER_ERROR:
                  feedback = (
                    FeedbackGeneratorService.getServerErrorFeedback());
                  break;
                case FEEDBACK_CATEGORIES.SYNTAX_ERROR:
                  feedback = FeedbackGeneratorService.getSyntaxErrorFeedback(
                    potentialFeedbackDetails);
                  break;
                default:
                  throw Error(
                    'Invalid feedback type for compilation step: ' +
                    potentialFeedbackDetails.getFeedbackCategory());
              }

              TranscriptService.recordSnapshot(null, codeEvalResult, feedback);
              return LearnerViewSubmissionResultObjectFactory.create(
                feedback, null);
            }

            // If there are no syntax errors, generate a CodeSubmission object
            // that wraps the student's code into a class and appends some test
            // code, then run the whole thing.
            var codeSubmission = CodeSubmissionObjectFactory.create(
              studentCode.trim());
            var preprocessedCodeObject =
              CodePreprocessorDispatcherService.preprocess(
                language, codeSubmission, auxiliaryCode, tasks);

            return CodeRunnerDispatcherService.runCodeAsync(
              language, preprocessedCodeObject
            ).then(function(preprocessedCodeEvalResult) {
              var feedbackDetails = computeFeedbackDetails(
                preprocessedCodeEvalResult, EXECUTION_CONTEXT_RUN_WITH_TESTS,
                language);

              // TODO(sll): Once all feedback categories have been migrated
              // here, remove this null case.
              if (feedbackDetails === null) {
                feedback = FeedbackGeneratorService.getFeedback(
                  tasks, preprocessedCodeEvalResult,
                  codeSubmission.getRawCodeLineIndexes());
              } else {
                switch (feedbackDetails.getFeedbackCategory()) {
                  case FEEDBACK_CATEGORIES.TIME_LIMIT_ERROR:
                    feedback = (
                      FeedbackGeneratorService.getTimeoutErrorFeedback());
                    break;
                  case FEEDBACK_CATEGORIES.STACK_EXCEEDED_ERROR:
                    feedback = (
                      FeedbackGeneratorService.getStackExceededFeedback());
                    break;
                  case FEEDBACK_CATEGORIES.SERVER_ERROR:
                    feedback = (
                      FeedbackGeneratorService.getServerErrorFeedback());
                    break;
                  case FEEDBACK_CATEGORIES.RUNTIME_ERROR:
                    feedback = FeedbackGeneratorService.getRuntimeErrorFeedback(
                      feedbackDetails,
                      codeSubmission.getRawCodeLineIndexes());
                    break;
                  case null:
                    feedback = FeedbackGeneratorService.getFeedback(
                      tasks, preprocessedCodeEvalResult,
                      codeSubmission.getRawCodeLineIndexes());
                    break;
                  default:
                    throw Error('Invalid feedback type.');
                }
              }
              TranscriptService.recordSnapshot(
                null, preprocessedCodeEvalResult, feedback);

              var stdout = preprocessedCodeEvalResult.getStdoutToDisplay(tasks);
              return LearnerViewSubmissionResultObjectFactory.create(
                feedback, stdout);
            });
          });
        }
      }
    };
  }
]);
