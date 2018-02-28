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
 * @fileoverview Directive for showing output snippets.
 */

tie.directive('outputSnippet', [function() {
  return {
    restrict: 'E',
    scope: {
      getContent: '&content'
    },
    template: `
      <div class="output-toggle-container">
        You can click on
        <a href ng-click="openOutputModal()" ng-if="!isModalOpen()"">this link</a>
        <span ng-if="isModalOpen()">this link</span>
        to display the output. We recommend that you do not rely on this.
      </div>
      <style>
        output-snippet .output-toggle-container {
          padding-bottom: 15px;
        }
        output-snippet .disabled-link {
          color: #ccc;
          pointer-events: none;
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
         * Array of strings used to represent the output snippet lines to be
         * presented in the UI.
         *
         * @type {Array}
         */
        $scope.snippetLines = [];

        /**
         * Represents whether user code output is being shown or not.
         *
         * @type {boolean}
         */
        $scope.outputIsShown = false;

        /**
         * Opens a modal with the printed output.
         */
        $scope.openOutputModal = function() {
          MonospaceDisplayModalService.showModal(
            'Code Output', $scope.snippetLines);
        };

        /**
         * Used to change the output snippet shown when the feedback changes.
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
