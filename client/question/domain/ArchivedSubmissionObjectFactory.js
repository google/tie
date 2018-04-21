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
 * @fileoverview Factory for creating new frontend instances of
 * ArchivedSubmission domain objects.
 */

tie.factory('ArchivedSubmissionObjectFactory', [
  'FeedbackParagraphObjectFactory',
  function(FeedbackParagraphObjectFactory) {
    /**
     * ArchivedSubmission objects store code and feedback associated with a
     * given submission.
     */

    /**
     * Constructor for ArchivedSubmission object.
     *
     * @param {string} rawCode The unprocessed code being submitted.
     * @param {Array<FeedbackParagraph>} feedbackParagraphs The feedback
     *   paragraphs that the learner received.
     * @constructor
     */
    var ArchivedSubmission = function(
        timestampMsecs, rawCode, feedbackParagraphs) {
      /**
       * IMPORTANT WARNING FOR DEVELOPERS
       *
       * If any of these properties change, the CURRENT_SCHEMA_VERSION in
       * LearnerSessionDataObjectFactory.js must be updated and a migration
       * step put in place to handle old session data dicts.
       ***********************************************************************/

      /**
       * @type {number} The timestamp of this submission, in milliseconds since
       *   the Epoch.
       * @private
       */
      this._timestampMsecs = timestampMsecs;

      /**
       * @type {string}
       * @private
       */
      this._rawCode = rawCode;

      /**
       * @type {Array<FeedbackParagraph>}
       * @private
       */
      this._feedbackParagraphs = feedbackParagraphs;
    };

    // Instance methods.
    /**
     * A getter for the _rawCode property.
     * The function should return a string with the raw (unprocessed) code that
     * the user submitted.
     *
     * @returns {string} rawCode
     */
    ArchivedSubmission.prototype.getRawCode = function() {
      return this._rawCode;
    };

    /**
     * A getter for the _feedbackParagraphs property.
     * The function should return the feedback paragraphs associated with this
     * submission.
     *
     * @returns {Array<FeedbackParagraphs>}
     */
    ArchivedSubmission.prototype.getFeedbackParagraphs = function() {
      return this._feedbackParagraphs;
    };

    /**
     * Returns a raw-dict version of this ArchivedSubmission instance.
     *
     * @returns {object}
     */
    ArchivedSubmission.prototype.toDict = function() {
      return {
        rawCode: this._rawCode,
        feedbackParagraphDicts: this._feedbackParagraphs.map(
          function(paragraph) {
            return paragraph.toDict();
          }
        )
      };
    };

    // Static class methods.
    /**
     * Returns a ArchivedSubmission object reconstructed from a raw dict.
     *
     * @param {object} archivedSubmissionDict
     * @returns {ArchivedSubmission}
     */
    ArchivedSubmission.fromDict = function(archivedSubmissionDict) {
      return new ArchivedSubmission(
        archivedSubmissionDict.timestampMsecs,
        archivedSubmissionDict.rawCode,
        archivedSubmissionDict.feedbackParagraphDicts.map(function(dict) {
          return FeedbackParagraphObjectFactory.fromDict(dict);
        })
      );
    };

    /**
     * Creates and returns a ArchivedSubmission object. The current time is
     * used as this submission's timestamp.
     *
     * @param {string} rawCode A string with the unprocessed student code.
     * @param {Array<FeedbackParagraph>} feedbackParagraphs The feedback
     *   corresponding to this code.
     * @returns {ArchivedSubmission}
     */
    ArchivedSubmission.create = function(rawCode, feedbackParagraphs) {
      return new ArchivedSubmission(Date.now(), rawCode, feedbackParagraphs);
    };

    return ArchivedSubmission;
  }
]);
