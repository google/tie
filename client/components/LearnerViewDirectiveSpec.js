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

  beforeEach(module("tie"));

  var generateRandomChars = function(number) {
    var generatedChars = "";
    var possible = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (var i = 0; i < number; i++) {
      generatedChars += possible.charAt(
        Math.floor(Math.random() * possible.length));
    }
    return generatedChars;
  };

  var NUM_CHARS_CODE = 100;
  var LANGUAGE = 'python';

  // Please make sure the following three variables are the same as
  // what we have in LearnerViewDirective
  var SECONDS_TO_MILLISECONDS = 1000;
  var DEFAULT_AUTOSAVE_SECONDS = 5;

  var DELTA_MILLISECONDS = 100;

  var AUTOSAVE_MILLISECONDS =
    DEFAULT_AUTOSAVE_SECONDS * SECONDS_TO_MILLISECONDS;

  var AUTOSAVE_REPEAT_RANGE = 20;

  beforeEach(inject(function($compile, $rootScope, _QuestionDataService_) {
    $scope = $rootScope.$new();

    // The reason why we have to go through this trouble to get $scope
    // is the controller is anonymous, thus, there is no easy way to do
    // it. Recommend future refactor.
    element = angular.element('<learner-view></learner-view>');
    element = $compile(element)($scope);
    $scope = element.isolateScope();
    $rootScope.$digest();
    $scope.$digest();

    QuestionDataService = _QuestionDataService_;

  }));

  describe("resetCode", function() {

    it('should reset code to default code', function() {
      $scope.questionIds.forEach(function(questionId, index) {
        var question = QuestionDataService.getQuestion(questionId);
        var starterCode = question.getStarterCode(LANGUAGE);
        $scope.currentQuestionIndex = index;
        $scope.code = generateRandomChars(NUM_CHARS_CODE);
        expect(angular.equals(starterCode, $scope.code)).toBe(false);
        $scope.resetCode();
        expect($scope.code).toEqual(starterCode);
      });
    });
  });

  describe("navigateToQuestion", function() {
    it('should navigate to given question', function() {
      for (var i = 0; i < $scope.questionIds.length; i++) {
        $scope.navigateToQuestion(i);
        expect($scope.currentQuestionIndex).toBe(i);
      }
    });
  });

  describe("activateAutosaving", function() {
    var $interval;
    var $timeout;
    var CodeStorageService;
    beforeEach(inject(function(_$interval_, _$timeout_, _CodeStorageService_) {
      $interval = _$interval_;
      $timeout = _$timeout_;
      CodeStorageService = _CodeStorageService_;
      localStorage.clear();
    }));

    // Autosave text is using $timeout, thus,
    // we need to flush both $interval and $timeout.
    var timeFlies = function(timeToFly) {
      $interval.flush(timeToFly);
      $timeout.flush(timeToFly);
    };

    it("should activate autosaving for only once", function() {
      for (var i = 0; i < $scope.questionIds.length; i++) {
        if (i !== 0) {
          // Default question index is 0, we don't want to
          // navigate to question 0 again because navigateToQuestion
          // will store code for current question, thus, fail the test
          $scope.navigateToQuestion(i);
        }
        expect(!$scope.autosaveOn).toBe(true);
        var questionId = $scope.questionIds[i];
        // There should be no code stored in local storage
        // before autosave is triggerred.
        expect(CodeStorageService.loadStoredCode(
          questionId, LANGUAGE)).toEqual(null);
        $scope.activateAutosaving();
        expect($scope.autosaveOn).toBe(true);
        // Flush 4900 milliseconds -- time: 4.9s
        expect($scope.autosaveTextIsDisplayed).toBe(false);
        timeFlies(AUTOSAVE_MILLISECONDS - DELTA_MILLISECONDS);
        expect($scope.autosaveOn).toBe(true);
        expect(CodeStorageService.loadStoredCode(
          questionId, LANGUAGE)).toEqual(null);
        // Flush 200 milliseconds -- time: 5.1s
        timeFlies(2 * DELTA_MILLISECONDS);
        var question = QuestionDataService.getQuestion(questionId);
        var starterCode = question.getStarterCode(LANGUAGE);
        expect(CodeStorageService.loadStoredCode(
          questionId, LANGUAGE)).toEqual(starterCode);
        expect($scope.autosaveOn).toBe(true);
        expect($scope.autosaveTextIsDisplayed).toBe(true);
        // Flush 1000 milliseconds -- time: 6.1s
        timeFlies(SECONDS_TO_MILLISECONDS);
        expect($scope.autosaveTextIsDisplayed).toBe(false);
        // Flush 4000 milliseconds -- time: 10.1s
        timeFlies(4 * SECONDS_TO_MILLISECONDS);
        expect($scope.autosaveTextIsDisplayed).toBe(false);
        expect($scope.autosaveOn).toBe(false);
        expect(CodeStorageService.loadStoredCode(
          questionId, LANGUAGE)).toEqual(starterCode);
      }
    });

    it("should store the latest code into localStorage", function() {
      for (var i = 0; i < $scope.questionIds.length; i++) {
        if (i !== 0) {
          // Default question index is 0, we don't want to
          // navigate to question 0 again because navigateToQuestion
          // will store code for current question, thus, fail the test
          $scope.navigateToQuestion(i);
        }
        // Repeat 1 - 20 times
        var repeatTimes = Math.floor(Math.random() * AUTOSAVE_REPEAT_RANGE) + 1;
        expect(!$scope.autosaveOn).toBe(true);
        var questionId = $scope.questionIds[i];
        // There should be no code stored in local storage
        // before autosave is triggerred.
        expect(CodeStorageService.loadStoredCode(
          questionId, LANGUAGE)).toEqual(null);
        $scope.activateAutosaving();
        expect($scope.autosaveOn).toBe(true);
        // Flush 4900 milliseconds -- time: 4.9s
        expect($scope.autosaveTextIsDisplayed).toBe(false);
        timeFlies(AUTOSAVE_MILLISECONDS - DELTA_MILLISECONDS);
        expect($scope.autosaveOn).toBe(true);
        expect(CodeStorageService.loadStoredCode(
          questionId, LANGUAGE)).toEqual(null);
        // Flush 200 milliseconds -- time: 5.1s
        timeFlies(2 * DELTA_MILLISECONDS);
        var question = QuestionDataService.getQuestion(questionId);
        var starterCode = question.getStarterCode(LANGUAGE);
        expect(CodeStorageService.loadStoredCode(
          questionId, LANGUAGE)).toEqual(starterCode);
        expect($scope.autosaveOn).toBe(true);
        expect($scope.autosaveTextIsDisplayed).toBe(true);
        var randomCodes;
        for (var j = 0; j < repeatTimes; j++) {
          randomCodes = generateRandomChars(NUM_CHARS_CODE);
          $scope.code = randomCodes;
          timeFlies(AUTOSAVE_MILLISECONDS);
        }
        expect(CodeStorageService.loadStoredCode(
          questionId, LANGUAGE)).toEqual(randomCodes);
        timeFlies(AUTOSAVE_MILLISECONDS);
        expect($scope.autosaveTextIsDisplayed).toBe(false);
        expect($scope.autosaveOn).toBe(false);
        expect(CodeStorageService.loadStoredCode(
          questionId, LANGUAGE)).toEqual(randomCodes);
      }
    });
  });
});
