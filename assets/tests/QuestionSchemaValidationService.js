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
      verifyTitleIsString: function(question) {
        return angular.isString(question.getTitle());
      },
      verifyTitleIsNotEmpty: function(question) {
        return question.getTitle().length > 0;
      },
      verifyStarterCodeIsString: function(question) {
        return ALL_SUPPORTED_LANGUAGES.every(function(language) {
          return angular.isString(question.getStarterCode(language));
        });
      },
      verifyStarterCodeIsNotEmpty: function(question) {
        return ALL_SUPPORTED_LANGUAGES.every(function(language) {
          return question.getStarterCode(language).length > 0;
        });
      },
      verifyAuxiliaryCodeIsString: function(question) {
        return ALL_SUPPORTED_LANGUAGES.every(function(language) {
          return angular.isString(question.getAuxiliaryCode(language));
        });
      },
      verifyAuxiliaryCodeIsNotEmpty: function(question) {
        return ALL_SUPPORTED_LANGUAGES.every(function(language) {
          return question.getAuxiliaryCode(language).length > 0;
        });
      },
      verifyAtLeastOneTaskExists: function(question) {
        // Note that individual task verification is tested separately in
        // TaskSchemaValidationServiceSpec.js.
        return (
          angular.isArray(question.getTasks()) &&
          question.getTasks().length > 0);
      },
      verifyAtLeastOneBuggyOutputTestExists: function(question) {
        return question.getTasks().some(function(task) {
          return task.getBuggyOutputTests().length > 0;
        });
      },
      verifyAllBuggyOutputTestMessagesAreUnique: function(question) {
        var messages = new Set();
        return question.getTasks().every(function(task) {
          return task.getBuggyOutputTests().every(function(test) {
            return test.getMessages().every(function(message) {
              var isUnique = !(message in messages);
              messages.add(message);
              return isUnique;
            });
          });
        });
      },
      verifyStyleTestsAreArray: function(question) {
        return angular.isArray(question.getStyleTests());
      },
      // TODO(sll): Implement verifyEvaluationFunctionNameAppearsInAuxiliaryCode
      // for style tests.
      verifyStyleTestsEvaluationFunctionNameIsString: function(question) {
        return question.getStyleTests().every(function(test) {
          return (
            angular.isString(test.getEvaluationFunctionName()) &&
            test.getEvaluationFunctionName().length > 0);
        });
      },
      verifyExpectedOutputIsNotUndefined: function(question) {
        return question.getStyleTests().every(function(test) {
          return (test.getExpectedOutput() !== undefined);
        });
      },
      verifyStyleTestMessageIsNonemptyString: function(question) {
        return question.getStyleTests().every(function(test) {
          return (
            angular.isString(test.getMessage()) &&
            test.getMessage().length > 0);
        });
      }
    };
  }
]);
