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
 * @fileoverview Directive for showing code snippets.
 */

tie.directive('codeSnippet', [function() {
  return {
    restrict: 'E',
    scope: {
      getContent: '&content'
    },
    template: `
      <span ng-repeat="line in abbreviatedSnippetLines track by $index">
        <span class="tie-code-snippet-line">{{line}}</span>
        <br>
      </span>
      <span ng-if="abbreviatedSnippetLines.length <= MAX_NUM_LINES_IN_ABBREVIATED_SNIPPET">
        <a href ng-click="openCodeModal()" ng-if="!isModalOpen()">View full code</a>
        <span ng-if="isModalOpen()">View full code</span>
      </span>
      <style>
        code-snippet .tie-code-snippet-line {
          font-family: monospace;
          line-height: 16px;
          word-wrap: break-word;
        }
      </style>
    `,
    controller: [
      '$scope', 'MonospaceDisplayModalService',
      function($scope, MonospaceDisplayModalService) {
        /**
         * Function to tell whether the monospace display modal is currently
         * open.
         *
         * @type {function}
         */
        $scope.isModalOpen = MonospaceDisplayModalService.isDisplayed;

        // The maximum number of lines to show in the abbreviated code snippet.
        $scope.MAX_NUM_LINES_IN_ABBREVIATED_SNIPPET = 3;

        /**
         * Array of strings that represents the lines in the code snippets that
         * need to be shown.
         *
         * @type {Array}
         */
        $scope.snippetLines = [];

        /**
         * Array of strings that represents the abbreviated version of the
         * snippet lines.
         *
         * @type {Array}
         */
        $scope.abbreviatedSnippetLines = [];

        /**
         * Opens a modal with the full code.
         */
        $scope.openCodeModal = function() {
          MonospaceDisplayModalService.showModal(
            'Previous Code', $scope.snippetLines);
        };

        /**
         * Used to change the code snippet whenever the feedback changes.
         */
        $scope.$watch($scope.getContent, function(newValue) {
          // Replace spaces by non-breaking spaces so that multiple spaces do
          // not get collapsed into a single one.
          var htmlFormattedContent = newValue.replace(/ /g, '\u00A0');
          $scope.snippetLines = htmlFormattedContent.split('\n');

          if ($scope.snippetLines.length <=
              $scope.MAX_NUM_LINES_IN_ABBREVIATED_SNIPPET) {
            $scope.abbreviatedSnippetLines = angular.copy($scope.snippetLines);
          } else {
            $scope.abbreviatedSnippetLines = [
              $scope.snippetLines[0],
              $scope.snippetLines[1],
              '...'
            ];
          }
        });
      }
    ]
  };
}]);
