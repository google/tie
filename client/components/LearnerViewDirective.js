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
            <div class="tie-step-container-outer">
              <div class="tie-step-container-inner">
                <div class="tie-step-item"
                    ng-repeat="questionId in questionIds track by $index"
                    ng-click="navigateToQuestion($index)">
                  <div class="tie-step-circle" ng-class="{'tie-step-active': currentQuestionIndex === $index, 'tie-step-unlocked': questionsCompletionStatus[$index]}">
                    <span class="tie-step-text", ng-show="!questionsCompletionStatus[$index]">{{$index + 1}}</span>
                    <span class="tie-step-checkmark", ng-show="questionsCompletionStatus[$index]">&#10004;</span>
                  </div>
                  <div ng-class="{'tie-step-line': $index < (questionIds.length - 1)}"></div>
                </div>
              </div>
            </div>
            <div class="tie-question-ui">
              <div class="tie-question-window" ng-class="{'night-mode': isInDarkMode}">
                <div class="tie-greetings">
                  <p ng-repeat="paragraph in greetingParagraphs track by $index">
                      {{paragraph.getContent()}}
                  </p>
                </div>
                <h3 class="tie-question-title">{{title}}</h3>
                <div class="tie-previous-instructions">
                  <div ng-repeat="previousInstruction in previousInstructions track by $index">
                    <div ng-repeat="instruction in previousInstruction track by $index">
                      <p ng-if="instruction.type == 'text'">{{instruction.content}}</p>
                      <pre class="tie-question-code" ng-class="{'night-mode': isInDarkMode}" ng-if="instruction.type == 'code'">{{instruction.content}}</pre>
                    </div>
                    <hr>
                  </div>
                </div>
                <div class="tie-instructions">
                  <div ng-repeat="instruction in instructions">
                    <p ng-if="instruction.type == 'text'">{{instruction.content}}</p>
                    <pre class="tie-question-code" ng-class="{'night-mode': isInDarkMode}" ng-if="instruction.type == 'code'">{{instruction.content}}</pre>
                  </div>
                </div>
                <div>
                  <div class="tie-feedback" ng-class="{'tie-most-recent-feedback':$last}" ng-repeat="set in feedbackStorage track by $index">
                    <hr>
                    <p ng-if="set.feedbackParagraphs" ng-repeat="paragraph in set.feedbackParagraphs track by $index"
                        class="tie-feedback-paragraph"
                        ng-class="{'tie-feedback-paragraph-code': paragraph.isCodeParagraph()}">
                      <span ng-if="paragraph.isTextParagraph()">
                        {{paragraph.getContent()}}
                      </span>
                      <span ng-if="paragraph.isCodeParagraph()">
                        <code-snippet content="paragraph.getContent()"></code-snippet>
                      </span>
                      <span ng-if="paragraph.isSyntaxErrorParagraph()">
                        <syntax-error-snippet content="paragraph.getContent()"
                                              on-state-change="scrollToBottomOfFeedbackWindow()">
                        </syntax-error-snippet>
                      </span>
                    </p>
                  </div>
                  <div class="tie-reinforcement">
                    <li ng-repeat="bullet in reinforcementBullets">
                      <img class="tie-bullet-img" ng-src="images/{{bullet.getImgName()}}">
                      <span class="tie-bullet-text">{{bullet.getContent()}}</span>
                    </li>
                  </div>
                  <div class="tie-dot-container" ng-if="loadingIndicatorIsShown">
                    <div class="tie-dot tie-dot-1" ng-class="{'night-mode': isInDarkMode}"></div>
                    <div class="tie-dot tie-dot-2" ng-class="{'night-mode': isInDarkMode}"></div>
                    <div class="tie-dot tie-dot-3" ng-class="{'night-mode': isInDarkMode}"></div>
                  </div>
                  <br>
                </div>
              </div>
              <select class="tie-select-menu" name="question-set-select"
                      ng-class="{'night-mode': isInDarkMode}"
                      ng-change="changeQuestionSet(currentQuestionSetId)" ng-model="currentQuestionSetId"
                      ng-options="i.questionSetId as i.questionSetId for i in questionSetIds">
                <option style="display: none" value="">Question Set</option>
              </select>
              <select class="tie-select-menu" name="theme-select"
                      ng-class="{'night-mode': isInDarkMode}"
                      ng-change="changeTheme(theme)" ng-model="theme"
                      ng-options="i.themeName as i.themeName for i in themes">
                <option style="display: none" value="">Theme</option>
              </select>
            </div>
            <div class="tie-coding-ui">
              <div class="tie-lang-terminal">
                <div class="tie-coding-terminal">
                  <div class="tie-next-curtain-container" ng-if="nextButtonIsShown">
                    <div class="tie-next-curtain"></div>
                    <div class="tie-arrow-highlighter"></div>
                    <div ng-click="showNextTask()" class="tie-next-arrow">
                      <span class="tie-next-button-text">Next</span>
                    </div>
                  </div>
                  <div ng-if="codeEditorIsShown" class="tie-codemirror-container">
                    <ui-codemirror ui-codemirror-opts="codeMirrorOptions"
                                   ng-model="editorContents.code"
                                   ng-change="autosave()"
                                   class="protractor-test-code-input">
                    </ui-codemirror>
                  </div>
                </div>
                <select class="tie-select-menu" name="lang-select-menu" ng-class="{'night-mode': isInDarkMode}">
                  <option value="Python" selected>Python</option>
                </select>
                <button class="tie-code-reset tie-button protractor-test-reset-code-btn" name="code-reset"
                    ng-class="{'night-mode': isInDarkMode}"
                    ng-click="resetCode()">
                  Reset Code
                </button>
                <div class="tie-code-auto-save" ng-class="{'night-mode': isInDarkMode}" ng-show="autosaveTextIsDisplayed">
                  Saving code...
                </div>
                <button class="tie-run-button tie-button tie-blue protractor-test-run-code-btn"
                    ng-class="{'active': !nextButtonIsShown}"
                    ng-click="submitCode(editorContents.code)"
                    ng-disabled="nextButtonIsShown">
                  Run
                </button>
              </div>
            </div>
            <div class="tie-options-row" ng-class="{'night-mode': isInDarkMode}">
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
      <style>
        html {
          height: 100%;
          min-height: 675px;
          min-width: 1331px;
        }
        body {
          background-color: rgb(242, 242, 242);
          font-family: Roboto, 'Helvetica Neue', 'Lucida Grande', sans-serif;
          font-size: 15px;
          height: 100%;
          margin: 0px;
        }
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
          padding: 1px 6px;
          width: 100px;
        }
        .tie-button:hover {
          border: 1px solid #e4e4e4;
        }
        .tie-button.tie-blue {
          background-color: rgb(66, 133, 244);
          color: #ffffff;
        }
        .tie-button.tie-blue:hover {
          background-color: rgb(50, 120, 240);
          border: 1px solid rgb(42, 112, 232);
        }
        .tie-code-auto-save {
          font-family: Roboto, 'Helvetica Neue', 'Lucida Grande', sans-serif;
          float: left;
          margin-top: 10px;
          margin-left: 10px;
        }
        .tie-code-auto-save.night-mode {
          color: #E0E0E0;
        }
        .tie-code-reset {
          float: left;
          margin-top: 10px;
        }
        .tie-code-reset.night-mode {
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
          margin-bottom: 10px;
          margin-right: 7px;
          margin-top: 3px;
          width: 4px;
        }
        .tie-dot-container{
          height: 100%;
        }
        .tie-dot.night-mode {
          background-color: #E0E0E0;
        }
        .tie-dot-2 {
          -webkit-animation-delay: 0.1s;
        }
        .tie-dot-3 {
          -webkit-animation-delay: 0.2s;
        }
        .tie-feedback {
          opacity: .4;
          transition: all 200ms;
        }
        .tie-feedback:hover {
          opacity: 1;
          transition: all 400ms;
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
        .tie-feedback-window.night-mode {
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
        .tie-feedback-paragraph {
          width: 100%;
        }
        .tie-feedback-paragraph-code {
          background: #333;
          color: #eee;
          font-family: monospace;
          font-size: 12px;
          padding: 2px 10px;
          width: 95%;
        }
        .tie-lang-select-menu {
          float: left;
          margin-top: 10px;
        }
        .tie-lang-terminal {
          display: inline;
        }
        .tie-most-recent-feedback {
          opacity: 1;
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
        .tie-options-row.night-mode a {
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
        .tie-privacy-button {
          float: right;
        }
        .tie-reinforcement li {
          list-style: none;
          margin: 0;
          margin-top: 1px;
          position: relative;
        }
        .tie-bullet-img {
          bottom: 1px;
          height: 15px;
          position: absolute;
          width: 15px;
        }
        .tie-bullet-text {
          padding-left: 19px;
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
        .tie-question-code.night-mode {
          background: #212121;
        }
        .tie-question-code.night-mode {
          background-color: #333;
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
          padding-top: 16px;
        }
        .tie-question-window {
          background-color: #FFFFF7;
          font-size: 14px;
          height: 508px;
          overflow: auto;
          padding: 10px;
          resize: both;
          width: 548px;
        }
        .tie-question-window.night-mode {
          background-color: #333A42;
          color: #E0E0E0;
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
        .tie-select-menu.night-mode {
          background-color: #333a42;
          color: white;
        }
        .tie-step-container-inner {
          display: flex;
          margin-left: auto;
          margin-right: auto;
          text-align: center;
        }
        .tie-step-container-outer {
          display: flex;
          margin-bottom: 8px;
        }
        .tie-step-circle {
          background-color: rgb(164, 164, 164);
          border-color: rgb(222, 222, 222);
          border-radius: 20px;
          color: rgb(255, 255, 255);
          cursor: pointer;
          height: 20px;
          width: 20px;
        }
        .tie-step-item {
          display: flex;
        }
        .tie-step-item > .tie-step-active {
          background-color: rgb(42, 128, 255);
        }
        .tie-step-line {
          background-color: rgb(200, 200, 200);
          height: 1px;
          margin-bottom: auto;
          margin-left: 8px;
          margin-right: 8px;
          margin-top: auto;
          width: 128px;
        }
        .tie-step-checkmark, .tie-step-text {
          font-size: 14px;
          vertical-align: middle;
        }
        .tie-step-unlocked {
          background-color: rgb(0, 128, 0);
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
      </style>
    `,
    controller: [
      '$scope', '$interval', '$timeout', 'SolutionHandlerService',
      'QuestionDataService', 'LANGUAGE_PYTHON', 'FeedbackObjectFactory',
      'ReinforcementObjectFactory', 'LocalStorageService',
      'SECONDS_TO_MILLISECONDS', 'DEFAULT_AUTOSAVE_SECONDS',
      'DISPLAY_AUTOSAVE_TEXT_SECONDS', 'SERVER_URL',
      function(
          $scope, $interval, $timeout, SolutionHandlerService,
          QuestionDataService, LANGUAGE_PYTHON, FeedbackObjectFactory,
          ReinforcementObjectFactory, LocalStorageService,
          SECONDS_TO_MILLISECONDS, DEFAULT_AUTOSAVE_SECONDS,
          DISPLAY_AUTOSAVE_TEXT_SECONDS, SERVER_URL) {
        /**
         * Number of milliseconds for TIE to wait for system to process code
         * submission.
         *
         * @type {number}
         * @constant
         */
        var DURATION_MSEC_WAIT_FOR_SCROLL = 20;

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
         * Location where the feedback for the current question is stored.
         *
         * @type {Array}
         */
        $scope.feedbackStorage = [];

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

        /**
         * Is used to store the Autosave promise such that it can later be
         * cancelled.
         *
         * @type {Promise}
         */
        var autosaveCancelPromise;

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
        var congratulatoryFeedback = FeedbackObjectFactory.create();

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
         * Checks if the system is in browser only mode and changes the privacy
         * notice message accordingly.
         */
        $scope.onPrivacyClick = function() {
          var isBrowserOnly = !SERVER_URL;
          if (isBrowserOnly) {
            alert(["Privacy Notice:\n\n",
              "This version of the TIE application stores information, ",
              "including your code, in your browser's local storage and ",
              "does not transmit data to any server."].join(''));
          } else {
            alert(["Privacy Notice:\n\n",
              "This version of the TIE application transmits data to ",
              "our servers in order to provide you with a better coding ",
              "experience."].join(''));
          }
        };

        /**
         * Initializes the appropriate values in $scope for the question
         * instructions, stored code, starter code, feedback, and greetings.
         *
         * @param {string} questionId ID of question whose data will be loaded
         */
        var loadQuestion = function(questionId) {
          question = QuestionDataService.getQuestion(questionId);
          tasks = question.getTasks();
          currentTaskIndex = 0;
          cachedCode = LocalStorageService.loadStoredCode(
            questionId, language);
          $scope.title = question.getTitle();
          $scope.editorContents.code = (
            cachedCode || question.getStarterCode(language));
          var reinforcement = ReinforcementObjectFactory.create();
          $scope.reinforcementBullets = reinforcement.getBullets();
          $scope.feedbackStorage = [];
          var loadedFeedback =
            LocalStorageService.loadLatestFeedbackAndReinforcement(
              questionId, language);
          if (loadedFeedback) {
            $scope.feedbackStorage.push({
              feedbackParagraphs: loadedFeedback.feedbackParagraphs
            });
            $scope.reinforcementBullets =
              loadedFeedback.reinforcementBullets || [];
          }
          $scope.instructions = tasks[currentTaskIndex].getInstructions();
          $scope.previousInstructions = [];
          $scope.nextButtonIsShown = false;
          var feedback = FeedbackObjectFactory.create();
          $scope.greetingParagraphs = feedback.getParagraphs();
        };

        /**
         * Highlights the syntax errors in the coding UI
         *
         * @param {number} lineNumber
         */
        var highlightLine = function(lineNumber) {
          var actualLineNumber = lineNumber - 1;
          var codeLines = document.querySelectorAll('.CodeMirror-line');
          codeLines[actualLineNumber].classList.add(CSS_CLASS_SYNTAX_ERROR);
        };

        /**
         * Clears all highlight from syntax errors in the coding UI
         */
        var clearAllHighlights = function() {
          var codeLines = document.querySelectorAll('.' + CSS_CLASS_SYNTAX_ERROR);
          for (var i = 0; i < codeLines.length; i++) {
            codeLines[i].classList.remove(CSS_CLASS_SYNTAX_ERROR);
          }
        };

        /**
         * Sets the feedbackStorage property in the scope to be an empty array.
         */
        var clearFeedback = function() {
          $scope.feedbackStorage = [];
          $scope.reinforcementBullets = [];
        };

        /**
         * Sets the feedbackStorage property to the appropriate text according
         * to the feedback passed into the function.
         *
         * @param {Feedback} feedback
         */
        var setFeedback = function(feedback) {
          $scope.loadingIndicatorIsShown = false;
          if (feedback.isAnswerCorrect()) {
            if (question.isLastTask(currentTaskIndex)) {
              congratulatoryFeedback.clear();
              congratulatoryFeedback.appendTextParagraph(
                  "Good work! You've completed this question.");
              congratulatoryFeedback.appendTextParagraph(
                  'Click the "Next" button to the right to proceed to the ' +
                  'next question.');
              $scope.nextButtonIsShown = true;
              $scope.questionsCompletionStatus[
                $scope.currentQuestionIndex] = true;
              $scope.feedbackStorage.push(
                {
                  feedbackParagraphs: congratulatoryFeedback.getParagraphs()
                });
            } else {
              $scope.showNextTask();
            }
            $scope.feedbackParagraphs = congratulatoryFeedback.getParagraphs();
            $scope.reinforcementBullets = [];
          } else {
            var feedbackParagraphs = feedback.getParagraphs();
            var hasSyntaxError = false;
            for (var i = 0; i < feedbackParagraphs.length; i++) {
              clearAllHighlights();
              if (feedbackParagraphs[i].isSyntaxErrorParagraph()) {
                hasSyntaxError = true;
                highlightLine(feedbackParagraphs[i].getErrorLineNumber());
                break;
              }
            }
            // Updating reinforcement bullets only if no syntax errors.
            $scope.reinforcementBullets =
              hasSyntaxError ? [] : feedback.getReinforcement().getBullets();
            $scope.feedbackStorage.push({
              feedbackParagraphs: feedbackParagraphs
            });
          }

          // Skulpt processing happens outside an Angular context, so
          // $scope.$apply() is needed to force a DOM update.
          $scope.$apply();
          $scope.scrollToBottomOfFeedbackWindow();

          // Store the most recent feedback and reinforcement bullets.
          storeLatestFeedback();
        };

        /**
         * Sets the UI theme to the theme passed in as a parameter.
         *
         * @param {string} newTheme
         */
        $scope.changeTheme = function(newTheme) {
          if (newTheme === 'Dark') {
            $scope.isInDarkMode = true;
            $scope.codeMirrorOptions.theme = 'material';
          }
          if (newTheme === 'Light') {
            $scope.isInDarkMode = false;
            $scope.codeMirrorOptions.theme = 'default';
          }
        };

        /**
         * Sets the current question set to the one with the given questionId.
         *
         * @param {string} newQuestionSetId
         */
        $scope.changeQuestionSet = function(newQuestionSetId) {
          if (ALLOWED_QUESTION_SET_IDS.indexOf(newQuestionSetId) === -1) {
            return;
          }
          $scope.initQuestionSet(newQuestionSetId);
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
          $scope.currentQuestionIndex = 0;
          $scope.questionIds = $scope.questionSet.getQuestionIds();
          $scope.questionsCompletionStatus = [];
          $scope.loadingIndicatorIsShown = false;
          for (var idx = 0; idx < $scope.questionIds.length; idx++) {
            $scope.questionsCompletionStatus.push(false);
          }
          $scope.autosaveTextIsDisplayed = false;
          loadQuestion($scope.questionSet.getFirstQuestionId());
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
         * Sets the question window to scroll to the bottom.
         */
        $scope.scrollToBottomOfFeedbackWindow = function() {
          questionWindowDiv.scrollTop = questionWindowDiv.scrollHeight;
        };

        /**
         * Changes the UI to show the next task and its instructions for the
         * given question. If the user just finished the last task, then
         * it renders the next question. If the user just completed the last
         * question, then the user sees a congratulatory alert.
         */
        $scope.showNextTask = function() {
          if (question.isLastTask(currentTaskIndex)) {
            $scope.currentQuestionIndex++;
            if ($scope.currentQuestionIndex >= $scope.questionIds.length) {
              // TODO(sll): This needs to be fleshed out.
              alert('Congratulations, you have finished!');
              return;
            }
            var questionId = $scope.questionIds[$scope.currentQuestionIndex];
            loadQuestion(questionId);
          } else {
            currentTaskIndex++;
            $scope.previousInstructions.push($scope.instructions);
            $scope.instructions = tasks[currentTaskIndex].getInstructions();
            $scope.nextButtonIsShown = false;
            clearFeedback();
          }
        };

        /**
         * Changes the UI to show the question which is at the given index.
         *
         * @param {number} index
         */
        $scope.navigateToQuestion = function(index) {
          // Before the questionId is changed, save it for later use.
          var currentQuestionId =
            $scope.questionIds[$scope.currentQuestionIndex];
          $scope.currentQuestionIndex = index;
          // We need to save the code before loading so that the user will get
          // their own code back if they click on the current question.
          LocalStorageService.storeCode(
            currentQuestionId, $scope.editorContents.code, language);
          // Finally, we need to clear the undo history of the editor. This is
          // done by removing the code editor from the DOM and putting it back
          // again.
          var CODEMIRROR_HIDE_TIMEOUT_MSEC = 20;
          $scope.codeEditorIsShown = false;
          $timeout(function() {
            $scope.codeEditorIsShown = true;
            var questionId = $scope.questionIds[$scope.currentQuestionIndex];
            loadQuestion(questionId);
          }, CODEMIRROR_HIDE_TIMEOUT_MSEC);
        };

        /**
         * Calls the processes necessary to start the code submission process.
         *
         * @param {string} code
         */
        $scope.submitCode = function(code) {
          $scope.loadingIndicatorIsShown = true;
          $timeout(function() {
            $timeout(function() {
              // Tasks from the first to current.
              var orderedTasks = tasks.slice(0, currentTaskIndex + 1);
              SolutionHandlerService.processSolutionAsync(
                orderedTasks, question.getStarterCode(language),
                code, question.getAuxiliaryCode(language), language
              ).then(setFeedback);
            }, DURATION_MSEC_WAIT_FOR_SCROLL);
          }, 0);
          storeCodeAndUpdateCachedCode(
            $scope.questionIds[$scope.currentQuestionIndex], code, language);
        };

        /**
         * Clears the cached code stored in local storage and resets the
         * question to its original state.
         */
        $scope.resetCode = function() {
          var questionId = $scope.questionIds[$scope.currentQuestionIndex];
          LocalStorageService.clearLocalStorageCode(questionId, language);
          loadQuestion(questionId);
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
         * If autosave is on, this function automatically saves the user's code
         * to the browser's local storage.
         */
        $scope.autosave = function() {
          if (!LocalStorageService.isAvailable()) {
            return;
          }

          if (!$scope.autosaveOn) {
            $scope.autosaveOn = true;
            autosaveCancelPromise = $interval(function() {
              var currentQuestionId =
                $scope.questionIds[$scope.currentQuestionIndex];
              if (angular.equals(cachedCode, $scope.editorContents.code)) {
                // No code change, stop autosave loop.
                stopAutosave();
              } else {
                // Code change detected, notify user, save code,
                // update code cache and continue this loop.
                storeCodeAndUpdateCachedCode(
                  currentQuestionId, $scope.editorContents.code, language);
                triggerAutosaveNotification(DISPLAY_AUTOSAVE_TEXT_SECONDS);
              }
            }, DEFAULT_AUTOSAVE_SECONDS * SECONDS_TO_MILLISECONDS);
          }
        };

        /**
         * Sets the system to not automatically save user code.
         */
        var stopAutosave = function() {
          $scope.autosaveOn = false;
          $interval.cancel(autosaveCancelPromise);
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

        /**
         * Stores the user's latest feedback to local storage.
         */
        var storeLatestFeedback = function() {
          var latestFeedback =
            $scope.feedbackStorage[$scope.feedbackStorage.length - 1];
          LocalStorageService.storeLatestFeedbackAndReinforcement(
            $scope.questionIds[$scope.currentQuestionIndex],
            latestFeedback.feedbackParagraphs,
            $scope.reinforcementBullets,
            language);
        };

        $scope.initQuestionSet(questionSetId);
      }
    ]
  };
}]);
