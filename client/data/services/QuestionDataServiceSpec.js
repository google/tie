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

  beforeEach(module('tie'));
  beforeEach(module('tieData'));
  beforeEach(inject(function($injector) {
    QuestionDataService = $injector.get('QuestionDataService');
  }));

  describe('getQuestion', function() {
    it('should throw an error if the question id does not exist', function() {
      expect(function() {
        QuestionDataService.getQuestion('');
      }).toThrowError('There is no question with ID: ');
    });
  });

  describe('getQuestionTitle', function() {
    it('should get the title of a question', function() {
      var title = globalData.questions.isPalindrome.title;
      expect(QuestionDataService.getQuestionTitle('isPalindrome'))
        .toEqual(title);
    });

    it('should throw an error if the question does not exist', function() {
      expect(function() {
        QuestionDataService.getQuestionTitle('lemon');
      }).toThrowError('There is no question with ID: lemon');
    });
  });

  describe('getQuestionVersion', function() {
    it('should return 1 exclusively, for now', function() {
      expect(QuestionDataService.getQuestionVersion()).toEqual(1);
    });
  });

  describe('getQuestionPreviewInstructions', function() {
    it('should get the title of a question', function() {
      expect(QuestionDataService
        .getQuestionPreviewInstructions('checkBalancedParentheses'))
        .toEqual('For this question, you will implement the isBalanced ' +
                 'function. It takes a string of only parentheses as input ' +
                 'and returns True if for every open parentheses there is a ' +
                 'matching closing parentheses, and False otherwise. ');
    });

    it('should throw an error if the question does not exist', function() {
      expect(function() {
        QuestionDataService.getQuestionPreviewInstructions('grape');
      }).toThrowError('There is no question with ID: grape');
    });
  });
});

describe('QuestionDataServiceServerVersion', function() {
  var QuestionDataService;
  var QuestionObjectFactory;
  var QuestionObject;
  var $httpBackend = null;
  var serverSuccessCode = 200;
  var serverErrorCode = 500;

  beforeEach(module('tie'));
  beforeEach(module('tieData'));
  beforeEach(function() {
    module('tieConfig', function($provide) {
      $provide.constant('SERVER_URL', 'test.com');
    });
  });
  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');
    QuestionDataService = $injector.get('QuestionDataService');
    QuestionObjectFactory = $injector.get(
      'QuestionObjectFactory');
    QuestionObject = QuestionObjectFactory.create({
      title: "title",
      starterCode: "starterCode",
      auxiliaryCode: "AUXILIARY_CODE",
      tasks: []
    });
  }));

  describe('getQuestionsAsync', function() {
    it('should correctly get the question data', function(done) {
      $httpBackend.expect('POST', '/ajax/get_question_data').respond(
        serverSuccessCode,
        {
          // eslint-disable-next-line camelcase
          question_data: {
            title: "title",
            starterCode: "starterCode",
            auxiliaryCode: "AUXILIARY_CODE",
            tasks: []
          }
        }
      );
      QuestionDataService.getQuestionAsync('reverseWords').then(
        function(result) {
          expect(result).toEqual(QuestionObject);
          done();
        }
      );
      $httpBackend.flush(1);
    });

    it('should throw an error if async call returns an error', function(done) {
      $httpBackend.expect('POST', '/ajax/get_question_data').respond(
        serverErrorCode, {}
      );
      QuestionDataService.getQuestionAsync('reverseWords').then(
        function() {
          // Nothing happens because it errors out.
        }, function(error) {
        expect(error).toEqual(
          Error('There was an error in retrieving the question.'));
        done();
      });
      $httpBackend.flush(1);
    });
  });
});
