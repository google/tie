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
        <div class="tie-instructions">
          <p ng-repeat="instruction in instructions">
            {{instruction}}
          </p>
        </div>
      </div>

      <div class="tie-learner-view-right-column">
        <textarea class="tie-coding-window" ng-model="code"></textarea>

        <button type="button" class="tie-button-submit-code" ng-click="submitCode(code)">
          Run
        </button>

        <div class="tie-output">
          <div class="tie-output-text">
            {{feedback}}
          </div>
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

        .tie-instructions {
          font-family: 'noto sans', Arial, Sans-Serif;
          font-size: 0.85em;
        }

        .tie-coding-window {
          background: #ffffff;
          border: 1px solid #cccccc;
          color: #222222;
          height: 400px;
          width: 100%;
        }

        .tie-button-submit-code {
          background: #4285f4;
          border: 0;
          color: #ffffff;
          cursor: pointer;
          float: right;
          margin: 10px 0;
          padding: 10px 24px;
          text-transform: uppercase;
        }

        .tie-output {
          background: #000000;
          color: #00ff4e;
          display: inline-block;
          font: 0.8em Consolas, 'Courier New';
          height: 200px;
          width: 100%;
        }

        .tie-output-text {
          padding: 5px;
        }
      </style>
    `,
    controller: [
      '$scope', 'SolutionBrokerService', 'QuestionDataService',
      'LANGUAGE_PYTHON',
      function(
          $scope, SolutionBrokerService, QuestionDataService,
          LANGUAGE_PYTHON) {
        var question = QuestionDataService.getData();
        var prompts = question.getPrompts();

        var currentPrompt = prompts[0];
        $scope.title = question.getTitle();
        $scope.instructions = currentPrompt.getInstructions();
        $scope.feedback = '';

        var setFeedback = function(feedback) {
          $scope.feedback = feedback;
          // Skulpt processing happens outside an Angular context, so
          // $scope.$apply() is needed to force a DOM update.
          $scope.$apply();
        };

        $scope.submitCode = function(code) {
          SolutionBrokerService
            .processSolutionAsync(question, code, LANGUAGE_PYTHON)
            .then(setFeedback);
        };
      }
    ]
  };
}]);
