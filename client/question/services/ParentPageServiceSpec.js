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
 * @fileoverview Unit tests for ParentPageService.
 */

describe('ParentPageService', function() {
  var ParentPageService;

  beforeEach(module('tie'));
  var setParentPageOrigin = function(parentPageOrigin) {
    module('tieConfig', function($provide) {
      $provide.constant('EXPECTED_PARENT_PAGE_ORIGIN', parentPageOrigin);
    });
  };

  var parentPageObject = {
    // Execution of this method signifies that the window received an event.
    receiveMessage: function() {
      // eslint-disable-next-line no-useless-return
      return;
    }
  };

  describe('sendRawCode', function() {
    describe('when there is no parent page', function() {
      beforeEach(function() {
        spyOn(parentPageObject, 'receiveMessage');
        setParentPageOrigin(null);
        inject(function($injector) {
          ParentPageService = $injector.get('ParentPageService');
        });
        ParentPageService.sendRawCode('code to be sent');
      });

      it('should not receive any messages', function() {
        expect(parentPageObject.receiveMessage).not.toHaveBeenCalled();
      });
    });
  });
});
