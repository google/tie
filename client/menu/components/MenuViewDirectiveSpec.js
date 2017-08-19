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
 * @MenuViewDirective Unit tests for the MenuViewDirective.
 *
 */

describe('MenuViewDirective', function() {
  var $scope;
  var element;
  var QuestionDataService;

  beforeEach(module("tieData"));
  beforeEach(module("tieMenu"));

  beforeEach(inject(function($compile, $rootScope, _QuestionDataService_,) {
    $scope = $rootScope.$new();

    // The reason why we have to go through this trouble to get $scope
    // is the controller is anonymous, thus, there is no easy way to do
    // it.
    // TODO (mengchaowang): Refactor learnerViewDirective controller to a
    // separate controller instead of anonymous controller.
    element = angular.element('<menu-view></menu-view>');
    element = $compile(element)($scope);
    $scope = element.isolateScope();
    $rootScope.$digest();
    $scope.$digest();

    QuestionDataService = _QuestionDataService_;
  }));

  describe("loadQuestion", function() {
    it('should load the question data', function() {
      // $scope.loadQuestions('reverseWords');
    });
  });
});
