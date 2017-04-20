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
 * @fileoverview Unit tests for SnapshotObject domain objects.
 */

describe('SnapshotObjectFactory', function() {
  var SnapshotObjectFactory;
  var snapshot;

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    SnapshotObjectFactory = $injector.get(
      'SnapshotObjectFactory');
    snapshot = SnapshotObjectFactory.create({
      codeEvalResult: null,
      feedback: null
    });
  }));

  describe('setCodeEvalResult', function() {
    it('should correctly set and get codeEvalResult', function() {
      snapshot.setCodeEvalResult("true");
      expect(snapshot.getCodeEvalResult()).toMatch("true");
    });
  });

  describe('setFeedback', function() {
    it('should correctly set and get feedback', function() {
      snapshot.setFeedback("good");
      expect(snapshot.getFeedback()).toMatch("good");
    });
  });
});

