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
