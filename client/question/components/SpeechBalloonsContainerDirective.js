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
 * @fileoverview Directive for the speech balloon container.
 */

tie.directive('speechBalloonsContainer', [function() {
  return {
    restrict: 'E',
    scope: {},
    template: `
      <div>
        <div class="tie-dot-container" ng-class="{'tie-display-dots': ConversationLogDataService.isNewBalloonPending()}"}>
          <div class="tie-dot tie-dot-1"></div>
          <div class="tie-dot tie-dot-2"></div>
          <div class="tie-dot tie-dot-3"></div>
        </div>
        <div ng-repeat="balloon in ConversationLogDataService.data.speechBalloonList" aria-live="assertive">
          <tie-speech-balloon-container>
            <div ng-if="balloon.isDisplayedOnLeft()">
              <tie-speech-balloon-left>
                <p ng-repeat="paragraph in balloon.getFeedbackParagraphs() track by $index" class="tie-feedback-paragraph protractor-test-feedback-paragraph" ng-class="{'tie-feedback-paragraph-code': paragraph.isCodeParagraph()}">
                  <span ng-if="paragraph.isTextParagraph()">
                    {{paragraph.getContent()}}
                  </span>
                  <span ng-if="paragraph.isCodeParagraph()">
                    <code-snippet content="paragraph.getContent()">
                    </code-snippet>
                  </span>
                  <span ng-if="paragraph.isErrorParagraph()">
                    <error-snippet content="paragraph.getContent()">
                    </error-snippet>
                  </span>
                  <span ng-if="paragraph.isOutputParagraph()">
                    <output-snippet content="paragraph.getContent()">
                    </output-snippet>
                  </span>
                  <span ng-if="paragraph.isImageParagraph()">
                    <img class="tie-question-completion-image" ng-src="../../assets/images/{{paragraph.getContent()}}">
                  </span>
                </p>
              </tie-speech-balloon-left>
              <tie-speech-balloon-tail-left></tie-speech-balloon-tail-left>
            </div>
            <div ng-if="!balloon.isDisplayedOnLeft()">
              <tie-speech-balloon-right>
                <p ng-repeat="paragraph in balloon.getFeedbackParagraphs() track by $index"
                    class="tie-feedback-paragraph tie-feedback-paragraph-code">
                  <code-snippet content="paragraph.getContent()"></code-snippet>
                </p>
              </tie-speech-balloon-right>
              <tie-speech-balloon-tail-right></tie-speech-balloon-tail-right>
            </div>
          </tie-speech-balloon-container>
        </div>
      </div>

      <style>
        @-webkit-keyframes tie-dot {
          from { -webkit-transform: translate(0px, 0px); }
          10%  { -webkit-transform: translate(0px, -10px); }
          20%  { -webkit-transform: translate(0px, 0px); }
          to   { -webkit-transform: translate(0px, 0px); }
        }
        .tie-dot {
          -webkit-animation-name: tie-dot;
          -webkit-animation-duration: 1.5s;
          -webkit-animation-iteration-count: infinite;
          background-color: black;
          border-radius: 2px;
          float: left;
          height: 4px;
          margin-right: 7px;
          margin-top: 3px;
          width: 4px;
        }
        .tie-dot-container {
          display: inline-block;
          height: 10px;
          opacity: 0;
          padding-left: 5px;
        }
        .night-mode .tie-dot {
          background-color: #E0E0E0;
        }
        .tie-dot-2 {
          -webkit-animation-delay: 0.1s;
        }
        .tie-dot-3 {
          -webkit-animation-delay: 0.2s;
        }
        .tie-display-dots {
          opacity: 1;
        }
        .tie-feedback-paragraph {
          width: 100%;
        }
        .tie-feedback-paragraph-code {
          font-size: 12px;
          padding-right: 8px;
          width: 95%;
        }
        .tie-question-completion-image {
          height: 180px;
        }
        .tie-speech-balloon-container {
          clear: right;
          display: block;
          margin-top: 12px;
          overflow: auto;
          transition: margin-top 0.2s cubic-bezier(0.4, 0.0, 0.2, 1),
                      opacity 0.15s cubic-bezier(0.4, 0.0, 0.2, 1) 0.2s;
        }
        .tie-speech-balloon {
          background-color: yellow;
          border: 1px solid #c3c0c0;
          border-radius: 10px;
          -moz-border-radius: 10px;
          -webkit-border-radius: 10px;
          max-width: calc(100% - 50px);
          min-height: 1em;
          min-width: 1em;
          padding-left: 10px;
          padding-right: 10px;
          width: fit-content;
        }
        .pulse-animation-enabled .tie-speech-balloon {
          transition: background-color 2s cubic-bezier(0.4, 0.0, 0.2, 1) 1.5s;
        }
        .night-mode .tie-speech-balloon {
          background-color: #323c5a;
          color: #E0E0E0;
        }
        .tie-speech-balloon a {
          /* Style visited links the same as unvisited links. */
          color: #0000ee;
        }
        .night-mode .tie-speech-balloon a {
          /* Style visited links the same as unvisited links. */
          color: #8b8bff;
        }
        .tie-speech-balloon-pulse {
          background-color: white;
        }
        .night-mode .tie-speech-balloon-pulse {
          background-color: #444444;
        }
        .tie-speech-balloon-tail-container {
          margin-bottom: 2px;
        }
        .tie-speech-balloon-left {
          float: left;
        }
        .tie-speech-balloon-tail-left {
          clear: left;
          float: left;
        }
        .tie-speech-balloon-tail-left-outer {
          border-bottom: 8px solid transparent;
          border-left: 13px solid #c3c0c0;
          height: 0;
          margin-left: 18px;
          width:  0;
        }
        .tie-speech-balloon-tail-left-inner {
          border-bottom: 8px solid transparent;
          border-left: 13px solid yellow;
          height: 0;
          margin-left: 19px;
          margin-top: -10px;
          width:  0;
        }
        .pulse-animation-enabled .tie-speech-balloon-tail-left-inner {
          transition: border-left-color 2.5s cubic-bezier(0.4, 0.0, 0.2, 1) 1s;
        }
        .night-mode .tie-speech-balloon-tail-left-inner {
          border-left: 13px solid #323c5a;
        }
        .tie-speech-balloon-tail-left-pulse {
          border-left-color: white;
        }
        .night-mode .tie-speech-balloon-tail-left-pulse {
          border-left: 13px solid #444444;
        }
        .tie-speech-balloon-right {
          float: right;
        }
        .tie-speech-balloon-tail-right {
          clear: right;
          float: right;
        }
        .tie-speech-balloon-tail-right-outer {
          border-bottom: 9px solid transparent;
          border-right: 13px solid #c3c0c0;
          height: 0;
          margin-right: 18px;
          margin-top: -1px;
          width:  0;
        }
        .tie-speech-balloon-tail-right-inner {
          border-bottom: 8px solid transparent;
          border-right: 12px solid yellow;
          height: 0;
          margin-right: 19;
          margin-top: -10px;
          width:  0;
        }
        .pulse-animation-enabled .tie-speech-balloon-tail-right-inner {
          transition: border-right-color 2.5s cubic-bezier(0.4, 0.0, 0.2, 1) 1s;
        }
        .night-mode .tie-speech-balloon-tail-right-inner {
          border-right: 13px solid #323c5a;
        }
        .tie-speech-balloon-tail-right-pulse {
          border-right-color: white;
        }
        .night-mode .tie-speech-balloon-tail-right-pulse {
          border-right: 12px solid #444444;
        }
      </style>
    `,
    controller: [
      '$scope', 'ConversationLogDataService',
      function($scope, ConversationLogDataService) {
        $scope.ConversationLogDataService = ConversationLogDataService;
      }
    ]
  };
}]);
