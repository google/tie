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
      <div id="exercise-ui-outer">
        <div id="exercise-ui-inner">
          <div id="question-ui">
            <div id="question-window">
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
                id="next-button">Next</button>
            </button>
          </div>
          <div id="coding-ui">
            <div id="feedback-window">
              <div id="tie-feedback" class="tie-feedback">
                <p ng-repeat="paragraph in feedbackMessages track by $index"
                    class="tie-feedback-paragraph">
                  {{paragraph}}
                </p>
              </div>
            </div>
            <div id="coding-window">
              <div id="lang-terminal">
                <!--textarea name="textarea" id="coding-terminal"
                    class="terminal">
                </textarea-->
                <div id="coding-terminal" class="terminal">
                  <ui-codemirror ui-codemirror="codeMirrorOptions" ng-model="code" class="codemirror-container"></ui-codemirror>
                </div>
                <select id="lang-select-menu" name="lang-select-menu">
                  <option value="Python" selected>Python</option>
                  <option value="JavaScript">JavaScript</option>
                </select>
                <button id="run-button" class="run-button"
                    ng-class="{'active': !nextButtonIsShown}"
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
        #exercise-ui-outer {
          margin-left: auto;
          margin-right: auto;
          margin-top: 32px;
          display: table;
        }
        #exercise-ui-inner {
          padding-left: 32px;
          padding-right: 32px;
        }
        #lang-terminal {
          display: inline;
        }
        #question-ui, #coding-ui {
          display: inline-block;
          margin: 8px;
        }
        #question-ui {
          vertical-align: top;
        }
        #lang-select-menu {
          float: left;
          margin-top: 10px;
        }
        #question-window, #coding-terminal {
          background-color: rgb(255, 255, 255);
          border-style: solid;
          border-width: 1px;
          border-radius: 3px;
          border-color: rgb(222, 222, 222);
          -webkit-font-smoothing: antialiased;
        }
        #question-window {
          font-size: 14px;
          height: 508px;
          overflow: auto;
          padding: 10px;
          resize: both;
          width: 548px;
        }
        #coding-window {
          display: inherit;
        }
        #coding-terminal {
          display: flex;
          width: 662px;
          height: 368px;
          font-size: 13px;
          margin-top: 10px;
        }
        #run-button {
          position: relative;
          margin-top: 10px;
          width: 100px;
          float: right;
          font-family: Roboto, 'Helvetica Neue', 'Lucida Grande', sans-serif;
          font-size: 12px;
          cursor: pointer;
          height: 24px;
          border-radius: 4px;
          border-style: none;
          background-color: rgb(66, 133, 244);
          color: white;
        }
        #next-button {
          position: relative;
          margin-top: 10px;
          width: 100px;
          float: right;
          font-family: Roboto, 'Helvetica Neue', 'Lucida Grande', sans-serif;
          font-size: 12px;
          cursor: pointer;
          height: 24px;
          border-radius: 4px;
          border-style: none;
          background-color: rgb(32, 142, 64);
          color: white;
        }
        #feedback-window {
          background-color: rgb(255, 255, 242);
          border-style: solid;
          border-width: 1px;
          border-radius: 3px;
          border-color: rgb(222, 222, 222);
          font-size: 14px;
          height: 128px;
          overflow: auto;
          padding: 10px;
          resize: both;
          width: 642px;
          -webkit-font-smoothing: antialiased;
        }
        #lang-select-menu:focus, #coding-terminal:focus, .run-button:focus {
          outline: 0;
        }
        .run-button:active {
          box-shadow: inset 0 1px 2px rgba(0,0,0.3);
          background-color: rgb(56, 123, 244);
          border: 1px solid rgb(42, 112, 232);
        }
        .codemirror-container {
          width: 100%;
        }
        .tie-previous-instructions {
          opacity: 0.5;
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
        var feedback_div = document.getElementById('tie-feedback');
        var tie_instructions_div = document.getElementById('tie-instructions');

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
          feedback_div.lastElementChild.scrollIntoView();
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
                  tie_instructions_div.lastElementChild.scrollIntoView();
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
