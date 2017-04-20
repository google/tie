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
    var Snapshot = function(codeEvalResult, preReqEvalResult, feedback) {
      this._codeEvalResult = codeEvalResult;
      this._preReqEvalResult = preReqEvalResult;
      this._feedback = feedback;
      this._timestamp = '';
    };

    // Instance methods.
    Snapshot.prototype.getCodeEvalResult = function() {
      return this._codeEvalResult;
    };

    Snapshot.prototype.setCodeEvalResult = function(codeEvalResult) {
      this._codeEvalResult = codeEvalResult;
    };

    Snapshot.prototype.getPreReqEvalResult = function() {
      return this._preReqEvalResult;
    };

    Snapshot.prototype.setPreReqEvalResult = function(preReqEvalResult) {
      this._preReqEvalResult = preReqEvalResult;
    };

    Snapshot.prototype.getFeedback = function() {
      return this._feedback;
    };

    Snapshot.prototype.setFeedback = function(feedback) {
      this._feedback = feedback;
    };

    // Static class methods.
    Snapshot.create = function(codeEvalResult, preReqEvalResult, feedback) {
      return new Snapshot(codeEvalResult, preReqEvalResult, feedback);
    };

    return Snapshot;
  }
]);
