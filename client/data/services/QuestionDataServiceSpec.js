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
  var QuestionObjectFactory;
  // In the Karma test environment, the deferred promise gets resolved only
  // when $rootScope.$digest() is called.
  var $rootScope;

  beforeEach(module('tie'));
  beforeEach(module('tieData'));
  beforeEach(inject(function($injector) {
    $rootScope = $injector.get('$rootScope');
    QuestionDataService = $injector.get('QuestionDataService');
    QuestionObjectFactory = $injector.get('QuestionObjectFactory');
  }));

  describe('fetchQuestionAsync', function() {
    it('should correctly get the question data', function(done) {
      QuestionDataService.fetchQuestionAsync('reverseWords').then(
        function(result) {
          expect(result instanceof QuestionObjectFactory).toBe(true);
          expect(result.getTitle()).toEqual('Reverse Words');
          done();
        }
      );
      $rootScope.$digest();
    });

    it('should return null if the question id does not exist', function(done) {
      QuestionDataService.fetchQuestionAsync('').then(function(result) {
        expect(result).toBe(null);
        done();
      });
      $rootScope.$digest();
    });
  });
});

describe('QuestionDataServiceServerVersion', function() {
  var QuestionDataService;
  var QuestionObjectFactory;
  var mockQuestionObject;
  var $httpBackend;
  var serverSuccessCode = 200;
  var serverErrorCode = 500;
  var $log;

  beforeEach(module('tie'));
  beforeEach(module('tieData'));
  beforeEach(function() {
    module('tieConfig', function($provide) {
      $provide.constant('SERVER_URL', 'test.com');
    });
  });
  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');
    $log = $injector.get('$log');
    QuestionDataService = $injector.get('QuestionDataService');
    QuestionObjectFactory = $injector.get('QuestionObjectFactory');
    mockQuestionObject = QuestionObjectFactory.create({
      title: "title",
      starterCode: "starterCode",
      auxiliaryCode: "AUXILIARY_CODE",
      tasks: []
    });
  }));

  describe('fetchQuestionAsync', function() {
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
      QuestionDataService.fetchQuestionAsync('reverseWords').then(
        function(result) {
          expect(result).toEqual(mockQuestionObject);
          done();
        }
      );
      $httpBackend.flush(1);
    });

    it('should throw an error if async call returns an error', function(done) {
      $httpBackend.expect('POST', '/ajax/get_question_data').respond(
        serverErrorCode, {}
      );
      QuestionDataService.fetchQuestionAsync('reverseWords').then(
        function(result) {
          expect(result).toBe(null);
          expect($log.error.logs[0][0]).toEqual(
            'There was an error in retrieving the question.');
          done();
        });
      $httpBackend.flush(1);
    });
  });
});
