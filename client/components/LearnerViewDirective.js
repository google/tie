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
                  {{paragraph.getContent()}}
                </p>
              </div>
            </div>
            <div class="tie-coding-window">
              <div class="tie-lang-terminal">
                <div class="tie-coding-terminal">
                  <ui-codemirror ui-codemirror="codeMirrorOptions"
                      ng-model="code"
                      class="tie-codemirror-container">
                  </ui-codemirror>
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
                  <div ng-click="showNextPrompt()" class="tie-next-arrow">
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
        .CodeMirror-scroll > .CodeMirror-gutters {
          z-index: 1;
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
          border-bottom: 42px solid transparent;
          border-left: 52px solid rgb(32, 142, 64);
          border-top: 42px solid transparent;
          cursor: pointer;
          height: 0;
          left: calc(50% - 20px);
          position: absolute;
          top: calc(50% - 44px);
          width: 0;
        }
        .tie-next-button-text {
          color: white;
          font-family: Roboto, 'Helvetica Neue', 'Lucida Grande', sans-serif;
          font-size: 16px;
          left: calc(50% - 50px);
          padding-left: 2px;
          position: absolute;
          top: calc(50% - 12px);
          vertical-align: middle;
          width: 100px;
        }
        .tie-next-curtain {
          background-color: rgb(100, 100, 100);
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
        .tie-run-button:active {
          box-shadow: inset 0 1px 2px rgba(0,0,0.3);
          background-color: rgb(56, 123, 244);
          border: 1px solid rgb(42, 112, 232);
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
        congratulatoryFeedback.appendTextParagraph(
          "Good work! You've completed this task.");
        congratulatoryFeedback.appendTextParagraph(
          "Now, take a look at the instructions for the next task.");

        QuestionDataService.initCurrentQuestionSet(questionSetId);
        var questionSet = QuestionDataService.getCurrentQuestionSet(
          questionSetId);
        $scope.currentQuestionIndex = 0;


        $scope.questionIds = questionSet.getQuestionIds();
        $scope.questionsCompletionStatus = [];
        for (var i = 0; i < $scope.questionIds.length; i++) {
          $scope.questionsCompletionStatus.push(false);
        }


        var question = null;
        var prompts = null;
        var currentPromptIndex = null;

        var loadQuestion = function(questionId, introParagraphs) {
          question = QuestionDataService.getQuestion(questionId);
          prompts = question.getPrompts();
          currentPromptIndex = 0;
          $scope.title = question.getTitle();
          $scope.code = question.getStarterCode(language);
          $scope.instructions = prompts[currentPromptIndex].getInstructions();
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
          $scope.feedbackTimestamp = (
            '[' + (new Date()).toLocaleTimeString() + ']');
          if (feedback.isAnswerCorrect()) {
            if (question.isLastPrompt(currentPromptIndex)) {
              $scope.nextButtonIsShown = true;
              $scope.questionsCompletionStatus[$scope.currentQuestionIndex] = true;
            } else {
              $scope.showNextPrompt();
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
          smartIndent: false,
          tabSize: 4
        };

        $scope.showNextPrompt = function() {
          if (question.isLastPrompt(currentPromptIndex)) {
            $scope.currentQuestionIndex++;
            if ($scope.currentQuestionIndex >= $scope.questionIds.length) {
              // TODO(sll): This needs to be fleshed out.
              alert('Congratulations, you have finished!');
              return;
            }
            var questionId = $scope.questionIds[$scope.currentQuestionIndex];
            loadQuestion(questionId, NEXT_QUESTION_INTRO_FEEDBACK);
          } else {
            currentPromptIndex++;
            $scope.previousInstructions.push($scope.instructions);
            $scope.instructions = prompts[currentPromptIndex].getInstructions();
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
          SolutionHandlerService.processSolutionAsync(
            prompts[currentPromptIndex], code,
            question.getAuxiliaryCode(language), language
          ).then(setFeedback);
        };

        loadQuestion(
          questionSet.getFirstQuestionId(),
          questionSet.getIntroductionParagraphs());
      }
    ]
  };
}]);
