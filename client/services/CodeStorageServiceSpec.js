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
 */

describe('CodeStorageService', function() {
  var LANGUAGE = 'python';
  var FAILED_LANGUAGE = 'java';
  var NUM_CHARS_QUESTION_ID = 10;
  var NUM_CHARS_CODE = 1000;
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
    CodeStorageService = $injector.get('CodeStorageService');

    for (var i = 0; i < NUM_QUESTIONS; i++) {
      // Generate random questoin Id with 
      // length of NUM_CHARS_QUESTION_ID
      sampleQuestionIds[i] = generateRandomChars(
        Math.floor(Math.random() * NUM_CHARS_QUESTION_ID));
      // Generate random question code with 
      // length of NUM_CHARS_CODE
      sampleQuestionCodes[i] = generateRandomChars(
        Math.floor(Math.random() * NUM_CHARS_CODE));
    }
  }));

  describe('storeCode', function() {
    it('should store code to browser', function() {
      sampleQuestionIds.forEach(function(questionId, index) {
        CodeStorageService.storeCode(questionId, 
          sampleQuestionCodes[index], LANGUAGE);
        expect(JSON.parse(localStorage.getItem(questionId))[LANGUAGE])
          .toEqual(sampleQuestionCodes[index]);
      });     
    });
  });

  describe('loadStoredCode', function() {
    it('should retrieve stored code from browser', function() {
      for (var i = 0; i < NUM_QUESTIONS; i++) {
        var storedCode = {};
        storedCode[LANGUAGE] = sampleQuestionCodes[i];
        localStorage.setItem(sampleQuestionIds[i], JSON.stringify(storedCode));
      }
      sampleQuestionIds.forEach(function(questionId, index) {
        expect(CodeStorageService.loadStoredCode(questionId, 
          LANGUAGE)).toEqual(sampleQuestionCodes[index]);
      });
    });

    it('should fail to retrieve code and return undefined or null or empty', function() {
      sampleQuestionIds.forEach(function(questionId) {
        expect(!CodeStorageService.loadStoredCode(questionId, 
          FAILED_LANGUAGE)).toBe(true);
      });
    });
  });

  describe('storeAndLoadCode', function() {
    it('should store and load stored code from browser', function() {
      sampleQuestionIds.forEach(function(questionId, index) {
        CodeStorageService.storeCode(questionId,
          sampleQuestionCodes[index], LANGUAGE);
        expect(CodeStorageService.loadStoredCode(questionId, 
          LANGUAGE)).toEqual(sampleQuestionCodes[index]);
      });
    });
  });
});

