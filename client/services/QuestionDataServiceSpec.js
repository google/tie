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
 * @fileoverview Unit tests for the QuestionDataService.
 */

describe('QuestionDataService', function() {
  var QuestionDataService;
  var QUESTION_IDS = Object.keys(globalData.questions);

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    globalData.questionSets.all = {};
    globalData.questionSets.all.questionIds = QUESTION_IDS;
    globalData.questionSets.all.introductionParagraphs = [];

    QuestionDataService = $injector.get('QuestionDataService');
  }));

  describe('initCurrentQuestionSet', function() {
    it('should throw an error if the question set id does not exist',
    function() {
      expect(function() {
        QuestionDataService.initCurrentQuestionSet('other');
      }).toThrowError('Could not find question set with ID: other');
    });
  });

  describe('getCurrentQuestionSet', function() {
    it('should correctly get current question set', function() {
      QuestionDataService.initCurrentQuestionSet('all');
      var questionSet = QuestionDataService.getCurrentQuestionSet('all');

      expect(questionSet.getQuestionIds()).toEqual(QUESTION_IDS);
    });

    it('should throw an error if the question set id does not exist',
    function() {
      expect(function() {
        QuestionDataService.getCurrentQuestionSet('other');
      }).toThrowError('No question set has been initialized.');
    });
  });

  describe('getQuestion', function() {
    it('should throw an error if the question id does not exist', function() {
      QuestionDataService.initCurrentQuestionSet('all');
      expect(function() {
        QuestionDataService.getQuestion('');
      }).toThrowError(
      'The current question set does not contain a question with ID: ');
    });
  });
});

