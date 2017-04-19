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
 * @fileoverview Unit tests for QuestionSetObjectFactory domain objects.
 */

describe('QuestionSetObjectFactory', function() {
  var QuestionSetObjectFactory;

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    QuestionSetObjectFactory = $injector.get('QuestionSetObjectFactory');
  }));

  describe('getQuestionsIds', function() {
    it('should get question ids', function() {
      var questionSetDict = {questionIds: ["q0", "q1"]};
      var questionSet = QuestionSetObjectFactory.create(questionSetDict);
      var questionIds = questionSet.getQuestionIds();

      expect(questionIds).toEqual(questionSetDict.questionIds);
    });
  });

  describe('getQuestionsId', function() {
    it('should get question id index', function() {
      var questionSetDict = {questionIds: ["q0", "q1"]};
      var questionSet = QuestionSetObjectFactory.create(questionSetDict);
      var questionId = questionSet.getQuestionId(1);

      expect(questionId).toMatch("q1");
    });

    it('should throw error if index passed to getQuestionId is out of bounds', function() {
      var errorFunction = function() {
        var questionSetDict = {questionIds: ["q0", "q1"]};
        var questionSet = QuestionSetObjectFactory.create(questionSetDict);
        questionSet.getQuestionId(-1);
      };

      expect(errorFunction).toThrowError(Error);
    });
  });

  describe('getFirstQuestionId', function() {
    it('should get question id of first question', function() {
      var questionSetDict = {questionIds: ["q0", "q1"]};
      var questionSet = QuestionSetObjectFactory.create(questionSetDict);
      var firstQuestionId = questionSet.getFirstQuestionId();

      expect(firstQuestionId).toMatch("q0");
    });
  });

  describe('getNumberOfQuestions', function() {
    it('should get total number of questions', function() {
      var questionSetDict = {questionIds: ["q0", "q1"]};
      var questionSet = QuestionSetObjectFactory.create(questionSetDict);
      var numberOfQuestions = questionSet.getNumberOfQuestions();

      expect(numberOfQuestions).toEqual(2);
    });
  });

  describe('getIntroductionParagraphs', function() {
    it('should get introduction paragraph', function() {
      var paragraphsDict = {introductionParagraphs: "introduction"};
      var questionSet = QuestionSetObjectFactory.create(paragraphsDict);
      var introductionParagraphs = questionSet.getIntroductionParagraphs();

      expect(introductionParagraphs)
        .toMatch(paragraphsDict.introductionParagraphs);
    });
  });
});

