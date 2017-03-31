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
  'ALL_SUPPORTED_LANGUAGES',
  function(ALL_SUPPORTED_LANGUAGES) {
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
      }
    };
  }
]);
