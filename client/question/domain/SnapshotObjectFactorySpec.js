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
  var PrereqCheckFailureObjectFactory;
  var prereqCheckFailure;
  var CodeEvalResultObjectFactory;
  var codeEvalResult;
  var FeedbackObjectFactory;
  var feedback;
  var FEEDBACK_CATEGORIES;

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    FEEDBACK_CATEGORIES = $injector.get('FEEDBACK_CATEGORIES');
    SnapshotObjectFactory = $injector.get('SnapshotObjectFactory');
    snapshot = SnapshotObjectFactory.create({
      codeEvalResult: null,
      feedback: null
    });
    PrereqCheckFailureObjectFactory = $injector.get(
      'PrereqCheckFailureObjectFactory');
    prereqCheckFailure = PrereqCheckFailureObjectFactory.create(
      'missingStarterCode', null, 'def myFunction(arg): return arg'
    );
    CodeEvalResultObjectFactory = $injector.get(
      'CodeEvalResultObjectFactory');
    codeEvalResult = CodeEvalResultObjectFactory.create(
      'code', '', [[true, true], [false, false]], [[false], [false]],
      [[], []], null, 'errorInput'
    );
    FeedbackObjectFactory = $injector.get('FeedbackObjectFactory');
    feedback = FeedbackObjectFactory.create(FEEDBACK_CATEGORIES.SUCCESSFUL);
  }));

  describe('setPrereqCheckFailure', function() {
    it('should correctly set and get prereqCheckFailure', function() {
      snapshot.setPrereqCheckFailure(prereqCheckFailure);
      expect(snapshot.getPrereqCheckFailure()).toEqual(
        PrereqCheckFailureObjectFactory.create(
          'missingStarterCode', null, 'def myFunction(arg): return arg'
      ));
    });
  });

  describe('setCodeEvalResult', function() {
    it('should correctly set and get codeEvalResult', function() {
      snapshot.setCodeEvalResult(codeEvalResult);
      expect(snapshot.getCodeEvalResult()).toEqual(
        CodeEvalResultObjectFactory.create(
          'code', '', [[true, true], [false, false]], [[false], [false]],
          [[], []], null, 'errorInput'
        ));
    });
  });

  describe('setFeedback', function() {
    it('should correctly set and get feedback', function() {
      snapshot.setFeedback(feedback);
      expect(snapshot.getFeedback()).toEqual(
        FeedbackObjectFactory.create(FEEDBACK_CATEGORIES.SUCCESSFUL));
    });
  });
});
