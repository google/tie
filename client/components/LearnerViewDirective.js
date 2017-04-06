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
      <div class="tie-question-ui-outer">
        <div class="tie-question-ui-inner">
          <div class="tie-step-container-outer">
            <div class="tie-step-container-inner">
              <div class="tie-step-item"
                  ng-repeat="questionId in questionIds track by $index"
                  ng-click="navigateToQuestion($index)">
                <div class="tie-step-circle" ng-class="{'tie-step-active': currentQuestionIndex === $index, 'tie-step-unlocked': questionsCompletionStatus[$index]}">
                  <span class="tie-step-text">{{$index + 1}}</span>
                </div>
                <div ng-class="{'tie-step-line': $index < (questionIds.length - 1)}"></div>
              </div>
            </div>
          </div>
          <div class="tie-coding-ui">
            <div class="tie-feedback-window">
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
              <div class="tie-dot-container" ng-if="loadingIndicatorIsShown">
                <div class="tie-dot tie-dot-1"></div>
                <div class="tie-dot tie-dot-2"></div>
                <div class="tie-dot tie-dot-3"></div>
              </div>
            </div>
            <div class="tie-coding-window">
              <div class="tie-lang-terminal">
                <div class="tie-coding-terminal">
                  <ui-codemirror ui-codemirror-opts="codeMirrorOptions"
                      ng-model="code"
                      class="tie-codemirror-container"></ui-codemirror>
                </div>
                <select class="tie-lang-select-menu" name="lang-select-menu">
                  <option value="Python" selected>Python</option>
                </select>
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
            <div class="tie-question-window">
              <h3>Question {{currentQuestionIndex + 1}}: {{title}}</h3>
              <div class="tie-previous-instructions">
                <div ng-repeat="previousInstruction in previousInstructions track by $index">
                  <p ng-repeat="paragraph in previousInstruction track by $index">{{paragraph}}</p>
                  <hr>
                </div>
              </div>
              <div class="tie-instructions">
                <p ng-repeat="paragraph in instructions">{{paragraph}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>
        body {
          background-color: rgb(242, 242, 242);
          font-family: Roboto, 'Helvetica Neue', 'Lucida Grande', sans-serif;
          font-size: 15px;
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
          border-color: rgb(222, 222, 222);
          border-radius: 3px;
          border-style: solid;
          border-width: 1px;
          -webkit-font-smoothing: antialiased;
        }
        .tie-coding-terminal:focus, .tie-lang-select-menu:focus,
            .tie-run-button:focus {
          outline: 0;
        }
        .tie-coding-ui, .tie-question-ui {
          display: inline-block;
          margin: 8px;
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
        .tie-dot-2 {
          -webkit-animation-delay: 0.1s;
        }
        .tie-dot-3 {
          -webkit-animation-delay: 0.2s;
        }
        .tie-question-ui-inner {
          padding-left: 32px;
          padding-right: 32px;
        }
        .tie-question-ui-outer {
          display: table;
          margin-left: auto;
          margin-right: auto;
          margin-top: 16px;
        }
        .tie-feedback-window {
          background-color: rgb(255, 255, 242);
          border-color: rgb(222, 222, 222);
          border-radius: 3px;
          border-style: solid;
          border-width: 1px;
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
        .tie-question-ui {
          vertical-align: top;
        }
        .tie-question-window {
          font-size: 14px;
          height: 508px;
          overflow: auto;
          padding: 10px;
          resize: both;
          width: 548px;
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
          border-style: solid;
          border-width: 1px;
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
        .tie-step-text {
          font-size: 14px;
          vertical-align: middle;
        }
        .tie-step-unlocked {
          background-color: rgb(0, 128, 0);
        }
      </style>
    `,
    controller: [
      '$scope', '$timeout', 'SolutionHandlerService', 'QuestionDataService',
      'LANGUAGE_PYTHON', 'FeedbackObjectFactory',
      function(
          $scope, $timeout, SolutionHandlerService, QuestionDataService,
          LANGUAGE_PYTHON, FeedbackObjectFactory) {
        var DURATION_MSEC_WAIT_FOR_SCROLL = 20;
        var language = LANGUAGE_PYTHON;
        // TODO(sll): Generalize this to dynamically select a question set
        // based on user input.
        var questionSetId = 'strings';

        var NEXT_QUESTION_INTRO_FEEDBACK = [
          [
            'Take a look at the next question to the right, and code your ',
            'answer below.'
          ].join('\n')
        ];

        var congratulatoryFeedback = FeedbackObjectFactory.create();
        QuestionDataService.initCurrentQuestionSet(questionSetId);
        var questionSet = QuestionDataService.getCurrentQuestionSet(
          questionSetId);
        $scope.currentQuestionIndex = 0;
        $scope.questionIds = questionSet.getQuestionIds();
        $scope.questionsCompletionStatus = [];
        $scope.loadingIndicatorIsShown = false;
        for (var i = 0; i < $scope.questionIds.length; i++) {
          $scope.questionsCompletionStatus.push(false);
        }
        var question = null;
        var tasks = null;
        var currentTaskIndex = null;
        var feedbackDiv =
            document.getElementsByClassName('tie-feedback-window')[0];

        var loadQuestion = function(questionId, introParagraphs) {
          question = QuestionDataService.getQuestion(questionId);
          tasks = question.getTasks();
          currentTaskIndex = 0;
          $scope.title = question.getTitle();
          $scope.code = question.getStarterCode(language);
          // Check if there is any previously stored code and retrieve it.          
          if (localStorage.getItem("question_code_" + $scope.currentQuestionIndex)) {
            $scope.code = localStorage.getItem("question_code_" + $scope.currentQuestionIndex);
          }
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
            $scope.feedbackParagraphs = feedback.getParagraphs();
          }
          // Skulpt processing happens outside an Angular context, so
          // $scope.$apply() is needed to force a DOM update.
          $scope.$apply();
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
          tabSize: 4
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
          $scope.currentQuestionIndex = index;
          var questionId = $scope.questionIds[$scope.currentQuestionIndex];
          loadQuestion(questionId, questionSet.getIntroductionParagraphs());
        };

        $scope.submitCode = function(code) {
          // Store the current code every time the code is submitted.
          localStorage.setItem("question_code_" + $scope.currentQuestionIndex, code);
          $scope.loadingIndicatorIsShown = true;
          var additionalHeightForLoadingIndicator = 17;
          $timeout(function() {
            feedbackDiv.scrollTop = feedbackDiv.scrollHeight +
              additionalHeightForLoadingIndicator;
            $timeout(function() {
              SolutionHandlerService.processSolutionAsync(
                tasks[currentTaskIndex], code,
                question.getAuxiliaryCode(language), language
                ).then(setFeedback);
            }, DURATION_MSEC_WAIT_FOR_SCROLL);
          }, 0);
        };

        loadQuestion(
          questionSet.getFirstQuestionId(),
          questionSet.getIntroductionParagraphs());
      }
    ]
  };
}]);
