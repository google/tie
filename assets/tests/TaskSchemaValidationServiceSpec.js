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
  var TaskSchemaValidationService;
  var questions = [];
  // Should contain all question IDs.
  // TODO(eyurko): Figure out a way to dynamically check to make sure
  // that all question IDs are specified.
  var questionIds = ['reverseWords', 'parens', 'i18n', 'rle'];
  globalData.questionSets.all = {};
  globalData.questionSets.all.questionIds = questionIds;
  globalData.questionSets.all.introductionParagraphs = [];
  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    // Used for testing the validator. Values will be inserted during the tests
    // so that we don't have to redefine the dict every time.
    QuestionDataService = $injector.get(
      'QuestionDataService');
    TaskSchemaValidationService = $injector.get(
      'TaskSchemaValidationService');
    QuestionDataService.initCurrentQuestionSet('all');
    questions = [];
    questionIds.forEach(function(item) {
      questions.push(QuestionDataService.getQuestion(item));
    });
  }));

  var assertTrueOnAllTasks = function(func, message) {
    questions.forEach(function(item) {
      var tasks = item.getTasks();
      for (var i = 0; i < tasks.length; i++) {
        assertTrue(func(tasks[i]), [item.getTitle(), message, i].join(''));
      }
    });
  };

  describe('verifyInstructionsAreNotEmpty', function() {
    it('should verify that a task has nonempty instructions',
      function() {
        assertTrueOnAllTasks(
          TaskSchemaValidationService.verifyInstructionsAreNotEmpty,
          ' has an empty instruction for the task at index ');
      });
  });

  describe('verifyInstructionsIsArrayOfStrings', function() {
    it('should verify that a task has an array of string instructions',
      function() {
        assertTrueOnAllTasks(
          TaskSchemaValidationService.verifyInstructionsIsArrayOfStrings,
          ' does not have a string instructions array for the task at index ');
      });
  });

  describe('verifyMainFunctionNameIsString', function() {
    it('should verify that a task has a string mainFunctionName',
      function() {
        assertTrueOnAllTasks(
          TaskSchemaValidationService.verifyMainFunctionNameIsString,
          ' does not have a string mainFunctionName for the task at index ');
      });
  });

  describe('verifyMainFunctionNameAppearsInStarterCode', function() {
    it('should verify that the mainFunctionName appears in the starter code',
      function() {
        var message = [' does not have mainFunctionName in its starterCode ',
          'for the task at index '].join('');
        questions.forEach(function(item) {
          // TODO(eyurko): Update this also when we add additional languages.
          var starterCode = item.getStarterCode('python');
          var tasks = item.getTasks();
          for (var i = 0; i < tasks.length; i++) {
            // Can't use assertTrueForAllTasks here; need starterCode.
            assertTrue(TaskSchemaValidationService.verifyMainFunctionNameAppearsInStarterCode(
              tasks[i], starterCode), [item.getTitle(), message, i].join(''));
          }
        });
      });
  });

  describe('verifyInputFunctionNameIsNullOrString', function() {
    it('should verify that a task has an inputFunctionName that is null or a string',
      function() {
        assertTrueOnAllTasks(
          TaskSchemaValidationService.verifyInputFunctionNameIsNullOrString,
          [' does not have null or a string for ',
            'inputFunctionName for the task at index '].join(''));
      });
  });

  describe('verifyInputFunctionNameAppearsInAuxiliaryCodeIfNotNull',
    function() {
      it('should verify that a task\'s inputFunctionName is in auxiliaryCode',
        function() {
          var message = [' does not have inputFunctionName in its ',
            'auxiliaryCode for the task at index '].join('');
          questions.forEach(function(item) {
            // TODO(eyurko): Update this when we add additional languages.
            var auxiliaryCode = item.getAuxiliaryCode('python');
            var tasks = item.getTasks();
            for (var i = 0; i < tasks.length; i++) {
              // Can't use assertTrueForAllTasks here; need to pass AuxiliaryCode.
              assertTrue(TaskSchemaValidationService.verifyInputFunctionNameAppearsInAuxiliaryCodeIfNotNull(
                tasks[i], auxiliaryCode), [
                  item.getTitle(), message, i].join(''));
            }
          });
        });
    });

  describe('verifyOutputFunctionNameIsNullOrString', function() {
    it('should verify that a task has a null or string outputFunctionName',
      function() {
        assertTrueOnAllTasks(
          TaskSchemaValidationService.verifyOutputFunctionNameIsNullOrString,
          [' does not have null or a string for ',
            'outputFunctionName for the task at index '].join(''));
      });
  });

  describe('verifyOutputFunctionNameAppearsInAuxiliaryCodeIfNotNull',
    function() {
      it('should verify that a task\'s outputFunctionName is in auxiliaryCode',
        function() {
          var message = [' does not have outputFunctionName in auxiliaryCode ',
            'for the task at index '].join('');
          questions.forEach(function(item) {
            // TODO(eyurko): Update this also when we add additional languages.
            var auxiliaryCode = item.getAuxiliaryCode('python');
            var tasks = item.getTasks();
            for (var i = 0; i < tasks.length; i++) {
              // Can't use assertTrueForAllTasks here either; auxiliaryCode.
              assertTrue(TaskSchemaValidationService.verifyOutputFunctionNameAppearsInAuxiliaryCodeIfNotNull(
                tasks[i], auxiliaryCode), [
                  item.getTitle(), message, i].join(''));
            }
          });
        });
    });

  describe('verifyPrerequisiteSkillsAreArray', function() {
    it('should verify that prerequisiteSkills are in an array',
      function() {
        assertTrueOnAllTasks(
          TaskSchemaValidationService.verifyPrerequisiteSkillsAreArray,
          ' does not have a prerequisiteSkills array for the task at index ');
      });
  });

  describe('verifyAcquiredSkillsAreArray', function() {
    it('should verify that acquiredSkills are in an array',
      function() {
        assertTrueOnAllTasks(
          TaskSchemaValidationService.verifyAcquiredSkillsAreArray,
          ' does not have an acquiredSkills array for the task at index ');
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

  describe('verifyAtLeastOneAcquiredSkill', function() {
    it('should verify that each task has at least one acquiredSkill',
      function() {
        assertTrueOnAllTasks(
          TaskSchemaValidationService.verifyAtLeastOneAcquiredSkill,
          ' does not have at least one acquiredSkill on the task at index ');
      });
  });

  describe('verifyCorrectnessTestsAreArray', function() {
    it('should verify that the correctnessTests are stored in an array',
      function() {
        assertTrueOnAllTasks(
          TaskSchemaValidationService.verifyCorrectnessTestsAreArray,
          ' does not have an array of correctnessTests in the task at index ');
      });
  });

  describe('verifyAtLeastOneCorrectnessTest', function() {
    it('should verify that there is at least one correctness test on each task',
      function() {
        assertTrueOnAllTasks(
          TaskSchemaValidationService.verifyAtLeastOneCorrectnessTest,
          ' does not have at least one correctness test for the task at index ');
      });
  });

  describe('verifyCorrectnessTestsHaveNonEmptyAllowedOutputArrays', function() {
    it('should verify that each correctness test has a nonempty allowedOutput.',
      function() {
        assertTrueOnAllTasks(
          TaskSchemaValidationService.verifyCorrectnessTestsHaveNonEmptyAllowedOutputArrays,
          ' does not have a nonempty allowedOutput array for the task at index ');
      });
  });

  describe('verifyBuggyOutputTestsAreArray', function() {
    it('should verify that buggy output tests are stored in an array',
      function() {
        assertTrueOnAllTasks(
          TaskSchemaValidationService.verifyBuggyOutputTestsAreArray,
          ' does not have buggy output tests in an array for the task at index');
      });
  });

  describe('verifyBuggyOutputTestsHaveArrayOfStringMessages', function() {
    it('should verify that buggy output test messages are an array of strings',
      function() {
        assertTrueOnAllTasks(
          TaskSchemaValidationService.verifyNoDuplicateSkillsInPrompts,
          ' does not have an array of string messages for the task at index ');
      });
  });

  describe('verifyPerformanceTestsAreArray', function() {
    it('should verify that performance tests are stored in an array',
      function() {
        assertTrueOnAllTasks(
          TaskSchemaValidationService.verifyPerformanceTestsAreArray,
          ' does not have an array for performance tests for the task at index ');
      });
  });

  describe('verifyPerformanceTestsHaveInputDataAtomString', function() {
    it('should verify that, performance tests have an inputDataAtom string',
      function() {
        assertTrueOnAllTasks(
          TaskSchemaValidationService.verifyPerformanceTestsHaveInputDataAtomString,
          [' does not have an inputDataAtom string for the defined performance ',
            'test in the task at index '].join(''));
      });
  });

  describe('verifyPerformanceTestsHaveLinearExpectedPerformance', function() {
    // TODO(eyurko): Expand this to tolerate more than linear runtimes.
    it('should verify that existing performance tests have a linear runtime',
      function() {
        assertTrueOnAllTasks(
          TaskSchemaValidationService.verifyPerformanceTestsHaveLinearExpectedPerformance,
          [' does not have a linear expected performance for the defined ',
            'performance test in the task at index '].join(''));
      });
  });

  describe('verifyPerformanceTestsHaveEvaluationFunctionName', function() {
    it('should verify that performance tests have an evaluation function name',
      function() {
        var message = [' does not have evaluationFunctionName defined or ',
          'in its auxiliaryCode or starterCode for ',
          'the task at index '].join('');
        questions.forEach(function(item) {
          // TODO(eyurko): Update this also when we add additional languages.
          var auxiliaryCode = item.getAuxiliaryCode('python');
          var starterCode = item.getStarterCode('python');
          var tasks = item.getTasks();
          for (var i = 0; i < tasks.length; i++) {
            // No assertTrueForAllTasks here either; we need to pass in code.
            assertTrue(TaskSchemaValidationService.verifyPerformanceTestsHaveEvaluationFunctionName(
              tasks[i], auxiliaryCode, starterCode), [
                item.getTitle(), message, i].join(''));
          }
        });
      });
  });
});
