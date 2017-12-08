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
 * @fileoverview Directive for the modal displaying monospaced code/error
 * messages.
 */

tie.directive('monospaceDisplayModal', [function() {
  return {
    restrict: 'E',
    scope: {},
    template: `
      <div class="tie-monospace-modal-container">
        <header>
          <div class="tie-monospace-modal-table-cell tie-monospace-modal-title">
            {{title}}
          </div>
        </header>
        <div class="tie-monospace-modal-body">
          <div class="tie-monospace-modal-table-cell tie-monospace-modal-content-container">
            <div class="tie-monospace-modal-content">
              <div ng-repeat="line in contentLines track by $index">
                {{line}}
              </div>
            </div>
          </div>
        </div>
        <footer>
          <div class="tie-monospace-modal-table-cell tie-monospace-modal-action-button-container">
            <button class="tie-button-blue tie-monospace-modal-action-button"
                    ng-click="closeModal()">
              <span>Close</span>
            </button>
          </div>
        </footer>
      </div>

      <style>
        monospace-display-modal .tie-monospace-modal-container {
          display: table;
          margin: 0;
          height: 100%;
          width: 100%;
        }
        monospace-display-modal header,
        monospace-display-modal .tie-monospace-modal-body,
        monospace-display-modal footer {
          display: table-row;
        }
        monospace-display-modal header, monospace-display-modal footer {
          background: #eee;
        }
        .night-mode monospace-display-modal header,
        .night-mode monospace-display-modal footer {
          background: #444;
          color: #ccc;
        }

        monospace-display-modal .tie-monospace-modal-table-cell {
          display: table-cell;
          padding: 10px;
        }

        monospace-display-modal .tie-monospace-modal-title {
          font-size: 18px;
          font-weight: bold;
          text-align: center;
        }
        monospace-display-modal .tie-monospace-modal-content-container {
          background: #fff;
          color: #111;
          font-family: monospace;
          /* This should match the font-size and font-family in the coding area. */
          font-size: 13px;
          height: 100%;
          position: relative;
        }
        .night-mode monospace-display-modal .tie-monospace-modal-content-container {
          background: #333a42;
          color: #eee;
        }
        monospace-display-modal .tie-monospace-modal-content {
          bottom: 0;
          left: 0;
          overflow: auto;
          padding: 10px;
          position: absolute;
          right: 0;
          top: 0;
        }
        monospace-display-modal .tie-monospace-modal-action-button-container {
          height: 18px;
          position: relative;
        }
        monospace-display-modal .tie-monospace-modal-action-button {
          border-radius: 4px;
          border-style: none;
          bottom: 6px;
          cursor: pointer;
          font-family: Roboto, 'Helvetica Neue', 'Lucida Grande', sans-serif;
          font-size: 14px;
          height: 24px;
          padding: 1px 6px;
          position: absolute;
          right: 18px;
          width: 60px;
        }
      </style>
    `,
    controller: [
      '$scope', '$window', 'MonospaceDisplayModalService',
      function($scope, $window, MonospaceDisplayModalService) {
        MonospaceDisplayModalService.registerCallback(function() {
          $scope.title = MonospaceDisplayModalService.getTitle();
          $scope.contentLines = MonospaceDisplayModalService.getContentLines();
        });

        /**
         *  Close the modal.
         */
        $scope.closeModal = function() {
          MonospaceDisplayModalService.hideModal();
        };
      }
    ]
  };
}]);
