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
 * @fileoverview Directive for the cards on the TIE menu page.
 */

tieMenu.directive('menuQuestionCard', [function() {
  return {
    restrict: 'E',
    scope: {
      questionId: '@'
    },
    template: `
      <div class="tie-menu-question">
        <a ng-href="../question/question.html?qid={{questionId}}">
          <div class="tie-menu-question-title">
            {{title}}
          </div>
          <div class="tie-menu-question-description">
            {{textInstructions}}
          </div>
        </a>
      </div>
      <style>
        .tie-menu-question {
          border-radius: 5px;
          margin: 20px 20px;
          width: 270px;
        }
        .tie-menu-question:hover {
          box-shadow: 0px 0px 13px 3px rgba(0,0,0,0.75);
          transition: all 0.3s cubic-bezier(.25,.8,.25,1);
        }
        .tie-menu-question a {
          text-decoration: none;
        }
        .tie-menu-question-title {
          background-color: #424242;
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
          color: white;
          font-weight: bold;
          padding: 10px 20px;
          text-align: center;
        }
        .tie-menu-question-description {
          background-color: white;
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;
          color: black;
          font-size: 14px;
          height: 144px;
          padding: 20px 20px;
          text-align: center;
        }
      </style>
    `,
    controller: ['$scope', 'QuestionDataService',
      function($scope, QuestionDataService) {
        $scope.title = QuestionDataService.getQuestionTitle($scope.questionId);
        $scope.textInstructions =
          QuestionDataService.getQuestionPreviewInstructions($scope.questionId);
      }
    ]
  };
}]);
