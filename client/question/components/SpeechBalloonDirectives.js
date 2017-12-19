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
    link: function(scope, iElement) {
      if (iElement[0].nodeName !== "DIV") {
        return;
      }
      var speechBalloonContainer = iElement[0];
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
    link: function(scope, iElement) {
      if (iElement[0].nodeName !== "DIV") {
        return;
       }
      var speechBalloon = iElement[0];
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
    link: function(scope, iElement) {
      if (iElement[0].nodeName !== "DIV") {
        return;
      }
      var speechBalloon = iElement[0];
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
      <div class="tie-speech-balloon-tail-container tie-speech-balloon-tail-left">
        <div class="tie-speech-balloon-tail-left-outer"></div>
        <div class="tie-speech-balloon-tail-left-inner"></div>
      </div>
    `,
    link: function(scope, iElement) {
      var speechBalloonTailLeftInner = iElement[0].getElementsByClassName(
          'tie-speech-balloon-tail-left-inner')[0];
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
    template: `
      <div class="tie-speech-balloon-tail-container tie-speech-balloon-tail-right">      
        <div class="tie-speech-balloon-tail-right-outer"></div>
        <div class="tie-speech-balloon-tail-right-inner"></div>
      </div>
    `,
    link: function(scope, iElement) {
      var speechBalloonTailRightInner = iElement[0].getElementsByClassName(
          'tie-speech-balloon-tail-right-inner')[0];
      $timeout(function() {
        speechBalloonTailRightInner.classList.add(
            "tie-speech-balloon-tail-right-pulse");
      }, 0);
    }
  };
}]);
