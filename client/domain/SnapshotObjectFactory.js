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
    /**
     * Snapshot objects are representations of the user's progress and code
     * submission history throughout a given task.
     */

    /**
     * Constructor for Snapshot.
     *
     * @param {PrereqCheckFailure} prereqCheckFailure
     * @param {CodeEvalResult} codeEvalResult
     * @param {Feedback} feedback
     * @constructor
     */
    var Snapshot = function(prereqCheckFailure, codeEvalResult, feedback) {
      // Note that this may be null.
      /**
       * If there is a prerequisite check error/failure at the time, then
       * the corresponding PrereqCheckFailure object with the correct info
       * is stored here. Note: this may be null if there are no
       * prerequisite check failures present.
       *
       * @type {PrereqCheckFailure}
       * @private
       */
      this._prereqCheckFailure = prereqCheckFailure;

      /**
       * This property stores a CodeEvalResult that corresponds with the results
       * of running the student's code.
       *
       * @type {CodeEvalResult}
       * @private
       */
      this._codeEvalResult = codeEvalResult;

      /**
       * This property stores the Feedback object that corresponds with the
       * results of the student's code.
       *
       * @type {Feedback}
       * @private
       */
      this._feedback = feedback;

      /**
       * This property automatically stores the time that the snapshot is taken.
       * @type {number}
       * @private
       */
      this._timestamp = Date.now();
    };

    // Instance methods.
    /**
     * A getter for the _prereqCheckFailure property.
     *
     * @returns {PrereqCheckFailure|*}
     */
    Snapshot.prototype.getPrereqCheckFailure = function() {
      return this._prereqCheckFailure;
    };

    /**
     * A setter for the _prereqCheckFailure property.
     *
     * @param {PrereqCheckFailure} prereqCheckFailure
     */
    Snapshot.prototype.setPrereqCheckFailure = function(prereqCheckFailure) {
      this._prereqCheckFailure = prereqCheckFailure;
    };

    /**
     * A getter for the _codeEvalResult property.
     *
     * @returns {CodeEvalResult}
     */
    Snapshot.prototype.getCodeEvalResult = function() {
      return this._codeEvalResult;
    };

    /**
     * A setter for the _codeEvalResult property.
     *
     * @param {CodeEvalResult} codeEvalResult
     */
    Snapshot.prototype.setCodeEvalResult = function(codeEvalResult) {
      this._codeEvalResult = codeEvalResult;
    };

    /**
     * A getter for the _feedback property.
     *
     * @returns {Feedback}
     */
    Snapshot.prototype.getFeedback = function() {
      return this._feedback;
    };

    /**
     * A setter for the _feedback property.
     *
     * @param {Feedback} feedback
     */
    Snapshot.prototype.setFeedback = function(feedback) {
      this._feedback = feedback;
    };

    // Static class methods.
    /**
     * Returns a Snapshot object with the properties specified in the params.
     *
     * @param {PrereqCheckFailure} prereqCheckFailure
     * @param {CodeEvalResult} codeEvalResult
     * @param {Feedback} feedback
     * @returns {Snapshot}
     */
    Snapshot.create = function(prereqCheckFailure, codeEvalResult, feedback) {
      return new Snapshot(prereqCheckFailure, codeEvalResult, feedback);
    };

    return Snapshot;
  }
]);
