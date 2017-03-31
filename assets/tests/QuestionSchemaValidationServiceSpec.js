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
 * @fileoverview Unit tests for the QuestionSchemaValidationService.
 */

describe('QuestionSchemaValidationService', function() {
  var QuestionDataService;
  var QuestionSchemaValidationService;

  var questions = [];
  // Hardcoded number of functions in QuestionSchemaValidationService.
  // Update if you add new question schema tests.
  var EXPECTED_VERIFIER_FUNCTION_COUNT = 11;
  // Should contain all question IDs.
  // TODO(eyurko): Figure out a way to dynamically check to make sure
  // that all question IDs are specified.
  var QUESTION_IDS = ['reverseWords', 'parens', 'i18n', 'rle'];

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    globalData.questionSets.all = {};
    globalData.questionSets.all.questionIds = QUESTION_IDS;
    globalData.questionSets.all.introductionParagraphs = [];

    // Used for testing the validator. Values will be inserted during the tests
    // so that we don't have to redefine the dict every time.
    QuestionDataService = $injector.get('QuestionDataService');
    QuestionSchemaValidationService = $injector.get(
      'QuestionSchemaValidationService');

    QuestionDataService.initCurrentQuestionSet('all');
    questions = QUESTION_IDS.map(function(questionId) {
      return QuestionDataService.getQuestion(questionId);
    });
  }));

  describe('validateAllQuestions', function() {
    it('should validate the structure of all sample questions', function() {
      var functions = Object.keys(QuestionSchemaValidationService);
      questions.forEach(function(question) {
        var functionCount = 0;
        var title = question.getTitle();

        functions.forEach(function(verifierFunctionName) {
          functionCount++;
          var verifierFunction = QuestionSchemaValidationService[
            verifierFunctionName];
          expect(verifierFunction(question)).toBe(true, [
            verifierFunctionName,
            ' failed for the question: "' + title + '"'
          ].join(''));
        });

        expect(functionCount).toEqual(EXPECTED_VERIFIER_FUNCTION_COUNT, [
          'Only ' + functionCount + ' functions were called for ' + title
        ].join(''));
      });
    });
  });
});
