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
 * @fileoverview Directive for the modal.
 */

tie.directive('modal', [function() {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      show: '=',
      title: '@',
    },
    template: `
      <div class="tie-modal" ng-show="show" ng-click="closeModal()">
        <div class="tie-modal-content" ng-click="$event.stopPropagation();">
          <h1 class="tie-modal-title">{{title}}</h1>
          <p ng-transclude></p>
          <div class="tie-modal-button-container">
            <button class="tie-button-blue tie-modal-button" ng-click="closeModal()">
              <span>Accept</span>
            </button>
            <button class="tie-button-red tie-modal-button" ng-click="closeModal()">
              <span>Reject</span>
            </button>
          </div>
          <div class="tie-modal-option">
            <input type="checkbox"></input>
            <span> This is a shared computer, don't save my response. </span>
          </div>
        </div>
      </div>
      <style>
        .tie-modal {
          background-color: rgb(0, 0, 0);
          background-color: rgba(0, 0, 0, 0.4);
          height: 100%;
          left: 0;
          overflow: auto;
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 4;
        }
        .tie-modal-button {
          border-radius: 4px;
          border-style: none;
          cursor: pointer;
          font-family: Roboto, 'Helvetica Neue', 'Lucida Grande', sans-serif;
          font-size: 14px;
          height: 50px;
          padding: 1px 6px;
          width: 180px;
        }
        .tie-modal-button-container {
          display: flex;
          justify-content: space-around;
          padding: 15px 0px;
        }
        .tie-modal-content {
          background-color: white;
          border: 1px solid #969696;
          border-radius: 10px;
          box-shadow: 0px 5px 20px 2px #797979;
          margin: 15% auto;
          padding: 20px;
          text-align: center;
          width: 30%;
          z-index: 5;
        }
        .tie-modal-content p {
          font-size: 16px;
          color: #7b7b7b;
        }
        .tie-modal-option {
          display: inline-block;
        }

        .tie-modal-title {
          font-size: 24px;
          font-weight: 600;
        }
      </style>
    `,
    link: function(scope) {
      /**
       * Sets the scope variable `show` to false to hide modal.
       */
      scope.closeModal = function() {
        scope.show = false;
      };
    }
  };
}]);
