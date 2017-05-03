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
            <div class="tie-coding-ui">
              <div class="tie-feedback-window" ng-class="{'night-mode': isInDarkMode}">
                <div class="tie-feedback">
                  <p ng-repeat="paragraph in feedbackParagraphs track by $index"
                      class="tie-feedback-paragraph"
                      ng-class="{'tie-feedback-paragraph-code': paragraph.isCodeParagraph()}">
                    <span ng-if="$first">{{feedbackTimestamp}}</span>
                    <span ng-if="paragraph.isTextParagraph()">
                      {{paragraph.getContent()}}
                    </span>
                    <span ng-if="paragraph.isCodeParagraph()">
                      <code-snippet content="paragraph.getContent()"></code-snippet>
                    </span>
                  </p>
                </div>
                <div class="tie-feedback-syntax-error">
                  <a href class="tie-feedback-syntax-error-link",
                      ng-click="toggleSyntaxErrorHint()",
                      ng-show="syntaxErrorFound">
                    {{isSyntaxErrorShown ? 'Hide error details' : 'Display error details'}}
                  </a>
                </div>
                <br>
                <span class = "tie-feedback-error-string", ng-show="isSyntaxErrorShown">
                  {{syntaxErrorString}}
                </span>
                <div class="tie-dot-container" ng-if="loadingIndicatorIsShown">
                  <div class="tie-dot tie-dot-1" ng-class="{'night-mode': isInDarkMode}"></div>
                  <div class="tie-dot tie-dot-2" ng-class="{'night-mode': isInDarkMode}"></div>
                  <div class="tie-dot tie-dot-3" ng-class="{'night-mode': isInDarkMode}"></div>
                </div>
              </div>
              <div class="tie-coding-window">
                <div class="tie-lang-terminal">
                  <div class="tie-coding-terminal">
                    <ui-codemirror ui-codemirror-opts="codeMirrorOptions"
                        ng-model="code"
                        ng-change="autosave()"
                        class="tie-codemirror-container"></ui-codemirror>
                  </div>
                  <select class="tie-lang-select-menu" name="lang-select-menu">
                    <option value="Python" selected>Python</option>
                  </select>
                  <select class="tie-question-set-select" name="question-set-select"
                          ng-change="changeQuestionSet(currentQuestionSetId)" ng-model="currentQuestionSetId"
                          ng-options="i.questionSetId as i.questionSetId for i in questionSetIds">
                    <option style="display: none" value="">Question Set</option>
                  </select>
                  <select class="tie-theme-select" name="theme-select"
                          ng-change="changeTheme(theme)" ng-model="theme"
                          ng-options="i.themeName as i.themeName for i in themes">
                    <option style="display: none" value="">Theme</option>
                  </select>
                  <button class="tie-code-reset" name="code-reset"
                      ng-click="resetCode()">
                    Reset Code
                  </button>
                  <div class="tie-code-auto-save" ng-class="{'night-mode': isInDarkMode}" ng-show="autosaveTextIsDisplayed">
                    Saving code...
                  </div>
                  <button class="tie-run-button"
                      ng-class="{'active': !nextButtonIsShown}"
                      ng-click="submitCode(code)"
                      ng-disabled="nextButtonIsShown">
                    Run
                  </button>
                  <div class="tie-next-curtain-container"
                      ng-if="nextButtonIsShown">
                    <div class="tie-next-curtain"></div>
                    <div class="tie-arrow-highlighter"></div>
                    <div ng-click="showNextTask()" class="tie-next-arrow">
                      <span class="tie-next-button-text">Next</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="tie-question-ui">
              <div class="tie-question-window" ng-class="{'night-mode': isInDarkMode}">
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
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>
        html {
          height: 100%;
          min-height: 622px;
          min-width: 1331px;
        }
        body {
          background-color: rgb(242, 242, 242);
          font-family: Roboto, 'Helvetica Neue', 'Lucida Grande', sans-serif;
          font-size: 15px;
          height: 100%;
          margin: 0px;
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
          margin-left: 5px;
          margin-top: 10px;
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
          height: 368px;
          margin-top: 10px;
          width: 662px;
        }
        .tie-coding-window {
          display: flex;
        }
        .tie-coding-terminal, .tie-question-window {
          background-color: rgb(255, 255, 255);
          -webkit-font-smoothing: antialiased;
        }
        .tie-coding-terminal:focus, .tie-lang-select-menu:focus,
            .tie-run-button:focus, .tie-question-set-select,
            .tie-theme-select:focus {
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
        .tie-dot.night-mode {
          background-color: #E0E0E0;
        }
        .tie-dot-2 {
          -webkit-animation-delay: 0.1s;
        }
        .tie-dot-3 {
          -webkit-animation-delay: 0.2s;
        }
        .tie-feedback-error-string {
          color: #FF0000;
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
          padding: 10px;
          width: 95%;
        }
        .tie-feedback, .tie-feedback-syntax-error {
          display: inline-block;
        }
        .tie-feedback-syntax-error-link {
          font-size: 12px;
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
          height: calc(100% - 10px);
          position: relative;
          top: calc(-100% + 44px);
          z-index: 2;
        }
        .tie-previous-instructions {
          opacity: 0.5;
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
          font-size: 14px;
          height: 508px;
          overflow: auto;
          padding: 10px;
          resize: both;
          width: 548px;
        }
        .tie-question-window.night-mode {
          background-color: #263238;
          color: #E0E0E0;
        }
        .tie-run-button {
          background-color: rgb(66, 133, 244);
          border-radius: 4px;
          border-style: none;
          color: white;
          cursor: pointer;
          float: right;
          font-family: Roboto, 'Helvetica Neue', 'Lucida Grande', sans-serif;
          font-size: 12px;
          height: 24px;
          margin-top: 10px;
          position: relative;
          width: 100px;
        }
        .tie-run-button:hover {
          box-shadow: inset 0 1px 2px rgba(0,0,0.3);
          background-color: rgb(50, 120, 240);
          border: 1px solid rgb(42, 112, 232);
        }
        .tie-run-button:active {
          background-color: rgb(42, 112, 232);
          border: 1px solid rgb(32, 100, 200);
          box-shadow: inset 0 1px 2px rgba(0,0,0.3);
        }
        .tie-question-set-select {
          float: left;
          margin-left: 5px;
          margin-top: 10px;
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
        .tie-theme-select {
          float: left;
          margin-left: 5px;
          margin-top: 10px;
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
      'CodeStorageService', 'SECONDS_TO_MILLISECONDS', 'DEFAULT_AUTOSAVE_SECONDS',
      'DISPLAY_AUTOSAVE_TEXT_SECONDS',
      function(
          $scope, $interval, $timeout, SolutionHandlerService,
          QuestionDataService, LANGUAGE_PYTHON, FeedbackObjectFactory,
          CodeStorageService, SECONDS_TO_MILLISECONDS, DEFAULT_AUTOSAVE_SECONDS,
          DISPLAY_AUTOSAVE_TEXT_SECONDS) {
        var DURATION_MSEC_WAIT_FOR_SCROLL = 20;
        var ALLOWED_QUESTION_SET_IDS = ['strings', 'other', 'all'];
        var language = LANGUAGE_PYTHON;
        // TODO(sll): Generalize this to dynamically select a question set
        // based on user input.
        var questionSetId = 'strings';
        $scope.questionSetIds = [];
        ALLOWED_QUESTION_SET_IDS.forEach(function(id) {
          var dict = {questionSetId: id};
          $scope.questionSetIds.push(dict);
        });
        var NEXT_QUESTION_INTRO_FEEDBACK = [
          [
            'Take a look at the next question to the right, and code your ',
            'answer below.'
          ].join('\n')
        ];

        $scope.themes = [
          {themeName: 'Light'},
          {themeName: 'Dark'}
        ];

        var autosaveCancelPromise;
        var cachedCode;
        var congratulatoryFeedback = FeedbackObjectFactory.create();
        var question = null;
        var tasks = null;
        var currentTaskIndex = null;
        var feedbackDiv =
            document.getElementsByClassName('tie-feedback-window')[0];

        var loadQuestion = function(questionId, introParagraphs) {
          question = QuestionDataService.getQuestion(questionId);
          tasks = question.getTasks();
          currentTaskIndex = 0;
          cachedCode =
            CodeStorageService.loadStoredCode(questionId, language);
          $scope.title = question.getTitle();
          $scope.code = cachedCode ?
              cachedCode : question.getStarterCode(language);
          $scope.instructions = tasks[currentTaskIndex].getInstructions();
          $scope.previousInstructions = [];
          $scope.nextButtonIsShown = false;
          var feedback = FeedbackObjectFactory.create();
          introParagraphs.forEach(function(paragraph) {
            feedback.appendTextParagraph(paragraph);
          });
          $scope.feedbackParagraphs = feedback.getParagraphs();
        };

        var clearFeedback = function() {
          $scope.feedbackTimestamp = null;
          $scope.feedbackParagraphs = [];
        };

        var hideSyntaxErrorLink = function() {
          $scope.syntaxErrorFound = false;
        };

        var setFeedback = function(feedback) {
          $scope.loadingIndicatorIsShown = false;
          feedbackDiv.scrollTop = 0;
          $scope.feedbackTimestamp = (
            '[' + (new Date()).toLocaleTimeString() + ']');
          if (feedback.isAnswerCorrect()) {
            if (question.isLastTask(currentTaskIndex)) {
              congratulatoryFeedback.clear();
              congratulatoryFeedback.appendTextParagraph(
                  "Good work! You've completed this question.");
              congratulatoryFeedback.appendTextParagraph(
                  "Click the \"Next\" button below to proceed to the next question.");
              $scope.nextButtonIsShown = true;
              $scope.questionsCompletionStatus[
                $scope.currentQuestionIndex] = true;
            } else {
              congratulatoryFeedback.clear();
              congratulatoryFeedback.appendTextParagraph(
                  "Good work! You've completed this task.");
              congratulatoryFeedback.appendTextParagraph(
                  "Now, take a look at the instructions for the next task.");
              $scope.showNextTask();
            }
            $scope.feedbackParagraphs = congratulatoryFeedback.getParagraphs();
          } else {
            var feedbackParagraphs = feedback.getParagraphs();
            // Get the index of syntax error in feedback.
            var syntaxErrorIndex = feedback.getSyntaxErrorIndex();
            // The index must be either null (indicating no syntax error)
            // or a positive integer.
            if (typeof syntaxErrorIndex === 'number' && syntaxErrorIndex > 0) {
              var syntaxErrorParagraph = feedbackParagraphs[syntaxErrorIndex];
              feedbackParagraphs.splice(syntaxErrorIndex, 1);
              $scope.syntaxErrorString = syntaxErrorParagraph.getContent();
              $scope.syntaxErrorFound = true;
            } else if (syntaxErrorIndex === null) {
              $scope.syntaxErrorString = '';
              $scope.syntaxErrorFound = false;
            }
            $scope.feedbackParagraphs = feedbackParagraphs;
          }
          // Skulpt processing happens outside an Angular context, so
          // $scope.$apply() is needed to force a DOM update.
          $scope.$apply();
        };

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

        $scope.changeQuestionSet = function(newQuestionSetId) {
          if (ALLOWED_QUESTION_SET_IDS.indexOf(newQuestionSetId) === -1) {
            return;
          }
          $scope.initQuestionSet(newQuestionSetId);
        };

        $scope.initQuestionSet = function(newQuestionSetId) {
          QuestionDataService.initCurrentQuestionSet(newQuestionSetId);
          $scope.questionSet = QuestionDataService.getCurrentQuestionSet(
            newQuestionSetId);
          $scope.currentQuestionIndex = 0;
          $scope.questionIds = $scope.questionSet.getQuestionIds();
          $scope.questionsCompletionStatus = [];
          $scope.loadingIndicatorIsShown = false;
          $scope.isSyntaxErrorShown = false;
          for (var i = 0; i < $scope.questionIds.length; i++) {
            $scope.questionsCompletionStatus.push(false);
          }
          $scope.autosaveTextIsDisplayed = false;
          loadQuestion(
            $scope.questionSet.getFirstQuestionId(),
            $scope.questionSet.getIntroductionParagraphs());
        };

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
          mode: LANGUAGE_PYTHON,
          smartIndent: true,
          tabSize: 4,
          theme: 'default'
        };

        $scope.toggleSyntaxErrorHint = function() {
          $scope.isSyntaxErrorShown = !$scope.isSyntaxErrorShown;
        };

        $scope.showNextTask = function() {
          if (question.isLastTask(currentTaskIndex)) {
            $scope.currentQuestionIndex++;
            if ($scope.currentQuestionIndex >= $scope.questionIds.length) {
              // TODO(sll): This needs to be fleshed out.
              alert('Congratulations, you have finished!');
              return;
            }
            var questionId = $scope.questionIds[$scope.currentQuestionIndex];
            loadQuestion(questionId, NEXT_QUESTION_INTRO_FEEDBACK);
          } else {
            currentTaskIndex++;
            $scope.previousInstructions.push($scope.instructions);
            $scope.instructions = tasks[currentTaskIndex].getInstructions();
            $scope.nextButtonIsShown = false;
            clearFeedback();
          }
        };

        $scope.navigateToQuestion = function(index) {
          // Before navigating to new question,
          // disable the syntax error link and content.
          hideSyntaxErrorLink();
          $scope.isSyntaxErrorShown = false;
          // Before the questionId is changed, save it for later use.
          var currentQuestionId =
            $scope.questionIds[$scope.currentQuestionIndex];
          $scope.currentQuestionIndex = index;
          var questionId = $scope.questionIds[$scope.currentQuestionIndex];
          // We need to save the code before loading so that the user will get
          // their own code back if they click on the current question.
          CodeStorageService.storeCode(currentQuestionId,
            $scope.code, language);
          loadQuestion(questionId,
            $scope.questionSet.getIntroductionParagraphs());
        };

        $scope.submitCode = function(code) {
          hideSyntaxErrorLink();
          $scope.loadingIndicatorIsShown = true;
          var additionalHeightForLoadingIndicator = 17;
          $timeout(function() {
            feedbackDiv.scrollTop = feedbackDiv.scrollHeight +
              additionalHeightForLoadingIndicator;
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

        $scope.resetCode = function() {
          var questionId = $scope.questionIds[$scope.currentQuestionIndex];
          CodeStorageService.clearLocalStorageCode(questionId, language);
          loadQuestion(questionId,
            $scope.questionSet.getIntroductionParagraphs());
        };

        var triggerAutosaveNotification = function(displaySeconds) {
          $scope.autosaveTextIsDisplayed = true;
          $timeout(function() {
            $scope.autosaveTextIsDisplayed = false;
          }, displaySeconds * SECONDS_TO_MILLISECONDS);
        };

        $scope.autosave = function() {
          if (!$scope.autosaveOn) {
            $scope.autosaveOn = true;
            autosaveCancelPromise = $interval(function() {
              var currentQuestionId =
                $scope.questionIds[$scope.currentQuestionIndex];
              if (angular.equals(cachedCode, $scope.code)) {
                // No code change, stop autosave loop.
                stopAutosave();
              } else {
                // Code change detected, notify user, save code,
                // update code cache and continue this loop.
                storeCodeAndUpdateCachedCode(
                  currentQuestionId, $scope.code, language);
                triggerAutosaveNotification(DISPLAY_AUTOSAVE_TEXT_SECONDS);
              }
            }, DEFAULT_AUTOSAVE_SECONDS * SECONDS_TO_MILLISECONDS);
          }
        };

        var stopAutosave = function() {
          $scope.autosaveOn = false;
          $interval.cancel(autosaveCancelPromise);
        };

        var storeCodeAndUpdateCachedCode = function(
          questionId, code, lang) {
          CodeStorageService.storeCode(questionId, code, lang);
          cachedCode = code;
        };

        $scope.initQuestionSet(questionSetId);
      }
    ]
  };
}]);
