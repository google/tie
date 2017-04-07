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
  var QUESTION_ID_LEN_RANGE = 10;
  var CODE_LEN_RANGE = 10000;
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

  var sampleQuestionId = [];
  var sampleQuestionCode = [];


  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    CodeStorageService = $injector.get('CodeStorageService');

    for (var i = 0; i < NUM_QUESTIONS; i++) {
      // Generate random questoin Id with 
      // length of QUESTION_ID_LEN_RANGE
      sampleQuestionId[i] = generateRandomChars(
        Math.floor(Math.random() * QUESTION_ID_LEN_RANGE));
      // Generate random question code with 
      // length of CODE_LEN_RANGE
      sampleQuestionCode[i] = generateRandomChars(
        Math.floor(Math.random() * CODE_LEN_RANGE));
    }
  }));

  describe('storeCode', function() {
    it('should store code to browser', function() {
      sampleQuestionId.forEach(function(questionId, index) {
        CodeStorageService.storeCode(questionId, 
          sampleQuestionCode[index], LANGUAGE);
        expect(JSON.parse(localStorage.getItem(questionId))[LANGUAGE])
          .toEqual(sampleQuestionCode[index]);
      });     
    });
  });

  describe('loadStoredCode', function() {
    it('should retrieve stored code from browser', function() {
      for (var i = 0; i < NUM_QUESTIONS; i++) {
        var storedCode = {};
        storedCode[LANGUAGE] = sampleQuestionCode[i];
        localStorage.setItem(sampleQuestionId[i], JSON.stringify(storedCode));
      }
      sampleQuestionId.forEach(function(questionId, index) {
        expect(CodeStorageService.loadStoredCode(questionId, 
          LANGUAGE)).toEqual(sampleQuestionCode[index]);
      });
    });

    it('should fail to retrieve code and return null', function() {
      sampleQuestionId.forEach(function(questionId) {
        expect(!CodeStorageService.loadStoredCode(questionId, 
          FAILED_LANGUAGE)).toBe(true);
      });
    });
  });

  describe('storeAndLoadCode', function() {
    it('should store and load stored code from browser', function() {
      sampleQuestionId.forEach(function(questionId, index) {
        CodeStorageService.storeCode(questionId,
          sampleQuestionCode[index], LANGUAGE);
        expect(CodeStorageService.loadStoredCode(questionId, 
          LANGUAGE)).toEqual(sampleQuestionCode[index]);
      });
    });
  });
});

