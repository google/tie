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
 * @fileoverview Unit tests for FeedbackStorageService.
 * Please be aware, the hash key format is {{questionId}}-feedback:{{language}}
 */

describe('FeedbackStorageService', function() {
  var LANGUAGE = 'python';
  var FAILED_LANGUAGE = 'java';
  var NUM_CHARS_QUESTION_ID = 10;
  var NUM_QUESTIONS = 5;

  var FeedbackStorageService;
  var FeedbackParagraphObjectFactory;

  var generateRandomChars = function(number) {
    var generatedChars = '';
    var possible = (
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');

    for (var i = 0; i < number; i++) {
      generatedChars += possible.charAt(
        Math.floor(Math.random() * possible.length));
    }
    return generatedChars;
  };

  var sampleQuestionIds = [];
  var sampleFeedback;
  var sampleFeedbackStorage;

  var sampleFeedbackJson =
    '[[{"_type":"error","_content":"SyntaxError: test"}]]';

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    localStorage.clear();
    FeedbackStorageService = $injector.get('FeedbackStorageService');
    FeedbackParagraphObjectFactory = $injector.get(
      'FeedbackParagraphObjectFactory');

    sampleFeedback = FeedbackParagraphObjectFactory.createSyntaxErrorParagraph(
      'SyntaxError: test');
    sampleFeedbackStorage = [{
      feedbackParagraphs: [sampleFeedback]
    }];

    for (var i = 0; i < NUM_QUESTIONS; i++) {
      // Generate random question Id with
      // length of NUM_CHARS_QUESTION_ID
      sampleQuestionIds[i] = generateRandomChars(
        Math.floor(Math.random() * NUM_CHARS_QUESTION_ID));
    }
  }));

  afterEach(function() {
    localStorage.clear();
  });

  describe('storeFeedback', function() {
    it('should store feedback paragraphs to browser', function() {
      expect(localStorage.length).toEqual(0);
      sampleQuestionIds.forEach(function(questionId) {
        FeedbackStorageService.storeFeedback(questionId, sampleFeedbackStorage,
          LANGUAGE);
        var key = questionId + "-feedback:" + LANGUAGE;
        expect(localStorage.getItem(key)).toEqual(sampleFeedbackJson);
      });
    });
  });

  describe('loadStoredFeedback', function() {
    it('should retrieve stored feedback from browser', function() {
      expect(localStorage.length).toEqual(0);
      sampleQuestionIds.forEach(function(questionId) {
        var key = questionId + "-feedback:" + LANGUAGE;
        localStorage.setItem(key, sampleFeedbackJson);
        var loadedFeedback = FeedbackStorageService.loadStoredFeedback(
          questionId, LANGUAGE);
        expect(loadedFeedback[0][0].isSyntaxErrorParagraph()).toBe(true);
        expect(loadedFeedback[0][0].getContent()).toEqual('SyntaxError: test');
      });
    });

    it('should fail to retrieve feedback and return null if there is no ' +
        'feedback stored', function() {
      expect(localStorage.length).toEqual(0);
      sampleQuestionIds.forEach(function(questionId) {
        expect(FeedbackStorageService.loadStoredFeedback(questionId,
          FAILED_LANGUAGE)).toEqual(null);
      });
    });
  });

  describe('storeAndLoadFeedback', function() {
    it('should store and load stored feedback from browser', function() {
      expect(localStorage.length).toEqual(0);
      sampleQuestionIds.forEach(function(questionId) {
        FeedbackStorageService.storeFeedback(
          questionId, sampleFeedbackStorage, LANGUAGE);
        var loadedFeedback = FeedbackStorageService.loadStoredFeedback(
          questionId, LANGUAGE);
        expect(loadedFeedback[0][0].isSyntaxErrorParagraph()).toBe(true);
        expect(loadedFeedback[0][0].getContent()).toEqual('SyntaxError: test');
      });
    });
  });

  describe('verifyLocalStorageKey', function() {
    it('should verify composed keys match localStorage keys', function() {
      expect(localStorage.length).toEqual(0);
      sampleQuestionIds.forEach(function(questionId) {
        FeedbackStorageService.storeFeedback(
          questionId, sampleFeedbackStorage, LANGUAGE);
        var key = questionId + '-feedback:' + LANGUAGE;
        expect(localStorage.getItem(key)).toEqual(sampleFeedbackJson);
      });
    });
  });

  describe('clearLocalStorageFeedback', function() {
    it('should remove feedback from localStorage', function() {
      sampleQuestionIds.forEach(function(questionId) {
        var key = questionId + '-feedback:' + LANGUAGE;
        localStorage.setItem(key, sampleFeedbackJson);
        expect(localStorage.getItem(key)).toEqual(sampleFeedbackJson);
        FeedbackStorageService.clearLocalStorageFeedback(questionId, LANGUAGE);
        expect(localStorage.getItem(key)).toEqual(null);
      });
    });
  });
});
