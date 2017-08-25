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
 * @LearnerViewDirective Unit tests for the LearnerViewDirective.
 *
 */

describe('LearnerViewDirective', function() {
  var $scope;
  var element;
  var QuestionDataService;
  var $location;

  beforeEach(module("tie"));

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

  var NUM_CHARS_CODE = 100;
  var LANGUAGE = 'python';

  var SECONDS_TO_MILLISECONDS;
  var DEFAULT_AUTOSAVE_SECONDS;
  var DELTA_MILLISECONDS = 100;
  var AUTOSAVE_MILLISECONDS;
  var AUTOSAVE_REPEAT_RANGE = 20;

  var questionId = 'findMostCommonCharacter';

  beforeEach(inject(function($compile, $rootScope, _QuestionDataService_,
    _SECONDS_TO_MILLISECONDS_, _DEFAULT_AUTOSAVE_SECONDS_, _$location_) {
    $scope = $rootScope.$new();

    // The reason why we have to go through this trouble to get $scope
    // is the controller is anonymous, thus, there is no easy way to do
    // it.
    // TODO (mengchaowang): Refactor learnerViewDirective controller to a
    // separate controller instead of anonymous controller.
    $location = _$location_;
    element = angular.element('<learner-view></learner-view>');
    element = $compile(element)($scope);
    $scope = element.isolateScope();
    $rootScope.$digest();
    $scope.$digest();

    QuestionDataService = _QuestionDataService_;

    SECONDS_TO_MILLISECONDS = _SECONDS_TO_MILLISECONDS_;
    DEFAULT_AUTOSAVE_SECONDS = _DEFAULT_AUTOSAVE_SECONDS_;
    AUTOSAVE_MILLISECONDS =
      DEFAULT_AUTOSAVE_SECONDS * SECONDS_TO_MILLISECONDS;

    localStorage.clear();


  }));

  describe("resetCode", function() {
    it('should reset code to starter code', function() {
      spyOn($location, 'search').and.returnValue({qid: 'findMostCommonCharacter'});
      var question = QuestionDataService.getQuestion(questionId);
      var starterCode = question.getStarterCode(LANGUAGE);
      $scope.editorContents.code = generateRandomChars(NUM_CHARS_CODE);
      expect(starterCode).not.toEqual($scope.editorContents.code);
      $scope.resetCode();
      expect($scope.editorContents.code).toEqual(starterCode);
    });
  });

  describe("autosave", function() {
    var $interval;
    var $timeout;
    var LocalStorageService;
    beforeEach(inject(function(_$interval_, _$timeout_, _LocalStorageService_) {
      $interval = _$interval_;
      $timeout = _$timeout_;
      LocalStorageService = _LocalStorageService_;
      localStorage.clear();
    }));

    // Autosave text is using $timeout, thus,
    // we need to flush both $interval and $timeout.
    var flushIntervalAndTimeout = function(timeToFlush) {
      $interval.flush(timeToFlush);
      $timeout.flush(timeToFlush);
    };

    it("should only activate autosave once", function() {
      expect(!$scope.autosaveOn).toBe(true);
      var question = QuestionDataService.getQuestion(questionId);
      var starterCode = question.getStarterCode(LANGUAGE);
      // There should be no code stored in localStorage
      // before autosave is triggered.
      expect(LocalStorageService.loadStoredCode(
        questionId, LANGUAGE)).toEqual(null);
      $scope.autosave();
      checkAutosaveDetail(questionId, starterCode);
      expect(LocalStorageService.loadStoredCode(
        questionId, LANGUAGE)).toEqual(starterCode);
    });

    // Autosave is triggered. 5 seconds later, autosave text should be
    // displayed for 1 second. Then, the autosave text should be gone but the
    // autosave is still running. At 10 seconds, cachedCode will be compared
    // to $scope.editorContents.code, since they are the same, autosave will
    // stop. Thus, at 10.1 seconds, autosave should be canceled and autosaveOn
    // should be false.
    var checkAutosaveDetail = function(questionId, starterCode) {
      expect($scope.autosaveOn).toBe(true);
      // Flush 4900 milliseconds -- time: 4.9s
      expect($scope.autosaveTextIsDisplayed).toBe(false);
      flushIntervalAndTimeout(AUTOSAVE_MILLISECONDS - DELTA_MILLISECONDS);
      expect($scope.autosaveOn).toBe(true);
      expect(LocalStorageService.loadStoredCode(
        questionId, LANGUAGE)).toEqual(null);
      // Flush 200 milliseconds -- time: 5.1s
      flushIntervalAndTimeout(2 * DELTA_MILLISECONDS);
      expect(LocalStorageService.loadStoredCode(
        questionId, LANGUAGE)).toEqual(starterCode);
      expect($scope.autosaveOn).toBe(true);
      expect($scope.autosaveTextIsDisplayed).toBe(true);
      // Flush 1000 milliseconds -- time: 6.1s
      flushIntervalAndTimeout(SECONDS_TO_MILLISECONDS);
      expect($scope.autosaveTextIsDisplayed).toBe(false);
      // Flush 4000 milliseconds -- time: 10.1s
      flushIntervalAndTimeout(4 * SECONDS_TO_MILLISECONDS);
      expect($scope.autosaveTextIsDisplayed).toBe(false);
      expect($scope.autosaveOn).toBe(false);
    };

    it("should store the latest code into localStorage", function() {
      // Repeat 1 - 20 times
      var repeatTimes = Math.floor(Math.random() * AUTOSAVE_REPEAT_RANGE) + 1;
      expect(!$scope.autosaveOn).toBe(true);
      // There should be no code stored in local storage
      // before autosave is triggerred.
      expect(LocalStorageService.loadStoredCode(
        questionId, LANGUAGE)).toEqual(null);
      $scope.autosave();
      var randomCodes;
      for (var j = 0; j < repeatTimes; j++) {
        randomCodes = generateRandomChars(NUM_CHARS_CODE);
        $scope.editorContents.code = randomCodes;
        flushIntervalAndTimeout(AUTOSAVE_MILLISECONDS);
      }
      expect(LocalStorageService.loadStoredCode(
        questionId, LANGUAGE)).toEqual(randomCodes);
      flushIntervalAndTimeout(AUTOSAVE_MILLISECONDS);
      expect($scope.autosaveTextIsDisplayed).toBe(false);
      expect($scope.autosaveOn).toBe(false);
      expect(LocalStorageService.loadStoredCode(
        questionId, LANGUAGE)).toEqual(randomCodes);
    });
  });
});
