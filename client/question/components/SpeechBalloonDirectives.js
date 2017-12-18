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
 * @fileoverview Directive for displaying speech balloons.
 */

tie.directive('tieSpeechBalloonContainer', ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    link: function(scope, el, attributes) {
      if (el[0].nodeName !== "DIV") { return; }
      var speechBalloonContainer = el[0];
      speechBalloonContainer.className = "tie-speech-balloon-container";
      speechBalloonContainer.style.opacity = "0";
      speechBalloonContainer.style.transition = "unset";
      speechBalloonContainer.style.display = "none";
      $timeout(function() {
        speechBalloonContainer.style.display = "block";
        speechBalloonContainer.style.marginTop =
            '-' + speechBalloonContainer.offsetHeight.toString() + 'px';
        $timeout(function() {
          speechBalloonContainer.removeAttribute("style");
        }, 0);
      }, 0);
    }
  };
}]);

tie.directive('tieSpeechBalloonLeft', ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    link: function(scope, el, attributes) {
      if (el[0].nodeName !== "DIV") { return; }
      var speechBalloon = el[0];
      speechBalloon.className = "tie-speech-balloon tie-speech-balloon-left";
      $timeout(function() {
        speechBalloon.classList.add("tie-speech-balloon-pulse");
      }, 0);
    }
  };
}]);

tie.directive('tieSpeechBalloonRight', ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    link: function(scope, el, attributes) {
      if (el[0].nodeName !== "DIV") { return; }
      var speechBalloon = el[0];
      speechBalloon.className = "tie-speech-balloon tie-speech-balloon-right";
      $timeout(function() {
        speechBalloon.classList.add("tie-speech-balloon-pulse");
      }, 0);
    }
  };
}]);

tie.directive('tieSpeechBalloonTailLeft', ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    template: `
      <div tie-speech-balloon-container
          class="tie-speech-balloon-container" style="">
        <div ng-if="balloon.isDisplayedOnLeft()" class="ng-scope">
          <div tie-speech-balloon-left class="tie-speech-balloon tie-speech-balloon-left tie-speech-balloon-pulse">
                <!-- ngRepeat: paragraph in balloon.getFeedbackParagraphs() track by $index --><p ng-repeat="paragraph in balloon.getFeedbackParagraphs() track by $index" class="tie-feedback-paragraph protractor-test-feedback-paragraph ng-scope" ng-class="{'tie-feedback-paragraph-code': paragraph.isCodeParagraph()}">
                  <!-- ngIf: paragraph.isTextParagraph() --><span ng-if="paragraph.isTextParagraph()" class="ng-binding ng-scope">
                    We noticed that you're using a print statement within your code. Since you will not be able to use such statements in a technical interview, TIE does not support this feature. We encourage you to instead step through your code by hand.
                  </span><!-- end ngIf: paragraph.isTextParagraph() -->
                  <!-- ngIf: paragraph.isCodeParagraph() -->
                  <!-- ngIf: paragraph.isSyntaxErrorParagraph() -->
                  <!-- ngIf: paragraph.isOutputParagraph() -->
                </p><!-- end ngRepeat: paragraph in balloon.getFeedbackParagraphs() track by $index -->
              </div>
              <div tie-speech-balloon-tail-left="" class="tie-speech-balloon-tail-container tie-speech-balloon-tail-left"><div class="tie-speech-balloon-tail-left-outer"></div><div class="tie-speech-balloon-tail-left-inner tie-speech-balloon-tail-left-pulse"></div></div>
            </div><!-- end ngIf: balloon.isDisplayedOnLeft() -->
            <!-- ngIf: !balloon.isDisplayedOnLeft() -->
          </div>
      
    `,
    link: function(scope, el, attributes) {
      if (el[0].nodeName !== "DIV") { return; }
      var speechBalloonTailContainer = el[0];
      speechBalloonTailContainer.className =
          "tie-speech-balloon-tail-container";
      var speechBalloonTailLeftOuter = document.createElement("div");
      speechBalloonTailLeftOuter.className =
          "tie-speech-balloon-tail-left-outer";
      var speechBalloonTailLeftInner = document.createElement("div");
      speechBalloonTailLeftInner.className =
          "tie-speech-balloon-tail-left-inner";
      speechBalloonTailContainer.appendChild(speechBalloonTailLeftOuter);
      speechBalloonTailContainer.appendChild(speechBalloonTailLeftInner);
      speechBalloonTailContainer.classList.add('tie-speech-balloon-tail-left');
      $timeout(function() {
        speechBalloonTailLeftInner.classList.add(
            "tie-speech-balloon-tail-left-pulse");
      }, 0);
    }
  };
}]);

tie.directive('tieSpeechBalloonTailRight', ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    link: function(scope, el, attributes) {
      if (el[0].nodeName !== "DIV") { return; }
      var speechBalloonTailContainer = el[0];
      speechBalloonTailContainer.className =
          "tie-speech-balloon-tail-container";
      var speechBalloonTailRightOuter = document.createElement("div");
      speechBalloonTailRightOuter.className = 
          "tie-speech-balloon-tail-right-outer";
      var speechBalloonTailRightInner = document.createElement("div");
      speechBalloonTailRightInner.className =
          "tie-speech-balloon-tail-right-inner";
      speechBalloonTailContainer.appendChild(speechBalloonTailRightOuter);
      speechBalloonTailContainer.appendChild(speechBalloonTailRightInner);
      speechBalloonTailContainer.classList.add('tie-speech-balloon-tail-right');
      $timeout(function() {
        speechBalloonTailRightInner.classList.add(
            "tie-speech-balloon-tail-right-pulse");
      }, 0);
    }
  };
}]);
