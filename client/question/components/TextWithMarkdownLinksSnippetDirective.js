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
 * @fileoverview Directive for showing text with Markdown links. Only links to
 *   HTTPS resources or the Python primer are permitted.
 */

tie.directive('textWithMarkdownLinksSnippet', [function() {
  return {
    restrict: 'E',
    scope: {
      // This contains raw text, in addition to Markdown links in the format
      // [link-text](link-destination).
      getContent: '&content'
    },
    template: `
      <span ng-bind-html="unsafeHtmlWithLinks"></span>
    `,
    controller: [
      '$scope', 'ThemeNameService',
      function($scope, ThemeNameService) {
        $scope.$watch($scope.getContent, function(newValue) {
          // First, strip out all tags in the content.
          var strippedValue = newValue.replace(/<[^>]+>/g, '');

          // The ng-bind-html attribute sanitizes HTML by default. See
          // https://docs.angularjs.org/api/ng/service/$sce
          $scope.unsafeHtmlWithLinks = strippedValue.replace(
            /\[([^[\]]+)\]\(([^)]+)\)/g,
            function(match, p1, p2) {
              var startsWithHttps = (p2.indexOf('https://') === 0);
              var goesToPrimer = (p2.indexOf('../docs/py-primer-') === 0);

              var targetUrl = null;
              if (goesToPrimer) {
                var pythonPrimerUrl = ThemeNameService.getPythonPrimerUrl();

                var hashIndex = p2.indexOf('#');
                if (p2.indexOf('#') === -1) {
                  targetUrl = pythonPrimerUrl;
                } else {
                  targetUrl = pythonPrimerUrl + p2.substring(hashIndex);
                }
              } else {
                targetUrl = p2;
              }

              if (startsWithHttps || goesToPrimer) {
                return (
                  '<a href="' + targetUrl + '" target="_blank">' + p1 + '</a>');
              } else {
                return '';
              }
            });
        });
      }
    ]
  };
}]);
