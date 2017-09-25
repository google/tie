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
 * @fileoverview Unit tests for SessionIdService.
 */

describe('SessionIdService', function() {
  var SessionIdService;

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    SessionIdService = $injector.get(
      'SessionIdService');
  }));

  describe('getSessionId', function() {
    it('should never return null', function(done) {
      var id = SessionIdService.getSessionId();
      expect(id).not.toEqual(null);
      done();
    });

    it('should return the same sessionId across multiple calls',
      function(done) {
        var id = SessionIdService.getSessionId();
        var otherId = SessionIdService.getSessionId();
        expect(id).toEqual(otherId);
        done();
      });

    it('should reset the sessionId', function(done) {
      var id = SessionIdService.getSessionId();
      SessionIdService.resetSessionId();
      var otherId = SessionIdService.getSessionId();
      expect(id).not.toEqual(otherId);
      done();
    });
  });
});
