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
        <div class="tie-dot-container" ng-if="ConversationLogDataService.isNewBalloonPending()">
          <div class="tie-dot tie-dot-1"></div>
          <div class="tie-dot tie-dot-2"></div>
          <div class="tie-dot tie-dot-3"></div>
          <br>
        </div>
        <div ng-repeat="balloon in ConversationLogDataService.getSpeechBalloonsList() track by $index">
          <div class="tie-speech-balloon-container">
            <div ng-if="balloon.isDisplayedOnLeft()">
              <div class="tie-speech-balloon tie-left-speech-balloon" ng-class="{'tie-most-recent-feedback':$first}">
                <p ng-repeat="paragraph in balloon.getFeedbackParagraphs() track by $index"
                   class="tie-feedback-paragraph"
                   ng-class="{'tie-feedback-paragraph-code': paragraph.isCodeParagraph()}">
                  <span ng-if="paragraph.isTextParagraph()">
                    {{paragraph.getContent()}}
                  </span>
                  <span ng-if="paragraph.isCodeParagraph()">
                    <code-snippet content="paragraph.getContent()"></code-snippet>
                  </span>
                  <span ng-if="paragraph.isSyntaxErrorParagraph()">
                    <syntax-error-snippet content="paragraph.getContent()">
                    </syntax-error-snippet>
                  </span>
                  <span ng-if="paragraph.isOutputParagraph()">
                    <output-snippet content="paragraph.getContent()">
                    </output-snippet>
                  </span>
                </p>
              </div>
              <div class="tie-left-speech-balloon-tail">
                <div class="tie-speech-balloon-tail-outer"></div>
                <div class="tie-speech-balloon-tail-inner"></div>
              </div>
            </div>

            <div ng-if="!balloon.isDisplayedOnLeft()">
              <div class="tie-speech-balloon tie-right-speech-balloon">
                <p ng-repeat="paragraph in balloon.getFeedbackParagraphs() track by $index"
                   class="tie-feedback-paragraph tie-feedback-paragraph-code">
                  <code-snippet content="paragraph.getContent()"></code-snippet>
                </p>
              </div>
              <div class="tie-right-speech-balloon-tail">
                <div class="tie-speech-balloon-tail-outer"></div>
                <div class="tie-speech-balloon-tail-inner"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        .tie-speech-balloon-container {
          clear: right;
          overflow: auto;
          transition: margin-top 0.2s cubic-bezier(0.4, 0.0, 0.2, 1),
                      opacity 0.15s cubic-bezier(0.4, 0.0, 0.2, 1) 0.2s;
        }
        .tie-speech-balloon {
          background-color: white;
          border: 1px solid #c3c0c0;
          border-radius: 10px;
          max-width: calc(100% - 20px);
          margin: 10px 0;
          min-height: 1em;
          min-width: 1em;
          padding: 0 12px;
          transition: background-color 2s cubic-bezier(0.4, 0.0, 0.2, 1) 1.5s;
          width: fit-content;
        }
        .tie-speech-balloon-tail-outer {
          border-bottom: 8px solid transparent;
          height: 0;
          margin-top: -11px;
          width:  0;
        }
        .tie-speech-balloon-tail-inner {
          border-bottom: 8px solid transparent;
          height: 0;
          margin-top: -10px;
          transition: border-left-color 2.5s cubic-bezier(0.4, 0.0, 0.2, 1);
          transition-delay: 1s;
          width: 0;
        }
        .tie-left-speech-balloon {
          float: left;
        }
        .tie-left-speech-balloon-tail {
          clear: left;
          float: left;
        }
        .tie-left-speech-balloon-tail .tie-speech-balloon-tail-outer {
          border-left: 13px solid #c3c0c0;
          margin-left: 18px;
        }
        .tie-left-speech-balloon-tail .tie-speech-balloon-tail-inner {
          border-left: 13px solid white;
          margin-left: 19px;
        }
        .tie-right-speech-balloon {
          float: right;
        }
        .tie-right-speech-balloon-tail {
          clear: right;
          float: right;
        }
        .tie-right-speech-balloon-tail .tie-speech-balloon-tail-outer {
          border-right: 13px solid #c3c0c0;
          margin-right: 18px;
        }
        .tie-right-speech-balloon-tail .tie-speech-balloon-tail-inner {
          border-right: 12px solid white;
          margin-right: 19px;
        }

        .tie-feedback-paragraph {
          width: 100%;
        }
        .tie-feedback-paragraph-code {
          font-size: 12px;
          padding: 2px 10px;
          width: 95%;
        }

        .tie-speech-balloon a {
          /* Style visited links the same as unvisited links. */
          color: #0000ee;
        }
        .night-mode .tie-speech-balloon a {
          /* Style visited links the same as unvisited links. */
          color: #8b8bff;
        }
        .tie-most-recent-feedback {
          opacity: 1;
        }

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
          margin-bottom: 10px;
          margin-right: 7px;
          margin-top: 3px;
          width: 4px;
        }
        .tie-dot-container {
          height: 100%;
          margin-bottom: 6px;
          margin-top: 18px;
          padding-left: 18px;
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
