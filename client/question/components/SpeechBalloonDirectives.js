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
 * @fileoverview Directives for displaying speech balloons.
 */

tie.directive('tieSpeechBalloonContainer', ['$timeout', 'DELAY_STYLE_CHANGES',
  function($timeout, DELAY_STYLE_CHANGES) {
    return {
      restrict: 'E',
      scope: {},
      link: function(scope, element) {
        var speechBalloonContainerElement = element[0];
        var speechBalloonContainer =
            angular.element(speechBalloonContainerElement);
        speechBalloonContainer.addClass('tie-speech-balloon-container');
        speechBalloonContainerElement.style.opacity = '0';
        speechBalloonContainerElement.style.transition = 'unset';
        speechBalloonContainerElement.style.display = 'none';
        $timeout(function() {
          speechBalloonContainerElement.style.display = 'block';
          speechBalloonContainerElement.style.marginTop =
              '-' + speechBalloonContainerElement.offsetHeight.toString() +
              'px';
          $timeout(function() {
            speechBalloonContainerElement.removeAttribute('style');
          }, DELAY_STYLE_CHANGES);
        }, 0);
      }
    };
  }
]);

tie.directive('tieSpeechBalloonLeft', ['$timeout', function($timeout) {
  return {
    restrict: 'E',
    scope: {},
    link: function(scope, element) {
      var speechBalloon = angular.element(element[0]);
      speechBalloon.addClass('tie-speech-balloon tie-speech-balloon-left');
      $timeout(function() {
        speechBalloon.addClass('tie-speech-balloon-pulse');
      }, 0);
    }
  };
}]);

tie.directive('tieSpeechBalloonRight', ['$timeout', function($timeout) {
  return {
    restrict: 'E',
    scope: {},
    link: function(scope, element) {
      var speechBalloon = angular.element(element[0]);
      speechBalloon.addClass('tie-speech-balloon tie-speech-balloon-right');
      $timeout(function() {
        speechBalloon.addClass('tie-speech-balloon-pulse');
      }, 0);
    }
  };
}]);

tie.directive('tieSpeechBalloonTailLeft', ['$timeout', function($timeout) {
  return {
    restrict: 'E',
    scope: {},
    template: `
      <div class='tie-speech-balloon-tail-container tie-speech-balloon-tail-left'>
        <div class='tie-speech-balloon-tail-left-outer'></div>
        <div class='tie-speech-balloon-tail-left-inner'></div>
      </div>
    `,
    link: function(scope, element) {
      var speechBalloonTailLeftInner =
          angular.element(element[0].getElementsByClassName(
          'tie-speech-balloon-tail-left-inner')[0]);
      $timeout(function() {
        speechBalloonTailLeftInner.addClass(
            'tie-speech-balloon-tail-left-pulse');
      }, 0);
    }
  };
}]);

tie.directive('tieSpeechBalloonTailRight', ['$timeout', function($timeout) {
  return {
    restrict: 'E',
    scope: {},
    template: `
      <div class='tie-speech-balloon-tail-container tie-speech-balloon-tail-right'>
        <div class='tie-speech-balloon-tail-right-outer'></div>
        <div class='tie-speech-balloon-tail-right-inner'></div>
      </div>
    `,
    link: function(scope, element) {
      var speechBalloonTailRightInner =
          angular.element(element[0].getElementsByClassName(
          'tie-speech-balloon-tail-right-inner')[0]);
      $timeout(function() {
        speechBalloonTailRightInner.addClass(
            'tie-speech-balloon-tail-right-pulse');
      }, 0);
    }
  };
}]);
