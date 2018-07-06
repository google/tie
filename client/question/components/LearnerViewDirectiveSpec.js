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
  var EventHandlerService;
  var FeedbackObjectFactory;
  var QuestionObjectFactory;
  var SessionHistoryService;
  var FEEDBACK_CATEGORIES;
  var $location;

  beforeEach(module('tie'));

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
  var CODE_CHANGE_DEBOUNCE_SECONDS;
  var DELTA_MILLISECONDS = 100;
  var CODE_CHANGE_DEBOUNCE_MILLISECONDS;
  var AUTOSAVE_REPEAT_RANGE = 20;
  var ALL_SUPPORTED_LANGUAGES;

  var QUESTION_ID = 'checkBalancedParentheses';

  beforeEach(inject(function(_$location_) {
    // Initialize a question ID that has more than one task.
    $location = _$location_;
    $location.search('qid', 'checkBalancedParentheses');
  }));

  beforeEach(inject(function(
      $compile, $rootScope, $injector, _SECONDS_TO_MILLISECONDS_,
      _CODE_CHANGE_DEBOUNCE_SECONDS_, _EventHandlerService_,
      _FeedbackObjectFactory_, _QuestionObjectFactory_,
      _SessionHistoryService_) {
    // The reason why we have to go through this trouble to get $scope
    // is the controller is anonymous, thus, there is no easy way to do
    // it.
    // TODO (mengchaowang): Refactor learnerViewDirective controller to a
    // separate controller instead of anonymous controller.

    EventHandlerService = _EventHandlerService_;
    FeedbackObjectFactory = _FeedbackObjectFactory_;
    QuestionObjectFactory = _QuestionObjectFactory_;
    SessionHistoryService = _SessionHistoryService_;

    // Set up spies to instrument EventHandlerService.
    spyOn(EventHandlerService, 'createQuestionStartEvent');
    spyOn(EventHandlerService, 'createTaskStartEvent');

    var parentScope = $rootScope.$new();
    element = angular.element('<learner-view></learner-view>');
    $scope = $compile(element)(parentScope).isolateScope();
    $rootScope.$digest();
    $scope.$digest();

    SECONDS_TO_MILLISECONDS = _SECONDS_TO_MILLISECONDS_;
    CODE_CHANGE_DEBOUNCE_SECONDS = _CODE_CHANGE_DEBOUNCE_SECONDS_;
    CODE_CHANGE_DEBOUNCE_MILLISECONDS =
      CODE_CHANGE_DEBOUNCE_SECONDS * SECONDS_TO_MILLISECONDS;
    FEEDBACK_CATEGORIES = $injector.get('FEEDBACK_CATEGORIES');
    ALL_SUPPORTED_LANGUAGES = $injector.get('ALL_SUPPORTED_LANGUAGES');

    localStorage.clear();
  }));

  describe('autosave', function() {
    var $interval;
    var $timeout;
    var AutosaveService;
    beforeEach(inject(function(_$interval_, _$timeout_, _AutosaveService_) {
      $interval = _$interval_;
      $timeout = _$timeout_;
      AutosaveService = _AutosaveService_;
      localStorage.clear();
    }));

    // Autosave text is using $timeout, thus,
    // we need to flush both $interval and $timeout.
    var flushIntervalAndTimeout = function(timeToFlush) {
      $interval.flush(timeToFlush);
      $timeout.flush(timeToFlush);
    };

    it('should only activate autosave once', function() {
      expect($scope.codeChangeLoopPromise).toBe(null);
      var question = QuestionObjectFactory.create(
        globalData.questions[QUESTION_ID]);
      var starterCode = question.getStarterCode(LANGUAGE);
      // There should be no code stored in localStorage
      // before autosave is triggered.
      expect(AutosaveService.getLastSavedCode(LANGUAGE)).toEqual(null);
      $scope.onCodeChange();

      // Autosave is triggered. 5 seconds later, autosave text should be
      // displayed for 1 second. Then, the autosave text should be gone but the
      // autosave is still running. At 10 seconds, cachedCode will be compared
      // to $scope.editorContents.code, since they are the same, autosave will
      // stop. Thus, at 10.1 seconds, autosave should be canceled and
      // $scope.codeChangeLoopPromise should be null.
      expect($scope.codeChangeLoopPromise).not.toBe(null);
      // Flush 4900 milliseconds -- time: 4.9s
      expect($scope.autosaveTextIsDisplayed).toBe(false);
      flushIntervalAndTimeout(
        CODE_CHANGE_DEBOUNCE_MILLISECONDS - DELTA_MILLISECONDS);
      expect($scope.codeChangeLoopPromise).not.toBe(null);
      expect(AutosaveService.getLastSavedCode(LANGUAGE)).toEqual(null);
      // Flush 200 milliseconds -- time: 5.1s
      flushIntervalAndTimeout(2 * DELTA_MILLISECONDS);
      expect(AutosaveService.getLastSavedCode(LANGUAGE)).toEqual(starterCode);
      expect($scope.codeChangeLoopPromise).not.toBe(null);
      expect($scope.autosaveTextIsDisplayed).toBe(true);
      // Flush 1000 milliseconds -- time: 6.1s
      flushIntervalAndTimeout(SECONDS_TO_MILLISECONDS);
      expect($scope.autosaveTextIsDisplayed).toBe(false);
      // Flush 4000 milliseconds -- time: 10.1s
      flushIntervalAndTimeout(4 * SECONDS_TO_MILLISECONDS);
      expect($scope.autosaveTextIsDisplayed).toBe(false);
      expect($scope.codeChangeLoopPromise).toBe(null);

      expect(AutosaveService.getLastSavedCode(LANGUAGE)).toEqual(starterCode);
    });

    it('should store the latest code into localStorage', function() {
      // Repeat 1 - 20 times
      var repeatTimes = Math.floor(Math.random() * AUTOSAVE_REPEAT_RANGE) + 1;
      expect($scope.codeChangeLoopPromise).toBe(null);
      // There should be no code stored in local storage before autosave is
      // triggered.
      expect(AutosaveService.getLastSavedCode(LANGUAGE)).toEqual(null);
      $scope.onCodeChange();
      var randomCodes;
      for (var j = 0; j < repeatTimes; j++) {
        randomCodes = generateRandomChars(NUM_CHARS_CODE);
        $scope.editorContents.code = randomCodes;
        flushIntervalAndTimeout(CODE_CHANGE_DEBOUNCE_MILLISECONDS);
      }
      expect(AutosaveService.getLastSavedCode(LANGUAGE)).toEqual(randomCodes);
      flushIntervalAndTimeout(CODE_CHANGE_DEBOUNCE_MILLISECONDS);
      expect($scope.autosaveTextIsDisplayed).toBe(false);
      expect($scope.codeChangeLoopPromise).toBe(null);
      expect(AutosaveService.getLastSavedCode(LANGUAGE)).toEqual(randomCodes);
    });
  });

  describe('onCodeChange', function() {
    var $interval;
    var $timeout;
    var UnpromptedFeedbackManagerService;
    var FeedbackParagraphObjectFactory;
    beforeEach(inject(function(
        _$interval_, _$timeout_, _UnpromptedFeedbackManagerService_,
        _FeedbackParagraphObjectFactory_) {
      $interval = _$interval_;
      $timeout = _$timeout_;
      UnpromptedFeedbackManagerService = _UnpromptedFeedbackManagerService_;
      FeedbackParagraphObjectFactory = _FeedbackParagraphObjectFactory_;
      spyOn(UnpromptedFeedbackManagerService, 'runTipsCheck').and.returnValue([
        FeedbackParagraphObjectFactory.fromDict({
          type: 'text',
          content: '[some unprompted feedback]'
        })
      ]);
    }));

    var flushIntervalAndTimeout = function(timeToFlush) {
      $interval.flush(timeToFlush);
      $timeout.flush(timeToFlush);
    };

    it('should add unprompted feedback to the feedback log', function() {
      var sessionTranscript = (
        SessionHistoryService.getBindableSessionTranscript());
      expect(sessionTranscript.length).toBe(0);
      expect($scope.codeChangeLoopPromise).toBe(null);

      $scope.onCodeChange();
      $scope.editorContents.code = 'new code';
      flushIntervalAndTimeout(CODE_CHANGE_DEBOUNCE_MILLISECONDS);
      expect(sessionTranscript.length).toBe(1);
      expect(sessionTranscript[0].getFeedbackParagraphs()[0].getContent()).toBe(
        '[some unprompted feedback]');
    });
  });

  describe('resetCode', function() {
    it('should reset code to starter code', function() {
      spyOn(EventHandlerService, 'createCodeResetEvent');
      localStorage.clear();

      var question = QuestionObjectFactory.create(
        globalData.questions[QUESTION_ID]);
      var starterCode = question.getStarterCode(LANGUAGE);
      $scope.editorContents.code = generateRandomChars(NUM_CHARS_CODE);
      expect(starterCode).not.toEqual($scope.editorContents.code);
      $scope.resetCode();
      expect($scope.editorContents.code).toEqual(starterCode);
      expect(EventHandlerService.createCodeResetEvent).toHaveBeenCalled();
    });
  });

  describe('completeQuestion', function() {
    it('should create a QuestionCompleteEvent after final task', function() {
      spyOn(EventHandlerService, 'createQuestionCompleteEvent');

      $scope.completeQuestion();
      expect(
        EventHandlerService.createQuestionCompleteEvent).toHaveBeenCalled();
    });
  });

  describe('events', function() {
    it('should create events when next task is shown', function() {
      $scope.currentTaskIndex = 0;
      $scope.showNextTask();
      expect(EventHandlerService.createTaskStartEvent).toHaveBeenCalled();
    });

    it('should create events for questionStart', function() {
      expect(EventHandlerService.createQuestionStartEvent).toHaveBeenCalled();
    });
  });

  describe('isDocumentHidden', function() {
    it('should return document[hiddenAttributeName]', function() {
      expect($scope.isDocumentHidden('hidden')).toEqual(document.hidden);
    });
  });

  describe('getHiddenAttribute', function() {
    it('should return document.hidden', function() {
      expect($scope.getHiddenAttribute()).toEqual(document.hidden);
    });
  });

  describe('getMsHiddenAttribute', function() {
    it('should return document.msHidden', function() {
      expect($scope.getMsHiddenAttribute()).toEqual(document.msHidden);
    });
  });

  describe('getWebkitHiddenAttribute', function() {
    it('should return document.webkitHidden', function() {
      expect($scope.getWebkitHiddenAttribute()).toEqual(document.webkitHidden);
    });
  });

  describe('determineHiddenAttributeNameForBrowser', function() {
    it('should return null if no hidden attribute is defined', function() {
      spyOn($scope, 'getHiddenAttribute').and.returnValue(undefined);
      spyOn($scope, 'getMsHiddenAttribute').and.returnValue(undefined);
      spyOn($scope, 'getWebkitHiddenAttribute').and.returnValue(undefined);
      var hiddenAttributeName = $scope.determineHiddenAttributeNameForBrowser();
      expect(hiddenAttributeName).toEqual(null);
    });

    it('should return "hidden" if hidden is defined', function() {
      spyOn($scope, 'getHiddenAttribute').and.returnValue('whatever');
      var hiddenAttributeName = $scope.determineHiddenAttributeNameForBrowser();
      expect(hiddenAttributeName).toEqual('hidden');
    });

    it('should return "msHidden" if msHidden is defined', function() {
      spyOn($scope, 'getHiddenAttribute').and.returnValue(undefined);
      spyOn($scope, 'getMsHiddenAttribute').and.returnValue('whatever');
      var hiddenAttributeName = $scope.determineHiddenAttributeNameForBrowser();
      expect(hiddenAttributeName).toEqual('msHidden');
    });

    it('should return "webkitHidden" if webkitHidden is defined', function() {
      spyOn($scope, 'getHiddenAttribute').and.returnValue(undefined);
      spyOn($scope, 'getMsHiddenAttribute').and.returnValue(undefined);
      spyOn($scope, 'getWebkitHiddenAttribute').and.returnValue('whatever');
      var hiddenAttributeName = $scope.determineHiddenAttributeNameForBrowser();
      expect(hiddenAttributeName).toEqual('webkitHidden');
    });
  });

  describe('determineVisibilityChangeAttributeNameForBrowser', function() {
    it('should return null if no hidden attribute is defined', function() {
      spyOn($scope, 'getHiddenAttribute').and.returnValue(undefined);
      spyOn($scope, 'getMsHiddenAttribute').and.returnValue(undefined);
      spyOn($scope, 'getWebkitHiddenAttribute').and.returnValue(undefined);
      var visibilityChange = (
        $scope.determineVisibilityChangeAttributeNameForBrowser());
      expect(visibilityChange).toEqual(null);
    });

    it('should return "visibilitychange" if hidden is defined', function() {
      spyOn($scope, 'getHiddenAttribute').and.returnValue('whatever');
      var visibilityChange = (
        $scope.determineVisibilityChangeAttributeNameForBrowser());
      expect(visibilityChange).toEqual('visibilitychange');
    });

    it('should return "msvisibilitychange" if msHidden is defined', function() {
      spyOn($scope, 'getHiddenAttribute').and.returnValue(undefined);
      spyOn($scope, 'getMsHiddenAttribute').and.returnValue('whatever');
      var visibilityChange = (
        $scope.determineVisibilityChangeAttributeNameForBrowser());
      expect(visibilityChange).toEqual('msvisibilitychange');
    });

    it('should return "webkitvisibilitychange" if webkitHidden is defined',
      function() {
        spyOn($scope, 'getHiddenAttribute').and.returnValue(undefined);
        spyOn($scope, 'getMsHiddenAttribute').and.returnValue(undefined);
        spyOn($scope, 'getWebkitHiddenAttribute').and.returnValue('whatever');
        var visibilityChange = (
          $scope.determineVisibilityChangeAttributeNameForBrowser());
        expect(visibilityChange).toEqual('webkitvisibilitychange');
      });
  });

  describe('setEventListenerForVisibilityChange', function() {
    it('should set an event listener in a supported browser', function() {
      spyOn(document, 'addEventListener');
      $scope.setEventListenerForVisibilityChange();
      expect(document.addEventListener).toHaveBeenCalled();
    });

    it('should NOT set an event listener in an unsupported browser',
      function() {
        spyOn(document, 'addEventListener');
        spyOn($scope, 'determineHiddenAttributeNameForBrowser').and.returnValue(
          null);
        $scope.setEventListenerForVisibilityChange();
        expect(document.addEventListener).not.toHaveBeenCalled();
      });

    it('should NOT set an event listener if visibilityChange is null',
      function() {
        spyOn(document, 'addEventListener');
        spyOn($scope,
          'determineVisibilityChangeAttributeNameForBrowser').and.returnValue(
          null);
        $scope.setEventListenerForVisibilityChange();
        expect(document.addEventListener).not.toHaveBeenCalled();
      });
  });

  describe('onVisiblityChange', function() {
    it('should create a SessionPauseEvent when the user hides the tab',
      function() {
        spyOn(EventHandlerService, 'createSessionPauseEvent');
        spyOn($scope, 'determineHiddenAttributeNameForBrowser').and.returnValue(
          'whatever');
        spyOn($scope, 'isDocumentHidden').and.returnValue(true);
        $scope.onVisibilityChange();
        expect(EventHandlerService.createSessionPauseEvent).toHaveBeenCalled();
      });

    it('should create a SessionResumeEvent when the user returns to the tab',
      function() {
        spyOn(EventHandlerService, 'createSessionResumeEvent');
        spyOn($scope, 'determineHiddenAttributeNameForBrowser').and.returnValue(
          'whatever');
        spyOn($scope, 'isDocumentHidden').and.returnValue(false);
        $scope.onVisibilityChange();
        expect(EventHandlerService.createSessionResumeEvent).toHaveBeenCalled();
      });
  });

  describe('setFeedback', function() {
    it('should create events for code submission', function() {
      spyOn($scope, 'scrollToTopOfFeedbackWindow');
      spyOn(EventHandlerService, 'createCodeSubmitEvent');
      var code = [
        'def myFunction(arg):',
        '    result = arg.rstrip()',
        '    return result',
        ''
      ].join('\n');
      $scope.setFeedback(
        FeedbackObjectFactory.create(FEEDBACK_CATEGORIES.RUNTIME_ERROR),
        code);
      expect(EventHandlerService.createCodeSubmitEvent).toHaveBeenCalled();
    });

    it('should create an event for task completion', function() {
      spyOn($scope, 'scrollToTopOfFeedbackWindow');
      spyOn(EventHandlerService, 'createTaskCompleteEvent');
      var code = [
        'def myFunction(arg):',
        '    result = arg.rstrip()',
        '    return result',
        ''
      ].join('\n');
      $scope.setFeedback(
        FeedbackObjectFactory.create(FEEDBACK_CATEGORIES.SUCCESSFUL),
        code);
      expect(EventHandlerService.createTaskCompleteEvent).toHaveBeenCalled();
    });
  });

  describe('supportedLanguageLabels', function() {
    it('should provide a descriptive label for each language', function() {
      expect($scope.supportedLanguageLabels[LANGUAGE]).toEqual('Python 2.7');

      expect($scope.supportedLanguageCount).toEqual(
        ALL_SUPPORTED_LANGUAGES.length);

      for (var i = ALL_SUPPORTED_LANGUAGES.length - 1; i >= 0; i--) {
        var label = $scope.supportedLanguageLabels[ALL_SUPPORTED_LANGUAGES[i]];
        expect(typeof label).toBe('string');
        expect(label).toBeTruthy();
      }
    });
  });
});
