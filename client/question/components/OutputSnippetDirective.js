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
      getContent: '&content',
      onStateChange: '&onStateChange'
    },
    template: `
      <div class="output-toggle-container">
        <a href class="toggle" ng-click="toggleOutput()">
          {{outputIsShown ? 'Hide' : 'Display'}} output
        </a>
      </div>
      <div class="output-container" ng-show="outputIsShown">
        <span ng-repeat="line in snippetLines">
          <span class="snippet-line">{{line}}</span>
          <br>
        </span>
      </div>
      <style>
        output-snippet .output-container {
          background: #333;
          color: #eee;
          font-family: monospace;
          font-size: 12px;
          margin-top: 10px;
          padding: 2px 10px;
          width: 95%;
        }
        output-snippet .output-toggle-container {
          margin-top: -30px;
          padding-bottom: 15px;
        }
        output-snippet .snippet-line {
          color: #ef9a9a;
          line-height: 24px;
          word-wrap: break-word;
        }
        output-snippet .toggle {
          color: #F44336;
          display: inline-block;
          float: right;
          font-size: 12px;
          margin-right: 8px;
          text-decoration: none;
        }
        output-snippet .toggle:hover {
          text-decoration: underline;
        }
      </style>
    `,
    controller: [
      '$scope', function($scope) {
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
         * Used to switch between states of whether user code output is
         * displayed or not.
         */
        $scope.toggleOutput = function() {
          $scope.outputIsShown = !$scope.outputIsShown;
          $scope.onStateChange();
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
