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
 * @fileoverview Unit tests for the LocalStorageService.
 * Please be aware, the hash key format is {{questionId}}:{{language}}
 */

describe('LocalStorageService', function() {
  var LANGUAGE = 'python';
  var FAILED_LANGUAGE = 'java';
  var NUM_CHARS_QUESTION_ID = 10;
  var NUM_CHARS_CODE = 10;
  var NUM_QUESTIONS = 5;

  var LocalStorageService;

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
  var sampleQuestionCodes = [];

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    localStorage.clear();
    LocalStorageService = $injector.get('LocalStorageService');

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

  describe('CodeStorage', function() {
    describe('storeCode', function() {
      it('should store code to browser', function() {
        expect(localStorage.length).toEqual(0);
        sampleQuestionIds.forEach(function(questionId, index) {
          LocalStorageService.storeCode(questionId,
            sampleQuestionCodes[index], LANGUAGE);
          var key = questionId + ":" + LANGUAGE;
          expect(localStorage.getItem(key)).toEqual(
            sampleQuestionCodes[index]);
        });
      });
    });

    describe('loadStoredCode', function() {
      it('should retrieve stored code from browser', function() {
        expect(localStorage.length).toEqual(0);
        sampleQuestionIds.forEach(function(questionId, index) {
          var key = questionId + ":" + LANGUAGE;
          localStorage.setItem(key, sampleQuestionCodes[index]);
          expect(LocalStorageService.loadStoredCode(questionId,
            LANGUAGE)).toEqual(sampleQuestionCodes[index]);
        });
      });

      it('should fail to retrieve code and return null', function() {
        expect(localStorage.length).toEqual(0);
        sampleQuestionIds.forEach(function(questionId) {
          expect(LocalStorageService.loadStoredCode(questionId,
            FAILED_LANGUAGE)).toEqual(null);
        });
      });
    });

    describe('storeAndLoadCode', function() {
      it('should store and load stored code from browser', function() {
        expect(localStorage.length).toEqual(0);
        sampleQuestionIds.forEach(function(questionId, index) {
          LocalStorageService.storeCode(questionId,
            sampleQuestionCodes[index], LANGUAGE);
          expect(LocalStorageService.loadStoredCode(questionId,
            LANGUAGE)).toEqual(sampleQuestionCodes[index]);
        });
      });
    });

    describe('verifyLocalStorageKey', function() {
      it('should verify composed keys match localStorage keys', function() {
        expect(localStorage.length).toEqual(0);
        sampleQuestionIds.forEach(function(questionId, index) {
          LocalStorageService.storeCode(questionId,
            sampleQuestionCodes[index], LANGUAGE);
          var key = questionId + ':' + LANGUAGE;
          expect(localStorage.getItem(key)).toEqual(
            sampleQuestionCodes[index]);
        });
      });
    });

    describe('clearLocalStorageCode', function() {
      it('should remove code from localStorage', function() {
        sampleQuestionIds.forEach(function(questionId, index) {
          var key = questionId + ':' + LANGUAGE;
          localStorage.setItem(key, sampleQuestionCodes[index]);
          expect(localStorage.getItem(key)).toEqual(
            sampleQuestionCodes[index]);
          LocalStorageService.clearLocalStorageCode(questionId, LANGUAGE);
          expect(localStorage.getItem(key)).toEqual(null);
        });
      });
    });
  });

  describe('FeedbackStorage', function() {
    var feedbackStorage = [];

    beforeEach(inject(function($injector) {
      var FeedbackObjectFactory = $injector.get('FeedbackObjectFactory');
      var feedbackObject = FeedbackObjectFactory.create(false);

      feedbackObject.appendTextParagraph('text1');
      feedbackObject.appendCodeParagraph('code1');
      var feedbackSet1 = {
        feedbackParagraphs: feedbackObject.getParagraphs()
      };
      feedbackStorage.push(feedbackSet1);

      feedbackObject.clear();
      feedbackObject.appendTextParagraph('text2');
      feedbackObject.appendCodeParagraph('code2');
      feedbackObject.appendSyntaxErrorParagraph('error');
      var feedbackSet2 = {
        feedbackParagraphs: feedbackObject.getParagraphs()
      };
      feedbackStorage.push(feedbackSet2);
    }));

    describe('storeFeedback', function() {
      it('should store feedback as a JSON object to browser', function() {
        expect(localStorage.length).toEqual(0);
        LocalStorageService.storeFeedback('testquestionid',
          feedbackStorage, LANGUAGE);
        var key = "testquestionid:feedback:" + LANGUAGE;
        expect(localStorage.getItem(key)).toEqual(
          angular.toJson(feedbackStorage));
      });
    });

    describe('loadFeedback', function() {
      it('should load feedback as an array of objects', function() {
        expect(localStorage.length).toEqual(0);
        var key = "testquestionid:feedback:" + LANGUAGE;
        localStorage.setItem(key, angular.toJson(feedbackStorage));
        expect(angular.equals(
          LocalStorageService.loadStoredFeedback(
            'testquestionid', LANGUAGE), feedbackStorage)
        ).toEqual(true);
      });

      it('should fail to retrieve feedback and return null', function() {
        expect(localStorage.length).toEqual(0);
        expect(LocalStorageService.loadStoredFeedback("testquestionid",
          FAILED_LANGUAGE)).toEqual(null);
      });
    });

    describe('clearLocalStorageFeedback', function() {
      it('should clear feedback from localStorage', function() {
        var key = "testquestionid:feedback:" + LANGUAGE;
        localStorage.setItem(key, angular.toJson(feedbackStorage));
        expect(localStorage.getItem(key)).toEqual(
          angular.toJson(feedbackStorage));
        LocalStorageService.clearLocalStorageFeedback(
          "testquestionid", LANGUAGE);
        expect(localStorage.getItem(key)).toEqual(null);
      });
    });
  });
});

