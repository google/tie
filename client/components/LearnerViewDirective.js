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
      <h3>Exercise: {{title}}</h3>

      <div class="tie-learner-view-left-column">
        <div class="tie-previous-instructions">
          <div ng-repeat="previousInstruction in previousInstructions track by $index">
            <p ng-repeat="paragraph in previousInstruction track by $index">
              {{paragraph}}
            </p>
            <hr>
          </div>
        </div>
        <div class="tie-instructions">
          <p ng-repeat="paragraph in instructions">
            {{paragraph}}
          </p>
        </div>

        <button ng-if="nextButtonIsShown" class="tie-action-button active"
                ng-click="showNextPrompt()">
          Next
        </button>
      </div>

      <div class="tie-learner-view-right-column">
        <div class="tie-coding-window">
          <ui-codemirror ui-codemirror="codeMirrorOptions" ng-model="code"></ui-codemirror>
        </div>

        <button type="button" class="tie-action-button"
                ng-class="{'active': !nextButtonIsShown}"
                ng-click="submitCode(code)"
                ng-disabled="nextButtonIsShown">
          Run
        </button>

        <div class="tie-feedback">
          <p ng-repeat="paragraph in feedbackMessages track by $index"
             class="tie-feedback-paragraph">
            {{paragraph}}
          </p>
        </div>
      </div>

      <style>
        .tie-learner-view-left-column {
          float: left;
          width: 400px;
        }

        .tie-learner-view-right-column {
          margin-left: 420px;
          width: 600px;
        }

        .tie-instructions, .tie-previous-instructions {
          font-family: 'noto sans', Arial, Sans-Serif;
          font-size: 0.85em;
        }
        .tie-previous-instructions {
          opacity: 0.5;
        }

        .tie-coding-window {
          border: 1px solid #888;
          height: 300px;
          width: 100%;
        }

        .tie-action-button {
          background: #888;
          border: 0;
          color: #ffffff;
          cursor: pointer;
          float: right;
          margin: 10px 0;
          padding: 10px 24px;
          text-transform: uppercase;
        }
        .tie-action-button.active {
          background: #4285f4;
          color: #ffffff;
        }

        .tie-feedback {
          background: #ddd;
          border: 1px solid black;
          color: #000;
          display: inline-block;
          font-family: 'noto sans', Arial, Sans-Serif;
          font-size: 0.85em;
          height: 200px;
          overflow: auto;
          width: 100%;
        }

        .tie-feedback-paragraph {
          margin-top: 5px;
          padding: 0 5px;
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
