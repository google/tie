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
 * @fileoverview Directive for showing feedback when user has print statements
 * in their code submission.
 */

tie.directive('printFeedbackSnippet', [function() {
  return {
    restrict: 'E',
    scope: {
      getLogOutput: '&logOutput'
    },
    template: `
      <p class="tie-feedback-paragraph">
        We noticed that you used a print statement in your latest code submission.
        This is a gentle reminder that while this is a valid debugging method,
        you do not have this resource available to you during interviews.
      </p>
      <p class="tie-feedback-paragraph">
        If you would still like to view the output from your print statements,
        then press the toggle below.
      </p>
      <button class="tie-feedback-toggle" ng-click="onToggleClick" ng-class="{'active': outputIsShown}">Log Output</button>
      <div class="tie-code-panel" ng-show="outputIsShown">
        <p class="tie-feedback-paragraph tie-feedback-paragraph-code">
          {{logOutput}}
        </p>
      </div>
      <style>
        .tie-feedback-toggle {
          background-color: #eee;
          color: #444;
          cursor: pointer;
          padding: 18px;
          width: 100%;
          text-align: left;
          border: none;
          outline: none;
          transition: 0.4s;
        }
        .tie-feedback-toggle:hover, .tie-feedback-toggle.active {
          background-color: #ddd;
        }
        .tie-code-panel {
          padding: 5px;
          background-color: #333;
        }
      </style>
    `,
    controller: [
      '$scope', function($scope) {
        $scope.logOutput = [];
        $scope.outputIsShown = false;

        $scope.onToggleClick = function() {
          $scope.outputIsShown = !($scope.outputIsShown);
        };

        $scope.$watch($scope.getLogOutput, function(newValue) {
          var htmlFormattedContent = newValue.replace(/ /g, '\u00A0');
          $scope.logOutput = htmlFormattedContent;
        });
      }
    ]
  };
}]);
