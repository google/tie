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
 * @fileoverview Unit tests for the CurrentQuestionService.
 */

describe('CurrentQuestionService', function() {
  var CurrentQuestionService;
  var $location;

  // In the Karma test environment, the deferred promise gets resolved only
  // when $rootScope.$digest() is called.
  var $rootScope;

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    $rootScope = $injector.get('$rootScope');
  }));

  describe('initialization status', function() {
    beforeEach(inject(function($injector) {
      CurrentQuestionService = $injector.get('CurrentQuestionService');
    }));

    it('should correctly verify initialization status', function(done) {
      expect(CurrentQuestionService.isInitialized()).toBe(false);

      CurrentQuestionService.init(function() {
        expect(CurrentQuestionService.isInitialized()).toBe(true);
        done();
      });
      $rootScope.$digest();
    });
  });

  describe('behavior for valid question', function() {
    beforeEach(inject(function($injector) {
      // Set up a valid, but non-default, question ID. This must be done
      // before CurrentQuestionService is initialized.
      $location = $injector.get('$location');
      $location.search('qid', 'checkBalancedParentheses');

      CurrentQuestionService = $injector.get('CurrentQuestionService');
    }));

    it('should retrieve the correct question ID', function(done) {
      CurrentQuestionService.init(function() {
        expect(CurrentQuestionService.getCurrentQuestionId()).toEqual(
          'checkBalancedParentheses');
        expect(CurrentQuestionService.getCurrentQuestionVersion()).toEqual(1);
        expect(CurrentQuestionService.getCurrentQuestion().getTitle()).toEqual(
          'Balanced Parentheses');
        done();
      });
      $rootScope.$digest();
    });
  });

  describe('behavior for invalid question', function() {
    beforeEach(inject(function($injector) {
      // Set up a non-existent question ID. This must be done before
      // CurrentQuestionService is initialized.
      $location = $injector.get('$location');
      $location.search('qid', 'invalidQuestion');

      CurrentQuestionService = $injector.get('CurrentQuestionService');
    }));

    it('should retrieve the correct question ID', function(done) {
      CurrentQuestionService.init(function() {
        expect(CurrentQuestionService.getCurrentQuestionId()).toEqual(
          'reverseWords');
        expect(CurrentQuestionService.getCurrentQuestionVersion()).toEqual(1);
        expect(CurrentQuestionService.getCurrentQuestion().getTitle()).toEqual(
          'Reverse Words');
        done();
      });
      $rootScope.$digest();
    });
  });
});

describe('CurrentQuestionService - Server', function() {
  var CurrentQuestionService;
  var $location;

  var $httpBackend;
  // In the Karma test environment, the deferred promise gets resolved only
  // when $rootScope.$digest() is called.
  var $rootScope;
  beforeEach(module('tie'));
  var setServerUrl = function(url) {
    module('tieConfig', function($provide) {
      $provide.constant('SERVER_URL', url);
    });
  };
  var setDefaultQuestionId = function(id) {
    module('tieConfig', function($provide) {
      $provide.constant('DEFAULT_QUESTION_ID', id);
    });
  };

  describe('behavior for invalid question - server', function() {

    it('should return null', function(done) {
      setServerUrl('http://katamari-dam.acy');
      setDefaultQuestionId(null);

      var PAGE_NOT_FOUND_ERROR = 404;
      var BAD_REQUEST_ERROR = 400;

      inject(function($injector) {
        // Set up a non-existent question ID. This must be done before
        // CurrentQuestionService is initialized.
        $location = $injector.get('$location');
        $rootScope = $injector.get('$rootScope');
        $httpBackend = $injector.get('$httpBackend');
        $location.search('qid', 'invalidQuestion - server');

        CurrentQuestionService = $injector.get('CurrentQuestionService');
      });
      // This post is for the initial question ID; it doesn't exist.
      $httpBackend.expectPOST(
        '/ajax/get_question_data').respond(PAGE_NOT_FOUND_ERROR, {});

      // The next post attempts again with the "default" question ID.
      // In our case, it's null, so it gets a BAD_REQUEST_ERROR.
      $httpBackend.expectPOST(
        '/ajax/get_question_data').respond(BAD_REQUEST_ERROR, {});
      CurrentQuestionService.init(function() {
        expect(CurrentQuestionService.getCurrentQuestionId()).toEqual(null);
        done();
      });
      $rootScope.$digest();
      $httpBackend.flush();
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });
  });
});
