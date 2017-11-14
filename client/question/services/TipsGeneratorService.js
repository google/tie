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
     * learner. At most one system-generated tip is presented.
     *
     * @param {string} language The language in which the code is written.
     * @param {Array<string>} codeLines The lines of code to analyze.
     * @returns {Array<FeedbackParagraph>} The feedback paragraphs to prepend
     *   to the regular TIE feedback.
     */
    var getSystemTipParagraphs = function(language, codeLines) {
      for (var i = 0; i < SYSTEM_GENERATED_TIPS[language].length; i++) {
        var tipSpecification = SYSTEM_GENERATED_TIPS[language][i];
        var regexp = new RegExp(tipSpecification.regExString);
        var detected = codeLines.some(function(line) {
          return line.search(regexp) !== -1;
        });
        if (detected) {
          return tipSpecification.feedbackParagraphs.map(
            function(paragraphDict) {
              return FeedbackParagraphObjectFactory.fromDict(paragraphDict);
            });
        }
      }

      return [];
    };

    /**
     * Returns a list of paragraphs indicating task-specific tips for the
     * learner. We do not show tips for already-passed tasks.
     *
     * @param {Array<Tip>} taskSpecificTips The checks to apply for determining
     *  which task-specific tips to show.
     * @param {Array<string>} codeLines The lines of code to analyze.
     * @returns {Array<FeedbackParagraph>} The feedback paragraphs to prepend
     *   to the general feedback. At most one task-specific tip is prepended
     *   (to avoid cognitive overload).
     */
    var getTaskSpecificTipParagraphs = function(taskSpecificTips, codeLines) {
      for (var i = 0; i < taskSpecificTips.length; i++) {
        var tipSpecification = taskSpecificTips[i];
        var regexp = new RegExp(tipSpecification.getRegexString());
        var detected = codeLines.some(function(line) {
          return line.search(regexp) !== -1;
        });
        if (detected) {
          return [FeedbackParagraphObjectFactory.createTextParagraph(
            tipSpecification.getMessage())];
        }
      }

      return [];
    };

    return {
      /**
       * Returns a list of paragraphs indicating tips for the learner. System
       * tips (e.g. print statements) are always shown, and in addition we also
       * show at most one task-specific wrong-approach tip.
       *
       * @param {string} language The language in which the code is written.
       * @param {string} code The code to analyze.
       * @param {Array<Tip>} taskSpecificTips The checks to apply for
       *  which task-specific tips to show.
       * @returns {Array} A list of FeedbackParagraph objects to prepend to the
       *   regular TIE feedback.
       */
      getTipParagraphs: function(language, code, taskSpecificTips) {
        var codeLines = PrereqCheckDispatcherService.getNonStringLines(
          language, code);
        return getSystemTipParagraphs(language, codeLines).concat(
          getTaskSpecificTipParagraphs(taskSpecificTips, codeLines));
      }
    };
  }
]);
