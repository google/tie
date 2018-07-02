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
  var QuestionSchemaValidationService;
  var QuestionObjectFactory;

  var questions = [];
  // Hardcoded number of functions in QuestionSchemaValidationService.
  // Update if you add new question schema tests.
  var EXPECTED_VERIFIER_FUNCTION_COUNT = 9;
  // Should contain all question IDs.
  var QUESTION_IDS = Object.keys(globalData.questions);

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    QuestionObjectFactory = $injector.get('QuestionObjectFactory');
    QuestionSchemaValidationService = $injector.get(
      'QuestionSchemaValidationService');

    questions = QUESTION_IDS.map(function(questionId) {
      return QuestionObjectFactory.create(globalData.questions[questionId]);
    });
  }));

  describe('validateTitlesAreUnique', function() {
    it('should verify that all questions have a unique title', function() {
      var titles = new Set();
      questions.forEach(function(question) {
        titles.add(question.getTitle());
      });
      expect(titles.size).toEqual(questions.length);
    });
  });

  describe('validateAllQuestions', function() {
    it('should validate the structure of all sample questions', function() {
      var functions = Object.keys(QuestionSchemaValidationService);
      questions.forEach(function(question) {
        var functionCount = 0;
        var title = question.getTitle();

        functions.forEach(function(verifierFunctionName) {
          functionCount++;
          var verifierFunction =
              QuestionSchemaValidationService[verifierFunctionName];
          expect(verifierFunction(question)).toBe(true, [
            verifierFunctionName, ' failed for the question: "' + title + '"'
          ].join(''));
        });

        expect(functionCount).toEqual(EXPECTED_VERIFIER_FUNCTION_COUNT, [
          'Only ' + functionCount + ' functions were called for ' + title
        ].join(''));
      });
    });

    it('checks that question id contains only alphabetic chars', function() {
      QUESTION_IDS.forEach(function(questionId, index) {
        expect(/^[a-zA-Z]+$/.test(QUESTION_IDS[index])).toBe(true);
      });
    });
  });
});

