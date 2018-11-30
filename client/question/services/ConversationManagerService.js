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
  'CodeSubmissionObjectFactory', 'CORRECTNESS_STATES',
  'LearnerViewSubmissionResultObjectFactory', 'FEEDBACK_CATEGORIES',
  'FeedbackDetailsObjectFactory', 'EXECUTION_CONTEXT_COMPILATION',
  'EXECUTION_CONTEXT_RUN_WITH_TESTS', 'LearnerStateService',
  'CORRECTNESS_STATE_NO_MORE_FEEDBACK',
  function(
      $q, CodePreprocessorDispatcherService, CodeRunnerDispatcherService,
      FeedbackGeneratorService, PrereqCheckDispatcherService,
      CodeSubmissionObjectFactory, CORRECTNESS_STATES,
      LearnerViewSubmissionResultObjectFactory, FEEDBACK_CATEGORIES,
      FeedbackDetailsObjectFactory, EXECUTION_CONTEXT_COMPILATION,
      EXECUTION_CONTEXT_RUN_WITH_TESTS, LearnerStateService,
      CORRECTNESS_STATE_NO_MORE_FEEDBACK) {

    /**
     * Determines the feedback details that fully characterize the feedback
     * that the learner should receive, based on the test results. Callers must
     * ensure that this function is called only if all test cases have run to
     * completion.
     *
     * @param {Array} tasks Tasks associated with the problem that include
     *    the tests the user's code must pass.
     * @param {CodeEvalResult} codeEvalResult The evaluation result for the
     *   learner's code.
     *
     * @returns {FeedbackDetails|null}
     */
    var _computeFeedbackDetailsFromTestResults = function(
        tasks, codeEvalResult) {
      var codeHasChanged = LearnerStateService.hasRawCodeChanged(
        codeEvalResult.getRawCode());
      if (!codeHasChanged) {
        return LearnerStateService.getPreviousFeedbackDetails();
      }

      var buggyOutputTestResults = codeEvalResult.getBuggyOutputTestResults();
      var observedOutputs = codeEvalResult.getObservedOutputs();
      var performanceTestResults = codeEvalResult.getPerformanceTestResults();

      for (var i = 0; i < tasks.length; i++) {
        var buggyOutputTests = tasks[i].getBuggyOutputTests();
        var suiteLevelTests = tasks[i].getSuiteLevelTests();
        var testSuites = tasks[i].getTestSuites();
        var performanceTests = tasks[i].getPerformanceTests();
        var passingSuiteIds = codeEvalResult.getPassingSuiteIds(tasks, i);

        var firstFailingTestCase = null;
        var firstFailingTestSuiteId = null;
        var firstFailingTestCaseIndex = null;
        var observedOutputForFirstFailingTest = null;

        for (var j = 0; j < testSuites.length; j++) {
          if (firstFailingTestCase === null) {
            var testCases = testSuites[j].getTestCases();
            for (var k = 0; k < testCases.length; k++) {
              var testCase = testCases[k];
              var observedOutput = observedOutputs[i][j][k];
              if (!testCase.matchesOutput(observedOutput)) {
                firstFailingTestCase = testCase;
                firstFailingTestSuiteId = testSuites[j].getId();
                firstFailingTestCaseIndex = k;
                observedOutputForFirstFailingTest = observedOutput;
                break;
              }
            }
          }
        }

        if (firstFailingTestCase !== null) {
          for (j = 0; j < buggyOutputTests.length; j++) {
            if (buggyOutputTestResults[i][j]) {
              var testMessages = buggyOutputTests[j].getMessages();

              var currentFeedbackStage = (
                LearnerStateService.getNextFeedbackStage(
                  i, firstFailingTestSuiteId, firstFailingTestCaseIndex,
                  FEEDBACK_CATEGORIES.KNOWN_BUG_FAILURE, j,
                  testMessages.length));
              var totalFeedbackStages = (
                testMessages.length + CORRECTNESS_STATES.length);

              if (currentFeedbackStage === totalFeedbackStages) {
                // eslint-disable-next-line max-len
                return FeedbackDetailsObjectFactory.createIncorrectOutputFeedbackDetails(
                  i, firstFailingTestSuiteId, firstFailingTestCaseIndex,
                  firstFailingTestCase, observedOutputForFirstFailingTest,
                  CORRECTNESS_STATE_NO_MORE_FEEDBACK,
                  FEEDBACK_CATEGORIES.KNOWN_BUG_FAILURE, j);
              } else if (currentFeedbackStage >= testMessages.length) {
                // eslint-disable-next-line max-len
                return FeedbackDetailsObjectFactory.createIncorrectOutputFeedbackDetails(
                  i, firstFailingTestSuiteId, firstFailingTestCaseIndex,
                  firstFailingTestCase, observedOutputForFirstFailingTest,
                  CORRECTNESS_STATES[
                    currentFeedbackStage - testMessages.length],
                  FEEDBACK_CATEGORIES.KNOWN_BUG_FAILURE, j);
              } else {
                return (
                  FeedbackDetailsObjectFactory.createBuggyOutputFeedbackDetails(
                    i, firstFailingTestSuiteId, firstFailingTestCaseIndex, j,
                    testMessages, currentFeedbackStage));
              }
            }
          }

          for (j = 0; j < suiteLevelTests.length; j++) {
            if (suiteLevelTests[j].areConditionsMet(passingSuiteIds)) {
              testMessages = suiteLevelTests[j].getMessages();

              currentFeedbackStage = (
                LearnerStateService.getNextFeedbackStage(
                  i, firstFailingTestSuiteId, firstFailingTestCaseIndex,
                  FEEDBACK_CATEGORIES.SUITE_LEVEL_FAILURE, j,
                  testMessages.length));
              totalFeedbackStages = (
                testMessages.length + CORRECTNESS_STATES.length);

              if (currentFeedbackStage === totalFeedbackStages) {
                // eslint-disable-next-line max-len
                return FeedbackDetailsObjectFactory.createIncorrectOutputFeedbackDetails(
                  i, firstFailingTestSuiteId, firstFailingTestCaseIndex,
                  firstFailingTestCase, observedOutputForFirstFailingTest,
                  CORRECTNESS_STATE_NO_MORE_FEEDBACK,
                  FEEDBACK_CATEGORIES.SUITE_LEVEL_FAILURE, j);
              } else if (currentFeedbackStage >= testMessages.length) {
                // eslint-disable-next-line max-len
                return FeedbackDetailsObjectFactory.createIncorrectOutputFeedbackDetails(
                  i, firstFailingTestSuiteId, firstFailingTestCaseIndex,
                  firstFailingTestCase, observedOutputForFirstFailingTest,
                  CORRECTNESS_STATES[
                    currentFeedbackStage - testMessages.length],
                  FEEDBACK_CATEGORIES.SUITE_LEVEL_FAILURE, j);
              } else {
                return (
                  FeedbackDetailsObjectFactory.createSuiteLevelFeedbackDetails(
                    i, firstFailingTestSuiteId, firstFailingTestCaseIndex, j,
                    testMessages, currentFeedbackStage));
              }
            }
          }

          var nextFeedbackStage = LearnerStateService.getNextFeedbackStage(
            i, firstFailingTestSuiteId, firstFailingTestCaseIndex,
            null, null, null);
          var nextCorrectnessState = CORRECTNESS_STATES[nextFeedbackStage];

          return (
            FeedbackDetailsObjectFactory.createIncorrectOutputFeedbackDetails(
              i, firstFailingTestSuiteId, firstFailingTestCaseIndex,
              firstFailingTestCase, observedOutputForFirstFailingTest,
              nextCorrectnessState, null, null));
        }

        for (j = 0; j < performanceTests.length; j++) {
          var expectedPerformance = (
            performanceTests[j].getExpectedPerformance());
          var observedPerformance = performanceTestResults[i][j];

          if (expectedPerformance !== observedPerformance) {
            return (
              FeedbackDetailsObjectFactory.createPerformanceFeedbackDetails(
                expectedPerformance));
          }
        }
      }

      return FeedbackDetailsObjectFactory.createSuccessFeedbackDetails();
    };

    /**
     * Determines the feedback details that fully characterize the feedback
     * that the learner should receive, based on errors triggered during the
     * run.
     *
     * @param {CodeEvalResult} codeEvalResult The evaluation result for the
     *   learner's code.
     * @param {string} executionContext The execution context under which the
     *   learner's code is run (either "compilation" or "run with tests").
     * @param {string} language The language the code is written in.
     *
     * @returns {FeedbackDetails|null} The feedback details, or null if the
     * code fully runs.
     */
    var _computeFeedbackDetailsForErrorCases = function(
        codeEvalResult, executionContext, language) {
      var errorLineNumber = codeEvalResult.getErrorLineNumber();
      var errorString = codeEvalResult.getErrorString();

      if (codeEvalResult.hasTimeLimitError()) {
        return (
          FeedbackDetailsObjectFactory.createTimeLimitErrorFeedbackDetails());
      } else if (codeEvalResult.hasMemoryLimitError()) {
        return (
          FeedbackDetailsObjectFactory.createMemoryLimitErrorFeedbackDetails());
      } else if (codeEvalResult.hasStackExceededError()) {
        return (
          FeedbackDetailsObjectFactory.createStackExceededFeedbackDetails());
      } else if (codeEvalResult.hasServerError()) {
        return FeedbackDetailsObjectFactory.createServerErrorFeedbackDetails();
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
          return FeedbackDetailsObjectFactory.createRuntimeErrorFeedbackDetails(
            errorLineNumber, errorString, language,
            codeEvalResult.getErrorInput(),
            languageUnfamiliarityFeedbackIsNeeded);
        } else {
          return FeedbackDetailsObjectFactory.createSyntaxErrorFeedbackDetails(
            errorLineNumber, errorString, language,
            languageUnfamiliarityFeedbackIsNeeded);
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
          return Promise.resolve(
            LearnerViewSubmissionResultObjectFactory.create(feedback, null));
        } else {
          // Next, run the raw code to detect syntax errors. If any exist, we
          // return a promise with a Feedback object.
          return CodeRunnerDispatcherService.compileCodeAsync(
            language, studentCode
          ).then(function(codeEvalResult) {
            var potentialFeedbackDetails = _computeFeedbackDetailsForErrorCases(
              codeEvalResult, EXECUTION_CONTEXT_COMPILATION, language);

            if (potentialFeedbackDetails) {
              feedback = null;

              switch (potentialFeedbackDetails.getFeedbackCategory()) {
                case FEEDBACK_CATEGORIES.TIME_LIMIT_ERROR:
                  feedback = (
                    FeedbackGeneratorService.getTimeoutErrorFeedback());
                  break;
                case FEEDBACK_CATEGORIES.MEMORY_LIMIT_ERROR:
                  feedback = (
                    FeedbackGeneratorService.getMemoryLimitErrorFeedback());
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

              LearnerStateService.recordRawCode(studentCode);
              LearnerStateService.recordFeedbackDetails(
                potentialFeedbackDetails);

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
              var errorFeedbackDetails = _computeFeedbackDetailsForErrorCases(
                preprocessedCodeEvalResult, EXECUTION_CONTEXT_RUN_WITH_TESTS,
                language);

              if (errorFeedbackDetails) {
                var feedbackDetails = errorFeedbackDetails;
                switch (errorFeedbackDetails.getFeedbackCategory()) {
                  case FEEDBACK_CATEGORIES.TIME_LIMIT_ERROR:
                    feedback = (
                      FeedbackGeneratorService.getTimeoutErrorFeedback());
                    break;
                  case FEEDBACK_CATEGORIES.MEMORY_LIMIT_ERROR:
                    feedback = (
                      FeedbackGeneratorService.getMemoryLimitErrorFeedback());
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
                      errorFeedbackDetails,
                      codeSubmission.getRawCodeLineIndexes());
                    break;
                  default:
                    throw Error('Invalid feedback type.');
                }
              } else {
                feedbackDetails = _computeFeedbackDetailsFromTestResults(
                  tasks, preprocessedCodeEvalResult);
                switch (feedbackDetails.getFeedbackCategory()) {
                  case FEEDBACK_CATEGORIES.KNOWN_BUG_FAILURE:
                    feedback = (
                      FeedbackGeneratorService.getBuggyOutputFeedback(
                        feedbackDetails));
                    break;
                  case FEEDBACK_CATEGORIES.SUITE_LEVEL_FAILURE:
                    feedback = (
                      FeedbackGeneratorService.getSuiteLevelFeedback(
                        feedbackDetails));
                    break;
                  case FEEDBACK_CATEGORIES.INCORRECT_OUTPUT_FAILURE:
                    feedback = (
                      FeedbackGeneratorService.getIncorrectOutputFeedback(
                        feedbackDetails));
                    break;
                  case FEEDBACK_CATEGORIES.PERFORMANCE_TEST_FAILURE:
                    feedback = (
                      FeedbackGeneratorService.getPerformanceTestFeedback(
                        feedbackDetails));
                    break;
                  case FEEDBACK_CATEGORIES.SUCCESSFUL:
                    feedback = FeedbackGeneratorService.getSuccessFeedback();
                    break;
                  default:
                    throw Error('Invalid feedback type.');
                }
              }

              LearnerStateService.recordRawCode(
                preprocessedCodeEvalResult.getRawCode());
              LearnerStateService.recordFeedbackDetails(feedbackDetails);

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
