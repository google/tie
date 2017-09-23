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
 * @fileoverview Unit tests for Transcript domain objects.
 */

describe('TranscriptObjectFactory', function() {
  var TranscriptObjectFactory;

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    TranscriptObjectFactory = $injector.get('TranscriptObjectFactory');
  }));

  describe('getMostRecentSnapshot', function() {
    it('should retrieve the last snapshot', function() {
      var transcript = TranscriptObjectFactory.create();
      transcript.recordSnapshot(1);
      transcript.recordSnapshot(2);

      expect(transcript.getMostRecentSnapshot()).toBe(2);
    });

    it('should return null if there are no snapshots', function() {
      var transcript = TranscriptObjectFactory.create();

      expect(transcript.getMostRecentSnapshot()).toBe(null);
    });
  });

  describe('recordSnapshot', function() {
    it('should return the number of snapshots taken when recording',
      function() {
        var transcript = TranscriptObjectFactory.create();

        expect(transcript.recordSnapshot(1)).toBe(1);
        expect(transcript.recordSnapshot(1)).toBe(2);
      }
    );
  });
});
