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
 * @fileoverview Factory for creating a snapshot of a student's code
 * and performance at a given time.
 */

tie.factory('SnapshotObjectFactory', [
  function() {
    var Snapshot = function(codePrereqCheckResult, codeEvalResult, feedback,
        reinforcement) {
      this._codePrereqCheckResult = codePrereqCheckResult;
      this._codeEvalResult = codeEvalResult;
      this._feedback = feedback;
      this._reinforcement = reinforcement;
      this._timestamp = '';
    };

    // Instance methods.
    Snapshot.prototype.getCodePrereqCheckResult = function() {
      return this._codePrereqCheckResult;
    };

    Snapshot.prototype.setCodePrereqCheckResult = function(
      codePrereqCheckResult) {
      this._codePrereqCheckResult = codePrereqCheckResult;
    };

    Snapshot.prototype.getCodeEvalResult = function() {
      return this._codeEvalResult;
    };

    Snapshot.prototype.setCodeEvalResult = function(codeEvalResult) {
      this._codeEvalResult = codeEvalResult;
    };

    Snapshot.prototype.getFeedback = function() {
      return this._feedback;
    };

    Snapshot.prototype.setFeedback = function(feedback) {
      this._feedback = feedback;
    };

    Snapshot.prototype.getReinforcement = function() {
      return this._reinforcement;
    };

    Snapshot.prototype.setReinforcement = function(reinforcement) {
      this._reinforcement = reinforcement;
    };

    // Static class methods.
    Snapshot.create = function(
      codePrereqCheckResult, codeEvalResult, feedback, reinforcement) {
      return new Snapshot(
        codePrereqCheckResult, codeEvalResult, feedback,reinforcement);
    };

    return Snapshot;
  }
]);
