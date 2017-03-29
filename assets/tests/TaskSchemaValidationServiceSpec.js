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
 * @fileoverview Unit tests for the QuestionSchemaValidatorService.
 */

describe('TaskSchemaValidationService', function() {
  var QuestionDataService;
  var QuestionObjectFactory;
  var TaskSchemaValidationService;
  var questions = [];
  // Should contain all question IDs.
  // TODO(eyurko): Figure out a way to dynamically check to make sure
  // that all question IDs are specified.
  var questionIds = ['reverseWords', 'parens', 'i18n', 'rle'];
  globalData.questionSets['all'] = {
    'questionIds': questionIds,
    'introductionParagraphs': []
  };
  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    // Used for testing the validator. Values will be inserted during the tests
    // so that we don't have to redefine the dict every time.
    QuestionDataService = $injector.get(
      'QuestionDataService');
    QuestionObjectFactory = $injector.get(
      'QuestionObjectFactory');
    TaskSchemaValidationService = $injector.get(
      'TaskSchemaValidationService');
    QuestionDataService.initCurrentQuestionSet('all');
    questionIds.forEach(function(item, index) {
      questions.push(QuestionDataService.getQuestion(item));
    });
  }));

  var assertTrueOnAllTasks = function(func, message) {
    questions.forEach(function(item, index) {
      var tasks = item.getTasks();
      for (var i = 0; i < tasks.length; i++) {
        assertTrue(func(tasks[i]), [item.getTitle(), message, i].join(''));
      }
    });
  }

  describe('verifyInstructionsAreNotEmpty', function() {
    it('should verify that a task has nonempty instructions',
      function() {
        assertTrueOnAllTasks(
          TaskSchemaValidationService.verifyInstructionsAreNotEmpty,
          ' has an empty instruction for the task at index ');
      });
  });

  describe('verifyNoDuplicateSkillsInPrompts', function() {
    it('should verify that there are no duplicates in any task\'s skills',
      function() {
        assertTrueOnAllTasks(
          TaskSchemaValidationService.verifyNoDuplicateSkillsInPrompts,
          ' should have no duplicate skills in the task at index ');
      });
  });

  describe('verifyQuestionHasAtLeastOneAcquiredSkill', function() {
    it('should verify that all question tasks have acquiredSkills', function() {
      assertTrueOnAllTasks(
        TaskSchemaValidationService.verifyAtLeastOneAcquiredSkill,
        ' should have at least one acquired skill for the task at index ');
    });
  });
});
