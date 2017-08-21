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
  beforeEach(module('tieData'));
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
        QuestionDataService.initCurrentQuestionSet('argleblargle');
      }).toThrowError('Could not find question set with ID: argleblargle');
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
        QuestionDataService.getCurrentQuestionSet('argleblargle');
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

  describe('getQuestionTitle', function() {
    it('should get the title of a question', function() {
      QuestionDataService.initCurrentQuestionSet('strings');
      var title = globalData.questions.isPalindrome.title;
      expect(QuestionDataService.getQuestionTitle('isPalindrome'))
        .toEqual(title);
    });

    it('should throw an error if the question does not exist', function() {
      QuestionDataService.initCurrentQuestionSet('strings');
      expect(function() {
        QuestionDataService.getQuestionTitle('lemon');
      }).toThrowError(
      'The current question set does not contain a question with ID: lemon');
    });
  });

  describe('getQuestionPreviewInstructions', function() {
    it('should get the title of a question', function() {
      QuestionDataService.initCurrentQuestionSet('strings');
      expect(QuestionDataService
        .getQuestionPreviewInstructions('checkBalancedParentheses'))
        .toEqual('For this question, you will implement the isBalanced ' +
                 'function. It takes a string of only parentheses as input ' +
                 'and returns True if for every open parentheses there is a ' +
                 'matching closing parentheses, and False otherwise. ');
    });

    it('should throw an error if the question does not exist', function() {
      QuestionDataService.initCurrentQuestionSet('strings');
      expect(function() {
        QuestionDataService.getQuestionPreviewInstructions('grape');
      }).toThrowError(
      'The current question set does not contain a question with ID: grape');
    });
  });

  describe('initAndGetQuestionIdsFromSet', function() {
    it('should throw an error if the question set id does not exist',
    function() {
      expect(function() {
        QuestionDataService.initAndGetQuestionIdsFromSet('humbug');
      }).toThrowError('Could not find question set with ID: humbug');
    });

    it('should correctly get current question set after initializing',
    function() {
      expect(QuestionDataService.initAndGetQuestionIdsFromSet('all'))
        .toEqual(QUESTION_IDS);
    });
  });
});

