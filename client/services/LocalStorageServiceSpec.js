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
  var VERSION = '1';

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
          var key = questionId + ":" + LANGUAGE + ":code";
          expect(localStorage.getItem(key)).toEqual(VERSION + ":" +
            sampleQuestionCodes[index]);
        });
      });
    });

    describe('loadStoredCode', function() {
      it('should retrieve stored code from browser', function() {
        expect(localStorage.length).toEqual(0);
        sampleQuestionIds.forEach(function(questionId, index) {
          var key = questionId + ":" + LANGUAGE + ":code";
          localStorage.setItem(key, VERSION + ":" + sampleQuestionCodes[index]);
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
          var key = questionId + ':' + LANGUAGE + ":code";
          expect(localStorage.getItem(key)).toEqual(VERSION + ":" +
            sampleQuestionCodes[index]);
        });
      });
    });

    describe('clearLocalStorageCode', function() {
      it('should remove code from localStorage', function() {
        sampleQuestionIds.forEach(function(questionId, index) {
          var key = questionId + ':' + LANGUAGE + ":code";
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
    var QUESTION_ID = 'questionid';
    var feedbackSet1 = [];
    var reinforcementBullets = [];
    var feedbackToStore = {};
    var feedbackSet1Dict = [];
    var reinforcementBulletsDict = [];

    beforeEach(inject(function($injector) {
      var FeedbackObjectFactory = $injector.get('FeedbackObjectFactory');
      var FeedbackParagraphObjectFactory =
        $injector.get('FeedbackParagraphObjectFactory');
      var ReinforcementBulletObjectFactory =
        $injector.get('ReinforcementBulletObjectFactory');

      var feedbackObject = FeedbackObjectFactory.create(false);
      feedbackObject.appendTextParagraph('text1');
      feedbackObject.appendCodeParagraph('code1');
      feedbackSet1 = feedbackObject.getParagraphs();

      var bullet1 = ReinforcementBulletObjectFactory.createPassedBullet(
        'passes on abcd');
      var bullet2 = ReinforcementBulletObjectFactory.createFailedBullet(
        'fails on something else');

      reinforcementBullets = [bullet1, bullet2];

      feedbackSet1Dict = feedbackSet1.map(function(paragraph) {
        return FeedbackParagraphObjectFactory.toDict(paragraph);
      });

      reinforcementBulletsDict = reinforcementBullets.map(function(bullet) {
        return ReinforcementBulletObjectFactory.toDict(bullet);
      });

      feedbackToStore = {
        feedbackParagraphs: feedbackSet1Dict,
        reinforcementBullets: reinforcementBulletsDict
      };

    }));

    describe('storeFeedback', function() {
      it('should store feedback and reinforcement bullets', function() {
        expect(localStorage.length).toEqual(0);
        LocalStorageService.storeLatestFeedbackAndReinforcement(QUESTION_ID,
          feedbackSet1, reinforcementBullets, LANGUAGE);
        var key = QUESTION_ID + ":" + LANGUAGE + ":feedback";
        var fromJsonObject = angular.fromJson(localStorage.getItem(key));
        expect(fromJsonObject.feedbackParagraphs).toEqual(feedbackSet1Dict);
        expect(fromJsonObject.reinforcementBullets)
          .toEqual(reinforcementBulletsDict);
      });
    });

    describe('loadFeedback', function() {
      it('should load feedback and reinforcement bullets', function() {
        expect(localStorage.length).toEqual(0);
        var key = QUESTION_ID + ":" + LANGUAGE + ":feedback";
        localStorage.setItem(key, angular.toJson(feedbackToStore));
        expect(LocalStorageService.loadStoredFeedback(QUESTION_ID, LANGUAGE))
          .toEqual({
            feedbackParagraphs: feedbackSet1,
            reinforcementBullets: reinforcementBullets
          });
      });

      it('should fail to retrieve feedback and return null', function() {
        expect(localStorage.length).toEqual(0);
        expect(LocalStorageService.loadStoredFeedback(QUESTION_ID,
          FAILED_LANGUAGE)).toEqual(null);
      });
    });

    describe('clearLocalStorageFeedback', function() {
      it('should clear feedback from localStorage', function() {
        var key = QUESTION_ID + ":" + LANGUAGE + ":feedback";
        localStorage.setItem(key, angular.toJson(feedbackToStore));
        expect(localStorage.getItem(key)).toEqual(
          angular.toJson(feedbackToStore));
        LocalStorageService.clearLocalStorageFeedback(QUESTION_ID, LANGUAGE);
        expect(localStorage.getItem(key)).toEqual(null);
      });
    });
  });
});

