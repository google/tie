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
 * @fileoverview Unit tests for ServerHandlerService.
 */

describe('ServerHandlerService', function() {
  var ServerHandlerService;

  beforeEach(module('tie'));
  var setServerUrl = function(url) {
    module('tieConfig', function($provide) {
      $provide.constant('SERVER_URL', url);
    });
  };

  describe("doesServerExist", function() {
    it('should return true if SERVER_URL exists', function() {
      setServerUrl('http://katamari.com');
      inject(function($injector) {
        ServerHandlerService = $injector.get('ServerHandlerService');
      });
      expect(ServerHandlerService.doesServerExist()).toEqual(true);

    });

    it('should return false if SERVER_URL is null', function() {
      setServerUrl(null);
      inject(function($injector) {
        ServerHandlerService = $injector.get('ServerHandlerService');
      });
      expect(ServerHandlerService.doesServerExist()).toEqual(false);
    });
  });
});
