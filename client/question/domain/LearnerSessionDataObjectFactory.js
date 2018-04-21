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
 * @fileoverview Factory for creating a LearnerSessionData object.
 * LearnerSessionData objects are used to store information related to a
 * learner's session history.
 */

tie.factory('LearnerSessionDataObjectFactory', [
  'ArchivedSubmissionObjectFactory',
  function(ArchivedSubmissionObjectFactory) {
    /**
     * The current schema version for the representation of the learner session
     * data dict. If the data dict that is stored in local storage has a
     * smaller version number, it must be upgraded to the current schema
     * version before being used.
     */
    var CURRENT_SCHEMA_VERSION = 1;

    var convertRawDataDictToLatestSchemaVersion = function(dataDict) {
      if (dataDict.schemaVersion === CURRENT_SCHEMA_VERSION) {
        return dataDict;
      } else {
        // TODO(sll): When CURRENT_SCHEMA_VERSION increases beyond 1, modify
        // this to convert the dataDict upwards based on its current schema
        // version, until it reaches the current one.
        throw Error('Not implemented yet.');
      }
    };

    /**
     * Constructor for LearnerSessionData.
     *
     * @constructor
     */
    var LearnerSessionData = function(submissionHistory) {
      /**
       * IMPORTANT WARNING FOR DEVELOPERS
       *
       * If any of these properties change, the CURRENT_SCHEMA_VERSION must be
       * updated and a migration step put in place to handle old session data
       * dicts.
       ***********************************************************************/

      /**
       * List of ArchivedSubmission objects representing successive code
       * submissions with their evaluation results.
       *
       * @type Array<ArchivedSubmission>
       * @private
       */
      this._submissionHistory = submissionHistory;
    };

    /**
     * A getter for the most recent archived submission.
     *
     * @returns {ArchivedSubmission|null}
     */
    LearnerSessionData.prototype._getLastSubmission = function() {
      if (this._submissionHistory.length === 0) {
        return null;
      } else {
        return this._submissionHistory[this._submissionHistory.length - 1];
      }
    };

    /**
     * A getter for the code that the learner last submitted.
     *
     * @returns {string|null}
     */
    LearnerSessionData.prototype.getLastSubmittedCode = function() {
      var potentialLastSubmission = this._getLastSubmission();
      if (potentialLastSubmission) {
        return potentialLastSubmission.getRawCode();
      } else {
        return null;
      }
    };

    /**
     * A getter for the feedback that was last shown to the learner.
     *
     * @returns {Array<FeedbackParagraph>|null}
     */
    LearnerSessionData.prototype.getFeedbackParagraphsFromLastSubmission =
      function() {
        var potentialLastSubmission = this._getLastSubmission();
        if (potentialLastSubmission) {
          return potentialLastSubmission.getFeedbackParagraphs();
        } else {
          return null;
        }
      };

    /**
     * Adds a new archived submission.
     *
     * @param {ArchivedSubmission} archivedSubmission The new submission to add.
     */
    LearnerSessionData.prototype.addNewArchivedSubmission = function(
        archivedSubmission) {
      this._submissionHistory.push(archivedSubmission);
    };

    /**
     * Returns a JSON-serialized representation of the current object.
     *
     * @returns {string}
     */
    LearnerSessionData.prototype.toJson = function() {
      return JSON.stringify({
        schemaVersion: this._schemaVersion,
        submissionDictHistory: this._submissionHistory.map(
          function(submission) {
            return submission.toDict();
          }
        )
      });
    };

    // Static class methods.
    /**
     * Returns a new LearnerSessionData object given a JSON string.
     *
     * @param {string} jsonData
     * @returns {LearnerSessionData}
     */
    LearnerSessionData.fromJson = function(jsonData) {
      var dataDict = convertRawDataDictToLatestSchemaVersion(
        JSON.parse(jsonData));
      var submissionHistory = dataDict.submissionDictHistory.map(
        function(submissionDict) {
          return ArchivedSubmissionObjectFactory.fromDict(submissionDict);
        }
      );
      return new LearnerSessionData(submissionHistory);
    };

    /**
     * Returns a new, unpopulated LearnerSessionData object.
     *
     * @returns {LearnerSessionData}
     */
    LearnerSessionData.createNew = function() {
      return new LearnerSessionData([], []);
    };

    return LearnerSessionData;
  }
]);
