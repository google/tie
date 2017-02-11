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
 * @fileoverview Directive for the coding interface.
 */

tie.directive('codingWindow', [function() {
  return {
    restrict: 'E',
    scope: {},
    template: `
      <div class="tie-instructions">
        {{instructions}}
      </div>

      <div class="tie-coding-window">
        <textarea ng-model="code"></textarea>
        <button type="button" ng-click="submitCode(code)">Submit</button>
      </div>

      <div class="tie-feedback-window">
        {{feedback}}
      </div>

      <style>
        .tie-coding-window textarea {
          border: 1px solid #ccc;
          height: 500px;
          width: 500px;
        }
      </style>
    `,
    controller: [
      '$scope', 'SolutionBrokerService', 'QuestionDataService',
      function($scope, SolutionBrokerService, QuestionDataService) {
        var question = QuestionDataService.getData();
        $scope.instructions = question.getInitialInstructions();
        $scope.feedback = '';

        var setFeedback = function(feedback) {
          $scope.feedback = feedback;
          // Skulpt processing happens outside an Angular context, so
          // $scope.$apply() is needed to force a DOM update.
          $scope.$apply();
        };

        $scope.submitCode = function(code) {
          SolutionBrokerService
            .processSolutionAsync(question, code)
            .then(setFeedback);
        };
      }
    ]
  };
}]);
