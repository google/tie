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

tie.directive('tieSpeechBalloonContainer', [function() {
  return {
    restrict: 'A',
    link: function(scope, el, attributes) {
      if (el[0].nodeName !== "DIV") { return; }
      var speechBalloonContainer = el[0];
      speechBalloonContainer.className = "tie-speech-balloon-container";
      speechBalloonContainer.style.marginTop =
          '-' + speechBalloonContainer.offsetHeight.toString() + 'px';
      speechBalloonContainer.style.opacity = "0";
      speechBalloonContainer.style.transition = "unset";
      window.setTimeout(
        function() {
          speechBalloonContainer.removeAttribute("style");
      }, 0);
    }
  };
}]);

tie.directive('tieSpeechBalloonLeft', [function() {
  return {
    restrict: 'A',
    link: function(scope, el, attributes) {
      if (el[0].nodeName !== "DIV") { return; }
      var speechBalloon = el[0];
      speechBalloon.className = "tie-speech-balloon tie-speech-balloon-left";
      window.setTimeout(
        function() {
          speechBalloon.classList.add("tie-speech-balloon-pulse");
      }, 0);
    }
  };
}]);

tie.directive('tieSpeechBalloonRight', [function() {
  return {
    restrict: 'A',
    link: function(scope, el, attributes) {
      if (el[0].nodeName !== "DIV") { return; }
      var speechBalloon = el[0];
      speechBalloon.className = "tie-speech-balloon tie-speech-balloon-right";
      window.setTimeout(
        function() {
          speechBalloon.classList.add("tie-speech-balloon-pulse");
      }, 0);
    }
  };
}]);

tie.directive('tieSpeechBalloonTailLeft', [function() {
  return {
    restrict: 'A',
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
      window.setTimeout(
        function() {
          speechBalloonTailLeftInner.classList.add(
              "tie-speech-balloon-tail-left-pulse");
      }, 0);
    }
  };
}]);

tie.directive('tieSpeechBalloonTailRight', [function() {
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
      window.setTimeout(
        function() {
          speechBalloonTailRightInner.classList.add(
              "tie-speech-balloon-tail-right-pulse");
      }, 0);
    }
  };
}]);
