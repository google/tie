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
      var dict = {questionIds: ["q0", "q1"]};
      var questionSet = QuestionSetObjectFactory.create(dict);
      var thisDict = questionSet.getQuestionIds();

      expect(thisDict).toEqual(dict.questionIds);
    });
  });

  describe('getQuestionsId', function() {
    it('should get question id index', function() {
      var dict = {questionIds: ["q0", "q1"]};
      var questionSet = QuestionSetObjectFactory.create(dict);
      var thisId = questionSet.getQuestionId(1);

      expect(thisId).toMatch("q1");
    });

    it('should throw error if index out of bounds of number of questions', function() {
      var errorFunction = function() {
        var dict = {questionIds: ["q0", "q1"]};
        var questionSet = QuestionSetObjectFactory.create(dict);
        var error = questionSet.getQuestionId(-1)    
      }

      expect(errorFunction).toThrowError(Error);
    });
  });

  describe('getFirstQuestionId', function() {
    it('should get question id of first question', function() {
      var dict = {questionIds: ["q0", "q1"]};
      var questionSet = QuestionSetObjectFactory.create(dict);
      var firstQuestionId = questionSet.getFirstQuestionId();

      expect(firstQuestionId).toMatch("q0");
    });
  });

  describe('getNumberOfQuestions', function() {
    it('should get total number of questions', function() {
      var dict = {questionIds: ["q0", "q1"]};
      var questionSet = QuestionSetObjectFactory.create(dict);
      var numberOfQuestions = questionSet.getNumberOfQuestions();

      expect(numberOfQuestions).toEqual(2);
    });
  });

  describe('getIntroductionParagraphs', function() {
    it('should get introduction paragraph', function() {
      var dict = {questionIds: ["q0", "q1"], introductionParagraphs: "introduction"};
      var questionSet = QuestionSetObjectFactory.create(dict);
      var introductionParagraphs = questionSet.getIntroductionParagraphs();

      expect(introductionParagraphs).toMatch("introduction");
    });
  });
});
