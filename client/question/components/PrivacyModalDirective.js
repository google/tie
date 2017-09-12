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
 * @fileoverview Directive for the privacy agreement modal.
 */

tie.directive('privacyModal', [function() {
  return {
    restrict: 'E',
    scope: {
      show: '=',
      title: '@',
      isClientVersion: '='
    },
    template: `
      <div class="tie-privacy-modal" ng-show="show" ng-click="closeModal()">
        <div class="tie-privacy-modal-content" ng-click="$event.stopPropagation();">
          <h1 class="tie-privacy-modal-title">Privacy Policy</h1>
            <p ng-show="isClientVersion">
              This version of the TIE application stores information,
              including your code, in your browser's local storage and
              does not transmit data to any server.
            </p>
            <p ng-show="!isClientVersion">
              By using TIE, you agree to do so under the Google Terms of Service,
              Google's Privacy Policy. In addition, you understand and agree that by
              using our tool, you may generate computer code. Metadata about the code,
              such as how long it took to write the code and whether it performs certain
              tasks or meet certain criteria may also be created. Generated metadata and
              computer code (collectively “User Generated Code”) will be collected and
              analyzed as part of product improvement. By using TIE, you grant Google a
              worldwide license to use, host, store, and create derivative works of
              your User Generated code.
            </p>
          <div class="tie-privacy-modal-button-container">
          <button ng-show="isClientVersion" class="tie-button-blue tie-privacy-modal-button" ng-click="accept()">
              <span>Okay</span>
            </button>
            <button ng-show="!isClientVersion" class="tie-button-blue tie-privacy-modal-button" ng-click="accept()">
              <span>Accept</span>
            </button>
            <button ng-show="!isClientVersion" class="tie-button-red tie-privacy-modal-button" ng-click="reject()">
              <span>Reject</span>
            </button>
          </div>
          <div ng-show="!isClientVersion">
            <label>
              <input type="checkbox" id="tie-privacy-modal-shared-option"></input>
              This is a shared computer, don't save my response. 
            </label>
          </div>
        </div>
      </div>
      <style>
        .tie-privacy-modal {
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
        .tie-privacy-modal-button {
          border-radius: 4px;
          border-style: none;
          cursor: pointer;
          font-family: Roboto, 'Helvetica Neue', 'Lucida Grande', sans-serif;
          font-size: 14px;
          height: 50px;
          padding: 1px 6px;
          width: 180px;
        }
        .tie-privacy-modal-button-container {
          display: flex;
          justify-content: space-around;
          padding: 15px 0px;
        }
        .tie-privacy-modal-content {
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
        .tie-privacy-modal-content p {
          font-size: 16px;
          color: #7b7b7b;
        }
        .tie-privacy-modal-title {
          font-size: 24px;
          font-weight: 600;
        }
      </style>
    `,
    link: function($scope) {
      // Get whether or not user has indicated to save the response
      var getSharedStatus = function() {
        var sharedStatus =
          document.getElementById('tie-privacy-modal-shared-option').checked;
        return sharedStatus;
      };
      /**
       * Stores the user's acceptance of the privacy policy
       * and closes the modal.
       */
      $scope.accept = function() {
        // Send signal to store that the user has accepted
        getSharedStatus();
        $scope.closeModal();
      };
      /**
       * Stores the user's rejection of the privacy policy
       * and closes the modal.
       */
      $scope.reject = function() {
        // Send signal to store that the user has rejected
        getSharedStatus();
        $scope.closeModal();
      };
      /**
       * Sets the scope variable `show` to false to hide modal.
       */
      $scope.closeModal = function() {
        $scope.show = false;
      };
    }
  };
}]);
