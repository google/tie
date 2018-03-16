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
 * @fileoverview Directive for the learner "practice question" view.
 */

tie.directive('learnerView', [function() {
  return {
    restrict: 'E',
    scope: {},
    template: `
      <div class="tie-wrapper" ng-class="{'night-mode': isInDarkMode}">
        <div class="tie-question-ui-outer">
          <div class="tie-question-ui-inner">
            <div class="tie-question-ui">
              <div class="tie-question-window">
                <div class="tie-question-container" ng-class="{'pulse-animation-enabled': pulseAnimationEnabled}" ng-attr-aria-hidden="{{MonospaceDisplayModalService.isDisplayed()}}">
                  <h1 class="tie-question-title">{{title}}</h1>
                  <div class="tie-previous-instructions">
                    <div ng-repeat="previousInstruction in previousInstructions track by $index">
                      <div ng-repeat="instruction in previousInstruction track by $index">
                        <p ng-if="instruction.type == 'text'">
                          {{instruction.content}}
                        </p>
                        <pre class="tie-question-code" ng-if="instruction.type == 'code'">{{instruction.content}}</pre>
                      </div>
                      <hr>
                    </div>
                  </div>
                  <div class="tie-instructions">
                    <div ng-repeat="instruction in instructions">
                      <p ng-if="instruction.type == 'text'">
                        {{instruction.content}}
                      </p>
                      <pre class="tie-question-code" ng-if="instruction.type == 'code'">{{instruction.content}}</pre>
                    </div>
                  </div>
                  <speech-balloons-container></speech-balloons-container>
                </div>
                <monospace-display-modal
                    ng-show="MonospaceDisplayModalService.isDisplayed()"
                    content="content">
                </monospace-display-modal>
              </div>
              <div ng-hide="MonospaceDisplayModalService.isDisplayed()">
                <button class="tie-code-reset tie-button"
                    ng-click="resetFeedback()"
                    title="Click to clear all feedback">
                  Reset Feedback
                </button>
                <select class="tie-select-menu"
                    id="themeSelector"
                    name="theme-select"
                    ng-change="changeTheme(currentThemeName)"
                    ng-model="currentThemeName"
                    ng-options="i.themeName as i.themeName for i in themes"
                    title="Change between light and dark themes">
                </select>
              </div>
            </div>
            <div class="tie-coding-ui">
              <div class="tie-lang-terminal">
                <div class="tie-coding-terminal">
                  <div ng-if="codeEditorIsShown"
                      class="tie-codemirror-container"
                      tabindex="0"
                      ng-keypress="onKeypressCodemirrorContainer($event)"
                      ng-focus="onFocusCodemirrorContainer()">
                    <ui-codemirror ui-codemirror-opts="codeMirrorOptions"
                        ng-model="editorContents.code"
                        ng-change="onCodeChange()"
                        ng-if="!accessibleMode"
                        class="protractor-test-code-input">
                    </ui-codemirror>
                    <ui-codemirror ng-model="editorContents.code"
                        ui-codemirror-opts="accessibleCodeMirrorOptions"
                        ng-change="onCodeChange()"
                        ng-if="accessibleMode"
                        class="protractor-test-code-input">
                    </ui-codemirror>
                  </div>
                </div>
                <select ng-if="SERVER_URL"
                    class="tie-select-menu"
                    name="lang-select-menu">
                  <option value="Python" selected>Python</option>
                </select>
                <button class="tie-code-reset tie-button protractor-test-reset-code-btn" name="code-reset" ng-click="resetCode()" title="Click to clear your code">
                  Reset Code
                </button>
                <a ng-if="!SERVER_URL" class="tie-primer-link tie-python-primer" target="_blank" ng-href="{{getPythonPrimerUrl()}}" title="Click to view a short introduction to Python">New to Python?</a>
                <div class="tie-code-auto-save"
                    ng-show="autosaveTextIsDisplayed">
                  Saving code...
                </div>
                <button class="tie-run-button tie-button tie-button-green protractor-test-run-code-btn" ng-click="submitCode(editorContents.code)" ng-disabled="ConversationLogDataService.isNewBalloonPending()" title="Click anytime you want feedback on your code">
                  Get Feedback
                </button>
              </div>
            </div>
            <div class="tie-options-row">
              <ul>
                <li class="tie-about-button">
                  <a target="_blank" href="https://github.com/google/tie/blob/master/README.md">About TIE</a>
                </li>
                <li class="tie-privacy-button" ng-click="onPrivacyClick()">
                  <a href="#">Privacy</a>
                </li>
                <li class="tie-leave-feedback-button"
                    title="Click to leave your feedback about TIE">
                  <a href="https://goo.gl/CcfCq4" target="_blank">
                    Leave feedback about TIE
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div aria-live="assertive">
        <div role="alert" ng-if="ariaLiveMessage.text">{{ariaLiveMessage.text}}</div>
      </div>

      <privacy-modal is-displayed="privacyModalIsDisplayed">
      </privacy-modal>

      <style>
        div.CodeMirror span.CodeMirror-matchingbracket {
          color: rgb(75, 206, 75);
        }
        .tie-about-button {
          float: left;
        }
        .tie-arrow-highlighter {
          background-color: white;
          border-radius: 100px;
          box-shadow: 0px 0px 42px 67px white;
          height: 50px;
          left: calc(50% - 25px);
          position: absolute;
          top: calc(50% - 25px);
          width: 50px;
        }
        .tie-button {
          background-color: #ffffff;
          border-radius: 4px;
          border-style: none;
          color: black;
          cursor: pointer;
          display: block;
          font-family: Roboto, 'Helvetica Neue', 'Lucida Grande', sans-serif;
          font-size: 12px;
          height: 24px;
          margin-right: 10px;
          outline: none;
          padding: 1px 6px;
          width: 120px;
        }
        .tie-button:hover {
          border: 1px solid #e4e4e4;
        }
        .night-mode .tie-button:hover {
          border-color: #646464;
        }
        .night-mode .tie-button:active {
          border-color: #c1c1c1;
        }
        .tie-button:active {
          border-color: #a0a0a0;
        }
        .tie-button-blue {
          background-color: #448AFF;
          border: none;
          color: #ffffff;
          outline: none;
        }
        .tie-button-blue:hover {
          background-color: #2979FF;
        }
        .tie-button-blue:active {
          background-color: #2962FF;
        }
        .night-mode .tie-button-blue {
          background-color: rgb(70, 90, 110);
          color: #ffffff;
        }
        .night-mode .tie-button-blue:hover {
          border-color: #e4e4e4;
        }
        .night-mode .tie-button-blue:active {
          background-color: rgb(62, 81, 99);
        }
        .tie-button-green {
          background-color: #3C5C14;
          border: none;
          color: #ffffff;
          outline: none;
        }
        .tie-button-green:hover {
          border-color: #82bf36;
        }
        .tie-button-green:active {
          background-color: #265221;
        }
        .night-mode .tie-button-green {
          background-color: #3C5C14;
          color: #ffffff;
        }
        .night-mode .tie-button-green:hover {
          border-color: #e4e4e4;
        }
        .night-mode .tie-button-green:active {
          background-color: #265221;
        }
        .tie-code-auto-save {
          font-family: Roboto, 'Helvetica Neue', 'Lucida Grande', sans-serif;
          font-size: 13px;
          float: left;
          margin-top: 14px;
          margin-left: 10px;
        }
        .night-mode .tie-code-auto-save {
          color: #E0E0E0;
        }
        .tie-code-reset, .tie-python-primer {
          float: left;
          margin-top: 10px;
        }
        .night-mode .tie-code-reset {
          background-color: #333a42;
          color: white;
        }
        .tie-coding-terminal .CodeMirror {
          /* Overwriting codemirror defaults */
          height: 100%;
        }
        .tie-codemirror-container {
          width: 100%;
        }
        .tie-coding-terminal {
          display: flex;
          font-size: 13px;
          height: 528px;
          position: relative;
          width: 662px;
        }
        .tie-coding-window {
          display: flex;
        }
        .tie-coding-terminal {
          background-color: rgb(255, 255, 255);
          -webkit-font-smoothing: antialiased;
        }
        .tie-coding-terminal:focus, .tie-run-button:focus,
            .tie-select-menu:focus {
          outline: 0;
        }
        .tie-coding-ui, .tie-question-ui {
          display: inline-block;
          margin: 8px;
          white-space: normal;
        }
        .tie-feedback-error-string {
          color: #F44336;
        }
        .tie-feedback-window {
          background-color: rgb(255, 255, 242);
          font-size: 14px;
          height: 128px;
          overflow: auto;
          padding: 10px;
          resize: both;
          width: 642px;
          -webkit-font-smoothing: antialiased;
        }
        .night-mode .tie-feedback-window {
          background-color: #37474F;
          color: #E0E0E0;
          font-size: 14px;
          height: 128px;
          overflow: auto;
          padding: 10px;
          resize: both;
          width: 642px;
          -webkit-font-smoothing: antialiased;
        }
        .tie-lang-select-menu {
          float: left;
          margin-top: 10px;
        }
        .tie-lang-terminal {
          display: inline;
        }
        .tie-leave-feedback-button {
          float: right;
        }
        .tie-options-row a {
          color: #696969;
          display: block;
          line-height: 25px;
          padding: 5px;
          text-decoration: none;
        }
        .night-mode .tie-options-row a {
          color: #E0E0E0;
        }
        .tie-options-row li {
          margin: 5px;
        }
        .tie-options-row ul {
          font-size: 11px;
          list-style-type: none;
          margin: 0;
          padding: 0;
        }
        .tie-options-row a:hover {
          text-decoration: underline;
        }
        .tie-previous-instructions {
          opacity: 0.5;
        }
        .tie-primer-link {
          color: blue;
          font-size: 12px;
          padding: 4px 10px 0px 4px;
        }
        .night-mode .tie-primer-link {
          color: white;
        }
        .tie-privacy-button {
          float: left;
        }
        .tie-question-code {
          background: rgb(242, 242, 242);
          border: 1px solid #ccc;
          font-family: monospace;
          font-size: 13px;
          padding: 10px;
          white-space: -moz-pre-wrap;
          white-space: -o-pre-wrap;
          white-space: -pre-wrap;
          white-space: pre-wrap;
          word-wrap: break-word;
        }
        .night-mode .tie-question-code {
          background: #333;
        }
        .tie-question-container {
          padding: 10px;
        }
        .tie-question-title {
          color: #212121;
          font-size: 18px;
        }
        .night-mode .tie-question-title {
          color: #ececec;
        }
        .tie-question-ui {
          vertical-align: top;
        }
        .tie-question-ui-inner {
          padding-left: 32px;
          padding-right: 32px;
          white-space: nowrap;
        }
        .tie-question-ui-outer {
          display: table;
          margin-left: auto;
          margin-right: auto;
          padding-top: 30px;
        }
        .tie-question-window {
          background-color: #FFFFF7;
          font-size: 14px;
          height: 528px;
          max-width: 700px;
          min-height: 300px;
          min-width: 400px;
          overflow: auto;
          padding: 0;
          resize: both;
          width: 548px;
        }
        .night-mode .tie-question-window {
          background-color: #333A42;
          color: #E0E0E0;
        }
        .tie-question-window.tie-monospace-modal-container {
          border: 1px solid #d3d3d3;
          resize: none;
        }
        .night-mode .tie-question-window.tie-monospace-modal-container {
          border: 1px solid #333;
        }
        .tie-run-button {
          float: right;
          margin-right: 0;
          margin-top: 10px;
          position: relative;
        }
        .tie-select-menu {
          background-color: #ffffff;
          border: 1px solid transparent;
          border-radius: 4px;
          cursor: pointer;
          float: left;
          height: 24px;
          margin-right: 5px;
          margin-top: 10px;
          min-width: 100px;
          padding: 1px 6px;
        }
        .tie-select-menu:hover {
          border-color: #e4e4e4;
        }
        .night-mode .tie-select-menu {
          background-color: #333a42;
          color: white;
        }
        .CodeMirror-linenumber {
          /* Increase the contrast of the line numbers from the background. */
          color: #424242;
        }
        .CodeMirror-line.tie-syntax-error-line {
          background: #FBC2C4;
        }
        .tie-wrapper.night-mode .CodeMirror-line.tie-syntax-error-line {
          background: #891111;
        }
        .tie-wrapper {
          height: 100%;
        }
        .tie-wrapper.night-mode {
          background-color: #212121;
        }
        .night-mode ::-webkit-scrollbar {
          background-color: #555555;
        }
        .night-mode ::-webkit-scrollbar-corner {
          background-color: #3c3c4b;
        }
        .night-mode ::-webkit-scrollbar-thumb {
          background-color: #888888;
          background-clip: content-box;
          border: 3px solid transparent;
          border-radius: 7px;
        }
      </style>
    `,
    controller: [
      '$scope', '$interval', '$timeout', '$location', 'CookieStorageService',
      'SolutionHandlerService', 'QuestionDataService', 'LANGUAGE_PYTHON',
      'FeedbackObjectFactory', 'EventHandlerService', 'LocalStorageService',
      'ServerHandlerService', 'SessionIdService',
      'UnpromptedFeedbackManagerService', 'MonospaceDisplayModalService',
      'SECONDS_TO_MILLISECONDS', 'CODE_CHANGE_DEBOUNCE_SECONDS',
      'DISPLAY_AUTOSAVE_TEXT_SECONDS', 'SERVER_URL', 'DEFAULT_QUESTION_ID',
      'FEEDBACK_CATEGORIES', 'DEFAULT_EVENT_BATCH_PERIOD_SECONDS',
      'ConversationLogDataService', 'DELAY_STYLE_CHANGES',
      function(
          $scope, $interval, $timeout, $location, CookieStorageService,
          SolutionHandlerService, QuestionDataService, LANGUAGE_PYTHON,
          FeedbackObjectFactory, EventHandlerService, LocalStorageService,
          ServerHandlerService, SessionIdService,
          UnpromptedFeedbackManagerService, MonospaceDisplayModalService,
          SECONDS_TO_MILLISECONDS, CODE_CHANGE_DEBOUNCE_SECONDS,
          DISPLAY_AUTOSAVE_TEXT_SECONDS, SERVER_URL, DEFAULT_QUESTION_ID,
          FEEDBACK_CATEGORIES, DEFAULT_EVENT_BATCH_PERIOD_SECONDS,
          ConversationLogDataService, DELAY_STYLE_CHANGES) {

        $scope.ConversationLogDataService = ConversationLogDataService;
        $scope.MonospaceDisplayModalService = MonospaceDisplayModalService;

        var KEY_CODE_ENTER = 13;

        var ARIA_LIVE_MESSAGE_RANDOM_ID_RANGE = 10000;
        var ARIA_LIVE_MESSAGE_TIMEOUT_MILLISECONDS = 2000;
        var ARIA_LIVE_MESSAGE_CODEMIRROR_CONTAINER_FOCUSED = (
          'Press Enter to access the code editor.');
        var ARIA_LIVE_MESSAGE_CODEMIRROR_ENTERED = (
          'Press Escape to exit the code editor.');

        /**
         * Name of the class for styling highlighted syntax errors.
         *
         * @type {string}
         * @constant
         */
        var CSS_CLASS_SYNTAX_ERROR = 'tie-syntax-error-line';

        /**
         * Sets a local variable language to the value of the constant
         * LANGUAGE_PYTHON.
         *
         * @type {string}
         */
        var language = LANGUAGE_PYTHON;

        var THEME_NAME_LIGHT = 'Light Theme';
        var THEME_NAME_DARK = 'Dark Theme';

        /**
         * Defines the accepted UI Themes for the editor.
         *
         * @type {Array}
         */
        $scope.themes = [
          {themeName: THEME_NAME_LIGHT},
          {themeName: THEME_NAME_DARK}
        ];

        /**
         * The ARIA alert message to show temporarily, as well as a random
         * integer generated to uniquely identify when it was first shown. When
         * the time comes for the message to be removed, the random identifier
         * is used to verify first that the removed message matches the
         * originally-added one.
         *
         * @type {string}
         */
        $scope.ariaLiveMessage = {
          text: '',
          randomIdentifier: -1
        };

        /**
         * The currently-selected theme name.
         *
         * @type {Object}
         */
        $scope.currentThemeName = THEME_NAME_LIGHT;

        /**
         * Defines if the code's editor is rendered in the UI.
         *
         * @type {boolean}
         */
        $scope.codeEditorIsShown = true;

        /**
         * We use an object here to prevent the child scope introduced by ng-if
         * from shadowing the parent scope.
         *
         * See http://stackoverflow.com/a/21512751
         * .
         * @type {{code: string}}
         */
        $scope.editorContents = {
          code: ''
        };

        // The privacy modal is not displayed by default.
        $scope.privacyModalIsDisplayed = false;

        // Whether to show the more accessible version of the CodeMirror
        // editor. "Accessible mode" is triggered by the user tabbing to the
        // editor.
        $scope.accessibleMode = false;

        /**
         * Stores a promise for the $interval process that automatically
         * retriggers the codeChangeEvent, so that that process can be
         * cancelled later.
         *
         * @type {Promise|null}
         */
        $scope.codeChangeLoopPromise = null;

        /**
         * String to store the code being cached.
         *
         * @type {string}
         */
        var cachedCode;

        /**
         * Stores the feedback to be shown when the user completes a question.
         *
         * @type {Feedback}
         */
        var congratulatoryFeedback = FeedbackObjectFactory.create(
          FEEDBACK_CATEGORIES.SUCCESSFUL, true);

        /**
         * Stores the current question that the user is working on.
         *
         * @type {Question|*}
         */
        var question = null;

        /**
         * Array of Task objects that stores the tasks that the user must
         * complete for the current question.
         *
         * @type {Array}
         */
        var tasks = null;

        /**
         * Stores the index of the task that the user is currently trying to
         * complete.
         *
         * @type {number}
         */
        var currentTaskIndex = null;

        /**
         * Stores the `div` node from the DOM where the question instructions
         * and feedback will be rendered.
         *
         * @type {DOM}
         */
        var questionWindowDiv =
            document.getElementsByClassName('tie-question-window')[0];

        /**
         * Shows an aria-live message alert for 2 seconds.
         *
         * @param {string} message The message to show.
         */
        var showAriaLiveMessage = function(messageText) {
          var randomInt = Math.random(ARIA_LIVE_MESSAGE_RANDOM_ID_RANGE);
          $scope.ariaLiveMessage.text = messageText;
          $scope.ariaLiveMessage.randomIdentifier = randomInt;
          $timeout(function() {
            if ($scope.ariaLiveMessage.randomIdentifier === randomInt) {
              $scope.ariaLiveMessage.text = '';
              $scope.ariaLiveMessage.randomIdentifier = -1;
            }
          }, ARIA_LIVE_MESSAGE_TIMEOUT_MILLISECONDS);
        };

        $scope.onVisibilityChange = function() {
          // When a user changes tabs (or comes back), add a SessionPause
          // or SessionResumeEvent, respectively.
          var hiddenAttributeName = (
            $scope.determineHiddenAttributeNameForBrowser());
          if (hiddenAttributeName !== null && tasks !== null &&
              tasks.length > currentTaskIndex) {
            if ($scope.isDocumentHidden(hiddenAttributeName)) {
              EventHandlerService.createSessionPauseEvent(
                tasks[currentTaskIndex].getId());
            } else {
              EventHandlerService.createSessionResumeEvent(
                tasks[currentTaskIndex].getId());
            }
          }
        };

        // Move document[hiddenAttributeName] getter into function for testing.
        $scope.isDocumentHidden = function(hiddenAttributeName) {
          return document[hiddenAttributeName];
        };

        // Move document.hidden getter into function for testing.
        $scope.getHiddenAttribute = function() {
          return document.hidden;
        };

        // Move document.msHidden getter into function for testing.
        $scope.getMsHiddenAttribute = function() {
          return document.msHidden;
        };

        // Move document.webkitHidden getter into function for testing.
        $scope.getWebkitHiddenAttribute = function() {
          return document.webkitHidden;
        };

        /**
         * Different browsers call the "hidden" attribute different things.
         * This method determines what the current browser calls its "hidden"
         * attribute and returns it.
         */
        $scope.determineHiddenAttributeNameForBrowser = function() {
          if (typeof $scope.getHiddenAttribute() !== 'undefined') {
            // Opera 12.10 and Firefox 18 and later support
            return 'hidden';
          } else if (typeof $scope.getMsHiddenAttribute() !== 'undefined') {
            return 'msHidden';
          } else if (typeof $scope.getWebkitHiddenAttribute() !== 'undefined') {
            return 'webkitHidden';
          }
          return null;
        };

        $scope.determineVisibilityChangeAttributeNameForBrowser = function() {
          // Handle page visibility change
          if (typeof $scope.getHiddenAttribute() !== 'undefined') {
            // Opera 12.10 and Firefox 18 and later support
            return 'visibilitychange';
          } else if (typeof $scope.getMsHiddenAttribute() !== 'undefined') {
            return 'msvisibilitychange';
          } else if (
            typeof $scope.getWebkitHiddenAttribute() !== 'undefined') {
            return 'webkitvisibilitychange';
          }
          // This should never happen, as hiddenAttributeName relies on the same
          // criteria to be non-null.
          return null;
        };

        $scope.setEventListenerForVisibilityChange = function() {
          var hiddenAttributeName = (
            $scope.determineHiddenAttributeNameForBrowser());
          if (typeof document.addEventListener === 'undefined' ||
            hiddenAttributeName === null) {
            // Browser either doesn't support addEventListener or
            // the Page Visibility API.
          } else {
            var visibilityChange = (
              $scope.determineVisibilityChangeAttributeNameForBrowser());
            if (visibilityChange !== null) {
              document.addEventListener(
                visibilityChange, $scope.onVisibilityChange, false);
            }
          }
        };

        $scope.setEventListenerForVisibilityChange();

        /**
         * Shows the privacy modal on click.
         */
        $scope.onPrivacyClick = function() {
          $scope.privacyModalIsDisplayed = true;
        };

        /**
         * Triggers the SendEventBatch method on an interval defined by
         * DEFAULT_EVENT_BATCH_PERIOD_SECONDS.
         */
        if (ServerHandlerService.doesServerExist()) {
          $interval(function() {
            EventHandlerService.sendCurrentEventBatch();
          }, DEFAULT_EVENT_BATCH_PERIOD_SECONDS * SECONDS_TO_MILLISECONDS);
        }

        /**
         * Loads the feedback, tasks, and stored code and initializes
         * the event services.
         */
        var initQuestionData = function(questionId) {
          tasks = question.getTasks();
          UnpromptedFeedbackManagerService.reset(tasks);
          currentTaskIndex = 0;
          cachedCode = LocalStorageService.loadStoredCode(
            questionId, language);
          $scope.title = question.getTitle();
          $scope.editorContents.code = (
            cachedCode || question.getStarterCode(language));
          var loadedFeedbackParagraphs = LocalStorageService.loadLatestFeedback(
            questionId, language);
          if (loadedFeedbackParagraphs) {
            ConversationLogDataService.addFeedbackBalloon(
              loadedFeedbackParagraphs);
          }

          $scope.instructions = tasks[currentTaskIndex].getInstructions();
          $scope.previousInstructions = [];
          EventHandlerService.init(
            SessionIdService.getSessionId(), $scope.currentQuestionId,
            QuestionDataService.getQuestionVersion());
          EventHandlerService.createQuestionStartEvent();
          EventHandlerService.createTaskStartEvent(
            tasks[currentTaskIndex].getId());
        };

        /**
         * Initializes the appropriate values in $scope for the question
         * instructions, stored code, starter code and feedback.
         *
         * @param {string} questionId ID of question whose data will be loaded
         */
        $scope.loadQuestion = function(questionId) {
          // The pulseAnimationEnabled var is set to false to prevent balloon
          // pulse animation when switching from light to dark mode and
          // vise versa. This is set to false in resetCode.
          $scope.pulseAnimationEnabled = true;
          SessionIdService.resetSessionId();
          if (SERVER_URL) {
            QuestionDataService.getQuestionAsync(questionId).then(
              function(response) {
                question = response;
                initQuestionData(questionId);
              },
              function() {
                $scope.loadQuestion(DEFAULT_QUESTION_ID);
              }
            );
          } else {
            question = QuestionDataService.getQuestion(questionId);
            if (!question) {
              question = QuestionDataService.getQuestion(DEFAULT_QUESTION_ID);
            }
            initQuestionData(questionId);
          }
        };

        /**
         * Highlights the syntax errors in the coding UI
         *
         * @param {number} lineNumber
         */
        var highlightLine = function(lineNumber) {
          var actualLineNumber = lineNumber - 1;
          var codeLines = document.querySelectorAll('.CodeMirror-line');
          // This check is needed in cases where the code is something like
          // "def methodName(s):". The syntax error refers to the follow-up
          // line (since the function declaration has no body), but that line
          // is empty so we can't highlight it.
          if (actualLineNumber < codeLines.length) {
            codeLines[actualLineNumber].classList.add(CSS_CLASS_SYNTAX_ERROR);
          }
        };

        /**
         * Clears all highlight from syntax errors in the coding UI
         */
        var clearAllHighlights = function() {
          var codeLines = document.querySelectorAll('.' +
            CSS_CLASS_SYNTAX_ERROR);
          for (var i = 0; i < codeLines.length; i++) {
            codeLines[i].classList.remove(CSS_CLASS_SYNTAX_ERROR);
          }
        };

        /**
         * Displays congratulations when the question is complete.
         * Also sends a QuestionCompleteEvent to the backend.
         */
        $scope.completeQuestion = function() {
          congratulatoryFeedback.clear();
          congratulatoryFeedback.appendTextParagraph(
              "Good work! You've completed this question.");
          congratulatoryFeedback.appendImageParagraph('congrats_cake.gif');
          congratulatoryFeedback.appendTextParagraph(
              "(You can continue to submit additional answers, if you wish.)");

          LocalStorageService.storeLatestFeedback(
              $scope.currentQuestionId,
              congratulatoryFeedback.getParagraphs(),
              language);

          ConversationLogDataService.addFeedbackBalloon(
            congratulatoryFeedback.getParagraphs());
          EventHandlerService.createQuestionCompleteEvent();
        };

        /**
         * Sets the feedback to the appropriate text according to the feedback
         * passed into the function.
         *
         * @param {Feedback} feedback
         * @param {string} code
         */
        $scope.setFeedback = function(feedback, code) {
          EventHandlerService.createCodeSubmitEvent(
            tasks[currentTaskIndex].getId(),
            feedback.getParagraphsAsListOfDicts(),
            feedback.getFeedbackCategory(), code);

          if (feedback.isAnswerCorrect()) {
            // If the feedback is correct, create a TaskCompleteEvent first.
            EventHandlerService.createTaskCompleteEvent(
              tasks[currentTaskIndex].getId());
            if (question.isLastTask(currentTaskIndex)) {
              $scope.completeQuestion();
            } else {
              $scope.showNextTask();
            }
          } else {
            var feedbackParagraphs = feedback.getParagraphs();
            for (var i = 0; i < feedbackParagraphs.length; i++) {
              clearAllHighlights();
              if (feedbackParagraphs[i].isErrorParagraph()) {
                highlightLine(feedbackParagraphs[i].getErrorLineNumber());
                break;
              }
            }
            ConversationLogDataService.addFeedbackBalloon(feedbackParagraphs);
            LocalStorageService.storeLatestFeedback(
              $scope.currentQuestionId, feedbackParagraphs, language);
          }

          // Skulpt processing happens outside an Angular context, so
          // $scope.$apply() is needed to force a DOM update.
          if (!ServerHandlerService.doesServerExist()) {
            $scope.$apply();
          }
          $scope.scrollToTopOfFeedbackWindow();
        };

        /**
         * Sets the UI theme to the theme passed in as a parameter.
         *
         * @param {string} newTheme
         */
        $scope.changeTheme = function(newTheme) {
          $scope.pulseAnimationEnabled = false;
          if (newTheme === THEME_NAME_DARK) {
            $scope.isInDarkMode = true;
            $scope.codeMirrorOptions.theme = 'material';
          }
          if (newTheme === THEME_NAME_LIGHT) {
            $scope.isInDarkMode = false;
            $scope.codeMirrorOptions.theme = 'default';
          }
          $timeout(function() {
            $scope.pulseAnimationEnabled = true;
          }, DELAY_STYLE_CHANGES);
        };

        /**
         * Provides the URL to the appropriately themed python primer file.
         */
        $scope.getPythonPrimerUrl = function() {
          var primerTheme = $scope.isInDarkMode ? 'dark' : 'light';
          return '../docs/py-primer-' + primerTheme + '.html';
        };

        /**
         * Stores the CodeMirror editor instance.
         */
        var codemirrorEditorInstance = null;

        /**
         * Returns a copy of the options that are needed to run codeMirror
         * correctly.
         *
         * @param {boolean} enableAccessibility Whether to return the
         * configuration that is optimized for accessible usage.
         */
        var getCodemirrorOptions = function(enableAccessibility) {
          var basicOptions = {
            autofocus: true,
            extraKeys: {
              Tab: function(cm) {
                var spaces = Array(cm.getOption('indentUnit') + 1).join(' ');
                cm.replaceSelection(spaces);
                // Move the cursor to the end of the selection.
                var endSelectionPos = cm.getDoc().getCursor('head');
                cm.getDoc().setCursor(endSelectionPos);
              },
              Esc: function() {
                document.getElementsByClassName(
                  'tie-codemirror-container')[0].focus();
              }
            },
            indentUnit: 4,
            lineNumbers: true,
            matchBrackets: true,
            mode: LANGUAGE_PYTHON,
            onLoad: function(editorInstance) {
              codemirrorEditorInstance = editorInstance;
            },
            smartIndent: true,
            tabSize: 4,
            tabindex: -1,
            theme: 'default'
          };

          if (enableAccessibility) {
            // Note that this option cannot be changed while the CodeMirror
            // instance is running. This mode has some disadvantages for
            // sighted users, e.g. mouse highlighting in the CodeMirror area is
            // not visible.
            basicOptions.inputStyle = 'contenteditable';
            basicOptions.autofocus = false;
          }

          return angular.copy(basicOptions);
        };

        $scope.codeMirrorOptions = getCodemirrorOptions(false);
        $scope.accessibleCodeMirrorOptions = getCodemirrorOptions(true);

        $scope.onKeypressCodemirrorContainer = function(evt) {
          if (evt.keyCode === KEY_CODE_ENTER) {
            // Enter key is pressed.
            evt.preventDefault();
            evt.stopPropagation();
            if (codemirrorEditorInstance) {
              codemirrorEditorInstance.focus();
              showAriaLiveMessage(ARIA_LIVE_MESSAGE_CODEMIRROR_ENTERED);
            }
          }
        };

        $scope.onFocusCodemirrorContainer = function() {
          $scope.accessibleMode = true;
          showAriaLiveMessage(ARIA_LIVE_MESSAGE_CODEMIRROR_CONTAINER_FOCUSED);
        };

        /**
         * Sets the question window to scroll to the top.
         */
        $scope.scrollToTopOfFeedbackWindow = function() {
          questionWindowDiv.scrollTop = 0;
        };

        /**
         * Changes the UI to show the next task and its instructions for the
         * given question.
         */
        $scope.showNextTask = function() {
          currentTaskIndex++;
          $scope.previousInstructions.push($scope.instructions);
          $scope.instructions = tasks[currentTaskIndex].getInstructions();

          ConversationLogDataService.clear();
          EventHandlerService.createTaskStartEvent(
            tasks[currentTaskIndex].getId());
        };

        /**
         * Calls the processes necessary to start the code submission process.
         *
         * @param {string} code
         */
        $scope.submitCode = function(code) {
          MonospaceDisplayModalService.hideModal();
          ConversationLogDataService.addCodeBalloon(code);

          // Gather all tasks from the first one up to the current one.
          var orderedTasks = tasks.slice(0, currentTaskIndex + 1);
          SolutionHandlerService.processSolutionAsync(
            orderedTasks, question.getStarterCode(language),
            code, question.getAuxiliaryCode(language), language
          ).then(function(feedback) {
            $scope.setFeedback(feedback, code);
          });

          storeCodeAndUpdateCachedCode(
            $scope.currentQuestionId, code, language);
        };

        /**
         * Clears the cached code stored in local storage and resets the
         * question to its original state.
         */
        $scope.resetCode = function() {
          LocalStorageService.clearLocalStorageCode(
            $scope.currentQuestionId, language);
          LocalStorageService.clearLocalStorageFeedback(
            $scope.currentQuestionId, language);
          EventHandlerService.createCodeResetEvent();
          $scope.loadQuestion($scope.currentQuestionId);
        };

        /**
         * Clears the feedback in the window, and deletes the feedback
         * from local storage for the current question.
         */
        $scope.resetFeedback = function() {
          ConversationLogDataService.clear();
          LocalStorageService.clearLocalStorageFeedback(
            $scope.currentQuestionId, language);
        };

        /**
         * Displays a notification for the given number of seconds to let the
         * user know their code has been autosaved.
         *
         * @param {number} displaySeconds
         */
        var triggerAutosaveNotification = function(displaySeconds) {
          $scope.autosaveTextIsDisplayed = true;
          $timeout(function() {
            $scope.autosaveTextIsDisplayed = false;
          }, displaySeconds * SECONDS_TO_MILLISECONDS);
        };

        /**
         * Called when a user code change is detected, with a minimum time of
         * CODE_CHANGE_DEBOUNCE_SECONDS between intervals.
         */
        $scope.onCodeChange = function() {
          if ($scope.codeChangeLoopPromise === null) {
            $scope.codeChangeLoopPromise = $interval(function() {
              if (angular.equals(cachedCode, $scope.editorContents.code)) {
                // No code change, stop the onCodeChange loop.
                $interval.cancel($scope.codeChangeLoopPromise);
                $scope.codeChangeLoopPromise = null;
                return;
              }

              // Code change detected. Actually do the operations that should
              // be triggered by a code change, such as autosaving.
              $scope.autosaveCode();

              // Check for unprompted feedback to add to the feedback log.
              var potentialFeedbackParagraphs = (
                UnpromptedFeedbackManagerService.runTipsCheck(
                  language, $scope.editorContents.code,
                  tasks[currentTaskIndex].getId()));
              if (potentialFeedbackParagraphs !== null) {
                // Note that, for simplicity, unprompted feedback is currently
                // not persisted in local storage.
                ConversationLogDataService.addFeedbackBalloon(
                  potentialFeedbackParagraphs);
              }
            }, CODE_CHANGE_DEBOUNCE_SECONDS * SECONDS_TO_MILLISECONDS);
          }
        };

        /**
         * Saves the user's code to the browser's local storage.
         */
        $scope.autosaveCode = function() {
          if (!LocalStorageService.isAvailable()) {
            return;
          }
          storeCodeAndUpdateCachedCode(
            $scope.currentQuestionId,
            $scope.editorContents.code,
            language);
          triggerAutosaveNotification(DISPLAY_AUTOSAVE_TEXT_SECONDS);
        };

        /**
         * Stores the user's code to local storage and the cachedCode variable.
         *
         * @param {string} questionId
         * @param {string} code
         * @param {string} lang
         */
        var storeCodeAndUpdateCachedCode = function(questionId, code, lang) {
          LocalStorageService.storeCode(questionId, code, lang);
          cachedCode = code;
        };

        $scope.autosaveTextIsDisplayed = false;
        // If there isn't a specified qid, use the default. If there is one,
        // but it doesn't exist, use the default.
        $scope.currentQuestionId = (
          $location.search().qid || DEFAULT_QUESTION_ID);
        $scope.loadQuestion($scope.currentQuestionId);

        // If server version, and the user has not accepted the privacy policy,
        // show them the privacy modal.
        if (SERVER_URL) {
          var privacyPolicyAccepted = CookieStorageService.hasPrivacyCookie();
          if (!privacyPolicyAccepted) {
            $scope.privacyModalIsDisplayed = true;
          }
        }
      }
    ]
  };
}]);
