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
              <div class="tie-question-window"
                  ng-show="!MonospaceDisplayModalService.isDisplayed()">
                <div class="tie-question-container"
                    ng-class="{'tie-theme-set': isTieThemeSet}">
                  <h3 class="tie-question-title">{{title}}</h3>
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
                  <div class="tie-dot-container" ng-class="{'tie-display-dots': ConversationLogDataService.isNewBalloonPending()}"}>
                    <div class="tie-dot tie-dot-1"></div>
                    <div class="tie-dot tie-dot-2"></div>
                    <div class="tie-dot tie-dot-3"></div>
                  </div>
                  <speech-balloons-container></speech-balloons-container>
                </div>
              </div>
              <div class="tie-question-window tie-monospace-modal-container"
                  ng-show="MonospaceDisplayModalService.isDisplayed()">
                <monospace-display-modal title="title" content="content">
                </monospace-display-modal>
              </div>
              <select class="tie-select-menu" name="theme-select"
                  ng-change="changeTheme(theme)" ng-model="theme"
                  ng-options="i.themeName as i.themeName for i in themes">
                <option style="display: none" value="">Theme</option>
              </select>
            </div>
            <div class="tie-coding-ui">
              <div class="tie-lang-terminal">
                <div class="tie-coding-terminal">
                  <div class="tie-next-curtain-container"
                      ng-if="nextButtonIsShown">
                    <div class="tie-next-curtain"></div>
                    <div class="tie-arrow-highlighter"></div>
                    <div ng-click="showNextTask()" class="tie-next-arrow">
                      <span class="tie-next-button-text">Next</span>
                    </div>
                  </div>
                  <div ng-if="codeEditorIsShown"
                      class="tie-codemirror-container">
                    <ui-codemirror ui-codemirror-opts="codeMirrorOptions"
                        ng-model="editorContents.code"
                        ng-change="onCodeChange()"
                        class="protractor-test-code-input">
                    </ui-codemirror>
                  </div>
                </div>
                <select ng-if="SERVER_URL" class="tie-select-menu"
                    name="lang-select-menu">
                  <option value="Python" selected>Python</option>
                </select>
                <button ng-if="!SERVER_URL"
                    class="tie-python-primer tie-button">
                  <a class="tie-primer-link" target="_blank"
                      ng-href="{{getPythonPrimerUrl()}}">New to python?</a>
                </button>
                <button class="tie-code-reset tie-button protractor-test-reset-code-btn"
                    name="code-reset"
                    ng-click="resetCode()">
                  Reset Code
                </button>
                <div class="tie-code-auto-save"
                    ng-show="autosaveTextIsDisplayed">
                  Saving code...
                </div>
                <button class="tie-run-button tie-button tie-button-green"
                    ng-class="{'active': !nextButtonIsShown}"
                    ng-click="submitCode(editorContents.code)"
                    ng-disabled="nextButtonIsShown">
                  I think I&#39m done
                </button>
                <button class="tie-run-button tie-button tie-button-blue protractor-test-run-code-btn"
                    ng-class="{'active': !nextButtonIsShown}"
                    ng-click="submitCode(editorContents.code)"
                    ng-disabled="nextButtonIsShown">
                  Check my code
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
              </ul>
            </div>
          </div>
        </div>
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
          padding: 1px 6px;
          width: 100px;
        }
        .tie-button:hover {
          border: 1px solid #e4e4e4;
        }
        .tie-button-blue {
          background-color: rgb(110, 150, 190);
          color: #ffffff;
        }
        .tie-button-blue:hover {
          background-color: rgb(50, 133, 190);
          border: 1px solid rgb(42, 112, 232);
        }
        .night-mode .tie-button-blue {
          background-color: rgb(70, 90, 110);
          color: #ffffff;
        }
        .night-mode .tie-button-blue:hover {
          background-color: rgb(85, 115, 150);
        }
        .tie-button-green {
          background-color: rgb(110, 150, 90);
          color: #ffffff;
        }
        .tie-button-green:hover {
          background-color: rgb(50, 133, 90);
          border: 1px solid rgb(42, 112, 132);
        }
        .night-mode .tie-button-green {
          background-color: rgb(70, 90, 10);
          color: #ffffff;
        }
        .night-mode .tie-button-green:hover {
          background-color: rgb(85, 115, 50);
        }
        .tie-button-red {
          background-color: #ef5350;
          color: #ffffff;
        }
        .tie-button-red:hover {
          background-color: #f44336;
          border: 1px solid #e53935;
        }
        .tie-code-auto-save {
          font-family: Roboto, 'Helvetica Neue', 'Lucida Grande', sans-serif;
          float: left;
          margin-top: 10px;
          margin-left: 10px;
        }
        .night-mode .tie-code-auto-save {
          color: #E0E0E0;
        }
        .tie-code-reset, .tie-python-primer {
          float: left;
          margin-top: 10px;
        }
        .night-mode .tie-code-reset, .night-mode .tie-python-primer {
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
        .tie-next-arrow {
          border-bottom: 50px solid transparent;
          border-left: 75px solid rgb(0, 165, 0);
          border-top: 50px solid transparent;
          cursor: pointer;
          height: 0;
          left: calc(50% - 20px);
          position: absolute;
          top: calc(50% - 50px);
          width: 0;
        }
        .tie-next-arrow:hover {
          border-left: 75px solid rgb(32, 142, 64);
        }
        .tie-next-arrow:active {
          border-left: 75px solid rgb(16, 128, 32);
        }
        .tie-next-button-text {
          color: white;
          font-family: Roboto, 'Helvetica Neue', 'Lucida Grande', sans-serif;
          font-size: 16px;
          right: -36px;
          padding-left: 2px;
          position: absolute;
          top: calc(50% - 12px);
          vertical-align: middle;
          width: 100px;
        }
        .tie-next-curtain {
          background-color: rgb(200, 200, 200);
          height: 100%;
          opacity: 0.5;
          width: 100%;
        }
        .tie-next-curtain-container {
          height: 100%;
          position: absolute;
          top: 0;
          width: 100%;
          z-index: 4;
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
          color: black;
          text-decoration: none;
        }
        .night-mode .tie-primer-link {
          color: white;
        }
        .tie-privacy-button {
          float: right;
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
          color: rgb(66, 133, 244);
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
          margin-top: 10px;
          position: relative;
        }
        .tie-run-button:hover {
          box-shadow: inset 0 1px 2px rgba(0,0,0.3);
        }
        .tie-run-button:active {
          background-color: rgb(42, 112, 232);
          border: 1px solid rgb(32, 100, 200);
          box-shadow: inset 0 1px 2px rgba(0,0,0.3);
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
        @-webkit-keyframes tie-dot {
          from { -webkit-transform: translate(0px, 0px); }
          10%  { -webkit-transform: translate(0px, -10px); }
          20%  { -webkit-transform: translate(0px, 0px); }
          to   { -webkit-transform: translate(0px, 0px); }
        }
        .tie-dot {
          -webkit-animation-name: tie-dot;
          -webkit-animation-duration: 1.5s;
          -webkit-animation-iteration-count: infinite;
          background-color: black;
          border-radius: 2px;
          float: left;
          height: 4px;
          margin-right: 7px;
          margin-top: 3px;
          width: 4px;
        }
        .tie-dot-container {
          display: inline-block;
          height: 10px;
          opacity: 0;
          padding-left: 5px;
        }
        .night-mode .tie-dot {
          background-color: #E0E0E0;
        }
        .tie-dot-2 {
          -webkit-animation-delay: 0.1s;
        }
        .tie-dot-3 {
          -webkit-animation-delay: 0.2s;
        }
        .tie-display-dots {
          opacity: 1;
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
      'ConversationLogDataService',
      function(
          $scope, $interval, $timeout, $location, CookieStorageService,
          SolutionHandlerService, QuestionDataService, LANGUAGE_PYTHON,
          FeedbackObjectFactory, EventHandlerService, LocalStorageService,
          ServerHandlerService, SessionIdService,
          UnpromptedFeedbackManagerService, MonospaceDisplayModalService,
          SECONDS_TO_MILLISECONDS, CODE_CHANGE_DEBOUNCE_SECONDS,
          DISPLAY_AUTOSAVE_TEXT_SECONDS, SERVER_URL, DEFAULT_QUESTION_ID,
          FEEDBACK_CATEGORIES, DEFAULT_EVENT_BATCH_PERIOD_SECONDS,
          ConversationLogDataService) {

        $scope.ConversationLogDataService = ConversationLogDataService;

        /**
         * Array of strings containing the ids of the allowed question sets.
         *
         * @type {Array}
         * @constant
         */
        var ALLOWED_QUESTION_SET_IDS = ['strings', 'other', 'all'];

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
         * @type: {string}
         */
        var language = LANGUAGE_PYTHON;
        // TODO(sll): Generalize this to dynamically select a question set
        // based on user input.
        /**
         * String of the id of the current question set of that in the user is
         * working in.
         *
         * @type {string}
         */
        var questionSetId = 'strings';

        /**
         * Array of strings identifying the Ids of the accepted question sets
         * used in TIE.
         *
         * @type {Array}
         */
        $scope.questionSetIds = [];
        // Sets $scope.questionSetIds to the values in ALLOWED_QUESTION_SET_IDS
        ALLOWED_QUESTION_SET_IDS.forEach(function(id) {
          var dict = {questionSetId: id};
          $scope.questionSetIds.push(dict);
        });

        /**
         * Defines the accepted UI Themes for the editor.
         *
         * @type {Array}
         */
        $scope.themes = [
          {themeName: 'Light'},
          {themeName: 'Dark'}
        ];

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
         * Stores the feedback to be shown when the user completes the entire
         * question set.
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

        $scope.MonospaceDisplayModalService = MonospaceDisplayModalService;

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
         * Initializes the appropriate values in $scope for the question
         * instructions, stored code, starter code and feedback.
         *
         * @param {string} questionId ID of question whose data will be loaded
         */
        $scope.loadQuestion = function(questionId) {
          $scope.isTieThemeSet = true;

          SessionIdService.resetSessionId();
          question = QuestionDataService.getQuestion(questionId);
          tasks = question.getTasks();
          UnpromptedFeedbackManagerService.reset(tasks);

          currentTaskIndex = 0;
          cachedCode = LocalStorageService.loadStoredCode(
            questionId, language);
          $scope.title = question.getTitle();
          $scope.editorContents.code = (
            cachedCode || question.getStarterCode(language));
          ConversationLogDataService.clear();
          var loadedFeedbackParagraphs = LocalStorageService.loadLatestFeedback(
            questionId, language);
          if (loadedFeedbackParagraphs) {
            ConversationLogDataService.addFeedbackBalloon(
              loadedFeedbackParagraphs);
          }

          $scope.instructions = tasks[currentTaskIndex].getInstructions();
          $scope.previousInstructions = [];
          $scope.nextButtonIsShown = false;
          EventHandlerService.init(
            SessionIdService.getSessionId(), $scope.currentQuestionId,
            QuestionDataService.getQuestionVersion());
          EventHandlerService.createQuestionStartEvent(
            SessionIdService.getSessionId(), $scope.currentQuestionId,
            QuestionDataService.getQuestionVersion());
          EventHandlerService.createTaskStartEvent(
            SessionIdService.getSessionId(), $scope.currentQuestionId,
            QuestionDataService.getQuestionVersion(),
            tasks[currentTaskIndex].getId());
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
          congratulatoryFeedback.appendTextParagraph(
              'Click the "Next" button to the right to proceed to the ' +
              'next question.');
          $scope.nextButtonIsShown = true;

          ConversationLogDataService.addFeedbackBalloon(
            congratulatoryFeedback.getParagraphs());
          EventHandlerService.createQuestionCompleteEvent(
            SessionIdService.getSessionId(), $scope.currentQuestionId,
            QuestionDataService.getQuestionVersion());
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
            SessionIdService.getSessionId(),
            feedback.getParagraphsAsListOfDicts(),
            feedback.getFeedbackCategory(), code);

          if (feedback.isAnswerCorrect()) {
            if (question.isLastTask(currentTaskIndex)) {
              $scope.completeQuestion();
            } else {
              $scope.showNextTask();
            }
          } else {
            var feedbackParagraphs = feedback.getParagraphs();
            for (var i = 0; i < feedbackParagraphs.length; i++) {
              clearAllHighlights();
              if (feedbackParagraphs[i].isSyntaxErrorParagraph()) {
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
          $scope.isTieThemeSet = false;
          if (newTheme === 'Dark') {
            $scope.isInDarkMode = true;
            $scope.codeMirrorOptions.theme = 'material';
          }
          if (newTheme === 'Light') {
            $scope.isInDarkMode = false;
            $scope.codeMirrorOptions.theme = 'default';
          }
          $timeout(function() {
            $scope.isTieThemeSet = true;
          }, 0);
        };

        /**
         * Provides the URL to the appropriately themed python primer file.
         */
        $scope.getPythonPrimerUrl = function() {
          var primerTheme = $scope.isInDarkMode ? 'dark' : 'light';
          return '../docs/py-primer-' + primerTheme + '.html';
        };

        /**
         * Initializes the questionSet property of $scope to be a new question
         * set with the id given in newQuestionSetId.
         *
         * @param {string} newQuestionSetId
         */
        $scope.initQuestionSet = function(newQuestionSetId) {
          QuestionDataService.initCurrentQuestionSet(newQuestionSetId);
          $scope.questionSet = QuestionDataService.getCurrentQuestionSet(
            newQuestionSetId);
          $scope.autosaveTextIsDisplayed = false;
          // If there isn't a specified qid, use the default. If there is one,
          // but it doesn't exist, use the default.
          $scope.currentQuestionId =
            $location.search().qid || DEFAULT_QUESTION_ID;
          try {
            $scope.loadQuestion($scope.currentQuestionId);
          } catch (Error) {
            $scope.loadQuestion(DEFAULT_QUESTION_ID);
          }
        };

        /**
         * Sets the options that are needed to run codeMirror correctly.
         *
         * @type {{autofocus: boolean, extraKeys: {Tab: Tab},
         *    indentUnit: number, lineNumbers: boolean, matchBrackets: boolean,
         *    mode: *, smartIndent: boolean, tabSize: number, theme: string}}
         */
        $scope.codeMirrorOptions = {
          autofocus: true,
          extraKeys: {
            Tab: function(cm) {
              var spaces = Array(cm.getOption('indentUnit') + 1).join(' ');
              cm.replaceSelection(spaces);
              // Move the cursor to the end of the selection.
              var endSelectionPos = cm.getDoc().getCursor('head');
              cm.getDoc().setCursor(endSelectionPos);
            }
          },
          indentUnit: 4,
          lineNumbers: true,
          matchBrackets: true,
          mode: LANGUAGE_PYTHON,
          smartIndent: true,
          tabSize: 4,
          theme: 'default'
        };

        /**
         * Sets the question window to scroll to the top.
         */
        $scope.scrollToTopOfFeedbackWindow = function() {
          questionWindowDiv.scrollTop = 0;
        };

        /**
         * Changes the UI to show the next task and its instructions for the
         * given question. If the user just finished the last task, then
         * it shows a congratulatory alert.
         */
        $scope.showNextTask = function() {
          EventHandlerService.createTaskCompleteEvent(
            SessionIdService.getSessionId(), $scope.currentQuestionId,
            QuestionDataService.getQuestionVersion(),
            tasks[currentTaskIndex].getId());
          if (question.isLastTask(currentTaskIndex)) {
            // TODO(talee): Flesh this out some more.
            alert('Congratulations, you have finished!');
          } else {
            currentTaskIndex++;
            $scope.previousInstructions.push($scope.instructions);
            $scope.instructions = tasks[currentTaskIndex].getInstructions();
            $scope.nextButtonIsShown = false;

            ConversationLogDataService.clear();
            EventHandlerService.createTaskStartEvent(
              SessionIdService.getSessionId(), $scope.currentQuestionId,
              QuestionDataService.getQuestionVersion(),
              tasks[currentTaskIndex].getId());
          }
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
          EventHandlerService.createCodeResetEvent(
            SessionIdService.getSessionId());
          $scope.loadQuestion($scope.currentQuestionId);
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

        $scope.initQuestionSet(questionSetId);

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
