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
          <h1 class="tie-monospace-modal-table-cell tie-monospace-modal-title">
            {{title}}
          </h1>
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
            <button class="tie-button tie-button-blue tie-monospace-modal-action-button"
                    ng-click="closeModal()">
              <span>Dismiss</span>
            </button>
          </div>
        </footer>
      </div>

      <style>
        monospace-display-modal {
          position: absolute;
          transition: top 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
        }
        .tie-feedback-modal-displayed {
          top: 9px;
        }
        monospace-display-modal .tie-monospace-modal-container {
          border: 1px solid #d0d0d0;
          box-shadow: 0px 1px 7px #d0d0d0;
          display: table;
          height: calc(100% - 80px);
          position: absolute;
          width: calc(100% - 783px);
        }
        .night-mode monospace-display-modal .tie-monospace-modal-container {
          border-color: #505050;
          box-shadow: 0px 1px 20px #000000;
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
          font-size: 16px;
          padding: 5px;
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
          padding: 4px;
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
          font-size: 12px;
          height: 24px;
          padding: 1px 6px;
          position: absolute;
          right: 18px;
          width: 60px;
        }
      </style>
    `,
    controller: ['$scope', '$timeout', '$window',
      'MonospaceDisplayModalService', 'FEEDBACK_MODAL_HEIGHT_OFFSET',
      'FEEDBACK_MODAL_HIDE_HEIGHT_OFFSET',
      function($scope, $timeout, $window,
          MonospaceDisplayModalService, FEEDBACK_MODAL_HEIGHT_OFFSET,
          FEEDBACK_MODAL_HIDE_HEIGHT_OFFSET) {
        MonospaceDisplayModalService.registerCallback(function() {
          $scope.title = MonospaceDisplayModalService.getTitle();
          $scope.contentLines = MonospaceDisplayModalService.getContentLines();

          var questionWindowDiv =
              document.getElementsByClassName('tie-question-window')[0];
          var monospaceDisplayModalElement =
              document.getElementsByTagName('monospace-display-modal')[0];
          var modalContainerDiv = document.getElementsByClassName(
              'tie-monospace-modal-container')[0];

          var modalWidth = questionWindowDiv.offsetWidth;
          var modalHeight = questionWindowDiv.offsetHeight;
          var modalTopOffsetString =
              (modalHeight + FEEDBACK_MODAL_HEIGHT_OFFSET).toString() + 'px';
          var modalHideTopOffsetString =
              '-' + (modalHeight + FEEDBACK_MODAL_HEIGHT_OFFSET +
              FEEDBACK_MODAL_HIDE_HEIGHT_OFFSET).toString() + 'px';

          modalContainerDiv.style.width = modalWidth.toString() + 'px';
          modalContainerDiv.style.height = modalTopOffsetString;
          monospaceDisplayModalElement.style.top = modalHideTopOffsetString;

          $timeout(function() {
            monospaceDisplayModalElement.style.top = "";
            monospaceDisplayModalElement.classList.add(
                'tie-feedback-modal-displayed');
          }, 0);
        });

        /**
         *  Close the modal.
         */
        $scope.closeModal = function() {
          var questionWindowDiv =
              document.getElementsByClassName('tie-question-window')[0];
          var monospaceDisplayModalElement =
              document.getElementsByTagName('monospace-display-modal')[0];

          var modalHeight = questionWindowDiv.offsetHeight;
          var modalHideTopOffsetString =
              '-' + (modalHeight + FEEDBACK_MODAL_HEIGHT_OFFSET +
              FEEDBACK_MODAL_HIDE_HEIGHT_OFFSET).toString() + 'px';

          monospaceDisplayModalElement.style.top = modalHideTopOffsetString;
          monospaceDisplayModalElement.classList.remove(
              'tie-feedback-modal-displayed');

          $timeout(function() {
            MonospaceDisplayModalService.hideModal();
          }, 0);
        };
      }
    ]
  };
}]);
