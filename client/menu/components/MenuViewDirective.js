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
 * @fileoverview Directive for the TIE menu view.
 */

tieMenu.directive('menuView', [function() {
  return {
    restrict: 'E',
    scope: {},
    template: `
      <div class="tie-menu-greeting">
        <div>
          Welcome to TIE (Technical Interview Exercises)!
        </div>
        <div class="tie-menu-greeting-description">
          Click below to get started on a coding exercise:
        </div>
      </div>
      <div class="tie-menu-question-list-wrapper">
        <div ng-repeat="questionId in questionIds">
          <menu-question-card question-id="{{questionId}}"></menu-question-card>
        </div>
      <div>
      <style>
        .tie-menu-greeting {
          font-size: 30px;
          padding-top: 200px;
          text-align: center;
        }
        .tie-menu-greeting-description {
          font-size: 20px;
        }
        .tie-menu-question-list-wrapper {
          align-content: flex-end;
          align-items: center;
          display: flex;
          flex-direction: row;
          justify-content: center;
          flex-flow: row wrap;
          flex-wrap: wrap;
          margin: auto;
          padding-top: 50px;
          width: 60%;
        }
      </style>
    `,
    controller: ['$scope',
      function($scope) {
        // The titles of the questions this menu page is displaying.
        $scope.questionIds = [
          'reverseWords',
          'checkBalancedParentheses',
          'findMostCommonCharacter',
          'isPalindrome',
          'internationalization',
          'runLengthEncoding'
        ];
      }
    ]
  };
}]);
