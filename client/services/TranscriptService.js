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
 * @fileoverview Service that maintains a local transcript of the
 * problem-solving session.
 */

tie.factory('TranscriptService', [
  'TranscriptObjectFactory', 'SnapshotObjectFactory',
  function(TranscriptObjectFactory, SnapshotObjectFactory) {
    /**
     * Global object to keep track of snapshots in this task.
     * @type {Transcript}
     */
    var transcript = TranscriptObjectFactory.create();

    return {
      /**
       * A getter for the transcript property.
       *
       * @returns {Transcript}
       */
      getTranscript: function() {
        return transcript;
      },

      /**
       * Records a transcript to this service's transcript object.
       *
       * @param {PrereqCheckFailure} prereqCheckFailure
       * @param {CodeEvalResult} codeEvalResult
       * @param {Feedback} feedback
       */
      recordSnapshot: function(prereqCheckFailure, codeEvalResult, feedback) {
        var snapshot = SnapshotObjectFactory.create(
          prereqCheckFailure, codeEvalResult, feedback);
        transcript.recordSnapshot(snapshot);
      },

      /**
       * Returns this transcript's most recent snapshot
       *
       * @returns {Snapshot}
       */
      getMostRecentSnapshot: function() {
        return transcript.getMostRecentSnapshot();
      }
    };
  }
]);
