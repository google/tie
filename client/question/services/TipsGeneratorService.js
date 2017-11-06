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
 * @fileoverview Service for generating tips based on a user's code submission.
 */

tie.factory('TipsGeneratorService', [
  'SYSTEM_GENERATED_TIPS', 'PrereqCheckDispatcherService',
  'FeedbackParagraphObjectFactory',
  function(
      SYSTEM_GENERATED_TIPS, PrereqCheckDispatcherService,
      FeedbackParagraphObjectFactory) {
    /**
     * Returns a list of paragraphs indicating system-generated tips for the
     * learner.
     *
     * @param {string} language The language in which the code is written.
     * @param {string} code The code to analyze.
     * @returns {Array} A list of FeedbackParagraph objects, representing
     *   system-generated tips, to prepend to the regular TIE feedback.
     */
    var getSystemTipParagraphs = function(language, codeLines) {
      var tipParagraphs = [];

      SYSTEM_GENERATED_TIPS[language].forEach(function(tipSpecification) {
        var regexp = new RegExp(tipSpecification.regExString);
        var detected = codeLines.some(function(line) {
          return line.search(regexp) !== -1;
        });
        if (detected) {
          var feedbackParagraphs = tipSpecification.feedbackParagraphs.map(
            function(paragraphDict) {
              return FeedbackParagraphObjectFactory.fromDict(paragraphDict);
            });
          tipParagraphs = tipParagraphs.concat(feedbackParagraphs);
        }
      });

      return tipParagraphs;
    };

    return {
      /**
       * Returns a list of paragraphs indicating tips for the learner. System
       * tips (e.g. print statements) are always shown, and in addition we also
       * show at most one task-specific wrong-approach tip.
       *
       * @param {string} language The language in which the code is written.
       * @param {string} code The code to analyze.
       * @returns {Array} A list of FeedbackParagraph objects to prepend to the
       *   regular TIE feedback.
       */
      getTipParagraphs: function(language, code) {
        var codeLines = PrereqCheckDispatcherService.getNonStringLines(
          language, code);
        return getSystemTipParagraphs(language, codeLines);
      }
    };
  }
]);
