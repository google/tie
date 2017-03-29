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

// describe('QuestionSchemaValidationService', function() {
//   var QuestionDataService;
//   var QuestionObjectFactory;
//   var QuestionSchemaValidationService;
//   var questions = [];
//   var questionData;
//   // Should contain all question IDs.
//   // TODO(eyurko): Figure out a way to dynamically check to make sure
//   // that all question IDs are specified.
//   var questionIds = ['reverseWords', 'parens', 'i18n', 'rle'];

//   beforeEach(module('tie'));
//   beforeEach(inject(function($injector) {
//     var globalData = {
//       questions: {},
//       questionSets: {}
//     };
//     // Used for testing the validator. Values will be inserted during the tests
//     // so that we don't have to redefine the dict every time.
//     questionData = {
//       title: '',
//       starterCode: {},
//       auxiliaryCode: {},
//       tasks: [{
//         instructions: [],
//         prerequisiteSkills: [],
//         acquiredSkills: [],
//         inputFunctionName: null,
//         outputFunctionName: null,
//         mainFunctionName: null,
//         correctnessTests: [],
//         buggyOutputTests: [],
//         performanceTests: []
//       }],
//       styleTests: [{}]
//     };
//     QuestionDataService = $injector.get(
//       'QuestionDataService');
//     QuestionObjectFactory = $injector.get(
//       'QuestionObjectFactory');
//     QuestionSchemaValidationService = $injector.get(
//       'QuestionSchemaValidationService');
//     QuestionDataService.initCurrentQuestionSet('all');
//     allQuestions = QuestionDataService.getCurrentQuestionSet();
//     allQuestions.getQuestionIds().forEach(
//       function(item, index) {
//       questions.push(QuestionDataService.getQuestion(item));
//     });
//   }));

//   describe('verifyNoDuplicateSkillsInPrompts', function() {
//     it('should return false if a question has duplicate skills in a task.',
//       function() {
//         // Question has 'Arrays' twice in prerequsisiteSkills.
//         questionData['tasks'][0]['prerequisiteSkills'] = [
//         'Arrays', 'Arrays', 'Strings', 'String Manipulation'];
//         questionData['tasks'][0]['acquiredSkills'] = ['String Manipulation'];
//         question = QuestionObjectFactory.create(questionData);
//         expect(
//           QuestionSchemaValidationService.verifyNoDuplicateSkillsInPrompts(
//               question)).toBe(false);
//       });

//     it('should return true if a question has no duplicate skills in a task.',
//       function() {
//         questionData['tasks'][0]['prerequisiteSkills'] = [
//         'Arrays', 'Strings', 'String Manipulation'];
//         questionData['tasks'][0]['acquiredSkills'] = ['String Manipulation'];
//         question = QuestionObjectFactory.create(questionData);
//         expect(
//           QuestionSchemaValidationService.verifyNoDuplicateSkillsInPrompts(
//             question)).toBe(true);
//       });

//     it('should verify that there are no duplicates in any task\'s skills',
//       function() {
//         questions.forEach(function(item, index) {
//           expect(
//             QuestionSchemaValidationService.verifyNoDuplicateSkillsInPrompts(
//               item)).toBe(true,
//                 [item.getTitle() + ' should have no duplicate skills within ',
//                  'a task'].join(''));
//         });
//       });
//   });

//   describe('verifyQuestionHasAtLeastOneAcquiredSkillPerTask', function() {
//     it('should return false if a question has no acquiredSkills', function() {
//       question = QuestionObjectFactory.create(questionData);
//       expect(
//         QuestionSchemaValidationService.verifyQuestionHasAtLeastOneAcquiredSkillPerTask(
//           question)).toBe(false);
//     });

//     it('should return true if a question has >= 1 acquiredSkills', function() {
//       questionData['tasks'][0]['acquiredSkills'] = ['String Manipulation'];
//       question = QuestionObjectFactory.create(questionData);
//       expect(
//         QuestionSchemaValidationService.verifyQuestionHasAtLeastOneAcquiredSkillPerTask(
//           question)).toBe(true);
//     });

//     it('should verify that all question tasks have acquiredSkills', function() {
//       questions.forEach(function(item, index) {
//         expect(
//           QuestionSchemaValidationService.verifyQuestionHasAtLeastOneAcquiredSkillPerTask(
//             item)).toBe(true,
//               [item.getTitle() + ' should have at least one acquiredskill for ',
//                'each task'].join(''));
//       });
//     });
//   });
// });
