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
 * @fileoverview Service for generating unprompted feedback based on a user's
 * code submission. Note that this service is NOT stateless.
 */

tie.factory('UnpromptedFeedbackManagerService', [
  'SYSTEM_GENERATED_TIPS', 'ALL_SUPPORTED_LANGUAGES',
  'PrereqCheckDispatcherService', 'FeedbackParagraphObjectFactory',
  'TipObjectFactory',
  function(
      SYSTEM_GENERATED_TIPS, ALL_SUPPORTED_LANGUAGES,
      PrereqCheckDispatcherService, FeedbackParagraphObjectFactory,
      TipObjectFactory) {
    var TIP_TYPE_TASK = 'task';
    var TIP_TYPE_SYSTEM = 'system';

    var STATE_NOT_SEEN = 0;
    var STATE_TENTATIVE = 1;
    var STATE_DISPLAYED = 2;

    // When initialized, this is an object mapping tipListKeys to lists of tip
    // specifications.
    // - Each tipListKey is formatted as "{{source}}-{{language}}", where
    //   "{{source}}" is either 'system' or 'task{{taskId}}' depending on
    //   whether this is a system tip or a task-specific tip, and {{language}}
    //   is the language of the code submission.
    // - Each tip specification is represented by a Tip domain object.
    // - Task-specific tips come before (and take precedence over) system tips.
    var cachedTipSpecifications = null;

    // This object keeps track of the current "state" for a given piece of
    // unprompted feedback. The keys are of the form "{{tipListKey}}-{{index}}",
    // where tipListKey references a key in cachedTipSpecifications, and
    // {{index}} is the index of the tip within the relevant tip list.
    //
    // For each type of unprompted feedback, the default state is always
    // NOT SEEN. On first detection of the trigger, the status moves to
    // TENTATIVE. If, subsequently, the trigger is re-detected, the status
    // moves to DISPLAYED and stays there forever. If the trigger is not
    // re-detected then the status moves back to NOT SEEN. At most one tip
    // moves to DISPLAYED at a time.
    var unpromptedFeedbackStates = {};

    var getTipListKey = function(source, language) {
      return source + '-' + language;
    };

    var getTipKey = function(tipListKey, index) {
      return tipListKey + '-' + index.toString();
    };

    return {
      /**
       * Resets the state counters and the tip specifications. This should only
       * be called when a new question is loaded.
       *
       * @param {Object} tasks The list of tasks for the current question.
       */
      reset: function(tasks) {
        unpromptedFeedbackStates = {};
        cachedTipSpecifications = {};

        ALL_SUPPORTED_LANGUAGES.forEach(function(language) {
          var key = getTipListKey(TIP_TYPE_SYSTEM, language);
          cachedTipSpecifications[key] =
            SYSTEM_GENERATED_TIPS[language].map(function(tipDict) {
              return TipObjectFactory.create(tipDict);
            });
        });

        tasks.forEach(function(task) {
          var taskId = task.getId();
          ALL_SUPPORTED_LANGUAGES.forEach(function(language) {
            var key = getTipListKey(TIP_TYPE_TASK + taskId, language);
            cachedTipSpecifications[key] = task.getTips(language);
          });
        });
      },
      /**
       * Returns a list of paragraphs indicating tips for the learner, while
       * also updating the internal state of this service to keep track of
       * tips.
       *
       * @param {string} language The language in which the code is written.
       * @param {string} code The code to analyze.
       * @returns {Array|null} A list of FeedbackParagraph objects to show as
       *   unprompted feedback, or null if there is no unprompted feedback to
       *   show.
       */
      runTipsCheck: function(language, code, taskId) {
        var codeLines = PrereqCheckDispatcherService.getNonStringLines(
          language, code);

        var feedbackParagraphs = null;
        var tipListKeysToCheck = [
          getTipListKey(TIP_TYPE_TASK + taskId, language),
          getTipListKey(TIP_TYPE_SYSTEM, language)
        ];

        tipListKeysToCheck.forEach(function(tipListKey) {
          var tipSpecificationList = cachedTipSpecifications[tipListKey];
          tipSpecificationList.forEach(function(tipSpecification, index) {
            var tipKey = getTipKey(tipListKey, index);

            if (tipSpecification.isTriggeredBy(codeLines)) {
              // The tip was triggered by the code.
              if (!unpromptedFeedbackStates.hasOwnProperty(tipKey) ||
                  unpromptedFeedbackStates[tipKey] === STATE_NOT_SEEN) {
                unpromptedFeedbackStates[tipKey] = STATE_TENTATIVE;
              } else if (
                  unpromptedFeedbackStates[tipKey] === STATE_TENTATIVE &&
                  feedbackParagraphs === null) {
                unpromptedFeedbackStates[tipKey] = STATE_DISPLAYED;
                feedbackParagraphs = [
                  FeedbackParagraphObjectFactory.createTextParagraph(
                    tipSpecification.getMessage())];
              }
            } else if (
                unpromptedFeedbackStates.hasOwnProperty(tipKey) &&
                unpromptedFeedbackStates[tipKey] === STATE_TENTATIVE) {
              // The tip was not triggered by the code.
              unpromptedFeedbackStates[tipKey] = STATE_NOT_SEEN;
            }
          });
        });

        return feedbackParagraphs;
      }
    };
  }
]);
