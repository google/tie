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

tie.factory('SolutionBrokerService', [
  'CodeRunnerDispatcherService', 'FeedbackGeneratorService',
  'TranscriptService',
  function(
      CodeRunnerDispatcherService, FeedbackGeneratorService,
      TranscriptService) {
    return {
      // Returns a promise.
      processSolutionAsync: function(question, code) {
        TranscriptService.recordSolution(code);
        return CodeRunnerDispatcherService.runCodeAsync(
          question.getLanguage(), code
        ).then(function(codeEvalResult) {
          var feedback = FeedbackGeneratorService.getFeedback(
            question, codeEvalResult);
          TranscriptService.recordFeedback(feedback);
          return feedback;
        });
      }
    };
  }
]);
