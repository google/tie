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
 * @fileoverview Unit tests for the CodeStorageService.
 * Please be aware, the hash key format is {{questionId}}:{{language}}
 */

describe('CodeStorageService', function() {
  var LANGUAGE = 'python';
  var FAILED_LANGUAGE = 'java';
  var NUM_CHARS_QUESTION_ID = 10;
  var NUM_CHARS_CODE = 10;
  var NUM_QUESTIONS = 5;

  var CodeStorageService;

  var generateRandomChars = function(number) {
    var generatedChars = "";
    var possible = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (var i = 0; i < number; i++) {
      generatedChars += possible.charAt(
        Math.floor(Math.random() * possible.length));
    }
    return generatedChars;
  };

  var sampleQuestionIds = [];
  var sampleQuestionCodes = [];

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    localStorage.clear();
    CodeStorageService = $injector.get('CodeStorageService');

    for (var i = 0; i < NUM_QUESTIONS; i++) {
      // Generate random question Id with
      // length of NUM_CHARS_QUESTION_ID
      sampleQuestionIds[i] = generateRandomChars(
        Math.floor(Math.random() * NUM_CHARS_QUESTION_ID));
      // Generate random question code with
      // length of NUM_CHARS_CODE
      sampleQuestionCodes[i] = generateRandomChars(
        Math.floor(Math.random() * NUM_CHARS_CODE));
    }
  }));

  afterEach(function() {
    localStorage.clear();
  });

  describe('storeCode', function() {
    it('should store code to browser', function() {
      expect(localStorage.length).toEqual(0);
      sampleQuestionIds.forEach(function(questionId, index) {
        CodeStorageService.storeCode(questionId,
          sampleQuestionCodes[index], LANGUAGE);
        var hashKey = questionId + ":" + LANGUAGE;
        expect(localStorage.getItem(hashKey)).toEqual(
          sampleQuestionCodes[index]);
      });
    });
  });

  describe('loadStoredCode', function() {
    it('should retrieve stored code from browser', function() {
      expect(localStorage.length).toEqual(0);
      var hashKeys = [];
      for (var i = 0; i < NUM_QUESTIONS; i++) {
        hashKeys[i] = sampleQuestionIds[i] + ":" + LANGUAGE;
        localStorage.setItem(hashKeys[i], sampleQuestionCodes[i]);
      }
      sampleQuestionIds.forEach(function(questionId, index) {
        expect(CodeStorageService.loadStoredCode(questionId,
          LANGUAGE)).toEqual(sampleQuestionCodes[index]);
      });
    });

    it('should fail to retrieve code and return null', function() {
      expect(localStorage.length).toEqual(0);
      sampleQuestionIds.forEach(function(questionId) {
        expect(CodeStorageService.loadStoredCode(questionId,
          FAILED_LANGUAGE)).toEqual(null);
      });
    });
  });

  describe('storeAndLoadCode', function() {
    it('should store and load stored code from browser', function() {
      expect(localStorage.length).toEqual(0);
      sampleQuestionIds.forEach(function(questionId, index) {
        CodeStorageService.storeCode(questionId,
          sampleQuestionCodes[index], LANGUAGE);
        expect(CodeStorageService.loadStoredCode(questionId,
          LANGUAGE)).toEqual(sampleQuestionCodes[index]);
      });
    });
  });

  describe('verifyLocalStorageHashKey', function() {
    it('should verify composed hash keys match localStorage keys', function() {
      expect(localStorage.length).toEqual(0);
      sampleQuestionIds.forEach(function(questionId, index) {
        CodeStorageService.storeCode(questionId,
          sampleQuestionCodes[index], LANGUAGE);
        var hashKey = questionId + ':' + LANGUAGE;
        expect(localStorage.getItem(hashKey)).toEqual(
          sampleQuestionCodes[index]);
      });
    });
  });
});

