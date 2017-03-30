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
 * @fileoverview Unit tests for the TaskSchemaValidationService.
 */

describe('TaskSchemaValidationService', function() {
  var QuestionDataService;
  // Alias for TaskSchemaValidationService.
  var Tsvs;
  var questions = [];
  // Should contain all question IDs.
  // TODO(eyurko): Figure out a way to dynamically check to make sure
  // that all question IDs are specified.
  var QUESTION_IDS = ['reverseWords', 'parens', 'i18n', 'rle'];
  globalData.questionSets.all = {};
  globalData.questionSets.all.questionIds = QUESTION_IDS;
  globalData.questionSets.all.introductionParagraphs = [];
  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    // Used for testing the validator. Values will be inserted during the tests
    // so that we don't have to redefine the dict every time.
    QuestionDataService = $injector.get('QuestionDataService');
    Tsvs = $injector.get('TaskSchemaValidationService');
    QuestionDataService.initCurrentQuestionSet('all');
    questions = [];
    QUESTION_IDS.forEach(function(item) {
      questions.push(QuestionDataService.getQuestion(item));
    });
  }));

  describe('validateAllTasks', function() {
    it('should validate the structure of all sample tasks', function() {
      questions.forEach(function(question) {
        Tsvs.init(question.getStarterCode('python'), 
            question.getAuxiliaryCode('python'));
        var functions = Tsvs.getAllFunctions();
        question.getTasks().forEach(function(task) {
          functions.forEach(function(verifierFunc) {
            expect(verifierFunc(task)).toBe(true,
            [verifierFunc.name, 
              ' returned false, but it should ',
              'return true.'].join(''));
          });
        });
      });
    });
  });
});
