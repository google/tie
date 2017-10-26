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
      isDisplayed: '=',
      title: '@'
    },
    template: `
      <div class="tie-privacy-modal" ng-show="isDisplayed">
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
            <button ng-show="isClientVersion" class="tie-button-blue tie-privacy-modal-button protractor-test-privacy-modal-okay-button" ng-click="closeModal()">
              <span>Okay</span>
            </button>
            <button ng-show="!isClientVersion" class="tie-button-blue tie-privacy-modal-button protractor-test-privacy-modal-accept-button" ng-click="accept()">
              <span>Accept</span>
            </button>
            <button ng-show="!isClientVersion" class="tie-button-red tie-privacy-modal-button protractor-test-privacy-modal-reject-button" ng-click="reject()">
              <span>Reject</span>
            </button>
          </div>
          <div ng-show="!isClientVersion">
            <label>
              <input type="checkbox" ng-model="modalData.isUsingSharedComputer"></input>
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
    controller: ['$scope', '$window', 'CookieStorageService',
      'ServerHandlerService', 'MENU_PAGE_URL_FROM_QUESTION_PAGE',
      function($scope, $window, CookieStorageService,
        ServerHandlerService, MENU_PAGE_URL_FROM_QUESTION_PAGE) {
        // Need to create this to be able to use ng-model, see below
        // https://stackoverflow.com/questions/12618342/ng-model-does-not-update-controller-value/22768720#22768720
        $scope.modalData = {};

        $scope.isClientVersion = !ServerHandlerService.doesServerExist();

        /**
         * Stores the user's acceptance of the privacy policy
         * and closes the modal.
         */
        $scope.accept = function() {
          if ($scope.modalData.isUsingSharedComputer) {
            CookieStorageService.setTransientPrivacyCookie();
          } else {
            CookieStorageService.setPrivacyCookieWithExpiryDate();
          }
          $scope.closeModal();
        };

        /**
         * Redirects to the menu page.
         */
        $scope.reject = function() {
          $window.location.href = MENU_PAGE_URL_FROM_QUESTION_PAGE;
        };

        /**
         *  Close the modal by setting the display variable to false.
         */
        $scope.closeModal = function() {
          $scope.isDisplayed = false;
        };
      }
    ]
  };
}]);
