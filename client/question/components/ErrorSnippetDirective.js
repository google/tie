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
 * @fileoverview Directive for showing syntax and runtime error snippets.
 */

tie.directive('errorSnippet', [function() {
  return {
    restrict: 'E',
    scope: {
      getContent: '&content'
    },
    template: `
      <div>
        <p>
          If you cannot figure out the problem, you can click on
          <a href ng-click="openSyntaxErrorModal()" ng-if="!isModalOpen()">this link</a>
          <span ng-if="isModalOpen()">this link</span>
          to display the error message.
        </p>
      </div>
      <div class="error-container" ng-show="syntaxErrorIsShown">
        <span ng-repeat="line in snippetLines">
          <span class="snippet-line">{{line}}</span>
          <br>
        </span>
      </div>
      <style>
        syntax-error-snippet .error-container {
          background: #333;
          color: #eee;
          font-family: monospace;
          font-size: 12px;
          margin-top: 10px;
          padding: 2px 10px;
          width: 95%;
        }
        syntax-error-snippet .snippet-line {
          color: #ef9a9a;
          line-height: 24px;
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

        /**
         * Array of strings used to represent the code snippet lines to be
         * presented in the UI.
         *
         * @type {Array}
         */
        $scope.snippetLines = [];

        /**
         * Represents whether a syntax error is being shown or not.
         *
         * @type {boolean}
         */
        $scope.syntaxErrorIsShown = false;

        /**
         * Opens a modal with the syntax error.
         */
        $scope.openSyntaxErrorModal = function() {
          MonospaceDisplayModalService.showModal(
            'Error Message', $scope.snippetLines);
        };

        /**
         * Used to change the code snippet shown when the feedback changes.
         */
        $scope.$watch($scope.getContent, function(newValue) {
          // Replace spaces by non-breaking spaces so that multiple spaces do
          // not get collapsed into a single one.
          var htmlFormattedContent = newValue.replace(/ /g, '\u00A0');
          $scope.snippetLines = htmlFormattedContent.split('\n');
        });
      }
    ]
  };
}]);
