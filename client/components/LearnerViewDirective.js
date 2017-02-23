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
      <div id="tie-exercise-ui-outer" class="tie-exercise-ui-outer">
        <div id="tie-exercise-ui-inner" class="tie-exercise-ui-inner">
          <div id="tie-question-ui" class="tie-question-ui">
            <div id="tie-question-window" class="tie-question-window">
              <h3>{{title}}</h3>
              <div class="tie-previous-instructions">
                <div ng-repeat="previousInstruction in previousInstructions track by $index">
                  <p ng-repeat="paragraph in previousInstruction track by $index">
                    {{paragraph}}
                  </p>
                  <hr>
                </div>
              </div>
              <div id="tie-instructions" class="tie-instructions">
                <p ng-repeat="paragraph in instructions">
                  {{paragraph}}
                </p>
              </div>
            </div>
            <button ng-click="showNextPrompt()" ng-if="nextButtonIsShown"
                id="tie-next-button" class="tie-next-button">Next</button>
            </button>
          </div>
          <div id="tie-coding-ui" class="tie-coding-ui">
            <div id="tie-feedback-window" class="tie-feedback-window">
              <div id="tie-feedback" class="tie-feedback">
                <p ng-repeat="paragraph in feedbackMessages track by $index"
                    class="tie-feedback-paragraph">
                  {{paragraph}}
                </p>
              </div>
            </div>
            <div id="tie-coding-window" class="tie-coding-window">
              <div id="tie-lang-terminal" class="tie-lang-terminal">
                <div id="tie-coding-terminal" class="tie-coding-terminal">
                  <ui-codemirror ui-codemirror="codeMirrorOptions" ng-model="code" class="tie-codemirror-container"></ui-codemirror>
                </div>
                <select id="tie-lang-select-menu" class="tie-lang-select-menu"
                    name="lang-select-menu">
                  <option value="Python" selected>Python</option>
                  <option value="JavaScript">JavaScript</option>
                </select>
                <button id="tie-run-button" class="tie-run-button"
                    ng-class="tie-{'active': !nextButtonIsShown}"
                    ng-click="submitCode(code)"
                    ng-disabled="nextButtonIsShown">
                  Run
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>
        body {
          font-family: Roboto, 'Helvetica Neue', 'Lucida Grande', sans-serif;
          font-size: 15px;
          background-color: rgb(242, 242, 242);
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
          display: inherit;
        }
        .tie-coding-terminal, .tie-question-window {
          background-color: rgb(255, 255, 255);
          border-color: rgb(222, 222, 222);
          border-radius: 3px;
          border-style: solid;
          border-width: 1px;
          -webkit-font-smoothing: antialiased;
        }
        .tie-coding-terminal:focus, .tie-lang-select-menu:focus, .tie-run-button:focus {
          outline: 0;
        }
        .tie-coding-ui, .tie-question-ui {
          display: inline-block;
          margin: 8px;
        }
        .tie-exercise-ui-inner {
          padding-left: 32px;
          padding-right: 32px;
        }
        .tie-exercise-ui-outer {
          display: table;
          margin-left: auto;
          margin-right: auto;
          margin-top: 32px;
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
        .tie-lang-select-menu {
          float: left;
          margin-top: 10px;
        }
        .tie-lang-terminal {
          display: inline;
        }
        .tie-next-button {
          background-color: rgb(32, 142, 64);
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
      </style>
    `,
    controller: [
      '$scope', 'SolutionHandlerService', 'QuestionDataService',
      'LANGUAGE_PYTHON',
      function(
          $scope, SolutionHandlerService, QuestionDataService,
          LANGUAGE_PYTHON) {
        var language = LANGUAGE_PYTHON;
        var question = QuestionDataService.getData();
        var prompts = question.getPrompts();
        var currentPromptIndex = 0;
        var feedbackDiv = document.getElementById('tie-feedback');
        var tieInstructionsDiv = document.getElementById('tie-instructions');

        var clearFeedback = function() {
          $scope.feedbackMessages = [];
        };

        var appendFeedback = function(feedback) {
          $scope.feedbackMessages.push(feedback.getMessage());
          if (feedback.isAnswerCorrect()) {
            $scope.nextButtonIsShown = true;
          }
          // Skulpt processing happens outside an Angular context, so
          // $scope.$apply() is needed to force a DOM update.
          $scope.$apply();
          feedbackDiv.lastElementChild.scrollIntoView();
        };

        $scope.codeMirrorOptions = {
          autofocus: true,
          lineNumbers: true,
          mode: LANGUAGE_PYTHON,
          smartIndent: false,
          tabSize: 4
        };

        $scope.showNextPrompt = function() {
          if (question.isLastPrompt(currentPromptIndex)) {
            // TODO(sll): This is a placeholder; fix it.
            alert('PLACEHOLDER: This should load the next question.');
          } else {
            currentPromptIndex++;
            $scope.previousInstructions.push($scope.instructions);
            $scope.instructions = prompts[currentPromptIndex].getInstructions();
            $scope.nextButtonIsShown = false;
            // TODO (johnmunoz): DOM not yet updated; is there a better way
            // than using a timeout?
            window.setTimeout(
                function() {
                  tieInstructionsDiv.lastElementChild.scrollIntoView();
                }, 0);
            clearFeedback();
          }
        };

        $scope.submitCode = function(code) {
          SolutionHandlerService
            .processSolutionAsync(prompts[currentPromptIndex], code, language)
            .then(appendFeedback);
        };

        clearFeedback();
        $scope.title = question.getTitle();
        $scope.code = question.getStarterCode(language);
        $scope.instructions = prompts[currentPromptIndex].getInstructions();
        $scope.previousInstructions = [];
        $scope.nextButtonIsShown = false;
      }
    ]
  };
}]);
