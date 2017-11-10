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
 * @fileoverview Service for validating non-task data put into a question.
 */

tie.factory('QuestionSchemaValidationService', [
  'ALL_SUPPORTED_LANGUAGES', function(ALL_SUPPORTED_LANGUAGES) {
    // TODO(sll): Verify that the BuggyOutputTest messages are unique across
    // all tasks.
    // TODO(sll): Verify that AuxiliaryCode contains the AuxiliaryCode class
    // definition.
    // TODO(sll): Verify that starter code contains Python function definitions
    // TODO(sll): Verify that the starter code matches a language pattern for
    // the language specified.

    return {
      /**
       * Checks that a given question's title is of type string.
       *
       * @param {Question} question
       */
      verifyTitleIsString: function(question) {
        return angular.isString(question.getTitle());
      },

      /**
       * Checks that a given question's title is not empty.
       *
       * @param {Question} question
       * @returns {boolean}
       */
      verifyTitleIsNotEmpty: function(question) {
        return question.getTitle().length > 0;
      },

      /**
       * Checks that the given starter code for a question is a string.
       *
       * @param {Question} question
       * @returns {boolean}
       */
      verifyStarterCodeIsString: function(question) {
        return ALL_SUPPORTED_LANGUAGES.every(function(language) {
          return angular.isString(question.getStarterCode(language));
        });
      },

      /**
       * Checks that the given starter code for a question is not empty.
       *
       * @param {Question} question
       * @returns {boolean}
       */
      verifyStarterCodeIsNotEmpty: function(question) {
        return ALL_SUPPORTED_LANGUAGES.every(function(language) {
          return question.getStarterCode(language).length > 0;
        });
      },

      /**
       * Checks that the given auxiliary code for a question is a string.
       *
       * @param {Question} question
       * @returns {boolean}
       */
      verifyAuxiliaryCodeIsString: function(question) {
        return ALL_SUPPORTED_LANGUAGES.every(function(language) {
          return angular.isString(question.getAuxiliaryCode(language));
        });
      },

      /**
       * Checks that the given auxiliary code for a question is not empty.
       *
       * @param {Question} question
       * @returns {boolean}
       */
      verifyAuxiliaryCodeIsNotEmpty: function(question) {
        return ALL_SUPPORTED_LANGUAGES.every(function(language) {
          return question.getAuxiliaryCode(language).length > 0;
        });
      },

      /**
       * Checks that the given Question has at least one task in its schema.
       *
       * @param {Question} question
       * @returns {boolean}
       */
      verifyAtLeastOneTaskExists: function(question) {
        // Note that individual task verification is tested separately in
        // TaskSchemaValidationServiceSpec.js.
        return (
          angular.isArray(question.getTasks()) &&
          question.getTasks().length > 0);
      },

      /**
       * Checks that the IDs of the tasks for the given Question are unique.
       *
       * @param {Question} question
       * @returns {boolean}
       */
      verifyTaskIdsAreUnique: function(question) {
        var tasks = question.getTasks();

        var ids = new Set();
        tasks.forEach(function(task) {
          ids.add(task.getId());
        });
        return ids.size === tasks.length;
      },

      /**
       * Checks that the given Question has at least one Buggy Output Test in
       * its schema.
       * @param {Question} question
       * @returns {boolean}
       */
      verifyAtLeastOneBuggyOutputTestExists: function(question) {
        return question.getTasks().some(function(task) {
          return task.getBuggyOutputTests().length > 0;
        });
      }
    };
  }
]);
