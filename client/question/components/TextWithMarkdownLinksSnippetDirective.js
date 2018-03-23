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
 * @fileoverview Directive for showing text with Markdown links.
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
      '$scope',
      function($scope) {
        $scope.$watch($scope.getContent, function(newValue) {
          // TODO(sll): Specialize allowed links to:
          // "../docs/py-primer-light.html"
          // "https://"-prefixed stuff

          // ng-bind-html sanitizes HTML by default. See
          // https://docs.angularjs.org/api/ng/service/$sce
          $scope.unsafeHtmlWithLinks = newValue.replace(
            /\[([^[\]]+)\]\(([^)]+)\)/g,
            '<a href="$2" target="_blank">$1</a>');
        });
      }
    ]
  };
}]);
